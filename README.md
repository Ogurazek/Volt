# VOLT — Streetwear Urbano

Sitio web institucional/comercial de VOLT, marca ficticia de indumentaria
streetwear. Proyecto final de la Tecnicatura Universitaria en Diseño Multimedia
y de Sitios Web.

El proyecto tiene **dos caras sobre una misma base de datos**: un sitio público
donde el visitante recorre el catálogo, el lookbook y los lanzamientos, y un
**panel de administración privado** desde el cual los dueños de la marca editan
todo ese contenido sin tocar código ni volver a desplegar.

---

## Stack

| Capa | Herramienta |
|---|---|
| Build / dev server | **Vite 8** |
| Interfaz | **React 19** |
| Ruteo | **react-router-dom 7** |
| Base de datos, auth y archivos | **Supabase** (Postgres + Auth + Storage) |
| Envío de mails | **EmailJS** — formulario de contacto sin backend propio |
| Íconos | **lucide-react** (interfaz) + **simple-icons** (logos de redes) |
| Linter | **oxlint** |
| Hosting | **Vercel** |
| Estilos | **CSS externo puro** — sin frameworks ni inline styles |

**No hay backend propio.** El frontend habla directamente con Supabase, y quien
decide qué puede hacer cada usuario son las políticas RLS (Row Level Security)
que evalúa Postgres del lado del servidor.

```
Navegador (React SPA servida por Vercel)
      |
      +-- Supabase JS  -->  Postgres  (datos, protegidos por RLS)
      |                -->  Auth      (sesión del administrador)
      |                -->  Storage   (imágenes, 4 buckets)
      |
      +-- EmailJS      -->  mail de contacto
```

---

## Arquitectura

Solo existen **dos rutas**:

| Ruta | Qué es |
|---|---|
| `/` | Sitio público: SPA de una sola página con 6 secciones ancladas |
| `/admin` | Panel de administración, detrás de login |

Cualquier otra ruta redirige a `/`. El panel se carga con `lazy()` + `Suspense`,
así un visitante común nunca descarga el código del administrador.

Las seis secciones del sitio se navegan por anchors desde la navbar fija:

| Sección | Anchor |
|---|---|
| Inicio | `#inicio` |
| Colección | `#coleccion` |
| Lookbook | `#lookbook` |
| Drops | `#drops` |
| Sobre VOLT | `#sobre` |
| Contacto | `#contacto` |

---

## Secciones del sitio público

### Inicio (`#inicio`)

Portada de la marca. Hero con el título a pantalla completa, una **cinta
animada tipo marquee** ("Alto Voltaje") que recorre el ancho, y botones que
llevan a Colección y a Drops.

Debajo, una grilla de **destacados con los últimos drops** cargados: cada card
muestra la foto, la categoría, el nombre y el badge de estado, con efecto de
hover. Los datos salen de la misma tabla que alimenta la sección Drops, así que
se actualizan solos cuando el administrador carga un lanzamiento nuevo.

### Colección (`#coleccion`)

El catálogo completo de productos, traído de la base de datos.

- **Filtro por categoría** (Hoodies, Tees, Pants, Accesorios, Cápsula) que se
  arma dinámicamente: solo se ofrecen las categorías que tienen al menos un
  producto cargado, así nunca aparece un filtro que devuelve una grilla vacía.
- El filtro activo se refleja en la URL como hash (`#hoodies`, `#tees`…), de
  modo que **el enlace es compartible**: mandar `…/#hoodies` abre el sitio ya
  filtrado. Se escribe con `history.replaceState`, para no llenar el historial
  del navegador de entradas por cada clic.
- Si el hash apunta a una categoría que ya no existe o que quedó vacía, cae de
  forma segura en "Todos".
- Cada card muestra foto, categoría, nombre y precio, con efecto de rollover.

### Lookbook (`#lookbook`)

Editorial de temporada sobre fondo negro. Cada **look** es una combinación de
prendas del catálogo — no textos sueltos: están relacionados por clave foránea
con la tabla de productos, así que un look siempre lista prendas que realmente
existen.

Cada card muestra la foto del look, su número (derivado del orden que define el
administrador) y el detalle de las prendas que lo componen.

### Drops (`#drops`)

Los lanzamientos de la marca, que es como trabaja VOLT: ediciones limitadas,
sin restock.

- Cada drop tiene un **badge de estado**: *Nuevo*, *Agotado* o *Próximo*.
- Arriba de la grilla, un bloque destacado con el **countdown en vivo** al
  próximo lanzamiento, que se actualiza cada segundo y cambia a "¡Ya está
  disponible!" cuando llega la fecha.
