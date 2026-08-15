import { useEffect, useState } from 'react'
import { supabase, supabaseConfigurado } from '../lib/supabase'
import Login from './Login'
import Panel from './Panel'
import './Admin.css'

function Admin() {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!supabaseConfigurado) {
      setCargando(false)
      return
    }

    // getSession lee la sesion guardada por el navegador: por eso el panel
    // sobrevive a un refresh sin volver a pedir credenciales.
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    // onAuthStateChange mantiene el estado sincronizado ante login, logout
    // y renovacion automatica del token.
    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, sesionActual) => {
      setSesion(sesionActual)
    })

    return () => escucha.subscription.unsubscribe()
  }, [])

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
