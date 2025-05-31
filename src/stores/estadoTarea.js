import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getEstados, createEstado, updateEstado, deleteEstado } from '@/api/supabase/statusApi';

export const useEstadosStore = defineStore('estados', () => {
const estados = ref([]);


  async function fetchEstados() {
    const { data, error } = await getEstados();
    if (!error) estados.value = data;
    return { data, error };
  }

  async function addEstado(estado) {
    const { data, error } = await createEstado(estado);
    if (!error && data) estados.value.push(data);
    return { data, error };
  }

  async function editEstado(id, updates) {
    const { data, error } = await updateEstado(id, updates);
    if (!error && data) {
      const idx = estados.value.findIndex(e => e.id === id);
      if (idx !== -1) estados.value[idx] = data;
    }
    return { data, error };
  }

  async function removeEstado(id) {
    const { error } = await deleteEstado(id);
    if (!error) estados.value = estados.value.filter(e => e.id !== id);
    return { error };
  }

  return { estados, fetchEstados, addEstado, editEstado, removeEstado };

});