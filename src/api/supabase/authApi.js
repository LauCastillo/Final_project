import { supabase } from './index';

// Registro de usuario
export async function signUp(email, password,name) {
  return await supabase.auth.signUp({ email, password,
    options: {
      data: { username:name, display_name:name

       }
    } });
}

// Login de usuario
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// Logout de usuario
export async function signOut() {
  return await supabase.auth.signOut();
}

// Obtener usuario actual
export function getUser() {
  return supabase.auth.getUser();
}