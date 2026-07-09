# VOLT — Streetwear Urbano

Sitio web institucional/comercial de VOLT, marca ficticia de indumentaria streetwear.
Proyecto final de Tecnología Web.

## Stack

- **Vite + React** — base del proyecto
- **CSS externo** — sin inline styles ni frameworks
- **EmailJS** — formulario de contacto sin backend
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

Entrega parcial: el objetivo actual es llegar al **50%** del sitio.

### Hecho

- [x] Scaffold Vite + React, repo en GitHub
- [x] Arquitectura SPA con anchors (sin react-router)
- [x] `global.css`: paleta (blanco / `#111111` / `#F5F5F5` / amarillo `#FFE500`), tipografías (Anton para títulos, Archivo para texto), botones, base responsive
- [x] Navbar fija con los 6 links y menú hamburguesa en móvil
- [x] Footer: navegación, newsletter con validación en cliente, redes sociales (nueva pestaña + aria-label)
- [x] Sección Inicio: hero con título gigante + cinta "Alto Voltaje" animada (marquee) + CTAs
- [x] Secciones Colección, Lookbook, Drops, Sobre y Contacto como esqueleto ("En construcción")

### Próximos pasos (para llegar al 50%)

- [ ] Inicio: destacados de últimos drops (cards con hover) + popup de newsletter al entrar
- [ ] Colección: grid de productos filtrable por categoría, índice con anchors (`#hoodies`, `#tees`, etc.), efecto rollover en cards

### Después del 50% (segunda entrega)

- [ ] Lookbook: galería editorial + botones de compartir
- [ ] Drops: lanzamientos con countdown y badges
- [ ] Sobre VOLT: historia/manifiesto con índice interno
- [ ] Contacto: formulario con validación + EmailJS
- [ ] Deploy en Vercel

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
```
