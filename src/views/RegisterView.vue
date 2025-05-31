
<script setup>
import { ref } from 'vue';
import { useAuth } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const { register } = useAuth();
const router = useRouter();

async function onRegister() {
  const { error: err } = await register(email.value, password.value);
  if (err) error.value = err.message;
  else router.push('/');
}
</script>
<template>
  <form @submit.prevent="onRegister">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Contraseña" required />
    <button type="submit">Registrarse</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
