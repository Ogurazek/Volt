import { useEffect, useState } from 'react'
import { listarDrops, traducirError } from '../lib/drops'
import { supabaseConfigurado } from '../lib/supabase'

// Se consulta una sola vez desde SitioPublico y el resultado se reparte a
// Inicio y a Drops: son dos secciones de la misma pagina y no tiene sentido
// que cada una pida lo mismo por separado.

export function useDrops() {
  const [drops, setDrops] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabaseConfigurado) {
      setError('El catálogo no está disponible en este momento.')
      setCargando(false)
      return
    }

    // Si el componente se desmonta antes de que responda el servidor, no
    // intentamos actualizar estado de algo que ya no existe.
    let vigente = true

    listarDrops()
      .then((lista) => {
        if (vigente) setDrops(lista)
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

  return { drops, cargando, error }
}
