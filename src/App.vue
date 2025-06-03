<script setup>
import { ref, watch, onMounted, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs, getActivePinia } from "pinia";
import { usePerfilStore } from "@/stores/perfil";
import { useProjectsStore } from "@/stores/projects";
import { useTasksStore } from "@/stores/tasks";
import { useEstadosStore } from "@/stores/estadoTarea";

import PerfilModal from "@/components/PerfilModal.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { logout, fetchUser } = authStore;

const perfilStore = usePerfilStore();
const { perfilActual } = storeToRefs(perfilStore);
const { cargarPerfil, crearPerfil } = perfilStore;

const storeTasks = useTasksStore();
const { tasks } = storeToRefs(storeTasks);
const { fetchTasks, addTask, editTask, removeTask } = storeTasks; // funciones

const storeEstados = useEstadosStore();
const { estados } = storeToRefs(storeEstados);
const { fetchEstados } = storeEstados;

const storeProject = useProjectsStore();
const { projects } = storeToRefs(storeProject);
const { fetchProjects } = storeProject;


const showPerfil = ref(false);
const modoPerfil = ref("editar");
const showUserMenu = ref(false);
const router = useRouter();

if (!user.value?.id) fetchUser();
if (!perfilActual.value) {
  comprobarPerfil(user.value.id);
}

async function comprobarPerfil(userId) {

  if (!userId) router.push("/login");
  const { data } = await cargarPerfil(userId);
  if (!data) {
    modoPerfil.value = "crear";
    showPerfil.value = true;
  }
  else{
    await fetchEstados();
  await fetchProjects();
  debugger;
  const { data, error } = await fetchTasks(true);
  }

}
function cleanStore(){
user.value=null;
perfilActual.value=null;
projects.value=null;
tasks.value=null;
}
watch(user, (val) => {
  if (val) comprobarPerfil(val.id);
  else cleanStore();
});
onBeforeMount(() => {
  if (user.value && !perfilActual.value) {
    comprobarPerfil(user.value.id);
  }
})
onMounted(() => {
  debugger;
  if (user.value && !perfilActual.value) {
    comprobarPerfil(user.value.id);
  }
});

async function handleSavePerfil(perfilData) {
  // Crear o actualizar perfil según el modo
  const { data, error } = await crearPerfil(user.value.id, perfilData.Nombre);
  if (!error && data) {
    showPerfil.value = false;
    if (modoPerfil.value === "crear") {
      await addProject({
        name: "Mis tareas personales",
        description: "Proyecto personal",
      });
    }
    showPerfil.value = false;
  }
}

async function handleLogout() {
  showUserMenu.value = false; 
  mobileMenuOpen.value = false;
  await logout();
cleanStore()

  router.push("/login");
}

function abrirModalPerfil() {
  mobileMenuOpen.value = false;
  showUserMenu.value = false;
  if (perfilActual.value && perfilActual.value.id) {
    modoPerfil.value = "editar";
  } else {
    modoPerfil.value = "crear";
  }
  showPerfil.value = true;
}

const mobileMenuOpen = ref(false);
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}
</script>

<template>
  <div class="flex flex-col items-center pt-20">
    <header
      v-if="user"
      class="w-full max-w-6xl bg-blue-50 rounded-xl shadow-2xl p-4 mb-8 bg-blue-100 fixed top-0 w-full z-50"
    >
      <!-- NAV Responsive -->
      <nav class="flex items-center justify-between">
        <!-- Logo o título -->
        <span class="font-bold text-purple-700 text-xl">Gestor Proyectos</span>
        <!-- Botón hamburguesa solo en móvil -->
        <button
          class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          @click="toggleMobileMenu"
          aria-label="Abrir menú"
        >
          <svg
            v-if="!mobileMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <!-- Menú de navegación -->
        <div class="hidden md:flex flex-row gap-4 items-center">
          <RouterLink
            v-if="user"
            to="/"
            class="router-link-active ml-2 rounded-full bg-purple-200 px-3 py-1"
            >Home</RouterLink
          >
          <RouterLink
            v-if="user"
            to="/projects"
            class="router-link-active ml-2 rounded-full bg-purple-200 px-3 py-1"
            >Proyectos</RouterLink
          >
          <div class="relative">
            <button
              v-if="user"
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-200 hover:bg-purple-300 transition cursor-pointer"
            >
              <span class="font-semibold text-purple-800">{{
                perfilActual?.Nombre || user.email
              }}</span>
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 flex flex-col"
              @click="showUserMenu = false"
            >
              <button
                class="text-left px-4 py-2 hover:bg-purple-100"
                @click.stop="
                  abrirModalPerfil
                "
              >
                Editar perfil
              </button>
              <button
                class="text-left px-4 py-2 hover:bg-purple-100"
                @click="handleLogout">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <!-- Menú móvil -->
      <transition name="fade">
        <div v-if="mobileMenuOpen" class="md:hidden flex flex-col gap-2 mt-4 bg-white rounded shadow p-4">
          <RouterLink
            v-if="user"
            to="/"
            class="router-link-active rounded-full bg-purple-200 px-3 py-2"
            @click="mobileMenuOpen = false"
            >Home</RouterLink
          >
          <RouterLink
            v-if="user"
            to="/projects"
            class="router-link-active rounded-full bg-purple-200 px-3 py-2"
            @click="mobileMenuOpen = false"
            >Proyectos</RouterLink
          >
    <div>
      <button
        @click="showUserMenu = !showUserMenu"
        class="flex items-center gap-2 w-full px-3 py-2 rounded-full bg-purple-200 hover:bg-purple-300 transition cursor-pointer"
      >
        <span class="font-semibold text-purple-800">{{ perfilActual?.Nombre || user.email }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-if="showUserMenu" class="flex flex-col mt-1">
        <button
          class="text-left px-4 py-2 hover:bg-purple-100"
          @click="abrirModalPerfil"
        >Editar perfil</button>
        <button
          class="text-left px-4 py-2 hover:bg-purple-100"
          @click="handleLogout">Cerrar sesión</button>
      </div>
    </div>
        </div>
      </transition>
    </header>
    <RouterView />
    <PerfilModal
      :show="showPerfil"
      :perfil="modoPerfil === 'editar' ? perfilActual : null"
      :modo="modoPerfil"
      @close="showPerfil = false"
      @save="handleSavePerfil"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.router-link-active {
  color: var(--color-blue-700);
  background-color: var(--color-purple-200);
}
.router-link-active:hover {
  color: var(--color-blue-100);
  background-color: var(--color-purple-500);
}
nav .router-link-exact-active {
  color: var(--color-blue-100);
  background-color: var(--color-purple-700);
}
nav .router-link-exact-active:hover {
  color: var(--color-blue-100);
  background-color: var(--color-purple-500);
}
</style>
