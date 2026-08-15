import { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'
import { actualizarProducto, crearProducto, subirImagenProducto } from '../lib/productos'
import { TIPOS_IMAGEN, TAMANO_MAXIMO } from '../lib/almacenamiento'
import { traducirError } from '../lib/errores'

function FormularioProducto({ producto, categorias, onCerrar, onGuardado }) {
  const esEdicion = Boolean(producto)

  const [campos, setCampos] = useState({
    nombre: producto?.nombre ?? '',
    categoria_id: producto?.categoria_id ? String(producto.categoria_id) : '',
    precio: producto?.precio != null ? String(producto.precio) : '',
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
    if (!campos.nombre.trim()) nuevosErrores.nombre = 'Ingresá el nombre del producto.'
    if (!campos.categoria_id) nuevosErrores.categoria_id = 'Elegí una categoría.'

    const precio = Number(campos.precio)
    if (!campos.precio.trim()) nuevosErrores.precio = 'Ingresá el precio.'
    else if (!Number.isInteger(precio) || precio < 0) {
      nuevosErrores.precio = 'El precio debe ser un número entero de pesos.'
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
        precio: Number(campos.precio),
        imagen_url: producto?.imagen_url ?? null,
      }

      if (archivo) datos.imagen_url = await subirImagenProducto(archivo)

      if (esEdicion) await actualizarProducto(producto.id, datos)
      else await crearProducto(datos)

      onGuardado()
    } catch (error) {
      setErrorGeneral(traducirError(error))
      setGuardando(false)
    }
  }

  const imagenMostrada = previsualizacion ?? producto?.imagen_url ?? null

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-producto"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      <div className="modal__caja">
        <div className="modal__encabezado">
          <h2 className="modal__titulo" id="modal-titulo-producto">
            {esEdicion ? 'Editar producto' : 'Nuevo producto'}
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
            <label htmlFor="producto-nombre">Nombre</label>
            <input
              id="producto-nombre"
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
              <label htmlFor="producto-categoria">Categoría</label>
              <select
                id="producto-categoria"
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
              <label htmlFor="producto-precio">Precio</label>
              <input
                id="producto-precio"
                type="number"
                min="0"
                step="1"
                placeholder="68000"
                value={campos.precio}
                onChange={actualizarCampo('precio')}
              />
              {errores.precio && (
                <span className="modal__error" role="alert">
                  {errores.precio}
                </span>
              )}
              <span className="modal__ayuda">En pesos, sin centavos.</span>
            </div>
          </div>

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

export default FormularioProducto
