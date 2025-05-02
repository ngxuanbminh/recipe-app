import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

export const useAuthStore = defineStore('auth', () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  
  const token = ref(null);
  const userProfile = computed(() => user.value);
  const isLoggedIn = computed(() => isAuthenticated.value);
  const loading = computed(() => isLoading.value);

  // Get the token when the user is authenticated
  watch(isAuthenticated, async (newIsAuthenticated) => {
    if (newIsAuthenticated) {
      try {
        token.value = await getAccessTokenSilently();
      } catch (error) {
        console.error('Error getting token:', error);
      }
    } else {
      token.value = null;
    }
  }, { immediate: true });

  return {
    userProfile,
    isLoggedIn,
    loading,
    token
  };
});