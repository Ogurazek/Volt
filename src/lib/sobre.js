import { supabase } from './supabase'
import { subirImagen } from './almacenamiento'

const BUCKET = 'sobre'
const FILA = 1

const CAMPOS =
  'id, etiqueta, lead, imagen_url, sobre_parrafos (id, texto, orden), sobre_valores (id, nombre, texto, orden)'

const porOrden = (a, b) => a.orden - b.orden || a.id - b.id

export async function obtenerSobre() {
  const { data, error } = await supabase.from('sobre').select(CAMPOS).eq('id', FILA).single()

  if (error) throw error

  return {
    ...data,
    parrafos: [...data.sobre_parrafos].sort(porOrden),
    valores: [...data.sobre_valores].sort(porOrden),
  }
}

// Las listas se sincronizan por diferencia en lugar de borrar todo y volver a
// insertar: asi las filas que no cambiaron conservan su id.
async function sincronizarLista(tabla, items, idsOriginales, construirFila) {
  const idsActuales = items.filter((item) => item.id).map((item) => item.id)
  const aEliminar = idsOriginales.filter((id) => !idsActuales.includes(id))

  if (aEliminar.length) {
    const { error } = await supabase.from(tabla).delete().in('id', aEliminar)
    if (error) throw error
  }

  const nuevos = []

  for (const [indice, item] of items.entries()) {
    const fila = construirFila(item, indice)

    if (item.id) {
      const { error } = await supabase.from(tabla).update(fila).eq('id', item.id)
      if (error) throw error
    } else {
      nuevos.push(fila)
    }
  }

  if (nuevos.length) {
    const { error } = await supabase.from(tabla).insert(nuevos)
    if (error) throw error
  }
}

export async function guardarSobre({ etiqueta, lead, imagen_url, parrafos, valores, idsOriginales }) {
  const { error } = await supabase
    .from('sobre')
    .update({ etiqueta: etiqueta.trim(), lead: lead.trim(), imagen_url })
    .eq('id', FILA)

  if (error) throw error

  await sincronizarLista('sobre_parrafos', parrafos, idsOriginales.parrafos, (item, indice) => ({
    sobre_id: FILA,
    texto: item.texto.trim(),
    orden: indice + 1,
  }))

  await sincronizarLista('sobre_valores', valores, idsOriginales.valores, (item, indice) => ({
    sobre_id: FILA,
    nombre: item.nombre.trim(),
    texto: item.texto.trim(),
    orden: indice + 1,
  }))
}

export function subirImagenSobre(archivo) {
  return subirImagen(BUCKET, archivo)
}
