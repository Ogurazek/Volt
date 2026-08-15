-- VOLT — Storage: bucket de imágenes de drops



insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'drops',
  'drops',
  true,
  5242880,  -- 5 MB por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

-- Políticas de acceso a los archivos
-- Los archivos de todos los buckets viven en la tabla storage.objects, que
-- también tiene RLS. Por eso cada política se acota con bucket_id = 'drops':
-- sin esa condición estaríamos abriendo el acceso a cualquier otro bucket
-- que el proyecto llegue a tener en el futuro.

create policy "Lectura pública de imágenes de drops"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'drops');

create policy "Subida de imágenes solo autenticada"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'drops');

create policy "Reemplazo de imágenes solo autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'drops')
  with check (bucket_id = 'drops');

create policy "Borrado de imágenes solo autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'drops');
