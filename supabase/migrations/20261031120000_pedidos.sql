-- VOLT — Pedidos: checkout con pago simulado
--
-- El carrito vive en el navegador del visitante (localStorage). Lo que se
-- guarda en la base es el pedido confirmado: quién compra, qué compra, cuánto
-- paga y en qué estado está.
--
-- Los visitantes no tienen cuenta, así que no pueden escribir estas tablas
-- directamente: el único camino para crear un pedido es la función
-- crear_pedido, que valida todo y calcula el total con los precios de la base.


-- Pedidos

create table public.pedidos (
  id               bigint generated always as identity primary key,
  creado_en        timestamptz not null default now(),

  nombre           text not null,
  email            text not null,
  telefono         text not null,
  direccion        text not null,
  ciudad           text not null,
  codigo_postal    text not null,

  metodo_pago      text not null,
  tarjeta_marca    text,
  tarjeta_ultimos4 text,

  total            integer not null default 0,
  estado           text    not null,

  constraint pedidos_nombre_valido    check (length(nombre) between 2 and 120),
  constraint pedidos_email_valido     check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  constraint pedidos_telefono_valido  check (telefono ~ '^[0-9 +()-]{8,20}$'),
  constraint pedidos_direccion_valida check (length(direccion) between 4 and 200),
  constraint pedidos_ciudad_valida    check (length(ciudad) between 2 and 100),
  -- Código postal viejo (4 dígitos) o CPA (letra + 4 dígitos + 3 letras).
  constraint pedidos_codigo_postal_valido
    check (codigo_postal ~ '^([0-9]{4}|[A-Z][0-9]{4}[A-Z]{3})$'),

  constraint pedidos_metodo_pago_valido
    check (metodo_pago in ('tarjeta', 'transferencia')),

  -- De la tarjeta solo se guarda la marca y los últimos 4 dígitos, como
  -- cualquier comercio real: el número completo nunca sale del navegador.
  constraint pedidos_datos_tarjeta
    check (
      (metodo_pago = 'tarjeta' and tarjeta_marca is not null and tarjeta_ultimos4 ~ '^[0-9]{4}$')
      or (metodo_pago <> 'tarjeta' and tarjeta_marca is null and tarjeta_ultimos4 is null)
    ),

  constraint pedidos_total_valido check (total >= 0),
  constraint pedidos_estado_valido
    check (estado in ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'))
);

comment on table public.pedidos is
  'Pedidos confirmados en el checkout. Se crean con crear_pedido y se gestionan desde /admin.';

create index pedidos_creado_en_idx on public.pedidos (creado_en desc);


-- Items del pedido
-- Se copia el nombre y el precio del producto al momento de la compra: si el
-- admin después cambia el precio o borra el producto, el pedido tiene que
-- seguir diciendo lo que el cliente pagó. Por eso producto_id queda en null
-- al borrar el producto en vez de arrastrar el item.

create table public.pedido_items (
  id              bigint  generated always as identity primary key,
  pedido_id       bigint  not null references public.pedidos (id) on delete cascade,
  producto_id     bigint  references public.productos (id) on delete set null,
  nombre          text    not null,
  precio_unitario integer not null,
  cantidad        integer not null,

  constraint pedido_items_cantidad_valida check (cantidad between 1 and 10),
  constraint pedido_items_precio_valido   check (precio_unitario >= 0)
);

create index pedido_items_pedido_id_idx on public.pedido_items (pedido_id);
create index pedido_items_producto_id_idx on public.pedido_items (producto_id);


-- Seguridad
-- Sin políticas de insert: ni anon ni authenticated pueden crear pedidos a
-- mano. Solo los lee y los actualiza el administrador.

alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;

create policy "Lectura de pedidos solo autenticada"
  on public.pedidos for select
  to authenticated
  using (true);

create policy "Edición de pedidos solo autenticada"
  on public.pedidos for update
  to authenticated
  using (true)
  with check (true);

create policy "Lectura de items de pedido solo autenticada"
  on public.pedido_items for select
  to authenticated
  using (true);

-- Lo que compró el cliente no se edita: el administrador solo puede mover el
-- pedido de estado. La restricción es por columna, a nivel de permisos.
revoke update on public.pedidos from authenticated;
grant update (estado) on public.pedidos to authenticated;


-- Crear pedido
--
-- security definer: corre con los permisos del dueño de la función, por eso
-- puede insertar aunque quien la llama (anon) no pueda. A cambio, todo lo que
-- llega desde el navegador se trata como no confiable:
--   - El precio sale de la tabla productos, nunca del cliente.
--   - Los productos inexistentes y las cantidades fuera de rango se rechazan.
--   - search_path vacío evita que se resuelvan objetos de otro esquema.
--
-- Pasarela simulada: una tarjeta terminada en 0002 se rechaza (la tarjeta de
-- prueba que usan las pasarelas reales); cualquier otra se aprueba y el
-- pedido nace pagado. Con transferencia, el pedido queda pendiente hasta que
-- el administrador confirme el pago. Si algo falla, la transacción entera se
-- deshace y no queda un pedido a medio crear.

create function public.crear_pedido(
  comprador   jsonb,
  items       jsonb,
  metodo_pago text,
  tarjeta     jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  nuevo_id          bigint;
  nuevo_total       integer;
  nuevo_estado      text;
  items_guardados   integer;
  productos_pedidos integer;
begin
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items) = 0 then
    raise exception 'pedido_vacio';
  end if;

  if metodo_pago = 'tarjeta' then
    if coalesce(tarjeta ->> 'ultimos4', '') = '0002' then
      raise exception 'pago_rechazado';
    end if;
    nuevo_estado := 'pagado';
  else
    nuevo_estado := 'pendiente';
  end if;

  insert into public.pedidos (
    nombre, email, telefono, direccion, ciudad, codigo_postal,
    metodo_pago, tarjeta_marca, tarjeta_ultimos4, estado
  )
  values (
    trim(comprador ->> 'nombre'),
    lower(trim(comprador ->> 'email')),
    trim(comprador ->> 'telefono'),
    trim(comprador ->> 'direccion'),
    trim(comprador ->> 'ciudad'),
    upper(trim(comprador ->> 'codigo_postal')),
    metodo_pago,
    case when metodo_pago = 'tarjeta' then tarjeta ->> 'marca' end,
    case when metodo_pago = 'tarjeta' then tarjeta ->> 'ultimos4' end,
    nuevo_estado
  )
  returning id into nuevo_id;

  -- group by suma las cantidades si el mismo producto llega repetido.
  insert into public.pedido_items (pedido_id, producto_id, nombre, precio_unitario, cantidad)
  select nuevo_id, p.id, p.nombre, p.precio, sum(i.cantidad)::integer
    from jsonb_to_recordset(items) as i (producto_id bigint, cantidad integer)
    join public.productos p on p.id = i.producto_id
   group by p.id, p.nombre, p.precio;

  get diagnostics items_guardados = row_count;

  select count(distinct i.producto_id)
    into productos_pedidos
    from jsonb_to_recordset(items) as i (producto_id bigint);

  if items_guardados <> productos_pedidos then
    raise exception 'producto_inexistente';
  end if;

  update public.pedidos
     set total = (
       select sum(pi.precio_unitario * pi.cantidad)
         from public.pedido_items pi
        where pi.pedido_id = nuevo_id
     )
   where id = nuevo_id
  returning total into nuevo_total;

  return jsonb_build_object('id', nuevo_id, 'total', nuevo_total, 'estado', nuevo_estado);
end;
$$;

comment on function public.crear_pedido is
  'Único punto de entrada para crear pedidos desde el sitio público. Calcula el total con los precios de la base.';

revoke execute on function public.crear_pedido from public;
grant execute on function public.crear_pedido to anon, authenticated;
