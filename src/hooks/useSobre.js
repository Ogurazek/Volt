import { useEffect, useState } from 'react'
import { obtenerSobre } from '../lib/sobre'
import { traducirError } from '../lib/errores'
import { supabaseConfigurado } from '../lib/supabase'

export function useSobre() {
  const [sobre, setSobre] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabaseConfigurado) {
      setError('El contenido no está disponible en este momento.')
      setCargando(false)
      return
    }

    let vigente = true

    obtenerSobre()
      .then((datos) => {
        if (vigente) setSobre(datos)
      })
      .catch((fallo) => {
        if (vigente) setError(traducirError(fallo))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
  }, [])

  return { sobre, cargando, error }
}
