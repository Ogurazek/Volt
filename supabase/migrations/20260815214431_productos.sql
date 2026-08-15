-- VOLT — Productos del catálogo (sección Colección)
--
-- Migra src/data/productos.js a una tabla administrable, reutilizando las
-- categorías que ya usan los drops.


-- Productos

create table public.productos (
  id           bigint generated always as identity primary key,
  nombre       text    not null,
  categoria_id bigint  not null references public.categorias (id) on delete restrict,
  precio       integer not null,
  imagen_url   text,
  creado_en    timestamptz not null default now(),

  -- El precio se guarda en pesos enteros: el catálogo no maneja centavos y
  -- así se evita cualquier problema de redondeo.
  constraint productos_precio_valido check (precio >= 0)
);

comment on table public.productos is
  'Catálogo de la sección Colección. Se administra desde /admin.';

create index productos_categoria_id_idx on public.productos (categoria_id);

alter table public.productos enable row level security;

create policy "Lectura pública de productos"
  on public.productos for select
  to anon, authenticated
  using (true);

create policy "Alta de productos solo autenticada"
  on public.productos for insert
  to authenticated
  with check (true);

create policy "Edición de productos solo autenticada"
  on public.productos for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de productos solo autenticada"
  on public.productos for delete
  to authenticated
  using (true);


-- Datos iniciales
-- La categoría se resuelve por slug contra la tabla existente, así el orden
-- de los ids de categorias no importa.

insert into public.productos (nombre, categoria_id, precio)
select iniciales.nombre, c.id, iniciales.precio
  from (values
    ('Voltaje Hoodie',  'hoodies',    68000),
    ('Amp Hoodie',      'hoodies',    72000),
    ('Blackout Hoodie', 'hoodies',    70000),
    ('Circuito Tee',    'tees',       32000),
    ('Static Tee',      'tees',       30000),
    ('Grid Tee',        'tees',       31000),
    ('Corriente Cargo', 'pants',      58000),
    ('Amperio Pants',   'pants',      62000),
    ('Gorra Voltio',    'accesorios', 22000),
    ('Medias Chispa',   'accesorios', 12000)
  ) as iniciales (nombre, slug, precio)
  join public.categorias c on c.slug = iniciales.slug;


-- Storage: bucket de imágenes de productos
-- Bucket separado del de drops para que cada sección administre lo suyo.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos',
  'productos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Lectura pública de imágenes de productos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'productos');

create policy "Subida de imágenes de productos solo autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

create policy "Reemplazo de imágenes de productos solo autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos')
  with check (bucket_id = 'productos');

create policy "Borrado de imágenes de productos solo autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');
