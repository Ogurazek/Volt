import { useCallback, useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { eliminarProducto, listarProductos } from '../lib/productos'
import { listarCategorias } from '../lib/categorias'
import { traducirError } from '../lib/errores'
import FormularioProducto from './FormularioProducto'

const formatearPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format

function ProductosAdmin() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formulario, setFormulario] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const cargar = useCallback(async () => {
    setError('')
    try {
      const [lista, listaCategorias] = await Promise.all([listarProductos(), listarCategorias()])
      setProductos(lista)
      setCategorias(listaCategorias)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const borrar = async (id) => {
    setBorrando(true)
    setError('')
    try {
      await eliminarProducto(id)
      setProductos((anteriores) => anteriores.filter((producto) => producto.id !== id))
      setConfirmando(null)
    } catch (fallo) {
      setError(traducirError(fallo))
    } finally {
      setBorrando(false)
    }
  }

  const alGuardar = () => {
    setFormulario(null)
    cargar()
  }

  if (cargando) {
    return <p className="admin__estado">Cargando productos…</p>
  }

  return (
    <>
      <div className="admin__encabezado">
        <div>
          <h1 className="admin__titulo">Colección</h1>
          <p className="admin__texto">
            {productos.length} {productos.length === 1 ? 'producto cargado' : 'productos cargados'}.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin__error" role="alert">
          {error}
        </p>
      )}

      <ul className="tarjetas">
        {productos.map((producto) => (
          <li className="tarjeta" key={producto.id}>
            <div className="tarjeta__imagen">
              {producto.imagen_url ? (
                <img src={producto.imagen_url} alt={producto.nombre} />
              ) : (
                <span className="tarjeta__sin-foto">Sin foto</span>
              )}

              {confirmando === producto.id && (
                <div className="tarjeta__confirmar">
                  <p>¿Borrar este producto?</p>
                  <div className="tarjeta__confirmar-acciones">
                    <button
                      type="button"
                      className="tarjeta__btn tarjeta__btn--peligro"
                      onClick={() => borrar(producto.id)}
                      disabled={borrando}
                    >
                      {borrando ? 'Borrando…' : 'Sí, borrar'}
                    </button>
                    <button
                      type="button"
                      className="tarjeta__btn"
                      onClick={() => setConfirmando(null)}
                      disabled={borrando}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="tarjeta__cuerpo">
              <span className="tarjeta__categoria">{producto.categorias?.nombre}</span>
              <span className="tarjeta__nombre">{producto.nombre}</span>
              <span className="tarjeta__precio">{formatearPrecio(producto.precio)}</span>
            </div>

            <div className="tarjeta__acciones">
              <button
                type="button"
                className="tarjeta__accion"
                onClick={() => setFormulario({ producto })}
              >
                <Pencil size={15} strokeWidth={2.5} aria-hidden="true" />
                Editar
              </button>
              <button
                type="button"
                className="tarjeta__accion tarjeta__accion--peligro"
                onClick={() => setConfirmando(producto.id)}
              >
                <Trash2 size={15} strokeWidth={2.5} aria-hidden="true" />
                Borrar
              </button>
            </div>
          </li>
        ))}

        <li className="tarjeta tarjeta--nueva">
          <button
            type="button"
            className="tarjeta__nueva-btn"
            onClick={() => setFormulario({ producto: null })}
          >
            <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
            Nuevo producto
          </button>
        </li>
      </ul>

      {formulario && (
        <FormularioProducto
          producto={formulario.producto}
          categorias={categorias}
          onCerrar={() => setFormulario(null)}
          onGuardado={alGuardar}
        />
      )}
    </>
  )
}

export default ProductosAdmin
