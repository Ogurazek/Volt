import { supabase } from './supabase'

const BUCKET = 'drops'
const CAMPOS = 'id, nombre, estado, fecha, imagen_url, categoria_id, categorias (slug, nombre)'

export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const TAMANO_MAXIMO = 5 * 1024 * 1024

export const ESTADOS = [
  { valor: 'nuevo', etiqueta: 'Nuevo' },
  { valor: 'agotado', etiqueta: 'Agotado' },
  { valor: 'proximo', etiqueta: 'Próximo' },
]

export async function listarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, slug, nombre')
    .order('orden')

  if (error) throw error
  return data
}

export async function listarDrops() {
  const { data, error } = await supabase
    .from('drops')
    .select(CAMPOS)
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}

export async function crearDrop(datos) {
  const { data, error } = await supabase.from('drops').insert(datos).select(CAMPOS).single()

  if (error) throw error
  return data
}

export async function actualizarDrop(id, datos) {
  const { data, error } = await supabase
    .from('drops')
    .update(datos)
    .eq('id', id)
    .select(CAMPOS)
    .single()

  if (error) throw error
  return data
}

export async function eliminarDrop(id) {
  // La respuesta trae las filas borradas: si viene vacia, RLS filtro la
  // operacion en lugar de rechazarla y conviene avisar en vez de dar por hecho.
  const { data, error } = await supabase.from('drops').delete().eq('id', id).select('id')

  if (error) throw error
  if (!data.length) throw new Error('sin-permiso')
}

export async function subirImagen(archivo) {
  const extension = archivo.name.split('.').pop().toLowerCase()
  const nombre = `${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(nombre, archivo, {
    cacheControl: '3600',
    contentType: archivo.type,
  })

  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(nombre).data.publicUrl
}

export function traducirError(error) {
  const mensaje = (error?.message || '').toLowerCase()

  if (mensaje.includes('sin-permiso')) return 'No tenés permiso para esta operación. Volvé a iniciar sesión.'
  if (mensaje.includes('drops_fecha_requerida_para_proximo')) return 'Un drop próximo necesita fecha de lanzamiento.'
  if (mensaje.includes('drops_estado_valido')) return 'El estado seleccionado no es válido.'
  if (mensaje.includes('violates foreign key')) return 'La categoría seleccionada ya no existe.'
  if (mensaje.includes('exceeded the maximum allowed size')) return 'La imagen supera los 5 MB permitidos.'
  if (mensaje.includes('mime type')) return 'Formato de imagen no permitido. Usá JPG, PNG, WebP o AVIF.'
  if (mensaje.includes('jwt') || mensaje.includes('expired')) return 'Tu sesión expiró. Iniciá sesión de nuevo.'
  if (mensaje.includes('failed to fetch')) return 'Sin conexión con el servidor. Revisá tu internet.'

  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}
