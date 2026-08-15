import { useEffect, useState } from 'react'
import { supabase, supabaseConfigurado } from '../lib/supabase'

// getSession lee la sesion guardada por el navegador, asi el estado sobrevive
// a un refresh. onAuthStateChange lo mantiene sincronizado ante login, logout
// y renovacion del token.

export function useSesion() {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!supabaseConfigurado) {
      setCargando(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, sesionActual) => {
      setSesion(sesionActual)
    })

    return () => escucha.subscription.unsubscribe()
  }, [])

  return { sesion, cargando }
}
