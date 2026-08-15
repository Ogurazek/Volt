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

function SitioPublico() {
  const { drops, cargando, error } = useDrops()

  return (
    <>
      <Navbar />
      <main>
        <Inicio drops={drops} />
        <Coleccion />
        <Lookbook />
        <Drops drops={drops} cargando={cargando} error={error} />
        <Sobre />
        <Contacto />
      </main>
      <Footer />
      <NewsletterPopup />
    </>
  )
}

export default SitioPublico