- La base de datos garantiza que un drop marcado como *próximo* tenga fecha: sin
  ella no habría countdown posible, así que la regla está declarada como
  restricción y no solo en el formulario.

### Sobre VOLT (`#sobre`)

Historia de la marca en layout de dos columnas: foto a un lado, texto al otro.
El texto se compone de una frase destacada (*lead*), una cantidad variable de
párrafos y una **grilla de valores** (Autenticidad, Calidad, Comunidad,
Movimiento), todos editables desde el panel.

### Contacto (`#contacto`)

Formulario de nombre, email y mensaje con **validación en el cliente** y envío
real a través de EmailJS: el mensaje llega efectivamente a la casilla de la
marca, sin necesidad de un servidor propio. Maneja estados de carga, de error
(sin conexión, demasiados intentos, servicio sin configurar) y de éxito.

Al costado, las redes sociales de la marca con su handle, que abren en pestaña
nueva.

### Elementos transversales

- **Navbar fija** con los seis enlaces y menú hamburguesa en móvil. Si hay
  sesión iniciada, aparece además un atajo a `/admin`.
- **Footer** con navegación, suscripción a la newsletter y redes sociales.
- **Popup de newsletter** que aparece 2,5 s después de entrar, **una sola vez
  por sesión** (se recuerda en `sessionStorage`), cerrable con `Escape` o
  haciendo clic afuera.

---

## Panel de administración (`/admin`)

Es la parte que hace que el sitio no dependa de un programador para
actualizarse.

### Acceso

**Solo se entra con una sesión iniciada.** Al abrir `/admin` la aplicación
consulta a Supabase Auth si existe una sesión válida:

- **Si no la hay**, se muestra la pantalla de **login** (email y contraseña).
  Los errores se traducen al español y **nunca revelan si lo que falló fue el
  email o la contraseña**; también se contempla el caso de demasiados intentos
  seguidos.
- **Si la hay**, se monta el panel directamente.

La sesión la guarda el navegador, así que **sobrevive a un refresh**, y se
mantiene sincronizada ante login, logout y renovación del token. La barra
superior muestra el email del usuario conectado, un enlace para volver al sitio
y el botón de salir.

