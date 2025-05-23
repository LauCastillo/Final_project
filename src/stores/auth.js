import { ref } from 'vue';
import { signIn, signUp, signOut, getUser } from '../api/supabase/authApi';

const user = ref(null);

export function useAuth() {
  async function login(email, password) {
    const { data, error } = await signIn(email, password);
    if (!error) user.value = data.user;
    return { data, error };
  }

  async function register(email, password,name) {
    const { data, error } = await signUp(email, password, name);
    if (!error) user.value = data.user;
    return { data, error };
  }

  async function logout() {
    await signOut();
    user.value = null;
  }

  async function fetchUser() {
    const { data } = await getUser();
    user.value = data.user;
  }

  return { user, login, register, logout, fetchUser };
}