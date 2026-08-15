import { useEffect, useState } from 'react'
import { listarLooks } from '../lib/lookbook'
import { traducirError } from '../lib/errores'
import { supabaseConfigurado } from '../lib/supabase'

export function useLookbook() {
  const [looks, setLooks] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabaseConfigurado) {
      setError('El lookbook no está disponible en este momento.')
      setCargando(false)
      return
    }

    let vigente = true

    listarLooks()
      .then((lista) => {
        if (vigente) setLooks(lista)
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

  return { looks, cargando, error }
}
