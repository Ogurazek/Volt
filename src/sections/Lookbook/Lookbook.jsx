import './Lookbook.css'

function Lookbook({ looks, cargando, error }) {
  return (
    <section id="lookbook" className="seccion seccion--negra lookbook">
      <div className="contenedor">
        <span className="etiqueta">Editorial</span>
        <h2 className="seccion-titulo">Lookbook</h2>
        <p className="lookbook__bajada">
          Fotografía editorial con los outfits completos de la temporada SS26.
        </p>

        {cargando && <p className="lookbook__aviso">Cargando looks…</p>}

        {!cargando && error && (
          <p className="lookbook__aviso" role="alert">
            {error}
          </p>
        )}

        {!cargando && !error && looks.length === 0 && (
          <p className="lookbook__aviso">Todavía no hay looks publicados.</p>
        )}

        {looks.length > 0 && (
          <ul className="lookbook__grid">
            {looks.map((look, indice) => (
              <li className="look-card" key={look.id}>
                <div className="look-card__imagen">
                  {look.imagen_url ? (
                    <img className="look-card__foto" src={look.imagen_url} alt={look.nombre} />
                  ) : (
                    <span className="look-card__foto-texto" aria-hidden="true">
                      editorial
                      <br />
                      photo look
                    </span>
                  )}
                  {/* El numero es presentacion: sale de la posicion, no es un dato guardado. */}
                  <span className="look-card__numero">{String(indice + 1).padStart(2, '0')}</span>
                </div>
                <div className="look-card__info">
                  <span className="look-card__nombre">{look.nombre}</span>
                  <ul className="look-card__prendas">
                    {look.prendas.map((prenda) => (
                      <li key={prenda.id}>{prenda.nombre}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Lookbook
