import { supabase } from './supabase'

// Las comparten productos y drops, por eso viven en su propio modulo.

export async function listarCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, slug, nombre')
    .order('orden')

  if (error) throw error
  return data
}
