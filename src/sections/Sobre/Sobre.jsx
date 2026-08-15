import './Sobre.css'

function Sobre({ sobre, cargando, error }) {
  return (
    <section id="sobre" className="seccion sobre">
      <div className="contenedor">
        <span className="etiqueta">{sobre?.etiqueta ?? 'Nuestra historia'}</span>
        <h2 className="seccion-titulo">Sobre VOLT</h2>

        {cargando && <p className="sobre__aviso">Cargando…</p>}

        {!cargando && error && (
          <p className="sobre__aviso" role="alert">
            {error}
          </p>
        )}

        {!cargando && !error && sobre && (
          <div className="sobre__grid">
            <div className="sobre__foto">
              {sobre.imagen_url ? (
                <img className="sobre__foto-imagen" src={sobre.imagen_url} alt="" />
              ) : (
                <span className="sobre__foto-texto" aria-hidden="true">
                  brand
                  <br />
                  photo
                </span>
              )}
            </div>

            <div className="sobre__texto">
              {/* El lead se guarda como texto plano; los saltos de linea los
                  respeta el CSS, no se interpreta HTML. */}
              <p className="sobre__lead">{sobre.lead}</p>

              {sobre.parrafos.map((parrafo) => (
                <p className="sobre__parrafo" key={parrafo.id}>
                  {parrafo.texto}
                </p>
              ))}

              {sobre.valores.length > 0 && (
                <ul className="sobre__valores">
                  {sobre.valores.map((valor) => (
                    <li className="sobre__valor" key={valor.id}>
                      <span className="sobre__valor-nombre">{valor.nombre}</span>
                      <p className="sobre__valor-texto">{valor.texto}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Sobre