El enlace a `/admin` solo se muestra en la navbar cuando hay sesión, pero eso
es **comodidad, no seguridad**: quien escriba la URL a mano llega igual a la
pantalla de login. Lo que realmente protege los datos son la sesión y las
políticas RLS de la base — ver [Seguridad](#seguridad).

### Qué se puede administrar

El panel tiene cuatro pestañas, cada una con alta, baja y modificación:

| Pestaña | Qué permite |
|---|---|
| **Colección** | ABM de productos: nombre, categoría, precio e imagen |
| **Lookbook** | ABM de looks: nombre, foto y **selección de prendas del catálogo** (agrupadas por categoría), más botones para **reordenar** los looks |
| **Drops** | ABM de lanzamientos: nombre, categoría, estado, fecha e imagen |
| **Sobre VOLT** | Edición del texto institucional: etiqueta, frase destacada, párrafos y valores (se agregan y eliminan de a uno), más la foto de la sección |

Las imágenes se suben a Supabase Storage desde el mismo formulario, con
previsualización antes de guardar. Todo lo que se guarda aparece en el sitio
público al recargar.

---

## Base de datos (Supabase)

El esquema vive en `supabase/migrations/` como **6 migraciones versionadas**:
la base se puede reconstruir desde cero con el CLI de Supabase.

```
categorias --+--< productos --< look_productos >-- looks
             +--< drops

sobre (fila única) --+--< sobre_parrafos
                     +--< sobre_valores
```

| Tabla | Contenido |
|---|---|
| `categorias` | Categorías compartidas por productos y drops |
| `productos` | Catálogo de la sección Colección |
| `drops` | Lanzamientos |
| `looks` | Looks editoriales del lookbook |
| `look_productos` | Relación muchos a muchos entre looks y productos |
| `sobre` | Texto institucional (fila única) |
| `sobre_parrafos` | Párrafos de la historia |
| `sobre_valores` | Valores de la marca |

### Decisiones de diseño

- **`categorias` como tabla propia.** Al principio la categoría era texto libre:
  nada impedía escribir "hoodies", "Hoodies" o "Hoddies" y que el drop quedara
  fuera de todo filtro. Con clave foránea ese error deja de ser posible, y de
  paso la misma tabla alimenta los desplegables del panel.
- **`look_productos` como relación N:M.** Un look combina varias prendas y una
  prenda aparece en varios looks. La clave primaria compuesta
  `(look_id, producto_id)` impide cargar dos veces la misma prenda en un look.
- **Reglas de negocio declaradas en la base**, no solo en el formulario — el
  formulario se puede saltear, la restricción no:
  - `check (estado in ('nuevo','agotado','proximo'))`
  - `check (estado <> 'proximo' or fecha is not null)` — un drop próximo necesita fecha
  - `check (precio >= 0)`
  - `check (id = 1)` en `sobre` — impide que existan dos filas
- **`on delete restrict` vs `on delete cascade`:** borrar una categoría con
  productos asociados se bloquea; borrar un look sí arrastra sus asociaciones.

### Seguridad

- **RLS activo en todas las tablas**, siempre con el mismo patrón: `select`
  abierto a `anon` (es contenido público del sitio) e `insert` / `update` /
  `delete` restringidos a `authenticated`.
- **Storage con las mismas reglas**, y cada política acotada por `bucket_id`
  para no abrir accidentalmente otros buckets del proyecto.
- Cuatro buckets (`drops`, `productos`, `lookbook`, `sobre`) con **límite de
  5 MB** por archivo y lista blanca de tipos MIME (JPG, PNG, WebP, AVIF). El
  cliente valida lo mismo antes de subir, pero solo para avisar rápido: **la
  validación que no se puede evadir es la del servidor.**
- La clave que viaja en el frontend (`anon key`) **es pública por diseño**:
  identifica al proyecto, no autoriza nada. La `service_role` nunca toca el
  frontend.

---

## Estructura del proyecto

```
src/
├── sections/     Secciones del sitio público (una carpeta por sección, con su CSS)
├── components/   Navbar, Footer, NewsletterPopup, IconoMarca
├── admin/        Panel: login, layout y una vista por pestaña, con sus formularios
├── hooks/        Un hook por dominio: useProductos, useDrops, useLookbook,
│                 useSobre, useSesion
├── lib/          Acceso a datos y servicios: supabase, productos, drops, lookbook,
│                 sobre, categorias, almacenamiento, contacto, errores
├── data/         Datos que no viven en la base (redes sociales)
└── styles/       global.css: paleta, tipografías, contenedor y utilidades
```

Convenciones que se repiten en todo el código:

- **Un hook por dominio**, todos con el mismo contrato `{ datos, cargando, error }`.
  Las secciones son presentación pura y no saben que existe Supabase.
- Cada hook usa una **bandera `vigente`** en el cleanup del efecto, para no
  escribir estado si el componente ya se desmontó.
- **`lib/errores.js` traduce los errores técnicos a mensajes accionables**:
  Supabase devuelve `violates check constraint "drops_fecha_requerida_para_proximo"`
  y el usuario lee *"Un drop próximo necesita fecha de lanzamiento"*.
- Las imágenes se suben con nombre `crypto.randomUUID()`, así dos archivos
  llamados `foto.jpg` nunca se pisan.
- Accesibilidad: `aria-label` en redes e íconos, `aria-current` en pestañas y
  filtros, `role="timer"` en el countdown, HTML semántico y `lang="es"`.

**Paleta y tipografías:** blanco, `#111111`, `#F5F5F5` y amarillo `#FFE500`;
Bebas Neue para títulos y Archivo para texto.

---

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y completar los valores (ver abajo)
npm run dev            # servidor de desarrollo
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | oxlint |

### Variables de entorno

Se copian de `.env.example` a `.env`. **El `.env` no se sube al repo**, así que
las mismas variables hay que cargarlas en Vercel (*Project Settings →
Environment Variables*).

| Variable | Dónde se obtiene |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS → Email Services |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS → Account → General |

Todas son públicas por diseño. Lo que limita el uso de EmailJS desde otro sitio
es la lista de dominios permitidos (*Account → Security*); lo que protege los
datos de Supabase son las políticas RLS.

Si faltan las variables de Supabase, el sitio no rompe: cada sección muestra un
aviso y `/admin` explica qué falta configurar.

---

## Despliegue

Push a `main` en GitHub → Vercel buildea y publica automáticamente.

`vercel.json` reescribe todas las rutas a `index.html`; sin eso, entrar directo
a `/admin` daría 404 en producción, porque el ruteo lo resuelve React del lado
del cliente.

---

## Alcance

Es un **sitio institucional/comercial con gestor de contenido propio**. No es un
e-commerce: no hay carrito, checkout, pasarela de pago ni control de stock — fue
una decisión de alcance deliberada.

Mejoras posibles a futuro: carrito y pasarela de pago, talles y stock,
optimización de imágenes (`srcset` y lazy loading), roles de usuario en el
panel, buscador y paginación en el catálogo, y tests automatizados.
