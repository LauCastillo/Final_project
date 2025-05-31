import { supabase } from './index';

// Registro de usuario y creación de perfil
export async function signUp(email, password) {
  // 1. Registro en Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
   
  });

  if (error || !data.user) return { error };

  return { data, error };
}

// Login de usuario y obtención de perfil
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error };

  // Obtener perfil
  const { data: perfil, error: perfilError } = await supabase
    .from('perfil')
    .select('*')
    .eq('user_id', data.user.id)
    .single();

  return { data, error };
}

// Logout de usuario
export async function signOut() {
  return await supabase.auth.signOut();
}

// Obtener usuario actual
export function getUser() {
  return supabase.auth.getUser();
}