<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTasksStore } from "@/stores/tasks";
import { useEstadosStore } from "@/stores/estadoTarea";
import { useProjectsStore } from "@/stores/projects";
import { usePerfilStore } from "@/stores/perfil";
import ProjectBoard from "@/components/ProjectBoard.vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore); // user es reactivo

const storeTasks = useTasksStore();
const { tasks } = storeToRefs(storeTasks);
const { fetchTasks, addTask, editTask, removeTask } = storeTasks; // funciones

const storeEstados = useEstadosStore();
const { estados } = storeToRefs(storeEstados);
const { fetchEstados } = storeEstados;

const storeProject = useProjectsStore();
const { projects } = storeToRefs(storeProject);
const { fetchProjects } = storeProject;

const storePerfil = usePerfilStore();
const { perfilActual } = storeToRefs(storePerfil);
const { cargarPerfil } = storePerfil;
const router = useRouter();

const loading = ref(true);
const error = ref(null);
const verPorProyectos = ref(true);
const searchTerm = ref("");
const searchActive = ref(false);
const proyectoSeleccionado = ref('todos');
const mostrarFiltros = ref(true);
const filtroCompletadas = ref('todas'); // opciones: 'semana', 'mes', 'trimestre', 'todas'

function tareasProjecto(projectId){
  if(!tasks.value) return [];
  return tasks.value.filter(t => t.project_id === projectId)
}

function filtrarTareas(tareas) {
  if (!searchActive.value || !searchTerm.value.trim()) return tareas;
  const term = searchTerm.value.trim().toLowerCase();
  return tareas.filter(
    (t) =>
      t.name?.toLowerCase().includes(term) ||
      t.description?.toLowerCase().includes(term)
  );
}

const proyectosFiltrados = computed(() => {
  if (proyectoSeleccionado.value === 'todos') return projects.value;
  return projects.value.filter(p => p.id === proyectoSeleccionado.value);
});
function filtrarPorCompletadas(tareas) {
  if(!tareas) return [];
  const ahora = new Date();
  let desde = null;

  if (filtroCompletadas.value === 'semana') {
    desde = new Date(ahora);
    desde.setDate(ahora.getDate() - 7);
  } else if (filtroCompletadas.value === 'mes') {
    desde = new Date(ahora);
    desde.setMonth(ahora.getMonth() - 1);
  } else if (filtroCompletadas.value === 'trimestre') {
    desde = new Date(ahora);
    desde.setMonth(ahora.getMonth() - 3);
  }

  const tareaFiltrada= tareas.filter(t => {
    // Si la tarea NO está completada, siempre se muestra
    if (!t.completed_at) return true;
    // Si el filtro es "todas", muestra todas las completadas
    if (filtroCompletadas.value === 'todas') return true;
    // Si está completada, comprueba si entra en el rango
    const fecha = new Date(t.completed_at);
    return fecha >= desde;
  });
  return tareaFiltrada ||[];
}

async function cargarDatos() {
  if(user.value.id && perfilActual.value ){
  loading.value = true;
  await fetchEstados();
  await fetchProjects();
  const { data, error } = await fetchTasks();
  try {
    console.log("Tareas cargadas:");
  } catch (e) {
    //error.value = "Error al cargar los datos. "+ e;
  } finally {
    loading.value = false;
  }
}else{
  projects.value=undefined;
  perfilActual.value=undefined;
  tasks.value=undefined;
}
}
watch(user, (val) => {
 if(val) cargarDatos();
});

//onMounted(async ()=>cargarDatos);
</script>

