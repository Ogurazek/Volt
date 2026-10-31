const CLAVE = 'volt-carrito'

// Son ediciones limitadas: un tope por prenda evita pedidos absurdos.
export const CANTIDAD_MAXIMA = 10

// Cada item guarda una copia de los datos del producto para poder mostrar el
// carrito antes de que llegue el catalogo. Cuando llega, se sincroniza.
function crearItem(producto, cantidad) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: Number(producto.precio),
    imagen_url: producto.imagen_url,
    categoria: producto.categorias?.nombre ?? producto.categoria ?? '',
    cantidad,
  }
}

function limitar(cantidad) {
  return Math.min(Math.max(cantidad, 1), CANTIDAD_MAXIMA)
}

export function reducirCarrito(items, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const existente = items.find((item) => item.id === accion.producto.id)
      if (!existente) return [...items, crearItem(accion.producto, 1)]
      return items.map((item) =>
        item.id === existente.id ? { ...item, cantidad: limitar(item.cantidad + 1) } : item,
      )
    }

    case 'cambiar-cantidad':
      return items.map((item) =>
        item.id === accion.id ? { ...item, cantidad: limitar(accion.cantidad) } : item,
      )

    case 'quitar':
      return items.filter((item) => item.id !== accion.id)

    case 'vaciar':
      return []

    // El admin pudo haber cambiado el precio o borrado el producto desde que se
    // agrego: manda siempre lo que dice la base, nunca la copia guardada.
    case 'sincronizar':
      return items.flatMap((item) => {
        const actual = accion.productos.find((producto) => producto.id === item.id)
        return actual ? [crearItem(actual, item.cantidad)] : []
      })

    default:
      return items
  }
}

function esItemValido(item) {
  return (
    item &&
    Number.isInteger(item.id) &&
    Number.isFinite(item.precio) &&
    Number.isInteger(item.cantidad) &&
    item.cantidad > 0
  )
}

// localStorage puede no estar disponible (modo privado, almacenamiento
// bloqueado) o tener basura: en ese caso el carrito arranca vacio.
export function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE))
    return Array.isArray(guardado) ? guardado.filter(esItemValido) : []
  } catch {
    return []
  }
}

export function guardarCarrito(items) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  } catch {
    // Sin almacenamiento el carrito sigue funcionando, solo no sobrevive al refresh.
  }
}
