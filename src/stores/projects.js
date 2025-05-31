import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { getProjectsByPerfil, createProject,updateProject, removeProject } from '@/api/supabase/projectsApi';
import { useAuthStore } from "@/stores/auth";
import { usePerfilStore } from "@/stores/perfil";
import { useUserProjectStore } from "@/stores/userProject.js";


export const useProjectsStore = defineStore('projects', () => {

  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const storePerfil = usePerfilStore();
  const { perfilActual } = storeToRefs(storePerfil);
  const { cargarPerfil } = storePerfil;
  const projects = ref([]);
  const userProjectStore = useUserProjectStore();
  const { addUserToProject } = userProjectStore;

  async function fetchProjects() {

    if (!user.value) return { data: [], error: null };
    if (!perfilActual.value?.id) {
      const { data, error } = await cargarPerfil(user.value.id);
      if (error) return { data: [], error };
    }
    if (!perfilActual.value) return { data: [], error: null };
    const { data, error } = await fetchProjectsByPerfil(perfilActual.value.id);
    return { dataProject: data, errorProject: error };
  }

  async function fetchProjectsByPerfil(perfilId) {
    const { data, error } = await getProjectsByPerfil(perfilId);
    if (!error) {
      projects.value = data.map(p => p.project);;
    }
    return { data: data.map(p => p.project), error };
  }

  async function addProject(project) {
    if(!project.description) project.description = '';
    const { data, error } = await createProject(project);
       if (!error && data) {
      addUserToProject({userId:perfilActual.value.id, projectId:data.id});
      projects.value.unshift(data);
    }
    return { data, error };
  }

  async function editProject(id, updates) {
    const { data, error } = await updateProject(id, updates);
    if (!error && data) {
      const idx = projects.value.findIndex(p => p.id === id);
      if (idx !== -1) projects.value[idx] = data;
    }
    return { data, error };
  }

  async function deleteProject(id) {
    const { error } = await removeProject(id);
    if (!error) projects.value = projects.value.filter(p => p.id !== id);
    return { error };
  }

  return {
    projects,
    fetchProjects,
    fetchProjectsByPerfil,
    addProject,
    editProject,
    deleteProject
  };
});