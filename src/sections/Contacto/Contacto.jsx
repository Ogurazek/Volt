import { useState } from 'react'
import { Check } from 'lucide-react'
import './Contacto.css'
import IconoMarca from '../../components/IconoMarca/IconoMarca'
import { redes } from '../../data/redes'

const CAMPOS_INICIALES = { nombre: '', email: '', mensaje: '' }

function Contacto() {
  const [campos, setCampos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const actualizarCampo = (campo) => (evento) => {
    setCampos((anteriores) => ({ ...anteriores, [campo]: evento.target.value }))
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!campos.nombre.trim()) nuevosErrores.nombre = 'Contanos tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) nuevosErrores.email = 'Ingresá un email válido.'
    if (!campos.mensaje.trim()) nuevosErrores.mensaje = 'Escribinos tu mensaje.'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const enviarFormulario = (evento) => {
    evento.preventDefault()
    if (!validar()) return
    setEnviado(true)
    setCampos(CAMPOS_INICIALES)
  }

  return (
    <section id="contacto" className="seccion seccion--negra contacto">
      <div className="contenedor">
        <div className="contacto__grid">
          <div className="contacto__info">
            <span className="etiqueta">Hablemos</span>
            <h2 className="seccion-titulo">Contacto</h2>
            <p className="contacto__bajada">
              ¿Tenés una pregunta, una propuesta o simplemente querés saber más sobre VOLT? Escribinos.
            </p>

            <div className="contacto__redes">
              <span className="contacto__redes-titulo">Seguinos en</span>
              {redes.map((red) => (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contacto__red"
                >
                  <IconoMarca icono={red.icono} size={18} />
                  {red.nombre} — {red.handle}
                </a>
              ))}
            </div>
          </div>

          <div className="contacto__form-wrap">
            {enviado ? (
              <div className="contacto__exito">
                <span className="contacto__exito-icono" aria-hidden="true">
                  <Check size={26} strokeWidth={2.5} />
                </span>
                <h3 className="contacto__exito-titulo">
                  Mensaje
                  <br />
                  enviado
                </h3>
                <p>Te respondemos a la brevedad. Gracias por escribirnos.</p>
              </div>
            ) : (
              <form onSubmit={enviarFormulario} noValidate>
                <div className="contacto__campo">
                  <label htmlFor="contacto-nombre">Nombre</label>
                  <input
                    id="contacto-nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={campos.nombre}
                    onChange={actualizarCampo('nombre')}
                  />
                  {errores.nombre && (
                    <span className="contacto__error" role="alert">
                      {errores.nombre}
                    </span>
                  )}
                </div>

                <div className="contacto__campo">
                  <label htmlFor="contacto-email">Email</label>
                  <input
                    id="contacto-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={campos.email}
                    onChange={actualizarCampo('email')}
                  />
                  {errores.email && (
                    <span className="contacto__error" role="alert">
                      {errores.email}
                    </span>
                  )}
                </div>

                <div className="contacto__campo">
                  <label htmlFor="contacto-mensaje">Mensaje</label>
                  <textarea
                    id="contacto-mensaje"
                    rows="5"
                    placeholder="Tu mensaje..."
                    value={campos.mensaje}
                    onChange={actualizarCampo('mensaje')}
                  />
                  {errores.mensaje && (
                    <span className="contacto__error" role="alert">
                      {errores.mensaje}
                    </span>
                  )}
                </div>

                <button type="submit" className="contacto__submit">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contacto
