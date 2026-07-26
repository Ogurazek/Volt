// Catálogo estático de VOLT. Sin backend: el sitio es institucional/de leads,
// no un e-commerce, así que los productos viven como datos locales.

export const categorias = [
  { slug: 'hoodies', nombre: 'Hoodies' },
  { slug: 'tees', nombre: 'Tees' },
  { slug: 'pants', nombre: 'Pants' },
  { slug: 'accesorios', nombre: 'Accesorios' },
]

export const productos = [
  { id: 1, nombre: 'Voltaje Hoodie', categoriaSlug: 'hoodies', precio: 68000 },
  { id: 2, nombre: 'Amp Hoodie', categoriaSlug: 'hoodies', precio: 72000 },
  { id: 3, nombre: 'Blackout Hoodie', categoriaSlug: 'hoodies', precio: 70000 },
  { id: 4, nombre: 'Circuito Tee', categoriaSlug: 'tees', precio: 32000 },
  { id: 5, nombre: 'Static Tee', categoriaSlug: 'tees', precio: 30000 },
  { id: 6, nombre: 'Grid Tee', categoriaSlug: 'tees', precio: 31000 },
  { id: 7, nombre: 'Corriente Cargo', categoriaSlug: 'pants', precio: 58000 },
  { id: 8, nombre: 'Amperio Pants', categoriaSlug: 'pants', precio: 62000 },
  { id: 9, nombre: 'Gorra Voltio', categoriaSlug: 'accesorios', precio: 22000 },
  { id: 10, nombre: 'Medias Chispa', categoriaSlug: 'accesorios', precio: 12000 },
]
