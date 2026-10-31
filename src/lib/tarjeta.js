// Validaciones de tarjeta que en una integracion real hace el formulario de la
// pasarela (Mercado Pago, Stripe…). Aca se hacen en el cliente y a la base
// solo viajan la marca y los ultimos 4 digitos: el numero completo nunca sale
// del navegador.

export const TARJETAS_DE_PRUEBA = {
  aprobada: '4242 4242 4242 4242',
  rechazada: '4000 0000 0000 0002',
}

const MARCAS = [
  { nombre: 'Visa', patron: /^4/, largos: [13, 16, 19], cvv: 3 },
  { nombre: 'Mastercard', patron: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/, largos: [16], cvv: 3 },
  { nombre: 'American Express', patron: /^3[47]/, largos: [15], cvv: 4 },
]

export function soloDigitos(texto) {
  return texto.replace(/\D/g, '')
}

export function detectarMarca(numero) {
  const digitos = soloDigitos(numero)
  return MARCAS.find((marca) => marca.patron.test(digitos)) ?? null
}

// Agrupa de a 4 (Amex va 4-6-5), como esta impreso en el plastico.
export function formatearNumero(numero) {
  const digitos = soloDigitos(numero).slice(0, 19)
  if (detectarMarca(digitos)?.nombre === 'American Express') {
    return [digitos.slice(0, 4), digitos.slice(4, 10), digitos.slice(10, 15)].filter(Boolean).join(' ')
  }
  return digitos.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatearVencimiento(texto) {
  const digitos = soloDigitos(texto).slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos
}

// Algoritmo de Luhn: el digito verificador que tienen todas las tarjetas.
// Detecta casi cualquier error de tipeo antes de mandar nada.
function pasaLuhn(digitos) {
  let suma = 0
  for (let i = 0; i < digitos.length; i++) {
    let digito = Number(digitos[digitos.length - 1 - i])
    if (i % 2 === 1) {
      digito *= 2
      if (digito > 9) digito -= 9
    }
    suma += digito
  }
  return suma % 10 === 0
}

export function validarTarjeta({ numero, titular, vencimiento, cvv }) {
  const errores = {}
  const digitos = soloDigitos(numero)
  const marca = detectarMarca(digitos)

  if (!marca) errores.numero = 'Aceptamos Visa, Mastercard y American Express.'
  else if (!marca.largos.includes(digitos.length) || !pasaLuhn(digitos))
    errores.numero = 'Revisá el número de la tarjeta.'

  if (titular.trim().length < 3) errores.titular = 'Ingresá el nombre como figura en la tarjeta.'

  const [mes, anio] = vencimiento.split('/').map(Number)
  if (!mes || !anio || mes > 12) {
    errores.vencimiento = 'Usá el formato MM/AA.'
  } else {
    // La tarjeta vence el ultimo dia del mes impreso.
    const finDeMes = new Date(2000 + anio, mes, 1)
    if (finDeMes <= new Date()) errores.vencimiento = 'La tarjeta está vencida.'
  }

  if (soloDigitos(cvv).length !== (marca?.cvv ?? 3)) errores.cvv = 'Código inválido.'

  return errores
}
