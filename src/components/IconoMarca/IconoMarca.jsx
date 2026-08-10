function IconoMarca({ icono, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" role="img" aria-hidden="true">
      <path d={icono.path} />
    </svg>
  )
}

export default IconoMarca
