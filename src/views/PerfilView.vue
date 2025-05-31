<script setup>
import { ref, onMounted } from "vue";
import { usePerfilStore } from "@/stores/perfil";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";


const perfilStore = usePerfilStore();
const { perfilActual }= storeToRefs(perfilStore);
const router = useRouter();

const loadingPerfil = ref(true);

onMounted(async () => {
  loadingPerfil.value = false;
  if (!perfilActual.value) {
    router.push("/home");
  }
});
</script>

<template>
  <div>
    <!-- Capa de carga -->
    <div
      v-if="loadingPerfil"
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <img
        src="@/assets/loading.svg"
        alt="Cargando..."
        class="w-24 h-24 mb-4"
      />
      <span class="text-gray-500">Cargando perfil...</span>
    </div>
    <!-- Capa si NO hay perfil -->
    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <img src="@/assets/logo.svg" alt="Bienvenido" class="w-32 h-32 mb-4" />
      <h2 class="text-2xl font-bold text-purple-700 mb-2">¡Bienvenido!</h2>
      <p class="text-gray-600 mb-4">
        Por favor, crea tu perfil para comenzar a usar la aplicación.
      </p>

    </div>
  </div>
</template>