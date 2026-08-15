import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import NewsletterPopup from './components/NewsletterPopup/NewsletterPopup'
import Inicio from './sections/Inicio/Inicio'
import Coleccion from './sections/Coleccion/Coleccion'
import Lookbook from './sections/Lookbook/Lookbook'
import Drops from './sections/Drops/Drops'
import Sobre from './sections/Sobre/Sobre'
import Contacto from './sections/Contacto/Contacto'
import { useDrops } from './hooks/useDrops'
import { useProductos } from './hooks/useProductos'
import { useSobre } from './hooks/useSobre'
import { useLookbook } from './hooks/useLookbook'

function SitioPublico() {
  const drops = useDrops()
  const catalogo = useProductos()
  const sobre = useSobre()
  const lookbook = useLookbook()

  return (
    <>
      <Navbar />
      <main>
        <Inicio drops={drops.drops} />
        <Coleccion
          productos={catalogo.productos}
          categorias={catalogo.categorias}
          cargando={catalogo.cargando}
          error={catalogo.error}
        />
        <Lookbook looks={lookbook.looks} cargando={lookbook.cargando} error={lookbook.error} />
        <Drops drops={drops.drops} cargando={drops.cargando} error={drops.error} />
        <Sobre sobre={sobre.sobre} cargando={sobre.cargando} error={sobre.error} />
        <Contacto />
      </main>
      <Footer />
      <NewsletterPopup />
    </>
  )
}

export default SitioPublico
