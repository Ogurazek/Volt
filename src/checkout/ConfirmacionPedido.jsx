import { Check, Clock } from 'lucide-react'
import { numeroDePedido } from '../lib/pedidos'
import { formatearPrecio } from '../lib/formato'

// Datos ficticios: es un proyecto academico y no hay cuenta real detras.
const DATOS_BANCARIOS = [
  { etiqueta: 'Titular', valor: 'VOLT Streetwear S.R.L.' },
  { etiqueta: 'CUIT', valor: '30-00000000-0' },
  { etiqueta: 'CBU', valor: '0000003100000000000000' },
  { etiqueta: 'Alias', valor: 'VOLT.STREET.PAGO' },
]

function ConfirmacionPedido({ pedido }) {
  const pagado = pedido.estado === 'pagado'

  return (
    <div className="confirmacion">
      <span
        className={`confirmacion__icono ${pagado ? '' : 'confirmacion__icono--pendiente'}`}
        aria-hidden="true"
      >
        {pagado ? <Check size={28} strokeWidth={2.5} /> : <Clock size={28} strokeWidth={2.5} />}
      </span>

      <span className="etiqueta">Pedido {numeroDePedido(pedido.id)}</span>
      <h1 className="seccion-titulo">{pagado ? '¡Gracias por tu compra!' : 'Pedido reservado'}</h1>

      <p className="confirmacion__texto" role="status">
        {pagado
          ? `Tu pago con ${pedido.tarjeta.marca} terminada en ${pedido.tarjeta.ultimos4} fue aprobado. `
          : 'Tu pedido queda reservado hasta que se acredite la transferencia. '}
        Te vamos a escribir a <strong>{pedido.email}</strong> con el seguimiento del envío.
      </p>

      {!pagado && (
        <div className="confirmacion__banco">
          <p className="confirmacion__banco-titulo">
            Transferí <strong>{formatearPrecio(pedido.total)}</strong> a esta cuenta:
          </p>
          <dl>
            {DATOS_BANCARIOS.map((dato) => (
              <div key={dato.etiqueta}>
                <dt>{dato.etiqueta}</dt>
                <dd>{dato.valor}</dd>
              </div>
            ))}
          </dl>
          <p className="confirmacion__nota">
            Indicá el número de pedido {numeroDePedido(pedido.id)} en el concepto. Datos ficticios:
            es una simulación.
          </p>
        </div>
      )}

      <div className="confirmacion__detalle">
        <ul>
          {pedido.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.cantidad} × {item.nombre}
              </span>
            </li>
          ))}
        </ul>
        <p className="confirmacion__total">
          <span>Total</span>
          <span>{formatearPrecio(pedido.total)}</span>
        </p>
      </div>

      <a href="/" className="btn btn--negro">
        Volver a la tienda
      </a>
    </div>
  )
}

export default ConfirmacionPedido
