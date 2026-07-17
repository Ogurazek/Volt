import './Inicio.css'

const ULTIMOS_DROPS = [
  { nombre: 'Voltaje Hoodie', categoria: 'Hoodies', estado: 'Nuevo' },
  { nombre: 'Circuito Tee', categoria: 'Tees', estado: 'Nuevo' },
  { nombre: 'Corriente Cargo', categoria: 'Pants', estado: 'Agotado' },
]

function Inicio() {
  return (
    <section id="inicio" className="inicio">
      <div className="contenedor inicio__contenido">
        <span className="etiqueta">Streetwear · Buenos Aires</span>
        <h1 className="inicio__titulo">
          Energía
          <br />
          <span className="inicio__titulo-acento">Urbana</span>
        </h1>
        <p className="inicio__bajada">
          Ropa hecha para la calle. Drops limitados, sin restock: cuando se agota, se agotó.
        </p>
        <div className="inicio__ctas">
          <a href="#coleccion" className="btn btn--negro">
            Ver colección
          </a>
          <a href="#drops" className="btn btn--borde">
            Próximos drops
          </a>
        </div>

        <div className="inicio__drops">
          <span className="inicio__drops-titulo">Últimos drops</span>
          <div className="inicio__drops-grid">
            {ULTIMOS_DROPS.map((drop) => (
              <a href="#drops" className="drop-card" key={drop.nombre}>
                <div className="drop-card__imagen">
                  <span className={`drop-card__estado drop-card__estado--${drop.estado === 'Nuevo' ? 'nuevo' : 'agotado'}`}>
                    {drop.estado}
                  </span>
                </div>
                <span className="drop-card__categoria">{drop.categoria}</span>
                <span className="drop-card__nombre">{drop.nombre}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="inicio__cinta" aria-hidden="true">
        <div className="inicio__cinta-texto">
          <span>⚡ Alto voltaje — Drops limitados — Sin restock — VOLT — </span>
          <span>⚡ Alto voltaje — Drops limitados — Sin restock — VOLT — </span>
        </div>
      </div>
    </section>
  )
}

export default Inicio
