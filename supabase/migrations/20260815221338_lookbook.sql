-- VOLT — Lookbook: looks editoriales y su relación con los productos
--
-- Reemplaza src/data/lookbook.js, donde cada look listaba sus prendas por
-- nombre de texto. Renombrar un producto rompía esa referencia en silencio;
-- con clave foránea la base no permite llegar a ese estado.


-- Looks

create table public.looks (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  imagen_url text,
  orden      int  not null default 0
);

comment on table public.looks is
  'Looks editoriales. El número que muestra el sitio se deriva del orden.';

create index looks_orden_idx on public.looks (orden, id);

alter table public.looks enable row level security;

create policy "Lectura pública de looks"
  on public.looks for select
  to anon, authenticated
  using (true);

create policy "Alta de looks solo autenticada"
  on public.looks for insert
  to authenticated
  with check (true);

create policy "Edición de looks solo autenticada"
  on public.looks for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de looks solo autenticada"
  on public.looks for delete
  to authenticated
  using (true);


-- Relación muchos a muchos con productos
-- Un look combina varias prendas y una prenda aparece en varios looks, así que
-- la relación necesita su propia tabla. La clave primaria compuesta impide
-- además cargar dos veces el mismo producto en un mismo look.

create table public.look_productos (
  look_id     bigint not null references public.looks (id) on delete cascade,
  producto_id bigint not null references public.productos (id) on delete cascade,

  primary key (look_id, producto_id)
);

-- La clave primaria ya indexa por look_id; este índice cubre el sentido
-- inverso (en qué looks aparece un producto).
create index look_productos_producto_id_idx on public.look_productos (producto_id);

alter table public.look_productos enable row level security;

create policy "Lectura pública de prendas del look"
  on public.look_productos for select
  to anon, authenticated
  using (true);

create policy "Alta de prendas del look solo autenticada"
  on public.look_productos for insert
  to authenticated
  with check (true);

create policy "Baja de prendas del look solo autenticada"
  on public.look_productos for delete
  to authenticated
  using (true);


-- Storage: imágenes de los looks

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lookbook', 'lookbook', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

create policy "Lectura pública de imágenes del lookbook"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lookbook');

create policy "Subida de imágenes del lookbook solo autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'lookbook');

create policy "Reemplazo de imágenes del lookbook solo autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'lookbook')
  with check (bucket_id = 'lookbook');

create policy "Borrado de imágenes del lookbook solo autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'lookbook');


-- Contenido actual

insert into public.looks (nombre, orden) values
  ('Voltaje',  1),
  ('Static',   2),
  ('Blackout', 3),
  ('Amp',      4);

-- Las prendas se asocian cruzando por nombre contra el catálogo ya cargado.
-- Si algún producto fue renombrado o eliminado desde el panel, esa asociación
-- simplemente no se crea y se puede completar después desde el formulario.
insert into public.look_productos (look_id, producto_id)
select l.id, p.id
  from (values
    ('Voltaje',  'Voltaje Hoodie'),
    ('Voltaje',  'Corriente Cargo'),
    ('Voltaje',  'Gorra Voltio'),
    ('Static',   'Static Tee'),
    ('Static',   'Amperio Pants'),
    ('Blackout', 'Blackout Hoodie'),
    ('Blackout', 'Grid Tee'),
    ('Blackout', 'Medias Chispa'),
    ('Amp',      'Amp Hoodie'),
    ('Amp',      'Circuito Tee'),
    ('Amp',      'Gorra Voltio')
  ) as iniciales (look, producto)
  join public.looks l     on l.nombre = iniciales.look
  join public.productos p on p.nombre = iniciales.producto;
