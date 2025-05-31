import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

// Adjust the import path as necessary

//{ path: '/', component: HomeView, meta: { requiresAuth: true } },
const routes = [
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/register', component: () => import('@/views/RegisterView.vue') },
  { path: '/perfil', component: () => import('@/views/PerfilView.vue'), meta: { requiresAuth: true } },
  { path: '/projects', component: () => import('@/views/ProjectsView.vue'), meta: { requiresAuth: true } },
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore); // user es reactivo
  const { fetchUser } = authStore; // funciones
  if (!user.value)
    await fetchUser();
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!user.value) return next('/login');
  }
  else if (user.value && (to.path === '/login' || to.path === '/register')) {
    // Si ya está autenticado y trata de acceder a login o register, redirige a home
    return next('/');
  }
  next();
});

export default router;