import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getPerfilByUserId, updatePerfilById, createPerfil } from '@/api/supabase/perfilApi';

export const usePerfilStore = defineStore('perfil', () => {
  const perfilActual = ref({});

  // Crear el perfil del usuario
  async function crearPerfil(userId, name) {
    if (!userId) return { data: null, error: 'No userId provided' };
    const { data, error } = await createPerfil({ user_id: userId, Nombre: name });
    if (!error) perfilActual.value = data;
    return { data, error };
  }

  // Cargar el perfil del usuario autenticado solo si no está en memoria
  async function cargarPerfil(userId, force = false) {
   if(userId && perfilActual.value?.id) {
      return { data: perfilActual.value, error: null };
    }
    if (!userId) return { data: null, error: 'No userId provided' };
    // Si ya está cargado y no se fuerza la recarga, no vuelvas a pedirlo
    if (!force && perfilActual.value?.id && perfilActual.value.user_id === userId) {
      return { data: perfilActual.value, error: null };
    }
    const { data, error } = await getPerfilByUserId(userId);
    if (!error) perfilActual.value = data;;
    return { data, error };
  }

  // Actualizar el perfil
  async function actualizarPerfil(updates) {
        debugger;
    if (!perfilActual.value) return { data: null, error: 'No perfil loaded' };
    const { data, error } = await updatePerfilById(perfilActual.value.id, updates);
    if (!error) perfilActual.value = data;
    return { data, error };
  }

  return { perfilActual, cargarPerfil, actualizarPerfil, crearPerfil };
});