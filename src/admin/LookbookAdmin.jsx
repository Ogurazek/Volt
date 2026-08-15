import { useCallback, useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { eliminarLook, intercambiarOrden, listarLooks } from '../lib/lookbook'
import { listarProductos } from '../lib/productos'
import { traducirError } from '../lib/errores'
import FormularioLook from './FormularioLook'

function LookbookAdmin() {
  const [looks, setLooks] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [ocupado, setOcupado] = useState(false)

  const cargar = useCallback(async () => {
    setError('')
    try {
      const [listaLooks, listaProductos] = await Promise.all([listarLooks(), listarProductos()])
      setLooks(listaLooks)
      setProductos(listaProductos)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const borrar = async (id) => {
    setOcupado(true)
    setError('')
    try {
      await eliminarLook(id)
      setLooks((anteriores) => anteriores.filter((look) => look.id !== id))
      setConfirmando(null)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setOcupado(false)
    }
  }

  const mover = async (indice, direccion) => {
    const destino = indice + direccion
    if (destino < 0 || destino >= looks.length) return

    setOcupado(true)
    setError('')
    try {
      await intercambiarOrden(looks[indice], looks[destino])
      await cargar()
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setOcupado(false)
    }
  }

  const alGuardar = () => {
    setFormulario(null)
    cargar()
  }

  if (cargando) return <p className="admin__estado">Cargando lookbook…</p>

  const ordenSiguiente = looks.length ? Math.max(...looks.map((look) => look.orden)) + 1 : 1

  return (
    <>
      <div className="admin__encabezado">
        <div>
          <h1 className="admin__titulo">Lookbook</h1>
          <p className="admin__texto">
            {looks.length} {looks.length === 1 ? 'look armado' : 'looks armados'}. El número que ve el
            visitante sale de este orden.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin__error" role="alert">
          {error}
        </p>
      )}

      <ul className="tarjetas">
        {looks.map((look, indice) => (
          <li className="tarjeta" key={look.id}>
            <div className="tarjeta__imagen">
              {look.imagen_url ? (
                <img src={look.imagen_url} alt={look.nombre} />
              ) : (
                <span className="tarjeta__sin-foto">Sin foto</span>
              )}
              <span className="tarjeta__estado tarjeta__estado--nuevo">
                {String(indice + 1).padStart(2, '0')}
              </span>

              <div className="tarjeta__mover">
                <button
                  type="button"
                  aria-label="Mover antes"
                  disabled={indice === 0 || ocupado}
                  onClick={() => mover(indice, -1)}
                >
                  <ChevronUp size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Mover después"
                  disabled={indice === looks.length - 1 || ocupado}
                  onClick={() => mover(indice, 1)}
                >
                  <ChevronDown size={16} strokeWidth={2.5} />
                </button>
              </div>

              {confirmando === look.id && (
                <div className="tarjeta__confirmar">
                  <p>¿Borrar este look?</p>
                  <div className="tarjeta__confirmar-acciones">
                    <button
                      type="button"
                      className="tarjeta__btn tarjeta__btn--peligro"
                      onClick={() => borrar(look.id)}
                      disabled={ocupado}
                    >
                      {ocupado ? 'Borrando…' : 'Sí, borrar'}
                    </button>
                    <button
                      type="button"
                      className="tarjeta__btn"
                      onClick={() => setConfirmando(null)}
                      disabled={ocupado}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="tarjeta__cuerpo">
              <span className="tarjeta__nombre">{look.nombre}</span>
              <span className="tarjeta__prendas">
                {look.prendas.map((prenda) => prenda.nombre).join(' · ')}
              </span>
            </div>

            <div className="tarjeta__acciones">
              <button type="button" className="tarjeta__accion" onClick={() => setFormulario({ look })}>
                <Pencil size={15} strokeWidth={2.5} aria-hidden="true" />
                Editar
              </button>
              <button
                type="button"
                className="tarjeta__accion tarjeta__accion--peligro"
                onClick={() => setConfirmando(look.id)}
              >
                <Trash2 size={15} strokeWidth={2.5} aria-hidden="true" />
                Borrar
              </button>
            </div>
          </li>
        ))}

        <li className="tarjeta tarjeta--nueva">
          <button
            type="button"
            className="tarjeta__nueva-btn"
            onClick={() => setFormulario({ look: null })}
          >
            <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
            Nuevo look
          </button>
        </li>
      </ul>

      {formulario && (
        <FormularioLook
          look={formulario.look}
          productos={productos}
          ordenSiguiente={ordenSiguiente}
          onCerrar={() => setFormulario(null)}
          onGuardado={alGuardar}
        />
      )}
    </>
  )
}

export default LookbookAdmin
