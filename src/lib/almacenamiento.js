import { supabase } from './supabase'

// Las mismas reglas estan declaradas en cada bucket. Estas constantes son para
// avisar antes de subir en vano; la validacion que no se puede evadir es la
// del servidor.
export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const TAMANO_MAXIMO = 5 * 1024 * 1024

export async function subirImagen(bucket, archivo) {
  const extension = archivo.name.split('.').pop().toLowerCase()
  const nombre = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(bucket).upload(nombre, archivo, {
    cacheControl: '3600',
    contentType: archivo.type,
  })

  if (error) throw error

  return supabase.storage.from(bucket).getPublicUrl(nombre).data.publicUrl
}
