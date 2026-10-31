import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ESTADOS_PEDIDO, cambiarEstadoPedido, listarPedidos, numeroDePedido } from '../lib/pedidos'
import { traducirError } from '../lib/errores'
import { formatearPrecio } from '../lib/formato'

const formatearFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
}).format

function describirPago(pedido) {
  return pedido.metodo_pago === 'tarjeta'
    ? `${pedido.tarjeta_marca} terminada en ${pedido.tarjeta_ultimos4}`
    : 'Transferencia bancaria'
}

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [guardando, setGuardando] = useState(null)

  const cargar = useCallback(async () => {
    setError('')
    try {
      setPedidos(await listarPedidos())
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const actualizarEstado = async (id, estado) => {
    setGuardando(id)
    setError('')
    try {
      await cambiarEstadoPedido(id, estado)
      setPedidos((anteriores) =>
        anteriores.map((pedido) => (pedido.id === id ? { ...pedido, estado } : pedido)),
      )
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setGuardando(null)
    }
  }

  if (cargando) {
    return <p className="admin__estado">Cargando pedidos…</p>
  }

  const pedidosFiltrados =
    filtro === 'todos' ? pedidos : pedidos.filter((pedido) => pedido.estado === filtro)
  const cantidadPorEstado = (estado) => pedidos.filter((pedido) => pedido.estado === estado).length
  const pendientes = cantidadPorEstado('pendiente')

  return (
    <>
      <div className="admin__encabezado">
        <div>
          <h1 className="admin__titulo">Pedidos</h1>
          <p className="admin__texto">
            {pedidos.length} {pedidos.length === 1 ? 'pedido recibido' : 'pedidos recibidos'}
            {pendientes > 0 && `, ${pendientes} pendiente${pendientes === 1 ? '' : 's'} de pago`}.
          </p>
        </div>
        <button type="button" className="modal__btn modal__btn--borde pedidos__recargar" onClick={cargar}>
          <RefreshCw size={15} strokeWidth={2.5} aria-hidden="true" />
          Actualizar
        </button>
      </div>

      {error && (
        <p className="admin__error" role="alert">
          {error}
        </p>
      )}

      <nav className="pedidos__filtros" aria-label="Filtrar pedidos por estado">
        <button
          type="button"
          className={`pedidos__filtro ${filtro === 'todos' ? 'pedidos__filtro--activo' : ''}`}
          aria-pressed={filtro === 'todos'}
          onClick={() => setFiltro('todos')}
        >
          Todos ({pedidos.length})
        </button>
        {ESTADOS_PEDIDO.map((estado) => (
          <button
            key={estado.valor}
            type="button"
            className={`pedidos__filtro ${filtro === estado.valor ? 'pedidos__filtro--activo' : ''}`}
            aria-pressed={filtro === estado.valor}
            onClick={() => setFiltro(estado.valor)}
          >
            {estado.etiqueta} ({cantidadPorEstado(estado.valor)})
          </button>
        ))}
      </nav>

      {pedidosFiltrados.length === 0 ? (
        <p className="admin__estado">
          {pedidos.length === 0 ? 'Todavía no entró ningún pedido.' : 'No hay pedidos en este estado.'}
        </p>
      ) : (
        <ul className="pedidos">
          {pedidosFiltrados.map((pedido) => (
            <li className="pedido" key={pedido.id}>
              <div className="pedido__resumen">
                <div className="pedido__id">
                  <span className="pedido__numero">{numeroDePedido(pedido.id)}</span>
                  <span className="pedido__fecha">{formatearFecha(new Date(pedido.creado_en))}</span>
                </div>
                <div className="pedido__cliente">
                  <span className="pedido__nombre">{pedido.nombre}</span>
                  <span className="pedido__pago">{describirPago(pedido)}</span>
                </div>
                <span className="pedido__total">{formatearPrecio(pedido.total)}</span>
                <select
                  className={`pedido__estado pedido__estado--${pedido.estado}`}
                  aria-label={`Estado del pedido ${numeroDePedido(pedido.id)}`}
                  value={pedido.estado}
                  disabled={guardando === pedido.id}
                  onChange={(evento) => actualizarEstado(pedido.id, evento.target.value)}
                >
                  {ESTADOS_PEDIDO.map((estado) => (
                    <option key={estado.valor} value={estado.valor}>
                      {estado.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <details className="pedido__detalle">
                <summary>Ver detalle</summary>
                <div className="pedido__columnas">
                  <div>
                    <h2 className="pedido__subtitulo">Productos</h2>
                    <ul className="pedido__items">
                      {pedido.pedido_items.map((item) => (
                        <li key={item.id}>
                          <span>
                            {item.cantidad} × {item.nombre}
                          </span>
                          <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="pedido__subtitulo">Contacto</h2>
                    <p>
                      <a href={`mailto:${pedido.email}`}>{pedido.email}</a>
                      <br />
                      {pedido.telefono}
                    </p>
                    <h2 className="pedido__subtitulo">Envío</h2>
                    <p>
                      {pedido.direccion}
                      <br />
                      {pedido.ciudad} ({pedido.codigo_postal})
                    </p>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default PedidosAdmin
