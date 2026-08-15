import { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'
import { actualizarLook, crearLook, subirImagenLook } from '../lib/lookbook'
import { TIPOS_IMAGEN, TAMANO_MAXIMO } from '../lib/almacenamiento'
import { traducirError } from '../lib/errores'

function FormularioLook({ look, productos, ordenSiguiente, onCerrar, onGuardado }) {
  const esEdicion = Boolean(look)
  const prendasOriginales = look?.prendas.map((prenda) => prenda.id) ?? []

  const [nombre, setNombre] = useState(look?.nombre ?? '')
  const [prendas, setPrendas] = useState(prendasOriginales)
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

  const alternarPrenda = (id) => {
    setPrendas((anteriores) =>
      anteriores.includes(id) ? anteriores.filter((item) => item !== id) : [...anteriores, id],
    )
  }

  const guardar = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')

    const nuevosErrores = {}
    if (!nombre.trim()) nuevosErrores.nombre = 'Ingresá el nombre del look.'
    if (prendas.length === 0) nuevosErrores.prendas = 'Elegí al menos una prenda.'
    setErrores((anteriores) => ({ ...anteriores, ...nuevosErrores, ...(nuevosErrores.nombre ? {} : { nombre: undefined }) }))
    if (Object.keys(nuevosErrores).length > 0) return

    setGuardando(true)
    try {
      let imagen = look?.imagen_url ?? null
      if (archivo) imagen = await subirImagenLook(archivo)

      if (esEdicion) {
        await actualizarLook(look.id, { nombre: nombre.trim(), imagen_url: imagen, prendas }, prendasOriginales)
      } else {
        await crearLook({ nombre: nombre.trim(), imagen_url: imagen, orden: ordenSiguiente, prendas })
      }

      onGuardado()
    } catch (error) {
      setErrorGeneral(traducirError(error))
      setGuardando(false)
    }
  }

  const imagenMostrada = previsualizacion ?? look?.imagen_url ?? null

  // Agrupadas por categoria para que la lista sea navegable.
  const porCategoria = productos.reduce((grupos, producto) => {
    const clave = producto.categorias?.nombre ?? 'Sin categoría'
    grupos[clave] = grupos[clave] ? [...grupos[clave], producto] : [producto]
    return grupos
  }, {})

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo-look"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      <div className="modal__caja">
        <div className="modal__encabezado">
          <h2 className="modal__titulo" id="modal-titulo-look">
            {esEdicion ? 'Editar look' : 'Nuevo look'}
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
            <label htmlFor="look-nombre">Nombre</label>
            <input
              id="look-nombre"
              type="text"
              placeholder="Voltaje"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
            />
            {errores.nombre && (
              <span className="modal__error" role="alert">
                {errores.nombre}
              </span>
            )}
          </div>

          <div className="modal__campo">
            <span className="modal__etiqueta">Prendas del look</span>

            {productos.length === 0 ? (
              <p className="modal__ayuda">
                No hay productos cargados. Agregá productos en Colección para poder armar un look.
              </p>
            ) : (
              <div className="prendas">
                {Object.entries(porCategoria).map(([categoria, items]) => (
                  <div className="prendas__grupo" key={categoria}>
                    <span className="prendas__titulo">{categoria}</span>
                    {items.map((producto) => (
                      <label className="prendas__opcion" key={producto.id}>
                        <input
                          type="checkbox"
                          checked={prendas.includes(producto.id)}
                          onChange={() => alternarPrenda(producto.id)}
                        />
                        {producto.nombre}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {errores.prendas && prendas.length === 0 && (
              <span className="modal__error" role="alert">
                {errores.prendas}
              </span>
            )}
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

export default FormularioLook
