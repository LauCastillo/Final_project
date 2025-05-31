import { supabase } from './index';

// Crear proyecto
export async function createProject({ name, description }) {
  const { data, error } = await supabase
    .from('project')
    .insert([{ name, description }])
    .select()
    .single();
  return { data, error };
}

// Obtener todos los proyectos del usuario actual
export async function getProjects(userId) {
  const { data, error } = await supabase
    .from('project')
    .select('*,user_project(project_id, perfil(id, Nombre, user_id))')
    .eq('user_id', userId)
    
    .order('created_at', { ascending: false });
  return { data, error };
}

// Obtener proyectos con usuarios y perfiles del usuario actual
export async function getProjectsWithUsers(userId) {
  const { data, error } = await supabase
    .from('project')
    .select(`
      *,
      user_project (
        id,
        perfil:perfil_id (
          id,
          Nombre,
          user_id
        )
      )
    `)
    .eq('user_id', userId);

  return { data, error };
}

// Actualizar proyecto
export async function updateProject(id, updates) {
  const { data, error } = await supabase
    .from('project')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Eliminar proyecto
export async function removeProject(id) {
  const { error } = await supabase
    .from('project')
    .delete()
    .eq('id', id);

  return { error };
}

// Obtener proyectos asociados al perfil del usuario
export async function getProjectsByPerfil(perfilId) {
  // 1. Obtener los project_id asociados al perfil
  const { data: userProjects, error: userProjectsError } = await supabase
    .from('user_project')
    .select('project_id,project(id, name, description, created_at)')
    .eq('perfil_id', perfilId);
    
  if (userProjectsError) return { data: [], error: userProjectsError };

  return { data: userProjects, error: userProjectsError };
}