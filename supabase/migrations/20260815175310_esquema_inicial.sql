-- 
-- VOLT — Esquema inicial: tabla de drops (lanzamientos)
-- Migra el catálogo que hasta ahora vivía como archivo estático
-- (src/data/drops.js) a una tabla administrable desde el panel


-- Tabla de drops

create table public.drops (
  id          bigint generated always as identity primary key,
  nombre      text        not null,
  categoria   text        not null,
  estado      text        not null default 'nuevo',
  fecha       timestamptz,
  imagen_url  text,
  creado_en   timestamptz not null default now(),

  -- Solo se admiten los tres estados que representa la interfaz.
  constraint drops_estado_valido
    check (estado in ('nuevo', 'agotado', 'proximo')),

  -- Un drop "proximo" necesita fecha: sin ella no hay countdown posible.
  -- La regla se declara en la base y no solo en el formulario, para que
  -- el dato no pueda quedar inconsistente por más que falle el cliente.
  constraint drops_fecha_requerida_para_proximo
    check (estado <> 'proximo' or fecha is not null)
);

comment on table public.drops is
  'Lanzamientos de la marca. Se administran desde /admin.';

-- El sitio público lista los drops por orden de carga descendente.
create index drops_creado_en_idx on public.drops (creado_en desc);


-- Seguridad a nivel de fila (Row Level Security)

alter table public.drops enable row level security;

-- Cualquier visitante puede leer el catálogo: es contenido público del sitio.
create policy "Lectura pública de drops"
  on public.drops for select
  to anon, authenticated
  using (true);

-- Crear, modificar y eliminar queda restringido a usuarios autenticados.
create policy "Alta de drops solo autenticada"
  on public.drops for insert
  to authenticated
  with check (true);

create policy "Edición de drops solo autenticada"
  on public.drops for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de drops solo autenticada"
  on public.drops for delete
  to authenticated
  using (true);


-- Datos iniciales
-- Réplica del catálogo estático original, para que el sitio tenga
-- contenido desde el primer momento en que se conecta a la base.

insert into public.drops (nombre, categoria, estado, fecha) values
  ('Voltaje Hoodie',   'Hoodies', 'nuevo',   null),
  ('Circuito Tee',     'Tees',    'nuevo',   null),
  ('Corriente Cargo',  'Pants',   'agotado', null),
  ('Amperio Pack',     'Cápsula', 'proximo', '2026-09-01T12:00:00-03:00'),
  ('Blackout Reissue', 'Hoodies', 'proximo', '2026-09-15T12:00:00-03:00');
