-- VOLT — Categorías como tabla propia y relación con drops
--
-- Hasta ahora drops.categoria era texto libre: nada impedía cargar "hoodies",
-- "Hoodies" o "Hoddies" y que el drop quedara fuera de todo filtro. Se pasa a
-- una tabla referenciada por clave foránea, que además alimenta el desplegable
-- del panel. La misma tabla la van a usar los productos de Colección.


-- Categorías

create table public.categorias (
  id     bigint generated always as identity primary key,
  slug   text not null unique,
  nombre text not null unique,
  orden  int  not null default 0
);

comment on table public.categorias is
  'Categorías compartidas por productos y drops.';

alter table public.categorias enable row level security;

create policy "Lectura pública de categorías"
  on public.categorias for select
  to anon, authenticated
  using (true);

create policy "Alta de categorías solo autenticada"
  on public.categorias for insert
  to authenticated
  with check (true);

create policy "Edición de categorías solo autenticada"
  on public.categorias for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de categorías solo autenticada"
  on public.categorias for delete
  to authenticated
  using (true);

-- El slug es el que ya usan los anchors del sitio (#hoodies, #tees, ...).
insert into public.categorias (slug, nombre, orden) values
  ('hoodies',    'Hoodies',    1),
  ('tees',       'Tees',       2),
  ('pants',      'Pants',      3),
  ('accesorios', 'Accesorios', 4),
  ('capsula',    'Cápsula',    5);


-- Relación con drops

alter table public.drops
  add column categoria_id bigint references public.categorias (id) on delete restrict;

-- Los nombres actuales coinciden con los de la tabla nueva, así que la
-- correspondencia se resuelve sola.
update public.drops d
   set categoria_id = c.id
  from public.categorias c
 where c.nombre = d.categoria;

-- Recién con todas las filas asociadas se puede exigir el dato.
alter table public.drops alter column categoria_id set not null;

alter table public.drops drop column categoria;

create index drops_categoria_id_idx on public.drops (categoria_id);
