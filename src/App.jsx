import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Inicio from './sections/Inicio/Inicio'
import Coleccion from './sections/Coleccion/Coleccion'
import Lookbook from './sections/Lookbook/Lookbook'
import Drops from './sections/Drops/Drops'
import Sobre from './sections/Sobre/Sobre'
import Contacto from './sections/Contacto/Contacto'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Inicio />
        <Coleccion />
        <Lookbook />
        <Drops />
        <Sobre />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}

export default App
