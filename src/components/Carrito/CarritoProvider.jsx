import { useEffect, useMemo, useReducer, useState } from 'react'
import { CarritoContexto } from '../../hooks/useCarrito'
import { guardarCarrito, leerCarrito, reducirCarrito } from '../../lib/carrito'

function CarritoProvider({ productos, catalogoListo, children }) {
  const [items, despachar] = useReducer(reducirCarrito, undefined, leerCarrito)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    guardarCarrito(items)
  }, [items])

  useEffect(() => {
    if (catalogoListo) despachar({ tipo: 'sincronizar', productos })
  }, [catalogoListo, productos])

  // Las acciones no dependen de los items: se crean una sola vez y quien las
  // use en un efecto no se re-ejecuta cada vez que cambia una cantidad.
  const acciones = useMemo(
    () => ({
      agregar: (producto) => despachar({ tipo: 'agregar', producto }),
      cambiarCantidad: (id, cantidad) => despachar({ tipo: 'cambiar-cantidad', id, cantidad }),
      quitar: (id) => despachar({ tipo: 'quitar', id }),
      vaciar: () => despachar({ tipo: 'vaciar' }),
      abrirCarrito: () => setAbierto(true),
      cerrarCarrito: () => setAbierto(false),
    }),
    [],
  )

  const valor = useMemo(
    () => ({
      ...acciones,
      items,
      abierto,
      cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
      total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
      cantidadDe: (id) => items.find((item) => item.id === id)?.cantidad ?? 0,
    }),
    [acciones, items, abierto],
  )

  return <CarritoContexto.Provider value={valor}>{children}</CarritoContexto.Provider>
}

export default CarritoProvider
