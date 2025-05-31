import { supabase } from './index';

// Obtener usuarios de un proyecto con perfil
export async function fetchUsersByProject(project_id) {
  const { data, error } = await supabase
    .from('user_project')
    .select(`
      id,
      perfil:perfil_id (
        id,
        Nombre,
        user_id
      )
    `)
    .eq('project_id', project_id);

  return { data, error };
}


/*  export async function addUserToProject(userId, projectId) {
  return await supabase.from('user_project').insert([{ perfil_id: userId, project_id: projectId }]);
}*/
// Añadir usuario a proyecto
export async function addUserProject( userId, projectId ) {
const { data, error }=await supabase.from('user_project')
.insert([{ perfil_id:userId, project_id:projectId }])
return { data, error };
}
// Quitar usuario de proyecto
/*export async function removeUserFromProject(id) {
  return await supabase.from('user_project').delete().eq('id', id);
}*/
export async function removeUserProject(userProjectId) {
  const { data, error }=await supabase.from('user_project').delete().eq('id', userProjectId);
  return { data, error };
}
export async function getPerfilesDisponibles() {
  const { data, error } = await supabase
    .from('perfil')
    .select('id, Nombre, user_id')
    .not('user_id', 'is', null)
    .order('Nombre', { ascending: true });

  return { data, error };
}