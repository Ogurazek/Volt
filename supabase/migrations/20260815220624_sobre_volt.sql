-- VOLT — Contenido editable de la sección Sobre VOLT
--
-- A diferencia de productos y drops, esta sección no son tarjetas sino texto.
-- Se modela como una fila única con dos listas asociadas.


-- Sobre (fila única)

create table public.sobre (
  id         smallint primary key default 1,
  etiqueta   text not null,
  lead       text not null,
  imagen_url text,

  -- La sección es una sola: la restricción impide que existan dos filas,
  -- en lugar de confiar en que nadie inserte otra.
  constraint sobre_fila_unica check (id = 1)
);

comment on column public.sobre.lead is
  'Frase destacada. Los saltos de línea se guardan como tales y se respetan al mostrar; no se acepta HTML.';

alter table public.sobre enable row level security;

create policy "Lectura pública de sobre"
  on public.sobre for select
  to anon, authenticated
  using (true);

create policy "Edición de sobre solo autenticada"
  on public.sobre for update
  to authenticated
  using (true)
  with check (true);


-- Párrafos de la historia

create table public.sobre_parrafos (
  id       bigint generated always as identity primary key,
  sobre_id smallint not null references public.sobre (id) on delete cascade,
  texto    text     not null,
  orden    int      not null default 0
);

create index sobre_parrafos_orden_idx on public.sobre_parrafos (orden, id);

alter table public.sobre_parrafos enable row level security;

create policy "Lectura pública de párrafos"
  on public.sobre_parrafos for select
  to anon, authenticated
  using (true);

create policy "Alta de párrafos solo autenticada"
  on public.sobre_parrafos for insert
  to authenticated
  with check (true);

create policy "Edición de párrafos solo autenticada"
  on public.sobre_parrafos for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de párrafos solo autenticada"
  on public.sobre_parrafos for delete
  to authenticated
  using (true);


-- Valores de la marca

create table public.sobre_valores (
  id       bigint generated always as identity primary key,
  sobre_id smallint not null references public.sobre (id) on delete cascade,
  nombre   text     not null,
  texto    text     not null,
  orden    int      not null default 0
);

create index sobre_valores_orden_idx on public.sobre_valores (orden, id);

alter table public.sobre_valores enable row level security;

create policy "Lectura pública de valores"
  on public.sobre_valores for select
  to anon, authenticated
  using (true);

create policy "Alta de valores solo autenticada"
  on public.sobre_valores for insert
  to authenticated
  with check (true);

create policy "Edición de valores solo autenticada"
  on public.sobre_valores for update
  to authenticated
  using (true)
  with check (true);

create policy "Baja de valores solo autenticada"
  on public.sobre_valores for delete
  to authenticated
  using (true);


-- Storage: imagen de la sección

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sobre', 'sobre', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

create policy "Lectura pública de imagen de sobre"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'sobre');

create policy "Subida de imagen de sobre solo autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'sobre');

create policy "Reemplazo de imagen de sobre solo autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'sobre')
  with check (bucket_id = 'sobre');

create policy "Borrado de imagen de sobre solo autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'sobre');


-- Contenido actual

insert into public.sobre (id, etiqueta, lead) values (
  1,
  'Nuestra historia',
  E'VOLT nació en las calles.\nNo en una oficina.'
);

insert into public.sobre_parrafos (sobre_id, texto, orden) values
  (1, 'Somos una marca de indumentaria urbana que cree en la autenticidad antes que en las tendencias. Cada pieza que diseñamos está pensada para durar, moverse y contar una historia.', 1),
  (1, 'Empezamos con tres amigos, una idea y demasiado tiempo libre. Hoy somos VOLT: una comunidad de personas que eligen moverse a su ritmo.', 2);

insert into public.sobre_valores (sobre_id, nombre, texto, orden) values
  (1, 'Autenticidad', 'Sin filtros, sin pretensiones. Solo ropa real para gente real.', 1),
  (1, 'Calidad',      'Materiales que aguantan el movimiento y el tiempo.', 2),
  (1, 'Comunidad',    'Construimos con la gente que nos elige, no solo para ellos.', 3),
  (1, 'Movimiento',   'Cada pieza pensada para la calle, no para el escaparate.', 4);
