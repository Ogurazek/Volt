import { useState } from 'react'
import './Footer.css'
import IconoMarca from '../IconoMarca/IconoMarca'
import { redes } from '../../data/redes'

const enlaces = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#coleccion', label: 'Colección' },
  { href: '#lookbook', label: 'Lookbook' },
  { href: '#drops', label: 'Drops' },
  { href: '#sobre', label: 'Sobre VOLT' },
  { href: '#contacto', label: 'Contacto' },
]

function Footer() {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('inicial') // inicial | error | ok

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

  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__grid">
          <div className="footer__marca">
            <p className="footer__logo">
              VOLT<span className="footer__chispa" aria-hidden="true"></span>
            </p>
            <p className="footer__slogan">Energía urbana. Drops limitados, sin restock.</p>
          </div>

          <nav className="footer__nav" aria-label="Navegación del pie de página">
            <h2 className="footer__titulo">Secciones</h2>
            <ul>
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <a href={enlace.href}>{enlace.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__newsletter">
            <h2 className="footer__titulo">Newsletter</h2>
            <p>Enterate de cada drop antes que nadie</p>
            <form onSubmit={suscribir} noValidate>
              <label htmlFor="footer-email" className="visualmente-oculto">
                Tu email
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value)
                  setEstado('inicial')
                }}
              />
              <button type="submit">Sumarme</button>
            </form>
            {estado === 'error' && (
              <p className="footer__mensaje footer__mensaje--error" role="alert">
                Ingresá un email válido para sumarte.
              </p>
            )}
            {estado === 'ok' && (
              <p className="footer__mensaje footer__mensaje--ok" role="status">
                ¡Listo! Ya estás en la lista.
              </p>
            )}

            <ul className="footer__redes">
              {redes.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`VOLT en ${red.nombre} (se abre en una pestaña nueva)`}
                  >
                    <IconoMarca icono={red.icono} size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} VOLT — Marca ficticia. Proyecto final de Tecnología Web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
