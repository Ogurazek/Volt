import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CAMPOS_INICIALES = { email: '', password: '' }

// Supabase devuelve los errores en ingles: los traducimos sin revelar si el
// que fallo fue el email o la contrasena.
function traducirError(error) {
  const mensaje = error.message.toLowerCase()
  if (mensaje.includes('invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (mensaje.includes('email not confirmed')) return 'La cuenta todavía no está confirmada.'
  if (mensaje.includes('rate limit') || mensaje.includes('too many')) {
    return 'Demasiados intentos. Esperá unos minutos antes de reintentar.'
  }
  return 'No se pudo iniciar sesión. Revisá tu conexión e intentá de nuevo.'
}

function Login() {
  const [campos, setCampos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const actualizarCampo = (campo) => (evento) => {
    setCampos((anteriores) => ({ ...anteriores, [campo]: evento.target.value }))
  }

  const validar = () => {
    const nuevosErrores = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) nuevosErrores.email = 'Ingresá un email válido.'
    if (!campos.password) nuevosErrores.password = 'Ingresá tu contraseña.'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const iniciarSesion = async (evento) => {
    evento.preventDefault()
    setErrorGeneral('')
    if (!validar()) return

    setEnviando(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: campos.email.trim(),
      password: campos.password,
    })
    setEnviando(false)

    // Si sale bien no hace falta hacer nada: onAuthStateChange en Admin
    // detecta la sesion nueva y monta el panel.
    if (error) setErrorGeneral(traducirError(error))
  }

  return (
    <div className="login">
      <div className="login__caja">
        <span className="login__marca">VOLT</span>
        <h1 className="login__titulo">Panel de administración</h1>
        <p className="login__bajada">Acceso restringido al administrador del sitio.</p>

        <form onSubmit={iniciarSesion} noValidate>
          <div className="login__campo">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              placeholder="admin@volt.com"
              value={campos.email}
              onChange={actualizarCampo('email')}
            />
            {errores.email && (
              <span className="login__error" role="alert">
                {errores.email}
              </span>
            )}
          </div>

          <div className="login__campo">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={campos.password}
              onChange={actualizarCampo('password')}
            />
            {errores.password && (
              <span className="login__error" role="alert">
                {errores.password}
              </span>
            )}
          </div>

          {errorGeneral && (
            <p className="login__error-general" role="alert">
              {errorGeneral}
            </p>
          )}

          <button type="submit" className="login__submit" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link to="/" className="login__volver">
          ← Volver al sitio
        </Link>
      </div>
    </div>
  )
}

export default Login
