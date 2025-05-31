import { supabase } from './index';

// Crear estado
export async function createEstado({ id, nombre }) {
  const { data, error } = await supabase
    .from('estado')
    .insert([{ id, nombre }])
    .select()
    .single();
  return { data, error };
}

// Obtener todos los estados
export async function getEstados() {
  const { data, error } = await supabase
    .from('estado')
    .select('*')
    .order('id', { ascending: true });
  return { data, error };
}

// Actualizar estado
export async function updateEstado(id, updates) {
  const { data, error } = await supabase
    .from('estado')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Eliminar estado
export async function deleteEstado(id) {
  const { error } = await supabase
    .from('estado')
    .delete()
    .eq('id', id);
  return { error };
}