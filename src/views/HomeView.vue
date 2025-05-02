<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';

const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
const router = useRouter();

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

const navigateTo = (route) => {
  router.push(route);
};
</script>

<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <div v-if="isLoading" class="text-center py-10">
        <div class="w-16 h-16 border-4 border-gray-300 border-t-[var(--color-tertiary)] rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-lg">Loading authentication...</p>
      </div>
      
      <div v-else>
        <!-- Authenticated User Welcome -->
        <div v-if="isAuthenticated" class="mb-8">
          <div class="flex items-center space-x-4 mb-4">
            <img v-if="user?.picture" :src="user.picture" alt="Profile" class="w-16 h-16 rounded-full">
            <div v-else class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-xl font-bold">{{ user?.name?.[0]?.toUpperCase() || 'U' }}</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold">Welcome back, {{ user?.name || 'User' }}!</h1>
              <p class="text-gray-600">{{ user?.email }}</p>
            </div>
          </div>
          
          <p class="text-lg mb-6">What would you like to do today?</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              @click="navigateTo('/recipe')"
              class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] p-6 rounded-lg text-center transition-colors"
            >
              <i class="pi pi-file text-2xl mb-2"></i>
              <h3 class="text-xl font-semibold">Browse Recipes</h3>
              <p class="text-sm mt-2">Discover new recipes or check your saved ones</p>
            </button>
            
            <button 
              @click="navigateTo('/groceries')"
              class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] p-6 rounded-lg text-center transition-colors"
            >
              <i class="pi pi-shopping-cart text-2xl mb-2"></i>
              <h3 class="text-xl font-semibold">Groceries</h3>
              <p class="text-sm mt-2">Manage your grocery lists</p>
            </button>
            
            <button 
              @click="navigateTo('/meal-plan')"
              class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] p-6 rounded-lg text-center transition-colors"
            >
              <i class="pi pi-calendar text-2xl mb-2"></i>
              <h3 class="text-xl font-semibold">Meal Planning</h3>
              <p class="text-sm mt-2">Plan your meals for the week</p>
            </button>
          </div>
        </div>
        
        <!-- Guest User Welcome -->
        <div v-else class="mb-8">
          <h1 class="text-3xl font-bold mb-4">Welcome to Recipe App!</h1>
          
          <div class="bg-[var(--color-secondary)] p-6 rounded-lg mb-8">
            <h2 class="text-xl font-semibold mb-2">Sign in to unlock all features</h2>
            <p class="mb-4">Create meal plans, save your favorite recipes, manage grocery lists, and more!</p>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="handleLogin"
                class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] py-2 px-6 rounded text-center transition-colors"
              >
                Log In
              </button>
              
              <button 
                @click="handleSignUp"
                class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] py-2 px-6 rounded text-center transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-xl font-semibold mb-3">Browse Recipes</h2>
              <p class="mb-3">Discover new recipes without signing in</p>
              <button 
                @click="navigateTo('/recipe')"
                class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] py-2 px-4 rounded text-center transition-colors"
              >
                Browse Recipes
              </button>
            </div>
            
            <div>
              <h2 class="text-xl font-semibold mb-3">Ask Questions</h2>
              <p class="mb-3">Get help with cooking or recipe questions</p>
              <button 
                @click="navigateTo('/chat')"
                class="bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] py-2 px-4 rounded text-center transition-colors"
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
