<script setup>
import { ref } from "vue";
import TaskColumn from "./TaskColumn.vue";
import TaskCreate from "@/components/TaskCreate.vue";

const props = defineProps({
  project: Object,
  projects: Array,
  estados: Array,
  tasks: Array,
  user: Object
});

const emit = defineEmits(['add-task', "edit-task", "remove-task"]);
const expanded = ref(true);
const showTaskPopup = ref(false);
const taskToEdit = ref(null);

function openCreateTask() {
  taskToEdit.value = null;
  showTaskPopup.value = true;
}
function openEditTask(task) {
  taskToEdit.value = task;
  showTaskPopup.value = true;
}
function closeTaskPopup() {
  showTaskPopup.value = false;
  taskToEdit.value = null;
}
function addTask(task) {
  emit("add-task", task);
  closeTaskPopup();
}
function editTask(original, updated) {
  const updates = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      updates[key] = updated[key];
    }
  }
  if (Object.keys(updates).length) {
    emit("edit-task", original.id, updates );
  }
  closeTaskPopup();
}
function toggleExpand() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="w-full max-w-6xl mb-6">
    <div class="flex mb-4">
      <button
        @click="toggleExpand"
        class="px-3 py-1 font-bold text-purple-700 rounded transition flex items-center"
        :aria-label="expanded ? 'Contraer' : 'Expandir'"
      >
        <span class="font-bold text-purple-700" v-if="expanded">
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
      <h2 class="text-2xl font-bold text-purple-700">
        {{ project?.name || "Proyecto" }}
      </h2>
      <button
        @click="openCreateTask"
        class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
        aria-label="Añadir Tarea"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span class="font-bold">Añadir Tarea</span>
      </button>
    </div>
    <TaskCreate
      v-if="showTaskPopup"
      :show="showTaskPopup"
      :userId="user?.id"
      :projects="projects"
      :estados="estados"
      :projectId="project?.id"
      :task="taskToEdit"
      @add-task="addTask"
      @edit-task="editTask"
      @close="closeTaskPopup"
    />
    <transition name="fade">
      <div v-show="expanded" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          v-for="estado in estados"
          :key="estado.id"
          :estadoColumn="estado"
          :estados="estados"
          :tasks="tasks.filter((t) => t.status === estado.id)"
          @edit-task="openEditTask"
          @remove-task="(taskId) => emit('remove-task', taskId)"
          @change-status="({original,updated})=>editTask(original,updated)"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0.7;
}
</style>