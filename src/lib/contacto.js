import emailjs from '@emailjs/browser'

// EmailJS manda el mail desde el navegador, sin backend propio. La clave
// publica solo identifica la cuenta: quien limita el uso es la lista de
// dominios permitidos que se configura en el panel de EmailJS.

const servicio = import.meta.env.VITE_EMAILJS_SERVICE_ID
const plantilla = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const clavePublica = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const emailConfigurado = Boolean(servicio && plantilla && clavePublica)

// Los nombres de las claves tienen que coincidir con las variables {{...}}
// de la plantilla creada en EmailJS.
export async function enviarConsulta({ nombre, email, mensaje }) {
  if (!emailConfigurado) {
    throw new Error('emailjs-sin-configurar')
  }

  await emailjs.send(
    servicio,
    plantilla,
    { nombre, email, mensaje },
    { publicKey: clavePublica },
  )
}

// EmailJS devuelve un objeto { status, text } en ingles. Lo traducimos a algo
// accionable para quien esta completando el formulario.
export function traducirErrorEmail(error) {
  if (error?.message === 'emailjs-sin-configurar') {
    return 'El formulario todavía no está configurado. Escribinos por redes mientras tanto.'
  }

  if (error?.status === 429) {
    return 'Recibimos demasiados mensajes seguidos. Probá de nuevo en unos minutos.'
  }

  if (error?.status === 0 || error?.message?.toLowerCase().includes('failed to fetch')) {
    return 'No pudimos conectarnos. Revisá tu internet e intentá de nuevo.'
  }

  return 'No pudimos enviar tu mensaje. Intentá de nuevo o escribinos por redes.'
}
