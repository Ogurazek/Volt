import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, ShoppingBag } from 'lucide-react'
import './Navbar.css'
import { useSesion } from '../../hooks/useSesion'
import { useCarrito } from '../../hooks/useCarrito'

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
  const { cantidadTotal, abrirCarrito } = useCarrito()

  const cerrarMenu = () => setAbierto(false)

  return (
    <header className="navbar">
      <nav className="navbar__inner contenedor" aria-label="Navegación principal">
        <a href="#inicio" className="navbar__logo" onClick={cerrarMenu}>
          VOLT
        </a>

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

        {/* Fuera del menu desplegable: en movil el carrito tiene que verse siempre. */}
        <div className="navbar__acciones">
          <button
            type="button"
            className="navbar__carrito"
            aria-label={`Abrir carrito (${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'})`}
            onClick={() => {
              cerrarMenu()
              abrirCarrito()
            }}
          >
            <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
            {cantidadTotal > 0 && (
              <span className="navbar__carrito-cantidad" aria-hidden="true">
                {cantidadTotal}
              </span>
            )}
          </button>

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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
