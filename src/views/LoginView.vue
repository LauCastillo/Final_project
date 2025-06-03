<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const isLogin = ref(true);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore); // user es reactivo
const { login, register, logout, fetchUser } = authStore; // funciones
const router = useRouter();

async function onSubmit() {
  error.value = "";
  if (isLogin.value) {
    const { error: err } = await login(email.value, password.value);
    if (err) error.value = err.message;
    else {
      (email.value = ""), (password.value = ""), router.push("/");
    }
  } else {
    const { error: err } = await register(
      email.value,
      password.value,
      name.value
    );
    if (err) error.value = err.message;
    else {
      (email.value = ""), (password.value = ""), router.push("/perfil");
    }
  }
}
</script>
<template>
  <div
    className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 font-sans text-gray-900 p-6 flex flex-col items-center justify-center"
  >
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-4">
        Bienvenido
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Inicia sesión o regístrate para acceder a tus tareas.
      </p>
      <p
        className="p-3 mb-4 rounded-lg text-center bg-red-100 text-red-700"
        v-if="error"
      >
        {{ error }}
      </p>
      <form @submit.prevent="onSubmit">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Correo Electrónico
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
            v-model="email"
            type="email"
            placeholder="tu@ejemplo.com"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
            v-model="password"
            type="password"
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <button
            class="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 w-full"
            type="submit"
          >
            {{ isLogin ? "Iniciar sesión" : "Registrarse" }}
          </button>
          <button
            type="button"
            class="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 w-full"
            @click="isLogin = !isLogin"
          >
            {{
              isLogin
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

