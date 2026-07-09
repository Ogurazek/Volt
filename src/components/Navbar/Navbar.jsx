import { useState } from 'react'
import './Navbar.css'

const enlaces = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#coleccion', label: 'Colección' },
  { href: '#lookbook', label: 'Lookbook' },
  { href: '#drops', label: 'Drops' },
  { href: '#sobre', label: 'Sobre VOLT' },
  { href: '#contacto', label: 'Contacto' },
]

function Navbar() {
  const [abierto, setAbierto] = useState(false)

  const cerrarMenu = () => setAbierto(false)

  return (
    <header className="navbar">
      <nav className="navbar__inner contenedor" aria-label="Navegación principal">
        <a href="#inicio" className="navbar__logo" onClick={cerrarMenu}>
          VOLT<span className="navbar__chispa" aria-hidden="true"></span>
        </a>

        <button
          type="button"
          className={`navbar__toggle ${abierto ? 'navbar__toggle--abierto' : ''}`}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__links ${abierto ? 'navbar__links--abierto' : ''}`}>
          {enlaces.map((enlace) => (
            <li key={enlace.href}>
              <a href={enlace.href} onClick={cerrarMenu}>
                {enlace.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
