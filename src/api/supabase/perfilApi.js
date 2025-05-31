import { supabase } from './index';

// Obtiene el perfil por el user_id de auth
export async function getPerfilByUserId(userId) {
  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}

 // Obtener perfil
 /* const { data: perfil, error: perfilError } = await supabase
    .from('perfil')
    .select('*')
    .eq('user_id', data.user.id)
    .single();*/

// Actualiza el perfil por id
export async function updatePerfilById(perfilId, updates) {
  const { data, error } = await supabase
    .from('perfil')
    .update(updates)
    .eq('id', perfilId)
    .single();
  return { data, error };
}

// Crea un nuevo perfil
export async function createPerfil({ user_id, Nombre }) {
  const { data, error } = await supabase
    .from('perfil')
    .insert([{ user_id, Nombre }])
    .select()
    .single();
  return { data, error };
}
