import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { createTask, getTasksByProjectIds, updateTaskById, removeTaskById } from '@/api/supabase/tasksApi';
import { useProjectsStore } from "@/stores/projects";
export const useTasksStore = defineStore('tasks', () => {


  const storeProject = useProjectsStore();
  const { projects } = storeToRefs(storeProject);
  const { fetchProjects } = storeProject
  const tasks = ref([]);


    // Comprobar si ya tenemos todas las tareas de los proyectos solicitados
  function hasTasksForProjects(projectIds) {
    if (!tasks ||tasks.value || !tasks.value.length) return [];
    const existingProjectIds = new Set(tasks.value.map(t => t.project_id));
    return projectIds.every(id => existingProjectIds.has(id));
  }

  async function fetchTasksByProjects(projectIds, force = false) {
    
    if (!force && hasTasksForProjects(projectIds)) {
      // Ya tenemos las tareas en el store
      return { data: tasks.value, error: null };
    }
    const { data, error } = await getTasksByProjectIds(projectIds);
    if (!error) tasks.value = data;
    return { data, error };
  }

  // Crear una nueva tarea
    async function addTask(task) {

    const { data, error } = await createTask(task);
    if (!error && data) {
      tasks.value.push(data);
    }
    return { data, error };
  }

   // Editar una tarea
  async function editTask(id, updates) {
    const { data, error } = await updateTaskById(id, updates);
    if (!error && data) {
      // Actualiza la tarea en el estado local
      const idx = tasks.value.findIndex(t => t.id === id);
      if (idx !== -1) tasks.value[idx] = data;
    }
    return { data, error };
  }
    // Eliminar una tarea
  async function removeTask(id) {
    const { error } = await removeTaskById(id);
    if (!error) {
      tasks.value = tasks.value.filter(t => t.id !== id);
    }
    return { error };
  }

  async function fetchTasks(force=false) {
    if(tasks.value && !force) return {data:tasks.value,error:null}
    const { dataProject, errorProject }=await fetchProjects(force);
    if (dataProject.length === 0)return { data: [], error: null };
    const projectIds = projects.value.map(p => p.id);
    const { data, error }= await fetchTasksByProjects(projectIds,force);
    if (!error) tasks.value = data;
    return { data, error };
  }
  return { tasks, fetchTasksByProjects,fetchTasks ,addTask, editTask, removeTask };
});