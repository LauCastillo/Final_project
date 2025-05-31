import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchUsersByProject, getPerfilesDisponibles, addUserProject, removeUserProject } from '@/api/supabase/userProjectApi';


export const useUserProjectStore = defineStore('useUserProjectStore', () => {
  const projectUsers = ref([]);
  const perfilesDisponibles = ref([]);
  async function fetchProjectUsers(project_id) {
    const { data, error } = await fetchUsersByProject(project_id);
    if (!error) projectUsers.value = data;
    return { data, error };
  }

  async function fetchPerfilesDisponibles() {
     const { data, error } =await getPerfilesDisponibles()
     if (!error) perfilesDisponibles.value =data;
  }

  async function addUserToProject({userId, projectId}) {
    const { data, error } =await addUserProject( userId, projectId );
    if(!error) {
          await fetchProjectUsers(projectId);
    }

  }

  async function removeUserFromProject({userProjectId, projectId}) {
    const { data, error } =await removeUserProject(userProjectId);
    if(!error) {
      const idx = projectUsers.value.findIndex(u => u.id === userProjectId);
      if (idx !== -1) projectUsers.value.splice(idx, 1);
    }
    //await fetchProjectUsers(projectId);
  }

  
  return {
    projectUsers,
    perfilesDisponibles,
    fetchProjectUsers,
    fetchPerfilesDisponibles,
    addUserToProject,
    removeUserFromProject
  };
});