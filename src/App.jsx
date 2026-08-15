import { Routes, Route, Navigate } from 'react-router-dom'
import SitioPublico from './SitioPublico'
import Admin from './admin/Admin'

// /admin no se enlaza desde ningun lado del sitio, pero eso es comodidad y no
// seguridad: quien escriba la URL llega igual. Lo que protege es la sesion de
// Supabase y, sobre todo, las politicas RLS de la base.

function App() {
  return (
    <Routes>
      <Route path="/" element={<SitioPublico />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
