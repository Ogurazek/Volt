import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import './Navbar.css'
import { useSesion } from '../../hooks/useSesion'

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
  const { sesion } = useSesion()

  const cerrarMenu = () => setAbierto(false)

  return (
    <header className="navbar">
      <nav className="navbar__inner contenedor" aria-label="Navegación principal">
        <a href="#inicio" className="navbar__logo" onClick={cerrarMenu}>
          VOLT
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

          {/* Solo para quien ya tiene sesion: es un atajo, no un control de acceso. */}
          {sesion && (
            <li>
              <Link to="/admin" className="navbar__admin" onClick={cerrarMenu}>
                <Settings size={14} strokeWidth={2.5} aria-hidden="true" />
                Admin
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
