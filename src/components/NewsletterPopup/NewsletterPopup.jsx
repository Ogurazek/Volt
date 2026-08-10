import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './NewsletterPopup.css'

const CLAVE_SESION = 'volt-popup-visto'

function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('inicial') 

  // Aparece una sola vez por sesión de navegación, 2.5s después de entrar al sitio
  useEffect(() => {
    if (sessionStorage.getItem(CLAVE_SESION)) return undefined

    const temporizador = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(temporizador)
  }, [])

  const cerrar = () => {
    setVisible(false)
    sessionStorage.setItem(CLAVE_SESION, '1')
  }

  useEffect(() => {
    if (!visible) return undefined

    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    return () => document.removeEventListener('keydown', alPresionarTecla)
  }, [visible])

  const suscribir = (evento) => {
    evento.preventDefault()

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValido) {
      setEstado('error')
      return
    }

    setEstado('ok')
    setEmail('')
  }

  if (!visible) return null

  return (
    <div className="popup-newsletter__fondo" onClick={cerrar}>
      <div
        className="popup-newsletter"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-newsletter-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <button type="button" className="popup-newsletter__cerrar" aria-label="Cerrar" onClick={cerrar}>
          <X size={20} />
        </button>

        <span className="etiqueta">Alto voltaje</span>
        <h2 id="popup-newsletter-titulo" className="popup-newsletter__titulo">
          Enterate primero
        </h2>
        <p className="popup-newsletter__texto">
          Sumate a la lista y recibí los próximos drops antes que se agoten.
        </p>

        {estado === 'ok' ? (
          <p className="popup-newsletter__mensaje" role="status">
            ¡Listo! Ya estás en la lista.
          </p>
        ) : (
          <form onSubmit={suscribir} noValidate>
            <input
              type="email"
              aria-label="Tu email"
              placeholder="tu@email.com"
              value={email}
              onChange={(evento) => {
                setEmail(evento.target.value)
                setEstado('inicial')
              }}
              autoFocus
            />
            <button type="submit" className="btn btn--negro">
              Sumarme
            </button>
          </form>
        )}
        {estado === 'error' && (
          <p className="popup-newsletter__mensaje" role="alert">
            Ingresá un email válido.
          </p>
        )}
      </div>
    </div>
  )
}

export default NewsletterPopup
