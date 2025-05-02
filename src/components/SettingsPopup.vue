<script setup>
import IconButton from './IconButton.vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

const handleLogin = () => {
  loginWithRedirect();
};

const handleSignUp = () => {
  loginWithRedirect({
    authorizationParams: {
      screen_hint: 'signup'
    }
  });
};

const handleLogout = () => {
  logout({ 
    logoutParams: {
      returnTo: window.location.origin 
    }
  });
};

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-lg w-[360px] max-w-[90vw] max-h-[80vh] overflow-y-auto shadow-lg" @click.stop>
      <div class="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold m-0">Settings</h2>
        <IconButton icon="times" @click="$emit('close')" />
      </div>
      
      <div class="p-4 border-b border-gray-200">
        <h3 class="mt-0 mb-3 text-base font-medium">Account</h3>
        <div v-if="!isAuthenticated">
          <button class="block w-full py-2 px-4 mb-2 bg-[var(--color-tertiary)] text-black border-none rounded cursor-pointer text-sm hover:bg-[var(--color-tertiary-hover)]" @click="handleLogin">Log in</button>
          <button class="block w-full py-2 px-4 mb-2 bg-[var(--color-tertiary)] text-black border-none rounded cursor-pointer text-sm hover:bg-[var(--color-tertiary-hover)]" @click="handleSignUp">Create account</button>
        </div>
        <div v-else>
          <div class="flex items-center mb-3">
            <img v-if="user?.picture" :src="user.picture" alt="Profile" class="w-10 h-10 rounded-full mr-3">
            <div>
              <p class="font-medium m-0">{{ user?.name }}</p>
              <p class="text-sm text-gray-500 m-0">{{ user?.email }}</p>
            </div>
          </div>
          <button class="block w-full py-2 px-4 mb-2 bg-gray-200 text-black border-none rounded cursor-pointer text-sm hover:bg-gray-300" @click="handleLogout">Log out</button>
        </div>
      </div>
      
      <div class="p-4 border-b border-gray-200">
        <h3 class="mt-0 mb-3 text-base font-medium">App Settings</h3>
        <div class="flex justify-between items-center mb-3">
          <span>Notifications</span>
          <input type="checkbox" />
        </div>
        <div class="flex justify-between items-center mb-3">
          <span>Auto-save recipes</span>
          <input type="checkbox" checked />
        </div>
        <div class="flex justify-between items-center mb-3">
          <span>Show nutritional info</span>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  </div>
</template>