<template>
  <div
    class="w-full min-w-[300px] sm:p-8 sm:rounded-xl sm:shadow-2xl max-w-6xl bg-white rounded-xl shadow-1xl p-3"
  >
    <h1 class="text-4xl font-extrabold text-center text-purple-700 mb-4">
      Mi Gestor de Tareas
    </h1>
    <div class="flex items-center justify-between mb-2">
  <div class="flex items-center gap-2">
    <button
    class="p-2 rounded-full hover:bg-purple-100 transition"
    @click="mostrarFiltros = !mostrarFiltros"
    :aria-label="mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'"
  >
  <span class="font-bold text-purple-700" v-if="mostrarFiltros">
          <!-- Flecha hacia la derecha (expandir) -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </span>
        <span v-else>
          <!-- Flecha hacia abajo (contraer) -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
          </svg>
        </span>
  </button>
    <span class="font-semibold text-lg text-purple-700">Configuración del panel</span>
  </div>
      <!-- Buscador -->
    <div class="flex gap-2 items-center">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar tareas..."
        class="border rounded px-2 py-1 text-sm w-32 md:w-48"
        @keyup.enter="searchActive = true"
      />
      <button class="px-3 py-1 bg-purple-600 text-white rounded text-sm" @click="searchActive = true">Buscar</button>
      <button v-if="searchActive" class="px-2 py-1 bg-gray-200 rounded text-xs" @click="() => { searchTerm = ''; searchActive = false; }">Limpiar</button>
    </div>
</div>
<!-- Capa de filtros-->
<transition name="fade">
  <div
    v-if="mostrarFiltros"
    class="grid grid-cols-4 gap-2 md:gap-4 mb-4 bg-purple-50 rounded-lg p-3 items-center"
  >
    <!-- 1ª columna: Texto del checkbox -->
    <span class="text-sm font-medium text-gray-900 dark:text-gray-300 text-left">
      Ver tareas por proyectos
    </span>
    <!-- 2ª columna: Checkbox -->
    <label class="inline-flex items-center cursor-pointer">
      <input type="checkbox" class="sr-only peer" v-model="verPorProyectos" />
      <div class="relative w-11 h-6 bg-purple-100 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-600"></div>
    </label>
    <!-- 1ª columna (siguiente fila): Texto del filtro completadas -->
    <span class="text-sm font-medium text-gray-900 dark:text-gray-300 text-left col-span-1 mt-2">
      Mostrar tareas completas:
    </span>
    <!-- 2ª columna (siguiente fila): Selector de tareas completadas -->
    <select v-model="filtroCompletadas" class="border rounded px-2 py-1 text-sm w-full mt-2">
      <option value="todas">Todas las tareas completadas</option>
      <option value="semana">Completadas esta semana</option>
      <option value="mes">Completadas este mes</option>
      <option value="trimestre">Completadas este trimestre</option>
    </select>
    <!-- 3ª columna: Texto del selector de proyecto -->
    <span class="text-sm font-medium text-gray-900 dark:text-gray-300 text-left">
      Filtrar por proyecto:
    </span>
    <!-- 4ª columna: Selector de proyecto -->
    <select v-model="proyectoSeleccionado" class="border rounded px-2 py-1 text-sm w-full">
      <option value="todos">Todos los proyectos</option>
      <option v-for="project in projects" :key="project.id" :value="project.id">
        {{ project.name }}
      </option>
    </select>



  </div>
</transition>
    
    <div
  v-if="verPorProyectos && proyectosFiltrados && proyectosFiltrados.length > 0"
  class="flex flex-col gap-8 w-full items-center"
>
  <ProjectBoard
    v-for="project in proyectosFiltrados"
    :key="project.id"
    :project="project"
    :projects="projects"
    :estados="estados"
    :tasks="filtrarPorCompletadas(filtrarTareas(tareasProjecto(project.id)))"
    :user="user"
    @add-task="addTask"
    @edit-task="editTask"
    @remove-task="removeTask"
  />
</div>
    <div v-else class="flex flex-col gap-8 w-full items-center">
  <ProjectBoard
    :project="proyectoSeleccionado === 'todos'
      ? { id: 'all', name: 'Todas tus tareas' }
      : projects.find(p => p.id === proyectoSeleccionado)"
    :projects="projects"
    :estados="estados"
    :tasks="filtrarPorCompletadas(filtrarTareas(
  proyectoSeleccionado === 'todos'
    ? tasks
    : tasks.filter(t => t.project_id === proyectoSeleccionado)
))"
    :user="user"
    @add-task="addTask"
    @edit-task="editTask"
    @remove-task="removeTask"
  />
</div>
  </div>
</template>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}</style>