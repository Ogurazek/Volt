import './Inicio.css'

const ULTIMOS_DROPS = [
  { nombre: 'Voltaje Hoodie', categoria: 'Hoodies', estado: 'Nuevo' },
  { nombre: 'Circuito Tee', categoria: 'Tees', estado: 'Nuevo' },
  { nombre: 'Corriente Cargo', categoria: 'Pants', estado: 'Agotado' },
]

const CINTA_ITEMS = ['Nueva temporada', 'Drops limitados', 'Sin restock', 'VOLT']

function Cinta() {
  return (
    <>
      {CINTA_ITEMS.map((texto, indice) => (
        <span className="inicio__cinta-item" key={texto}>
          <span className="inicio__cinta-palabra">{texto}</span>
          {indice < CINTA_ITEMS.length - 1 && (
            <span className="inicio__cinta-separador" aria-hidden="true">
              ◆
            </span>
          )}
        </span>
      ))}
    </>
  )
}

function Inicio() {
  return (
    <section id="inicio" className="inicio">
      <div className="inicio__hero">
        <div className="inicio__foto" aria-hidden="true">
          <span className="inicio__foto-texto">
            editorial
            <br />
            photo drop
          </span>
        </div>
        <div className="inicio__velo" aria-hidden="true"></div>

        <div className="inicio__contenido">
          <span className="inicio__kicker">Nueva temporada — SS26</span>
          <h1 className="inicio__titulo">VOLT</h1>
          <p className="inicio__bajada">Streetwear urbano para los que se mueven diferente.</p>

          <div className="inicio__ctas">
            <a href="#coleccion" className="inicio__cta inicio__cta--relleno">
              Ver colección
            </a>
            <a href="#drops" className="inicio__cta inicio__cta--fantasma">
              Drops
            </a>
          </div>
        </div>

        <div className="inicio__scroll" aria-hidden="true">
          <span className="inicio__scroll-texto">Scroll</span>
          <span className="inicio__scroll-linea"></span>
        </div>
      </div>

      <div className="inicio__cinta">
        <div className="inicio__cinta-texto">
          <Cinta />
          <Cinta />
        </div>
      </div>

      <div className="inicio__destacados">
        <div className="contenedor">
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
    </section>
  )
}

export default Inicio
