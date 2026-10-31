import { supabase, supabaseConfigurado } from './supabase'

export const ESTADOS_PEDIDO = [
  { valor: 'pendiente', etiqueta: 'Pendiente de pago' },
  { valor: 'pagado', etiqueta: 'Pagado' },
  { valor: 'enviado', etiqueta: 'Enviado' },
  { valor: 'entregado', etiqueta: 'Entregado' },
  { valor: 'cancelado', etiqueta: 'Cancelado' },
]

export function numeroDePedido(id) {
  return `#${String(id).padStart(6, '0')}`
}

// Del carrito solo viajan id y cantidad: el precio lo pone la base. Si el
// navegador mandara precios, cualquiera podria editarlos desde la consola.
export async function crearPedido({ comprador, items, metodoPago, tarjeta }) {
  if (!supabaseConfigurado) throw new Error('sin-configurar')

  const { data, error } = await supabase.rpc('crear_pedido', {
    comprador,
    items: items.map((item) => ({ producto_id: item.id, cantidad: item.cantidad })),
    metodo_pago: metodoPago,
    tarjeta: metodoPago === 'tarjeta' ? tarjeta : null,
  })

  if (error) throw error
  return data
}

export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, pedido_items (id, nombre, precio_unitario, cantidad)')
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data
}

export async function cambiarEstadoPedido(id, estado) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
    .select('id')

  if (error) throw error
  if (!data.length) throw new Error('sin-permiso')
}
