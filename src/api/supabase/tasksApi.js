import { supabase } from './index';

// Crear tarea { name, description, status, user_id, project_id }
export async function createTask_old(task) {
    
    const { name, description, status, user_id, project_id } = task;
  const { data, error } = await supabase
    .from('tareas')
    .insert([{ name, description, status, user_id, project_id }])
    .select()
    .single();
  return { data, error };
}
export async function createTask(task) {
  const { data, error } = await supabase
    .from('tareas')
    .insert([task])
    .select()
    .single();
  return { data, error };
}

// Obtener tareas por usuario y/o proyecto
export async function getTasks({ user_id}) {
  let query = supabase.from('tareas').select('*,project(id,user_project(project_id))');
  if (user_id) query = query.eq('user_id', user_id);
  //if (project_id) query = query.eq('project_id', project_id);
  query = query.order('created_at', { ascending: false });
  const { data, error } = await query;
  return { data, error };
}

// Obtener tareas por IDs de proyecto
export async function getTasksByProjectIds(projectIds) {
  if (!projectIds.length) return { data: [], error: null };
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .in('project_id', projectIds);
  return { data, error };
}

// Actualizar tarea
export async function updateTaskById(taskId, updates) {
  const { data, error } = await supabase
    .from('tareas')
    .update(updates)
    .eq('id', taskId).select('*')
    .single();
  return { data, error };
}

// Eliminar tarea
export async function removeTaskById(taskId) {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id', taskId);
  return { error };
}