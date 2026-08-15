import { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'
import {
  ESTADOS,
  TIPOS_IMAGEN,
  TAMANO_MAXIMO,
  actualizarDrop,
  crearDrop,
  subirImagen,
  traducirError,
} from '../lib/drops'

// El input datetime-local trabaja en hora local y la base guarda en UTC.
function aValorInput(iso) {
  if (!iso) return ''
  const fecha = new Date(iso)
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function FormularioDrop({ drop, categorias, onCerrar, onGuardado }) {
  const esEdicion = Boolean(drop)

  const [campos, setCampos] = useState({
    nombre: drop?.nombre ?? '',
    categoria_id: drop?.categoria_id ? String(drop.categoria_id) : '',
    estado: drop?.estado ?? 'nuevo',
    fecha: aValorInput(drop?.fecha),
  })
  const [archivo, setArchivo] = useState(null)
  const [previsualizacion, setPrevisualizacion] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', cerrarConEscape)
    return () => document.removeEventListener('keydown', cerrarConEscape)
  }, [onCerrar])

  useEffect(() => {
    if (!archivo) {
      setPrevisualizacion(null)
      return
    }
    const url = URL.createObjectURL(archivo)
    setPrevisualizacion(url)
    return () => URL.revokeObjectURL(url)
  }, [archivo])

  const actualizarCampo = (campo) => (evento) => {
    setCampos((anteriores) => ({ ...anteriores, [campo]: evento.target.value }))
  }

  const elegirArchivo = (evento) => {
    const elegido = evento.target.files?.[0]
    if (!elegido) return

    // Las mismas reglas estan declaradas en el bucket: esta validacion es
    // comodidad para no subir en vano, la que no se puede evadir es la otra.
    if (!TIPOS_IMAGEN.includes(elegido.type)) {
      setErrores((anteriores) => ({ ...anteriores, archivo: 'Formato no permitido. Usá JPG, PNG, WebP o AVIF.' }))
      return
    }
    if (elegido.size > TAMANO_MAXIMO) {
      setErrores((anteriores) => ({ ...anteriores, archivo: 'La imagen supera los 5 MB.' }))
      return
    }

    setErrores((anteriores) => ({ ...anteriores, archivo: undefined }))
    setArchivo(elegido)
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!campos.nombre.trim()) nuevosErrores.nombre = 'Ingresá el nombre del drop.'
    if (!campos.categoria_id) nuevosErrores.categoria_id = 'Elegí una categoría.'
    if (campos.estado === 'proximo' && !campos.fecha) {
      nuevosErrores.fecha = 'Un drop próximo necesita fecha de lanzamiento.'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardar = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')
    if (!validar()) return

    setGuardando(true)
    try {
      const datos = {
        nombre: campos.nombre.trim(),
        categoria_id: Number(campos.categoria_id),
        estado: campos.estado,
        fecha: campos.estado === 'proximo' ? new Date(campos.fecha).toISOString() : null,
        imagen_url: drop?.imagen_url ?? null,
      }

      if (archivo) datos.imagen_url = await subirImagen(archivo)

      if (esEdicion) await actualizarDrop(drop.id, datos)
      else await crearDrop(datos)

      onGuardado()
    } catch (error) {
      setErrorGeneral(traducirError(error))
      setGuardando(false)
    }
  }

  const imagenMostrada = previsualizacion ?? drop?.imagen_url ?? null

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      <div className="modal__caja">
        <div className="modal__encabezado">
          <h2 className="modal__titulo" id="modal-titulo">
            {esEdicion ? 'Editar drop' : 'Nuevo drop'}
          </h2>
          <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={guardar} noValidate>
          <div className="modal__campo">
            <span className="modal__etiqueta">Foto</span>
            <div className="modal__foto">
              <div className="modal__foto-vista">
                {imagenMostrada ? (
                  <img src={imagenMostrada} alt="" />
                ) : (
                  <span className="modal__foto-vacia">Sin foto</span>
                )}
              </div>
              <label className="modal__foto-boton">
                <Upload size={16} strokeWidth={2.5} aria-hidden="true" />
                {imagenMostrada ? 'Cambiar foto' : 'Subir foto'}
                <input type="file" accept={TIPOS_IMAGEN.join(',')} onChange={elegirArchivo} />
              </label>
            </div>
            {errores.archivo && (
              <span className="modal__error" role="alert">
                {errores.archivo}
              </span>
            )}
          </div>

          <div className="modal__campo">
            <label htmlFor="drop-nombre">Nombre</label>
            <input
              id="drop-nombre"
              type="text"
              placeholder="Voltaje Hoodie"
              value={campos.nombre}
              onChange={actualizarCampo('nombre')}
            />
            {errores.nombre && (
              <span className="modal__error" role="alert">
                {errores.nombre}
              </span>
            )}
          </div>

          <div className="modal__fila">
            <div className="modal__campo">
              <label htmlFor="drop-categoria">Categoría</label>
              <select
                id="drop-categoria"
                value={campos.categoria_id}
                onChange={actualizarCampo('categoria_id')}
              >
                <option value="">Elegir…</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              {errores.categoria_id && (
                <span className="modal__error" role="alert">
                  {errores.categoria_id}
                </span>
              )}
            </div>

            <div className="modal__campo">
              <label htmlFor="drop-estado">Estado</label>
              <select id="drop-estado" value={campos.estado} onChange={actualizarCampo('estado')}>
                {ESTADOS.map((estado) => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {campos.estado === 'proximo' && (
            <div className="modal__campo">
              <label htmlFor="drop-fecha">Fecha de lanzamiento</label>
              <input
                id="drop-fecha"
                type="datetime-local"
                value={campos.fecha}
                onChange={actualizarCampo('fecha')}
              />
              {errores.fecha && (
                <span className="modal__error" role="alert">
                  {errores.fecha}
                </span>
              )}
              <span className="modal__ayuda">Se usa para el countdown del sitio.</span>
            </div>
          )}

          {errorGeneral && (
            <p className="modal__error-general" role="alert">
              {errorGeneral}
            </p>
          )}

          <div className="modal__acciones">
            <button type="button" className="modal__btn modal__btn--borde" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="modal__btn modal__btn--negro" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioDrop
