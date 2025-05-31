<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProjectsStore } from '@/stores/projects';
import { useUserProjectStore } from '@/stores/userProject';
import ProjectModal from '@/components/ProjectModal.vue';

const store = useProjectsStore();
const { projects } = storeToRefs(store);
const { addProject, editProject, deleteProject, fetchProjects } = store;


const projectUsersStore = useUserProjectStore();
const { projectUsers,perfilesDisponibles } = storeToRefs(projectUsersStore);
const { fetchProjectUsers, addUserToProject, removeUserFromProject,fetchPerfilesDisponibles } = projectUsersStore; // funciones

const showProjectModal = ref(false);
const projectToEdit = ref(null);

onMounted(()=>{
  fetchProjects();
  fetchPerfilesDisponibles()
}
);
/*
function openUserManager(project) {
  selectedProject.value = project;
  showUserManager.value = true;
}*/

function openCreateProject() {
  projectToEdit.value = null;
  showProjectModal.value = true;
}

function openEditProject(project) {
  projectUsersStore.fetchProjectUsers(project.id);
  projectToEdit.value = project;
  showProjectModal.value = true;
}

async function handleSaveProject(project) {
  if (projectToEdit.value) {
    await editProject(projectToEdit.value.id, { name: project.name });
  } else {
    await addProject({ name: project.name, description: project.description });
  }
  showProjectModal.value = false;
}
</script>

<template>

    <div class="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-8 mb-8">
      <h1 class="text-4xl font-extrabold text-center text-purple-700 mb-4">Gestión de tus Proyectos</h1>
      <button @click="openCreateProject" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">Nuevo Proyecto</button>
      <div class="flex flex-wrap gap-4 w-full mt-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="flex-1 min-w-[250px] max-w-xs flex flex-col p-4 mb-3 rounded-lg shadow-sm border bg-gray-100 border-gray-300 cursor-pointer hover:bg-purple-50 transition"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-lg mb-2">{{ project.name }}</span>
            <button @click="deleteProject(project.id)"
              class="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
              title="Eliminar proyecto">
              <!-- icono de eliminar -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
          <div class="mt-auto flex gap-2">
            <button @click="openEditProject(project)" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">Editar</button>
          </div>
        </div>
      </div>
      <ProjectModal
  :show="showProjectModal"
  :project="projectToEdit"
  :projectUsers="projectUsers"
  :perfilesDisponibles="perfilesDisponibles"
  @addUser="addUserToProject"
  @deleteUser="removeUserFromProject"
  @save="handleSaveProject"
  @close="showProjectModal = false"
/>
    </div>
</template>