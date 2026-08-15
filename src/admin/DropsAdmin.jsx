import { useCallback, useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { eliminarDrop, listarCategorias, listarDrops, traducirError } from '../lib/drops'
import FormularioDrop from './FormularioDrop'

const ETIQUETAS_ESTADO = {
  nuevo: 'Nuevo',
  agotado: 'Agotado',
  proximo: 'Próximo',
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function DropsAdmin() {
  const [drops, setDrops] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const cargar = useCallback(async () => {
    setError('')
    try {
      const [listaDrops, listaCategorias] = await Promise.all([listarDrops(), listarCategorias()])
      setDrops(listaDrops)
      setCategorias(listaCategorias)
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
    setBorrando(true)
    setError('')
    try {
      await eliminarDrop(id)
      setDrops((anteriores) => anteriores.filter((drop) => drop.id !== id))
      setConfirmando(null)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setBorrando(false)
    }
  }

  const alGuardar = () => {
    setFormulario(null)
    cargar()
  }

  if (cargando) {
    return <p className="admin__estado">Cargando drops…</p>
  }

  return (
    <>
      <div className="admin__encabezado">
        <div>
          <h1 className="admin__titulo">Drops</h1>
          <p className="admin__texto">
            {drops.length} {drops.length === 1 ? 'lanzamiento cargado' : 'lanzamientos cargados'}.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin__error" role="alert">
          {error}
        </p>
      )}

      <ul className="tarjetas">
        {drops.map((drop) => (
          <li className="tarjeta" key={drop.id}>
            <div className="tarjeta__imagen">
              {drop.imagen_url ? (
                <img src={drop.imagen_url} alt={drop.nombre} />
              ) : (
                <span className="tarjeta__sin-foto">Sin foto</span>
              )}
              <span className={`tarjeta__estado tarjeta__estado--${drop.estado}`}>
                {ETIQUETAS_ESTADO[drop.estado]}
              </span>

              {confirmando === drop.id && (
                <div className="tarjeta__confirmar">
                  <p>¿Borrar este drop?</p>
                  <div className="tarjeta__confirmar-acciones">
                    <button
                      type="button"
                      className="tarjeta__btn tarjeta__btn--peligro"
                      onClick={() => borrar(drop.id)}
                      disabled={borrando}
                    >
                      {borrando ? 'Borrando…' : 'Sí, borrar'}
                    </button>
                    <button
                      type="button"
                      className="tarjeta__btn"
                      onClick={() => setConfirmando(null)}
                      disabled={borrando}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="tarjeta__cuerpo">
              <span className="tarjeta__categoria">{drop.categorias?.nombre}</span>
              <span className="tarjeta__nombre">{drop.nombre}</span>
              {drop.estado === 'proximo' && drop.fecha && (
                <span className="tarjeta__fecha">{formatearFecha(drop.fecha)}</span>
              )}
            </div>

            <div className="tarjeta__acciones">
              <button
                type="button"
                className="tarjeta__accion"
                onClick={() => setFormulario({ drop })}
              >
                <Pencil size={15} strokeWidth={2.5} aria-hidden="true" />
                Editar
              </button>
              <button
                type="button"
                className="tarjeta__accion tarjeta__accion--peligro"
                onClick={() => setConfirmando(drop.id)}
              >
                <Trash2 size={15} strokeWidth={2.5} aria-hidden="true" />
                Borrar
              </button>
            </div>
          </li>
        ))}

        <li className="tarjeta tarjeta--nueva">
          <button type="button" className="tarjeta__nueva-btn" onClick={() => setFormulario({ drop: null })}>
            <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
            Nuevo drop
          </button>
        </li>
      </ul>

      {formulario && (
        <FormularioDrop
          drop={formulario.drop}
          categorias={categorias}
          onCerrar={() => setFormulario(null)}
          onGuardado={alGuardar}
        />
      )}
    </>
  )
}

export default DropsAdmin
