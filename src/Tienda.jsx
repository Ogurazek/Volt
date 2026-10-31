import { Outlet } from 'react-router-dom'
import CarritoProvider from './components/Carrito/CarritoProvider'
import { useProductos } from './hooks/useProductos'

// Envuelve las rutas del sitio publico (/ y /checkout) para que compartan el
// carrito y el catalogo. El admin queda afuera: no usa ninguno de los dos.
function Tienda() {
  const catalogo = useProductos()

  return (
    <CarritoProvider
      productos={catalogo.productos}
      catalogoListo={!catalogo.cargando && !catalogo.error}
    >
      <Outlet context={catalogo} />
    </CarritoProvider>
  )
}

export default Tienda
