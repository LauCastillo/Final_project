import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useAuth } from '@/stores/auth'; // Importa el store

 // Adjust the import path as necessary

const routes = [
  { path: '/login',  component: () => import('@/views/LoginView.vue') },
  { path: '/register',  component: () => import('@/views/RegisterView.vue') },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/', component: HomeView, meta: { requiresAuth: true } }
 
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global
router.beforeEach(async (to, from, next) => {
  const { user, fetchUser } = useAuth();

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Si el usuario aún no está cargado, intenta cargarlo
    if (!user.value) {
      await fetchUser();
    }
    // Si sigue sin usuario, redirige a login
    if (!user.value) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;