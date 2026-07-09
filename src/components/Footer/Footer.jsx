import { useState } from 'react'
import './Footer.css'

const enlaces = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#coleccion', label: 'Colección' },
  { href: '#lookbook', label: 'Lookbook' },
  { href: '#drops', label: 'Drops' },
  { href: '#sobre', label: 'Sobre VOLT' },
  { href: '#contacto', label: 'Contacto' },
]

const redes = [
  {
    nombre: 'Instagram',
    url: 'https://www.instagram.com/',
    icono: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1M12 0C8.7 0 8.3 0 7 .1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c0 1.2.2 2.1.5 2.9.3.8.7 1.5 1.4 2.1.6.7 1.3 1.1 2.1 1.4.8.3 1.7.5 2.9.5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.2 0 2.1-.2 2.9-.5.8-.3 1.5-.7 2.1-1.4.7-.6 1.1-1.3 1.4-2.1.3-.8.5-1.7.5-2.9.1-1.3.1-1.7.1-5s0-3.7-.1-5c0-1.2-.2-2.1-.5-2.9-.3-.8-.7-1.5-1.4-2.1C21.4 1.3 20.7.9 19.9.6c-.8-.3-1.7-.5-2.9-.5C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.8-10.4a1.4 1.4 0 1 1-2.9 0 1.4 1.4 0 0 1 2.9 0z" />
      </svg>
    ),
  },
  {
    nombre: 'TikTok',
    url: 'https://www.tiktok.com/',
    icono: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.4V2h-3.3v13.2a2.8 2.8 0 1 1-2-2.7V9.1a6.1 6.1 0 1 0 5.3 6V8.9a8 8 0 0 0 4.4 1.3V6.9c-.2 0-.4 0-.6-.2z" />
      </svg>
    ),
  },
  {
    nombre: 'X',
    url: 'https://x.com/',
    icono: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M18.2 2.3h3.3l-7.3 8.3 8.6 11.1h-6.7l-5.3-6.8-6 6.8H1.5l7.8-8.9L1 2.3h6.9l4.8 6.2 5.5-6.2zm-1.2 17.5h1.8L7 4.1H5l12 15.7z" />
      </svg>
    ),
  },
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
            <p>Enterate de cada drop antes que nadie.</p>
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
                    {red.icono}
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
