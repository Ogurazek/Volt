import { useEffect, useState } from 'react'
import { ArrowLeft, Building2, CreditCard, FlaskConical } from 'lucide-react'
import './Checkout.css'
import ConfirmacionPedido from './ConfirmacionPedido'
import { useCarrito } from '../hooks/useCarrito'
import { crearPedido } from '../lib/pedidos'
import { traducirError } from '../lib/errores'
import { formatearPrecio } from '../lib/formato'
import {
  TARJETAS_DE_PRUEBA,
  detectarMarca,
  formatearNumero,
  formatearVencimiento,
  soloDigitos,
  validarTarjeta,
} from '../lib/tarjeta'

const COMPRADOR_INICIAL = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigo_postal: '',
}

const TARJETA_INICIAL = { numero: '', titular: '', vencimiento: '', cvv: '' }

// Una pasarela real tarda un momento en responder. Sin esta espera el
// "Procesando pago…" ni llega a verse y el flujo no se siente como un pago.
const DEMORA_SIMULADA = 1200

const esperar = (milisegundos) => new Promise((resolver) => setTimeout(resolver, milisegundos))

// Las mismas reglas que las restricciones de la tabla pedidos: aca son para
// avisar rapido, la que no se puede saltear es la de la base.
function validarComprador(comprador) {
  const errores = {}
  if (comprador.nombre.trim().length < 2) errores.nombre = 'Ingresá tu nombre y apellido.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comprador.email.trim())) errores.email = 'Ingresá un email válido.'
  if (!/^[0-9 +()-]{8,20}$/.test(comprador.telefono.trim())) errores.telefono = 'Ingresá un teléfono válido.'
  if (comprador.direccion.trim().length < 4) errores.direccion = 'Ingresá calle y número.'
  if (comprador.ciudad.trim().length < 2) errores.ciudad = 'Ingresá tu ciudad.'
  if (!/^([0-9]{4}|[A-Z][0-9]{4}[A-Z]{3})$/.test(comprador.codigo_postal.trim().toUpperCase()))
    errores.codigo_postal = 'Ej: 1425 o C1425ABC.'
  return errores
}

function Campo({ id, etiqueta, error, className = '', ...props }) {
  return (
    <div className={`checkout__campo ${className}`}>
      <label htmlFor={`checkout-${id}`}>{etiqueta}</label>
      <input
        id={`checkout-${id}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `checkout-${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`checkout-${id}-error`} className="checkout__error">
          {error}
        </span>
      )}
    </div>
  )
}

