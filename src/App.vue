<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './stores/auth'
const { user, logout, fetchUser } = useAuth()
const router = useRouter()

fetchUser() // Opcional: para cargar el usuario al iniciar la app

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header v-if="user">
    <div class="wrapper">
      <HelloWorld class="logo" />
      <nav>
                <RouterLink to="/">Inicio</RouterLink>
        <RouterLink v-if="!user" to="/login">Iniciar sesión</RouterLink>
        <RouterLink v-if="!user" to="/register">Registrarse</RouterLink>
        <RouterLink v-if="user" to="/home">Home</RouterLink>
        <a v-if="user" href="#" @click.prevent="handleLogout">Cerrar sesión</a>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
