<script setup>
import { ref,computed} from 'vue';

const props = defineProps({
  project: { type: Object, required: true },
  projectUsers: { type: Array, required: true },
  perfilesDisponibles: { type: Array, required: true }
});
const emit = defineEmits(['addUser', 'deleteUser']);

const newUserId = ref('');

const perfilesEnProyectoIds = computed(() =>
  props.projectUsers.map(u => u.perfil?.id)
);

const perfilesParaAgregar = computed(() =>
  props.perfilesDisponibles.filter(
    perfil => !perfilesEnProyectoIds.value.includes(perfil.id)
  )
);

function handleAddUser() {
  if (!newUserId.value) return;
  emit('addUser', newUserId.value);
  newUserId.value = '';
}

function handleRemoveUser(userProjectId) {

  emit('deleteUser', userProjectId);
}
</script>

<template>
  <div>
    <h2 class="font-bold mb-2">Usuarios del proyecto: {{ project?.name }}</h2>
    <div class="flex flex-wrap gap-4 w-full mb-4">
      <div
        v-for="user in projectUsers"
        :key="user.id"
        class="flex-1 min-w-[220px] max-w-xs bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between"
      >
        <div>
          <span class="font-semibold">{{ user.perfil?.Nombre || 'Sin nombre' }}</span>
          <span class="block text-gray-500 text-xs">{{ user.perfil?.users?.email }}</span>
        </div>
        <button type="button" v-show="projectUsers.length > 1"
        class="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
        title="Quitar usuario"
        @click="handleRemoveUser(user.id)"
      >
        <!-- icono de eliminar -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>

      </div>
    </div>
    <div v-if="perfilesParaAgregar.length" class="flex gap-2 mt-2">
      <select v-model="newUserId" class="p-1 border rounded text-sm">
        <option value="" disabled>Selecciona un usuario</option>
        <option v-for="perfil in perfilesParaAgregar" :key="perfil.id" :value="perfil.id">
          {{ perfil.Nombre }}
        </option>
      </select>

      <button type="button" @click="handleAddUser" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">Añadir usuario</button>
    </div>
  </div>
</template>