function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const [comprador, setComprador] = useState(COMPRADOR_INICIAL)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [tarjeta, setTarjeta] = useState(TARJETA_INICIAL)
  const [errores, setErrores] = useState({})
  const [procesando, setProcesando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  // Se llega desde el carrito con la pagina scrolleada: arranca desde arriba.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [confirmacion])

  const marca = detectarMarca(tarjeta.numero)

  const actualizarComprador = (campo) => (evento) => {
    setComprador((anterior) => ({ ...anterior, [campo]: evento.target.value }))
  }

  const actualizarTarjeta = (campo, formatear = (valor) => valor) => (evento) => {
    setTarjeta((anterior) => ({ ...anterior, [campo]: formatear(evento.target.value) }))
  }

  const usarTarjetaDePrueba = (numero) => {
    setTarjeta({ numero, titular: 'VOLT PRUEBA', vencimiento: '12/30', cvv: '123' })
    setErrores((anteriores) => ({ ...anteriores, numero: '', titular: '', vencimiento: '', cvv: '' }))
  }

  const enviar = async (evento) => {
    evento.preventDefault()

    const nuevosErrores = {
      ...validarComprador(comprador),
      ...(metodoPago === 'tarjeta' ? validarTarjeta(tarjeta) : {}),
    }
    setErrores(nuevosErrores)

    const primerError = Object.keys(nuevosErrores)[0]
    if (primerError) {
      document.getElementById(`checkout-${primerError}`)?.focus()
      return
    }

    setProcesando(true)
    setErrorEnvio('')

    const datosTarjeta = {
      marca: marca?.nombre,
      ultimos4: soloDigitos(tarjeta.numero).slice(-4),
    }

    try {
      const [pedido] = await Promise.all([
        crearPedido({
          comprador: { ...comprador, codigo_postal: comprador.codigo_postal.toUpperCase() },
          items,
          metodoPago,
          tarjeta: datosTarjeta,
        }),
        esperar(DEMORA_SIMULADA),
      ])

      setConfirmacion({
        ...pedido,
        metodoPago,
        email: comprador.email.trim(),
        tarjeta: datosTarjeta,
        items: items.map(({ id, nombre, cantidad }) => ({ id, nombre, cantidad })),
      })
      vaciar()
    } catch (fallo) {
      setErrorEnvio(traducirError(fallo))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="pagina-checkout">
      <header className="checkout-barra">
        <div className="contenedor checkout-barra__inner">
          <a href="/" className="checkout-barra__logo">
            VOLT
          </a>
          <a href="/#coleccion" className="checkout-barra__volver">
            <ArrowLeft size={16} strokeWidth={2.5} aria-hidden="true" />
            Seguir comprando
          </a>
        </div>
      </header>

      <main className="checkout contenedor">
        {confirmacion ? (
          <ConfirmacionPedido pedido={confirmacion} />
        ) : items.length === 0 ? (
          <div className="checkout__vacio">
            <span className="etiqueta">Checkout</span>
            <h1 className="seccion-titulo">Tu carrito está vacío</h1>
            <p>Agregá prendas desde la colección para finalizar una compra.</p>
            <a href="/#coleccion" className="btn btn--negro">
              Ver colección
            </a>
          </div>
        ) : (
          <>
            <span className="etiqueta">Checkout</span>
            <h1 className="seccion-titulo">Finalizar compra</h1>

            <div className="checkout__grid">
              <form className="checkout__form" onSubmit={enviar} noValidate>
                <fieldset className="checkout__bloque" disabled={procesando}>
                  <legend className="checkout__subtitulo">
                    <span className="checkout__paso">1</span> Tus datos
                  </legend>
                  <Campo
                    id="nombre"
                    etiqueta="Nombre y apellido"
                    autoComplete="name"
                    value={comprador.nombre}
                    onChange={actualizarComprador('nombre')}
                    error={errores.nombre}
                  />
                  <div className="checkout__fila">
                    <Campo
                      id="email"
                      etiqueta="Email"
                      type="email"
                      autoComplete="email"
                      value={comprador.email}
                      onChange={actualizarComprador('email')}
                      error={errores.email}
                    />
                    <Campo
                      id="telefono"
                      etiqueta="Teléfono"
                      type="tel"
                      autoComplete="tel"
                      value={comprador.telefono}
                      onChange={actualizarComprador('telefono')}
                      error={errores.telefono}
                    />
                  </div>
                </fieldset>

                <fieldset className="checkout__bloque" disabled={procesando}>
                  <legend className="checkout__subtitulo">
                    <span className="checkout__paso">2</span> Envío
                  </legend>
                  <Campo
                    id="direccion"
                    etiqueta="Dirección"
                    placeholder="Calle, número, piso y depto."
                    autoComplete="street-address"
                    value={comprador.direccion}
                    onChange={actualizarComprador('direccion')}
                    error={errores.direccion}
                  />
                  <div className="checkout__fila">
                    <Campo
                      id="ciudad"
                      etiqueta="Ciudad"
                      autoComplete="address-level2"
                      value={comprador.ciudad}
                      onChange={actualizarComprador('ciudad')}
                      error={errores.ciudad}
                    />
                    <Campo
                      id="codigo_postal"
                      etiqueta="Código postal"
                      autoComplete="postal-code"
                      value={comprador.codigo_postal}
                      onChange={actualizarComprador('codigo_postal')}
                      error={errores.codigo_postal}
                    />
                  </div>
                </fieldset>

                <fieldset className="checkout__bloque" disabled={procesando}>
                  <legend className="checkout__subtitulo">
                    <span className="checkout__paso">3</span> Pago
                  </legend>

                  <div className="checkout__metodos">
                    <label
                      className={`checkout__metodo ${metodoPago === 'tarjeta' ? 'checkout__metodo--activo' : ''}`}
                    >
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="tarjeta"
                        checked={metodoPago === 'tarjeta'}
                        onChange={() => setMetodoPago('tarjeta')}
                      />
                      <CreditCard size={20} aria-hidden="true" />
                      Tarjeta de crédito o débito
                    </label>
                    <label
                      className={`checkout__metodo ${metodoPago === 'transferencia' ? 'checkout__metodo--activo' : ''}`}
                    >
                      <input
                        type="radio"
                        name="metodo-pago"
                        value="transferencia"
                        checked={metodoPago === 'transferencia'}
                        onChange={() => setMetodoPago('transferencia')}
                      />
                      <Building2 size={20} aria-hidden="true" />
                      Transferencia bancaria
                    </label>
                  </div>

                  {metodoPago === 'tarjeta' ? (
                    <>
                      <div className="checkout__prueba">
                        <FlaskConical size={18} aria-hidden="true" />
                        <div>
                          <p>
                            <strong>Pago simulado:</strong> no se realiza ningún cobro. Probá con una
                            tarjeta de prueba:
                          </p>
                          <div className="checkout__prueba-botones">
                            <button
                              type="button"
                              onClick={() => usarTarjetaDePrueba(TARJETAS_DE_PRUEBA.aprobada)}
                            >
                              Aprobada · {TARJETAS_DE_PRUEBA.aprobada}
                            </button>
                            <button
                              type="button"
                              onClick={() => usarTarjetaDePrueba(TARJETAS_DE_PRUEBA.rechazada)}
                            >
                              Rechazada · {TARJETAS_DE_PRUEBA.rechazada}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* autoComplete off: es una simulacion, no queremos que el
                          navegador ofrezca completar con una tarjeta real guardada. */}
                      <Campo
                        id="numero"
                        etiqueta={marca ? `Número de tarjeta · ${marca.nombre}` : 'Número de tarjeta'}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="0000 0000 0000 0000"
                        value={tarjeta.numero}
                        onChange={actualizarTarjeta('numero', formatearNumero)}
                        error={errores.numero}
                      />
                      <Campo
                        id="titular"
                        etiqueta="Nombre del titular"
                        autoComplete="off"
                        placeholder="Como figura en la tarjeta"
                        value={tarjeta.titular}
                        onChange={actualizarTarjeta('titular')}
                        error={errores.titular}
                      />
                      <div className="checkout__fila">
                        <Campo
                          id="vencimiento"
                          etiqueta="Vencimiento"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="MM/AA"
                          value={tarjeta.vencimiento}
                          onChange={actualizarTarjeta('vencimiento', formatearVencimiento)}
                          error={errores.vencimiento}
                        />
                        <Campo
                          id="cvv"
                          etiqueta="Código de seguridad"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder={marca?.cvv === 4 ? '0000' : '000'}
                          value={tarjeta.cvv}
                          onChange={actualizarTarjeta('cvv', (valor) => soloDigitos(valor).slice(0, 4))}
                          error={errores.cvv}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="checkout__nota">
                      Al confirmar te mostramos los datos bancarios. El pedido queda reservado y lo
                      despachamos cuando se acredita la transferencia.
                    </p>
                  )}
                </fieldset>

                {errorEnvio && (
                  <p className="checkout__error-envio" role="alert">
                    {errorEnvio}
                  </p>
                )}

                <button type="submit" className="btn btn--negro checkout__confirmar" disabled={procesando}>
                  {procesando
                    ? 'Procesando pago…'
                    : metodoPago === 'tarjeta'
                      ? `Pagar ${formatearPrecio(total)}`
                      : 'Confirmar pedido'}
                </button>
              </form>

              <aside className="checkout__resumen" aria-labelledby="checkout-resumen-titulo">
                <h2 id="checkout-resumen-titulo" className="checkout__resumen-titulo">
                  Tu pedido
                </h2>
                <ul className="checkout__items">
                  {items.map((item) => (
                    <li className="checkout__item" key={item.id}>
                      <div className="checkout__item-imagen">
                        {item.imagen_url && <img src={item.imagen_url} alt="" />}
                        <span className="checkout__item-cantidad">{item.cantidad}</span>
                      </div>
                      <div className="checkout__item-detalle">
                        <span className="checkout__item-nombre">{item.nombre}</span>
                        <span className="checkout__item-categoria">{item.categoria}</span>
                      </div>
                      <span className="checkout__item-precio">
                        {formatearPrecio(item.precio * item.cantidad)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="checkout__totales">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatearPrecio(total)}</dd>
                  </div>
                  <div>
                    <dt>Envío</dt>
                    <dd>Gratis</dd>
                  </div>
                  <div className="checkout__total">
                    <dt>Total</dt>
                    <dd>{formatearPrecio(total)}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Checkout
