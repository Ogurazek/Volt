import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SitioPublico from './SitioPublico'

// El panel se carga aparte y solo al entrar a /admin: un visitante del sitio
// no tiene por que descargar codigo que nunca va a usar.
const Admin = lazy(() => import('./admin/Admin'))

// /admin no se enlaza desde el sitio salvo que haya sesion iniciada, pero eso
// es comodidad y no seguridad: quien escriba la URL llega igual. Lo que
// protege es la sesion de Supabase y las politicas RLS de la base.

function App() {
  return (
    <Routes>
      <Route path="/" element={<SitioPublico />} />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<p className="cargando-panel">Cargando panel…</p>}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
