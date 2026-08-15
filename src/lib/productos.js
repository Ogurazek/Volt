import { supabase } from './supabase'
import { subirImagen } from './almacenamiento'

const BUCKET = 'productos'
const CAMPOS = 'id, nombre, precio, imagen_url, categoria_id, categorias (slug, nombre)'

export async function listarProductos() {
  // Agrupados por categoria, que es como los recorre el catalogo.
  const { data, error } = await supabase
    .from('productos')
    .select(CAMPOS)
    .order('categoria_id')
    .order('id')

  if (error) throw error
  return data
}

export async function crearProducto(datos) {
  const { data, error } = await supabase.from('productos').insert(datos).select(CAMPOS).single()

  if (error) throw error
  return data
}

export async function actualizarProducto(id, datos) {
  const { data, error } = await supabase
    .from('productos')
    .update(datos)
    .eq('id', id)
    .select(CAMPOS)
    .single()

  if (error) throw error
  return data
}

export async function eliminarProducto(id) {
  const { data, error } = await supabase.from('productos').delete().eq('id', id).select('id')

  if (error) throw error
  if (!data.length) throw new Error('sin-permiso')
}

export function subirImagenProducto(archivo) {
  return subirImagen(BUCKET, archivo)
}
