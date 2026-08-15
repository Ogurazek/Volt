import { supabase } from './supabase'
import { subirImagen } from './almacenamiento'

const BUCKET = 'drops'
const CAMPOS = 'id, nombre, estado, fecha, imagen_url, categoria_id, categorias (slug, nombre)'

export const ESTADOS = [
  { valor: 'nuevo', etiqueta: 'Nuevo' },
  { valor: 'agotado', etiqueta: 'Agotado' },
  { valor: 'proximo', etiqueta: 'Próximo' },
]

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

export function subirImagenDrop(archivo) {
  return subirImagen(BUCKET, archivo)
}
