<script setup>
import { ref, watch, computed } from 'vue';
import UserProjectManager from './UserProjectManager.vue';

const props = defineProps({
  show: Boolean,
  project: Object,
  projectUsers: Array,
  perfilesDisponibles: Array
});
const emit = defineEmits(['save', 'close', 'addUser', 'deleteUser']);

const isEdit = computed(() => !!props.project);

const form = ref({ name: '', description: '' });

watch(
  () => props.project,
  (p) => {
    form.value = p ? { ...p } : { name: '', description: '' };
  },
  { immediate: true }
);


function handleSubmit() {
  emit('save', { ...form.value });
}
function addUser(userId) {
  if (props.project && userId) {
    emit('addUser', { userId, projectId: props.project.id });
  }
}

function removeUser(userProjectId) {
  if (props.project && userProjectId) {
    emit('deleteUser', { userProjectId, projectId: props.project.id });
  }
}
</script>
<template>
  <div v-if="show" class="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" @click="$emit('close')">&times;</button>
      <h2 class="font-bold mb-4">{{ isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h2>
      <form @submit.prevent="handleSubmit">
        <label class="block mb-2">Nombre</label>
        <input v-model="form.name" class="border rounded px-3 py-2 w-full mb-4" required />
        <label class="block mb-2 font-semibold">Descripción</label>
        <textarea v-model="form.description" class="border rounded px-3 py-2 w-full mb-4" />
      
      <!-- Gestión de usuarios solo si es edición -->
      <div v-if="isEdit">
        <hr class="my-4" />
        <UserProjectManager 
            :project="props.project" 
            :projectUsers="projectUsers"
            :perfilesDisponibles="perfilesDisponibles"
            @addUser="addUser"
            @deleteUser="removeUser"
          />
      </div>
      <div class="flex justify-end gap-2 mb-1 mt-6">
          <button type="submit" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
        </div>
    </form>
    </div>
  </div>
</template>

<style scoped>
.bg-white.bg-opacity-40{
  background-color: rgba(255, 255, 255, 0.7);
}
</style>