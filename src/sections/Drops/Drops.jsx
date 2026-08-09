import { useEffect, useState } from 'react'
import './Drops.css'
import { drops } from '../../data/drops'

const ETIQUETAS_ESTADO = {
  nuevo: 'Nuevo',
  agotado: 'Agotado',
  proximo: 'Próximo',
}

function calcularRestante(fecha) {
  const diferencia = Math.max(0, new Date(fecha).getTime() - Date.now())
  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diferencia / (1000 * 60)) % 60),
    segundos: Math.floor((diferencia / 1000) % 60),
    terminado: diferencia === 0,
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}

function Countdown({ fecha }) {
  const [restante, setRestante] = useState(() => calcularRestante(fecha))

  useEffect(() => {
    const intervalo = setInterval(() => setRestante(calcularRestante(fecha)), 1000)
    return () => clearInterval(intervalo)
  }, [fecha])

  if (restante.terminado) {
    return <p className="drops__countdown-cerrado">¡Ya está disponible!</p>
  }

  const unidades = [
    { valor: restante.dias, etiqueta: 'Días' },
    { valor: restante.horas, etiqueta: 'Hs' },
    { valor: restante.minutos, etiqueta: 'Min' },
    { valor: restante.segundos, etiqueta: 'Seg' },
  ]

  return (
    <div className="drops__countdown" role="timer" aria-live="off">
      {unidades.map((unidad) => (
        <div className="drops__countdown-unidad" key={unidad.etiqueta}>
          <span className="drops__countdown-valor">{String(unidad.valor).padStart(2, '0')}</span>
          <span className="drops__countdown-etiqueta">{unidad.etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

function Drops() {
  const proximoDrop = [...drops]
    .filter((drop) => drop.estado === 'proximo')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]

  return (
    <section id="drops" className="seccion drops">
      <div className="contenedor">
        <span className="etiqueta">Lanzamientos</span>
        <h2 className="seccion-titulo">Drops</h2>
        <p className="drops__bajada">Lanzamientos recientes y próximos. Sin restock.</p>

        {proximoDrop && (
          <div className="drops__proximo">
            <span className="drops__proximo-titulo">
              Próximo drop: {proximoDrop.nombre} — {formatearFecha(proximoDrop.fecha)}
            </span>
            <Countdown fecha={proximoDrop.fecha} />
          </div>
        )}

        <ul className="drops__grid">
          {drops.map((drop) => (
            <li className="drop-card" key={drop.id}>
              <div className="drop-card__imagen">
                <span className={`drop-card__estado drop-card__estado--${drop.estado}`}>
                  {ETIQUETAS_ESTADO[drop.estado]}
                </span>
              </div>
              <span className="drop-card__categoria">{drop.categoria}</span>
              <span className="drop-card__nombre">{drop.nombre}</span>
              {drop.estado === 'proximo' && <span className="drop-card__fecha">{formatearFecha(drop.fecha)}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Drops
