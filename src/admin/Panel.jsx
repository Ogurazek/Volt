import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductosAdmin from './ProductosAdmin'
import DropsAdmin from './DropsAdmin'
import SobreAdmin from './SobreAdmin'

const SECCIONES = [
  { clave: 'coleccion', etiqueta: 'Colección', componente: ProductosAdmin },
  { clave: 'drops', etiqueta: 'Drops', componente: DropsAdmin },
  { clave: 'sobre', etiqueta: 'Sobre VOLT', componente: SobreAdmin },
]

function Panel({ sesion }) {
  const [seccion, setSeccion] = useState('coleccion')
  const [saliendo, setSaliendo] = useState(false)

  const SeccionActiva = SECCIONES.find((item) => item.clave === seccion).componente

  const cerrarSesion = async () => {
    setSaliendo(true)
    await supabase.auth.signOut()
  }

  return (
    <div className="admin">
      <header className="admin__barra">
        <div className="admin__barra-izq">
          <span className="admin__marca">VOLT</span>
          <span className="admin__seccion">Admin</span>
        </div>

        <div className="admin__barra-der">
          <span className="admin__usuario">{sesion.user.email}</span>
          <Link to="/" className="admin__link-sitio">
            Ver sitio
          </Link>
          <button type="button" className="admin__salir" onClick={cerrarSesion} disabled={saliendo}>
            <LogOut size={16} strokeWidth={2.5} aria-hidden="true" />
            {saliendo ? 'Saliendo…' : 'Salir'}
          </button>
        </div>
      </header>

      <nav className="admin__pestanas" aria-label="Secciones administrables">
        {SECCIONES.map((item) => (
          <button
            key={item.clave}
            type="button"
            className={`admin__pestana ${seccion === item.clave ? 'admin__pestana--activa' : ''}`}
            aria-current={seccion === item.clave ? 'page' : undefined}
            onClick={() => setSeccion(item.clave)}
          >
            {item.etiqueta}
          </button>
        ))}
      </nav>

      <main className="admin__contenido">
        <SeccionActiva />
      </main>
    </div>
  )
}

export default Panel
