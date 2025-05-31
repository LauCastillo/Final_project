<script setup>
import { ref } from "vue";
const props = defineProps({
  task: Object,
  estadoColumn: Object,
  estados: Array
});
const emit = defineEmits(["edit-task", "remove-task", "change-status"]);
const showMenu = ref(false);

function changeStatus(newStatus) {
  emit("change-status", {original:props.task,updated: { ...props.task,status: newStatus, completed_at : newStatus === 3? new Date().toISOString(): null }});
  showMenu.value = false;
}

function handleEdit() {
  emit("edit-task", props.task, { ...props.task });
}
</script>

<template>
  <div
    name="card-tarea"
    class="flex flex-col p-4 mb-3 rounded-lg shadow-sm border bg-gray-100 border-gray-300 cursor-pointer hover:bg-purple-50 transition"
    @click="handleEdit"
  >
    <div class="flex items-center justify-between mb-2">
      <p class="text-lg font-medium text-gray-800">{{ task.name }}</p>
      <button
        class="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors duration-200"
        title="Eliminar tarea"
        @click.stop="emit('remove-task', task.id)"
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
    <div class="flex justify-end space-x-2 relative">
      <div class="relative">
        <button
          @click.stop="showMenu = !showMenu"
          class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
        >
          Cambiar estado
        </button>
        <div v-show="showMenu" class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <button
            v-for="estado in estados"
            :key="estado.id"
            @click.stop="changeStatus(estado.id)"
            class="block w-full text-left px-4 py-2 hover:bg-blue-100"
            v-show="estado.id !== task.status"
          >
            {{ estado.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button { text-transform: capitalize; }
</style>