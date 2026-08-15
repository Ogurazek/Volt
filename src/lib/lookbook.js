import { supabase } from './supabase'
import { subirImagen } from './almacenamiento'

const BUCKET = 'lookbook'
const CAMPOS = 'id, nombre, imagen_url, orden, look_productos (productos (id, nombre))'

export async function listarLooks() {
  const { data, error } = await supabase.from('looks').select(CAMPOS).order('orden').order('id')

  if (error) throw error

  // Aplanamos la tabla intermedia: al consumidor le interesa la lista de
  // prendas, no que exista un look_productos en el medio.
  return data.map((look) => ({
    ...look,
    prendas: look.look_productos.map((fila) => fila.productos).sort((a, b) => a.id - b.id),
  }))
}

async function sincronizarPrendas(lookId, idsElegidos, idsOriginales) {
  const aQuitar = idsOriginales.filter((id) => !idsElegidos.includes(id))
  const aAgregar = idsElegidos.filter((id) => !idsOriginales.includes(id))

  if (aQuitar.length) {
    const { error } = await supabase
      .from('look_productos')
      .delete()
      .eq('look_id', lookId)
      .in('producto_id', aQuitar)

    if (error) throw error
  }

  if (aAgregar.length) {
    const { error } = await supabase
      .from('look_productos')
      .insert(aAgregar.map((producto_id) => ({ look_id: lookId, producto_id })))

    if (error) throw error
  }
}

export async function crearLook({ nombre, imagen_url, orden, prendas }) {
  const { data, error } = await supabase
    .from('looks')
    .insert({ nombre, imagen_url, orden })
    .select('id')
    .single()

  if (error) throw error

  await sincronizarPrendas(data.id, prendas, [])
  return data
}

export async function actualizarLook(id, { nombre, imagen_url, prendas }, prendasOriginales) {
  const { error } = await supabase.from('looks').update({ nombre, imagen_url }).eq('id', id)

  if (error) throw error

  await sincronizarPrendas(id, prendas, prendasOriginales)
}

export async function eliminarLook(id) {
  // Las filas de look_productos se van solas por el on delete cascade.
  const { data, error } = await supabase.from('looks').delete().eq('id', id).select('id')

  if (error) throw error
  if (!data.length) throw new Error('sin-permiso')
}

// Reordenar es intercambiar la clave de orden entre dos looks vecinos.
export async function intercambiarOrden(primero, segundo) {
  const { error: errorPrimero } = await supabase
    .from('looks')
    .update({ orden: segundo.orden })
    .eq('id', primero.id)

  if (errorPrimero) throw errorPrimero

  const { error: errorSegundo } = await supabase
    .from('looks')
    .update({ orden: primero.orden })
    .eq('id', segundo.id)

  if (errorSegundo) throw errorSegundo
}

export function subirImagenLook(archivo) {
  return subirImagen(BUCKET, archivo)
}
