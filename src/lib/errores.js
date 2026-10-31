// Supabase responde en ingles y con mensajes tecnicos. Los traducimos a algo
// que un usuario pueda entender y accionar.

export function traducirError(error) {
  const mensaje = (error?.message || '').toLowerCase()

  if (mensaje.includes('sin-permiso')) return 'No tenés permiso para esta operación. Volvé a iniciar sesión.'
  if (mensaje.includes('drops_fecha_requerida_para_proximo')) return 'Un drop próximo necesita fecha de lanzamiento.'
  if (mensaje.includes('drops_estado_valido')) return 'El estado seleccionado no es válido.'
  if (mensaje.includes('productos_precio_valido')) return 'El precio no puede ser negativo.'
  if (mensaje.includes('sin-configurar')) return 'La tienda no está disponible en este momento.'
  if (mensaje.includes('pago_rechazado')) return 'Tu tarjeta fue rechazada. Probá con otra o elegí transferencia.'
  if (mensaje.includes('pedido_vacio')) return 'Tu carrito está vacío.'
  if (mensaje.includes('producto_inexistente')) return 'Uno de los productos ya no está disponible. Revisá tu carrito.'
  if (mensaje.includes('pedido_items_cantidad_valida')) return 'Podés llevar hasta 10 unidades de cada producto.'
  if (mensaje.includes('pedidos_email_valido')) return 'El email no es válido.'
  if (mensaje.includes('pedidos_codigo_postal_valido')) return 'El código postal no es válido.'
  if (mensaje.includes('pedidos_') || mensaje.includes('not-null')) return 'Revisá los datos del formulario.'
  if (mensaje.includes('violates foreign key')) return 'La categoría seleccionada ya no existe.'
  if (mensaje.includes('exceeded the maximum allowed size')) return 'La imagen supera los 5 MB permitidos.'
  if (mensaje.includes('mime type')) return 'Formato de imagen no permitido. Usá JPG, PNG, WebP o AVIF.'
  if (mensaje.includes('jwt') || mensaje.includes('expired')) return 'Tu sesión expiró. Iniciá sesión de nuevo.'
  if (mensaje.includes('failed to fetch')) return 'Sin conexión con el servidor. Revisá tu internet.'

  return 'Ocurrió un error inesperado. Intentá de nuevo.'
}
