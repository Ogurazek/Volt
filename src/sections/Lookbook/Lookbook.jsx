import './Lookbook.css'
import { looks } from '../../data/lookbook'

function Lookbook() {
  return (
    <section id="lookbook" className="seccion seccion--negra lookbook">
      <div className="contenedor">
        <span className="etiqueta">Editorial</span>
        <h2 className="seccion-titulo">Lookbook</h2>
        <p className="lookbook__bajada">
          Fotografía editorial con los outfits completos de la temporada SS26.
        </p>

        <ul className="lookbook__grid">
          {looks.map((look) => (
            <li className="look-card" key={look.id}>
              <div className="look-card__imagen" aria-hidden="true">
                <span className="look-card__numero">{look.numero}</span>
                <span className="look-card__foto-texto">
                  editorial
                  <br />
                  photo look
                </span>
              </div>
              <div className="look-card__info">
                <span className="look-card__nombre">{look.nombre}</span>
                <ul className="look-card__prendas">
                  {look.prendas.map((prenda) => (
                    <li key={prenda}>{prenda}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Lookbook
