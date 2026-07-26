import { useState } from 'react'
import './Coleccion.css'
import { categorias, productos } from '../../data/productos'

const formatearPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format

function obtenerCategoriaInicial() {
  const hash = window.location.hash.replace('#', '')
  return categorias.some((categoria) => categoria.slug === hash) ? hash : 'todos'
}

function Coleccion() {
  const [categoriaActiva, setCategoriaActiva] = useState(obtenerCategoriaInicial)

  const seleccionarCategoria = (slug) => {
    setCategoriaActiva(slug)
    window.history.replaceState(null, '', `#${slug === 'todos' ? 'coleccion' : slug}`)
  }

  const productosFiltrados =
    categoriaActiva === 'todos'
      ? productos
      : productos.filter((producto) => producto.categoriaSlug === categoriaActiva)

  return (
    <section id="coleccion" className="seccion coleccion">
      <div className="contenedor">
        <span className="etiqueta">Catálogo</span>
        <h2 className="seccion-titulo">Colección</h2>
        <p className="coleccion__bajada">
          Hoodies, tees, pants y accesorios. Filtrá por categoría o mirá todo el catálogo.
        </p>

        <nav className="coleccion__indice" aria-label="Filtrar colección por categoría">
          <button
            type="button"
            className={`coleccion__filtro ${categoriaActiva === 'todos' ? 'coleccion__filtro--activo' : ''}`}
            aria-pressed={categoriaActiva === 'todos'}
            onClick={() => seleccionarCategoria('todos')}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
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
            {productosFiltrados.map((producto) => {
              const categoria = categorias.find((item) => item.slug === producto.categoriaSlug)
              return (
                <li className="producto-card" key={producto.id}>
                  <div className="producto-card__imagen">
                    <span className="producto-card__categoria-tag">{categoria?.nombre}</span>
                  </div>
                  <div className="producto-card__info">
                    <span className="producto-card__nombre">{producto.nombre}</span>
                    <span className="producto-card__precio">{formatearPrecio(producto.precio)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="coleccion__vacio">No hay productos en esta categoría todavía.</p>
        )}
      </div>
    </section>
  )
}

export default Coleccion
