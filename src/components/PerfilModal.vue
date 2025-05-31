<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  perfil: Object,
  modo: {
    type: String,
    default: 'editar' // o 'crear'
  }
});
const emit = defineEmits(['close', 'save']);

const nombre = ref('');

watch(
  () => [props.show, props.perfil, props.modo],
  ([show, perfil, modo]) => {
    if (show) {
      if (modo === 'editar' && perfil) {
        nombre.value = perfil.Nombre || '';
      } else {
        nombre.value = '';
      }
    }
  },
  { immediate: true }
);

async function save() {
  if (!nombre.value.trim()) return;
  emit('save', { Nombre: nombre.value });
}

function close() {
  emit('close');
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" @click="close">&times;</button>
      <h2 class="font-bold mb-4">
        {{ modo === 'crear' ? 'Crear Perfil' : 'Editar Perfil' }}
      </h2>
      <form @submit.prevent="save">
        <label class="block mb-2 font-semibold">Nombre</label>
        <input v-model="nombre" class="border rounded px-3 py-2 w-full mb-4" required />
        <button type="submit" class="ml-auto px-3 py-1 bg-purple-600 text-white rounded transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center">Guardar</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.bg-white.bg-opacity-40{
  background-color: rgba(255, 255, 255, 0.7);
}
</style>