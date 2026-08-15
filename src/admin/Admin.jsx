import { supabaseConfigurado } from '../lib/supabase'
import { useSesion } from '../hooks/useSesion'
import Login from './Login'
import Panel from './Panel'
import './Admin.css'

function Admin() {
  const { sesion, cargando } = useSesion()

  if (!supabaseConfigurado) {
    return (
      <div className="admin-aviso">
        <h1 className="admin-aviso__titulo">Falta configuración</h1>
        <p>
          No están definidas <code>VITE_SUPABASE_URL</code> y{' '}
          <code>VITE_SUPABASE_ANON_KEY</code>. Copiá <code>.env.example</code> como{' '}
          <code>.env</code> y completá los valores del proyecto.
        </p>
      </div>
    )
  }

  if (cargando) {
    return (
      <div className="admin-aviso">
        <p>Verificando sesión…</p>
      </div>
    )
  }

  return sesion ? <Panel sesion={sesion} /> : <Login />
}

export default Admin
