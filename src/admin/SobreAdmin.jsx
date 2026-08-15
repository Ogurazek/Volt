import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown, X, Plus, Upload, Check } from 'lucide-react'
import { obtenerSobre, guardarSobre, subirImagenSobre } from '../lib/sobre'
import { TIPOS_IMAGEN, TAMANO_MAXIMO } from '../lib/almacenamiento'
import { traducirError } from '../lib/errores'

// Las filas nuevas todavia no tienen id, y React necesita una clave estable
// para no perder el foco al tipear.
const conClave = (item) => ({ ...item, clave: item.clave ?? crypto.randomUUID() })

function SobreAdmin() {
  const [etiqueta, setEtiqueta] = useState('')
  const [lead, setLead] = useState('')
  const [imagenUrl, setImagenUrl] = useState(null)
  const [parrafos, setParrafos] = useState([])
  const [valores, setValores] = useState([])
  const [idsOriginales, setIdsOriginales] = useState({ parrafos: [], valores: [] })

  const [archivo, setArchivo] = useState(null)
  const [previsualizacion, setPrevisualizacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(false)

  useEffect(() => {
    obtenerSobre()
      .then((datos) => {
        setEtiqueta(datos.etiqueta)
        setLead(datos.lead)
        setImagenUrl(datos.imagen_url)
        setParrafos(datos.parrafos.map(conClave))
        setValores(datos.valores.map(conClave))
        setIdsOriginales({
          parrafos: datos.parrafos.map((item) => item.id),
          valores: datos.valores.map((item) => item.id),
        })
      })
      .catch((fallo) => setError(traducirError(fallo)))
      .finally(() => setCargando(false))
  }, [])

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
      setError('Formato no permitido. Usá JPG, PNG, WebP o AVIF.')
      return
    }
    if (elegido.size > TAMANO_MAXIMO) {
      setError('La imagen supera los 5 MB.')
      return
    }

    setError('')
    setArchivo(elegido)
  }

  const mover = (lista, setLista) => (indice, direccion) => {
    const destino = indice + direccion
    if (destino < 0 || destino >= lista.length) return

    const copia = [...lista]
    ;[copia[indice], copia[destino]] = [copia[destino], copia[indice]]
    setLista(copia)
  }

  const editar = (lista, setLista) => (indice, campo, valor) => {
    setLista(lista.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)))
  }

  const quitar = (lista, setLista) => (indice) => {
    setLista(lista.filter((_, i) => i !== indice))
  }

  const guardar = async (evento) => {
    evento.preventDefault()
    setError('')
    setGuardado(false)

    if (!etiqueta.trim() || !lead.trim()) {
      setError('La etiqueta y la frase destacada no pueden quedar vacías.')
      return
    }
    if (parrafos.some((item) => !item.texto.trim())) {
      setError('Hay un párrafo vacío. Completalo o eliminalo.')
      return
    }
    if (valores.some((item) => !item.nombre.trim() || !item.texto.trim())) {
      setError('Hay un valor incompleto. Completalo o eliminalo.')
      return
    }

    setGuardando(true)
    try {
      let imagenFinal = imagenUrl
      if (archivo) imagenFinal = await subirImagenSobre(archivo)

      await guardarSobre({ etiqueta, lead, imagen_url: imagenFinal, parrafos, valores, idsOriginales })

      const datos = await obtenerSobre()
      setImagenUrl(datos.imagen_url)
      setParrafos(datos.parrafos.map(conClave))
      setValores(datos.valores.map(conClave))
      setIdsOriginales({
        parrafos: datos.parrafos.map((item) => item.id),
        valores: datos.valores.map((item) => item.id),
      })
      setArchivo(null)
      setGuardado(true)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p className="admin__estado">Cargando contenido…</p>

  const imagenMostrada = previsualizacion ?? imagenUrl

  return (
    <>
      <div className="admin__encabezado">
        <div>
          <h1 className="admin__titulo">Sobre VOLT</h1>
          <p className="admin__texto">Historia, frase destacada y valores de la marca.</p>
        </div>
      </div>

      {error && (
        <p className="admin__error" role="alert">
          {error}
        </p>
      )}

      {guardado && (
        <p className="admin__exito" role="status">
          <Check size={16} strokeWidth={3} aria-hidden="true" />
          Cambios guardados.
        </p>
      )}

      <form className="editor" onSubmit={guardar} noValidate>
        <div className="editor__bloque">
          <span className="modal__etiqueta">Foto de la sección</span>
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
        </div>

        <div className="editor__bloque">
          <label className="modal__etiqueta" htmlFor="sobre-etiqueta">
            Etiqueta
          </label>
          <input
            id="sobre-etiqueta"
            type="text"
            className="editor__input"
            value={etiqueta}
            onChange={(evento) => setEtiqueta(evento.target.value)}
          />
        </div>

        <div className="editor__bloque">
          <label className="modal__etiqueta" htmlFor="sobre-lead">
            Frase destacada
          </label>
          <textarea
            id="sobre-lead"
            className="editor__input"
            rows="3"
            value={lead}
            onChange={(evento) => setLead(evento.target.value)}
          />
          <span className="modal__ayuda">Los saltos de línea se respetan tal como los escribas.</span>
        </div>

        <div className="editor__bloque">
          <span className="modal__etiqueta">Párrafos de la historia</span>

          {parrafos.map((parrafo, indice) => (
            <div className="editor__item" key={parrafo.clave}>
              <textarea
                className="editor__input"
                rows="3"
                aria-label={`Párrafo ${indice + 1}`}
                value={parrafo.texto}
                onChange={(evento) => editar(parrafos, setParrafos)(indice, 'texto', evento.target.value)}
              />
              <div className="editor__item-acciones">
                <button
                  type="button"
                  aria-label="Subir"
                  disabled={indice === 0}
                  onClick={() => mover(parrafos, setParrafos)(indice, -1)}
                >
                  <ChevronUp size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Bajar"
                  disabled={indice === parrafos.length - 1}
                  onClick={() => mover(parrafos, setParrafos)(indice, 1)}
                >
                  <ChevronDown size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar párrafo"
                  className="editor__quitar"
                  onClick={() => quitar(parrafos, setParrafos)(indice)}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="editor__agregar"
            onClick={() => setParrafos([...parrafos, conClave({ texto: '' })])}
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            Agregar párrafo
          </button>
        </div>

        <div className="editor__bloque">
          <span className="modal__etiqueta">Valores de la marca</span>

          {valores.map((valor, indice) => (
            <div className="editor__item" key={valor.clave}>
              <div className="editor__valor">
                <input
                  type="text"
                  className="editor__input"
                  placeholder="Nombre del valor"
                  aria-label={`Nombre del valor ${indice + 1}`}
                  value={valor.nombre}
                  onChange={(evento) => editar(valores, setValores)(indice, 'nombre', evento.target.value)}
                />
                <textarea
                  className="editor__input"
                  rows="2"
                  placeholder="Descripción"
                  aria-label={`Descripción del valor ${indice + 1}`}
                  value={valor.texto}
                  onChange={(evento) => editar(valores, setValores)(indice, 'texto', evento.target.value)}
                />
              </div>
              <div className="editor__item-acciones">
                <button
                  type="button"
                  aria-label="Subir"
                  disabled={indice === 0}
                  onClick={() => mover(valores, setValores)(indice, -1)}
                >
                  <ChevronUp size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Bajar"
                  disabled={indice === valores.length - 1}
                  onClick={() => mover(valores, setValores)(indice, 1)}
                >
                  <ChevronDown size={16} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  aria-label="Eliminar valor"
                  className="editor__quitar"
                  onClick={() => quitar(valores, setValores)(indice)}
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="editor__agregar"
            onClick={() => setValores([...valores, conClave({ nombre: '', texto: '' })])}
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            Agregar valor
          </button>
        </div>

        <div className="editor__acciones">
          <button type="submit" className="modal__btn modal__btn--negro" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </>
  )
}

export default SobreAdmin
