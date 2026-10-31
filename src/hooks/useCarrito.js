import { createContext, useContext } from 'react'

// A diferencia de los otros hooks, el carrito no se pide a la base: es estado
// compartido entre la navbar, el catalogo y el panel del carrito, asi que vive
// en un contexto que provee CarritoProvider.
export const CarritoContexto = createContext(null)

export function useCarrito() {
  const carrito = useContext(CarritoContexto)
  if (!carrito) throw new Error('useCarrito se usa dentro de <CarritoProvider>')
  return carrito
}
