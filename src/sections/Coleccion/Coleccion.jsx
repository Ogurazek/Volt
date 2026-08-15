import { useState } from 'react'
import './Coleccion.css'

const formatearPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format

function Coleccion({ productos, categorias, cargando, error }) {
  const [categoriaElegida, setCategoriaElegida] = useState(
    () => window.location.hash.replace('#', '') || 'todos',
  )

  // Solo se ofrecen categorias que tengan al menos un producto: un filtro que
  // no devuelve nada es ruido. Si el admin carga un producto de una categoria
  // nueva, el filtro aparece solo.
  const categoriasConProductos = categorias.filter((categoria) =>
    productos.some((producto) => producto.categoria_id === categoria.id),
  )

  // El hash puede apuntar a una categoria que ya no existe o que quedo vacia,
  // y las categorias llegan despues del primer render.
  const categoriaActiva = categoriasConProductos.some((item) => item.slug === categoriaElegida)
    ? categoriaElegida
    : 'todos'

  const seleccionarCategoria = (slug) => {
    setCategoriaElegida(slug)
    window.history.replaceState(null, '', `#${slug === 'todos' ? 'coleccion' : slug}`)
  }

  const productosFiltrados =
    categoriaActiva === 'todos'
      ? productos
      : productos.filter((producto) => producto.categorias?.slug === categoriaActiva)

  return (
    <section id="coleccion" className="seccion coleccion">
      <div className="contenedor">
        <span className="etiqueta">Catálogo</span>
        <h2 className="seccion-titulo">Colección</h2>
        <p className="coleccion__bajada">
          Hoodies, tees, pants y accesorios. Filtrá por categoría o mirá todo el catálogo.
        </p>

        {cargando && <p className="coleccion__vacio">Cargando catálogo…</p>}

        {!cargando && error && (
          <p className="coleccion__vacio" role="alert">
            {error}
          </p>
        )}

        {!cargando && !error && (
          <>
            <nav className="coleccion__indice" aria-label="Filtrar colección por categoría">
              <button
                type="button"
                className={`coleccion__filtro ${categoriaActiva === 'todos' ? 'coleccion__filtro--activo' : ''}`}
                aria-pressed={categoriaActiva === 'todos'}
                onClick={() => seleccionarCategoria('todos')}
              >
                Todos
              </button>
              {categoriasConProductos.map((categoria) => (
                <button
                  key={categoria.slug}
                  type="button"
                  className={`coleccion__filtro ${categoriaActiva === categoria.slug ? 'coleccion__filtro--activo' : ''}`}
                  aria-pressed={categoriaActiva === categoria.slug}
                  onClick={() => seleccionarCategoria(categoria.slug)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </nav>

            {productosFiltrados.length > 0 ? (
              <ul className="coleccion__grid">
                {productosFiltrados.map((producto) => (
                  <li className="producto-card" key={producto.id}>
                    <div className="producto-card__imagen">
                      {producto.imagen_url && (
                        <img
                          className="producto-card__foto"
                          src={producto.imagen_url}
                          alt={producto.nombre}
                        />
                      )}
                      <span className="producto-card__categoria-tag">
                        {producto.categorias?.nombre}
                      </span>
                    </div>
                    <div className="producto-card__info">
                      <span className="producto-card__nombre">{producto.nombre}</span>
                      <span className="producto-card__precio">{formatearPrecio(producto.precio)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="coleccion__vacio">No hay productos en esta categoría todavía.</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Coleccion
