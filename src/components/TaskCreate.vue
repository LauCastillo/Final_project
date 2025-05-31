<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  userId: String,
  projects: Array,
  estados: Array,
  projectId: String, // Puede ser null
  task: Object // Si se pasa, es edición
});
const emit = defineEmits(['add-task', 'edit-task', 'close']);

const isEdit = computed(() => !!props.task);

const form = ref({
  name: '',
  description: '',
  status: props.estados?.[0]?.id || '',
  project_id: props.projectId || ''
});

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.value = {
        name: task.name,
        description: task.description,
        status: task.status,
        project_id: task.project_id
      };
    }
  },
  { immediate: true }
);

function handleSubmit() {
  if (isEdit.value) {
    emit('edit-task', props.task, { ...props.task, ...form.value });
  } else {
    emit('add-task', { ...form.value });
  }
  emit('close');
}
</script>

<template>
  <div class="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" @click="$emit('close')">&times;</button>
      <h2 class="text-2xl font-bold mb-4">{{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
      <form @submit.prevent="handleSubmit">
        <label class="block mb-2 font-semibold">Nombre</label>
        <input v-model="form.name" class="border rounded px-3 py-2 w-full mb-4" required />

        <label class="block mb-2 font-semibold">Descripción</label>
        <textarea v-model="form.description" class="border rounded px-3 py-2 w-full mb-4" />

        <label class="block mb-2 font-semibold">Estado</label>
        <select v-model="form.status" class="border rounded px-3 py-2 w-full mb-4" required>
          <option v-for="estado in estados" :key="estado.id" :value="estado.id">
            {{ estado.name }}
          </option>
        </select>

        <!-- Selector de proyectos si no hay project_id o si es edición -->
        <div v-if="projectId=='all' || isEdit">
          <label class="block mb-2 font-semibold">Proyecto</label>
          <select v-model="form.project_id" class="border rounded px-3 py-2 w-full mb-4" required>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">
          {{ isEdit ? 'Guardar Cambios' : 'Crear Tarea' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bg-white.bg-opacity-40{
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
