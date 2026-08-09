import './Sobre.css'

const VALORES = [
  { nombre: 'Autenticidad', texto: 'Sin filtros, sin pretensiones. Solo ropa real para gente real.' },
  { nombre: 'Calidad', texto: 'Materiales que aguantan el movimiento y el tiempo.' },
  { nombre: 'Comunidad', texto: 'Construimos con la gente que nos elige, no solo para ellos.' },
  { nombre: 'Movimiento', texto: 'Cada pieza pensada para la calle, no para el escaparate.' },
]

function Sobre() {
  return (
    <section id="sobre" className="seccion sobre">
      <div className="contenedor">
        <span className="etiqueta">Nuestra historia</span>
        <h2 className="seccion-titulo">Sobre VOLT</h2>

        <div className="sobre__grid">
          <div className="sobre__foto" aria-hidden="true">
            <span className="sobre__foto-texto">
              brand
              <br />
              photo
            </span>
          </div>

          <div className="sobre__texto">
            <p className="sobre__lead">
              VOLT nació en las calles.
              <br />
              No en una oficina.
            </p>
            <p className="sobre__parrafo">
              Somos una marca de indumentaria urbana que cree en la autenticidad antes que en las tendencias.
              Cada pieza que diseñamos está pensada para durar, moverse y contar una historia.
            </p>
            <p className="sobre__parrafo">
              Empezamos con tres amigos, una idea y demasiado tiempo libre. Hoy somos VOLT: una comunidad de
              personas que eligen moverse a su ritmo.
            </p>

            <ul className="sobre__valores">
              {VALORES.map((valor) => (
                <li className="sobre__valor" key={valor.nombre}>
                  <span className="sobre__valor-nombre">{valor.nombre}</span>
                  <p className="sobre__valor-texto">{valor.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sobre
