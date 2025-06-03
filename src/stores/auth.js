import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { signIn, signUp, signOut, getUser } from '@/api/supabase/authApi';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);


  async function login(email, password) {
    const { data, error } = await signIn(email, password);
    if (!error) user.value = data.user;
    else{
      user.value = null;
      if(error.message=="Email not confirmed"){
        error.message = "Revisa tu correo, debes confirmar que este email es tuyo antes de poder entrar en la aplicación";
      
        return { data: null, error: error };
        }
    }
    return { data, error };
  }

  async function register(email, password) {
    const { data, error } = await signUp(email, password);
    if (!error) {
      user.value = data.user;
    }
    return { data, error };
  }

  async function logout() {
    await signOut();
    user.value = null;
  }

  async function fetchUser() {
    if (!user.value) {
      const { data,error } = await getUser();
      user.value = data.user;
      return { data,error };
    }
    else return {data: user.value, error: null};
  }


  return { user, login, register, logout, fetchUser };
});