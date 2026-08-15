import { createClient } from '@supabase/supabase-js'

// La clave publica identifica al proyecto, no autoriza: lo que protege los
// datos son las politicas RLS, que Postgres evalua del lado del servidor.

const url = import.meta.env.VITE_SUPABASE_URL
const clavePublica = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && clavePublica)

export const supabase = supabaseConfigurado ? createClient(url, clavePublica) : null
