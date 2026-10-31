import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import './Carrito.css'
import { useCarrito } from '../../hooks/useCarrito'
import { CANTIDAD_MAXIMA } from '../../lib/carrito'
import { formatearPrecio } from '../../lib/formato'

function Carrito() {
  const { items, abierto, cerrarCarrito, cambiarCantidad, quitar, vaciar, cantidadTotal, total } =
    useCarrito()
  const botonCerrar = useRef(null)

  // Mientras esta abierto: foco en el panel, Escape cierra y la pagina de
  // fondo no scrollea. Al cerrar, el foco vuelve a donde estaba (el boton de
  // la navbar), asi quien navega con teclado no pierde su lugar.
  useEffect(() => {
    if (!abierto) return undefined

    const focoAnterior = document.activeElement
    botonCerrar.current?.focus()
    document.body.classList.add('carrito-abierto')

    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') cerrarCarrito()
    }
    document.addEventListener('keydown', alPresionarTecla)

    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.classList.remove('carrito-abierto')
      focoAnterior?.focus?.()
    }
  }, [abierto, cerrarCarrito])

  return (
    // Siempre montado para que pueda animarse; inert lo saca del tab y de los
    // lectores de pantalla mientras esta cerrado.
    <div className={`carrito ${abierto ? 'carrito--abierto' : ''}`} inert={!abierto}>
      <div className="carrito__fondo" onClick={cerrarCarrito} />

      <aside
        className="carrito__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrito-titulo"
      >
        <div className="carrito__cabecera">
          <h2 id="carrito-titulo" className="carrito__titulo">
            Tu carrito <span className="carrito__contador">({cantidadTotal})</span>
          </h2>
          <button
            ref={botonCerrar}
            type="button"
            className="carrito__cerrar"
            aria-label="Cerrar carrito"
            onClick={cerrarCarrito}
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="carrito__vacio">
            <ShoppingBag size={40} strokeWidth={1.5} aria-hidden="true" />
            <p>Tu carrito está vacío.</p>
            <a href="#coleccion" className="btn btn--negro" onClick={cerrarCarrito}>
              Ver colección
            </a>
          </div>
        ) : (
          <>
            <ul className="carrito__lista">
              {items.map((item) => (
                <li className="carrito-item" key={item.id}>
                  <div className="carrito-item__imagen">
                    {item.imagen_url && <img src={item.imagen_url} alt="" />}
                  </div>

                  <div className="carrito-item__detalle">
                    <span className="carrito-item__categoria">{item.categoria}</span>
                    <span className="carrito-item__nombre">{item.nombre}</span>
                    <span className="carrito-item__unitario">{formatearPrecio(item.precio)} c/u</span>

                    <div className="carrito-item__controles">
                      <div className="cantidad" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                        <button
                          type="button"
                          className="cantidad__boton"
                          aria-label="Restar uno"
                          disabled={item.cantidad <= 1}
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="cantidad__valor" aria-live="polite">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          className="cantidad__boton"
                          aria-label="Sumar uno"
                          disabled={item.cantidad >= CANTIDAD_MAXIMA}
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      <span className="carrito-item__subtotal">
                        {formatearPrecio(item.precio * item.cantidad)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="carrito-item__quitar"
                    aria-label={`Quitar ${item.nombre} del carrito`}
                    onClick={() => quitar(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="carrito__pie">
              <div className="carrito__total">
                <span>Total</span>
                <span>{formatearPrecio(total)}</span>
              </div>
              <Link to="/checkout" className="btn btn--negro carrito__boton" onClick={cerrarCarrito}>
                Finalizar compra
              </Link>
              <a href="#coleccion" className="btn btn--borde carrito__boton" onClick={cerrarCarrito}>
                Seguir comprando
              </a>
              <button type="button" className="carrito__vaciar" onClick={vaciar}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default Carrito
