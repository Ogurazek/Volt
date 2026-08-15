import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import DropsAdmin from './DropsAdmin'

function Panel({ sesion }) {
  const [saliendo, setSaliendo] = useState(false)

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

      <main className="admin__contenido">
        <DropsAdmin />
      </main>
    </div>
  )
}

export default Panel
