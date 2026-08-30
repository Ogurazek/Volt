# VOLT — Streetwear Urbano

Sitio web institucional/comercial de VOLT, marca ficticia de indumentaria streetwear.
Proyecto final de Tecnología Web.

## Stack

- **Vite + React** — base del proyecto
- **CSS externo** — sin inline styles ni frameworks
- **lucide-react** — íconos de interfaz (cerrar, check, etc.)
- **simple-icons** — logos de redes sociales (Instagram, TikTok, X)
- **EmailJS** — envío real del formulario de contacto, sin backend propio
- **Vercel** — hosting

## Arquitectura

SPA (Single Page Application): una sola página con 6 secciones ancladas,
navegables desde la navbar fija.

| Sección | Anchor |
|---|---|
| Inicio | `#inicio` |
| Colección | `#coleccion` |
| Lookbook | `#lookbook` |
| Drops | `#drops` |
| Sobre VOLT | `#sobre` |
| Contacto | `#contacto` |

## Estado del proyecto

- [x] Scaffold Vite + React, repo en GitHub
- [x] Arquitectura SPA con anchors (sin react-router)
- [x] `global.css`: paleta (blanco / `#111111` / `#F5F5F5` / amarillo `#FFE500`), tipografías (Bebas Neue para títulos, Archivo para texto), botones, base responsive
- [x] Navbar fija con los 6 links y menú hamburguesa en móvil
- [x] Footer: navegación, newsletter con validación en cliente, redes sociales (nueva pestaña + aria-label)
- [x] Sección Inicio: hero con título gigante + cinta "Alto Voltaje" animada (marquee) + CTAs
- [x] Inicio: destacados de últimos drops (cards con hover)
- [x] Popup de newsletter: aparece 2,5s después de entrar, una vez por sesión, con validación en cliente y cierre con Escape/click afuera
- [x] Colección: catálogo estático (`src/data/productos.js`), filtro por categoría (Hoodies, Tees, Pants, Accesorios) con hash compartible (`#hoodies`, `#tees`, etc.), grid con efecto rollover en cards
- [x] Lookbook: editorial de temporada con looks armados a partir del catálogo (`src/data/lookbook.js`), grid con placeholders de foto y hover
- [x] Drops: catálogo de lanzamientos (`src/data/drops.js`) con badges Nuevo/Agotado/Próximo y countdown en vivo al próximo drop
- [x] Sobre VOLT: layout a dos columnas (foto + historia de marca) con grilla de valores (Autenticidad, Calidad, Comunidad, Movimiento)
- [x] Contacto: formulario (nombre, email, mensaje) con validación en cliente, envío real vía EmailJS (estados de carga y error) y estado de éxito, más redes sociales con handle

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
```
