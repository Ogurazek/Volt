import { useEffect, useState } from 'react'
import { listarProductos } from '../lib/productos'
import { listarCategorias } from '../lib/categorias'
import { traducirError } from '../lib/errores'
import { supabaseConfigurado } from '../lib/supabase'

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabaseConfigurado) {
      setError('El catálogo no está disponible en este momento.')
      setCargando(false)
      return
    }

    let vigente = true

    Promise.all([listarProductos(), listarCategorias()])
      .then(([lista, listaCategorias]) => {
        if (!vigente) return
        setProductos(lista)
        setCategorias(listaCategorias)
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

  return { productos, categorias, cargando, error }
}
