<script setup>
import RecipeCard from '@/components/RecipeCard.vue'
import { ref, computed, onMounted } from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import favRecipesApi from '@/services/favRecipesApi'
import myRecipesApi from '@/services/myRecipesApi'
import axios from 'axios'

// Accept navbar truncated state from parent
defineProps({
  navbarTruncated: {
    type: Boolean,
    default: false,
  },
})

// Empty arrays for recipe data
const favoriteRecipes = ref([])
const myRecipes = ref([])
const databaseRecipes = ref([])
const isLoading = ref(false)

// Compute whether to show "Show More" buttons
const showMoreFavorites = computed(() => favoriteRecipes.value.length > 6)
const showMoreMyRecipes = computed(() => myRecipes.value.length > 6)

// Limit visible recipes to 6
const visibleFavorites = computed(() => favoriteRecipes.value.slice(0, 6))
const visibleMyRecipes = computed(() => myRecipes.value.slice(0, 6))

onMounted(async () => {
  try {
    isLoading.value = true

    // Fetch recipes from both sources simultaneously
    const [favResponse, myRecipesResponse] = await Promise.all([
      favRecipesApi.getAllFavorites(),
      myRecipesApi.getAllRecipes(),
    ])

    console.log('API Responses:', {
      favResponse: favResponse.data,
      myRecipesResponse: myRecipesResponse.data,
    })

    // JSON-Server returns data directly, not nested under property names
    favoriteRecipes.value = Array.isArray(favResponse.data)
      ? favResponse.data
      : favResponse.data['fav-recipes'] || []
    myRecipes.value = Array.isArray(myRecipesResponse.data)
      ? myRecipesResponse.data
      : myRecipesResponse.data['my-recipes'] || []

    const response = await axios.get('api/recipes/random', {
      params: {
        apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY,
        number: 6,
      },
    })
    databaseRecipes.value = response.data.recipes
    console.log('Database Recipes:', databaseRecipes.value)
  } catch (error) {
    console.error('Error fetching recipes:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="recipe-view bg-[var(--color-primary)] h-full w-full overflow-y-auto">
    <!-- Content container with padding -->
    <div class="py-6 pl-6">
      <!-- Favorite Recipes Section -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <i class="pi pi-star text-xl"></i>
          <h2 class="headline-small m-0">Favorite</h2>
        </div>

        <!-- Show loading spinner while loading is true -->
        <div v-if="isLoading" class="flex items-center justify-center h-[150px]">
          <PulseLoader :loading="isLoading" color="#4f46e5" size="15" />
        </div>

        <div
          class="flex flex-nowrap gap-4 overflow-x-auto pb-2 w-full scroll-smooth touch-pan-x scrollbar-hide"
        >
          <!-- Recipe Cards (when available) -->
          <RecipeCard
            v-for="recipe in visibleFavorites"
            :key="recipe.id"
            :title="recipe.title"
            :image="recipe.image"
            class="flex-none w-[200px] h-[150px]"
          />

          <!-- Add Recipe Button -->
          <div
            class="flex-none w-[200px] h-[150px] flex items-center justify-center bg-[var(--color-tertiary)] rounded-xl cursor-pointer hover:bg-[var(--color-tertiary-hover)]"
          >
            <i class="pi pi-plus text-2xl text-gray-400"></i>
          </div>

          <!-- Show More Button (only if more than 6 recipes) -->
          <div
            v-if="showMoreFavorites"
            class="flex items-center justify-center w-20 h-[150px] flex-shrink-0"
          >
            <button
              class="w-12 h-12 rounded-full bg-[#f3effb] flex items-center justify-center hover:bg-[#e8def8]"
            >
              <i class="pi pi-arrow-right text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- My Recipes Section -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <i class="pi pi-user text-xl"></i>
          <h2 class="headline-small m-0">My Recipe</h2>
        </div>

        <!-- Show loading spinner while loading is true -->
        <div v-if="isLoading" class="flex items-center justify-center h-[150px]">
          <PulseLoader :loading="isLoading" color="#4f46e5" size="15" />
        </div>

        <div
          class="flex flex-nowrap gap-4 overflow-x-auto pb-2 w-full scroll-smooth touch-pan-x scrollbar-hide"
        >
          <!-- Recipe Cards (when available) -->
          <RecipeCard
            v-for="recipe in visibleMyRecipes"
            :key="recipe.id"
            :title="recipe.title"
            :image="recipe.image"
            class="flex-none w-[200px] h-[150px]"
          />

          <!-- Add Recipe Button -->
          <div
            class="flex-none w-[200px] h-[150px] flex items-center justify-center bg-[var(--color-tertiary)] rounded-xl cursor-pointer hover:bg-[var(--color-tertiary-hover)]"
          >
            <i class="pi pi-plus text-2xl text-gray-400"></i>
          </div>

          <!-- Show More Button (only if more than 6 recipes) -->
          <div
            v-if="showMoreMyRecipes"
            class="flex items-center justify-center w-20 h-[150px] flex-shrink-0"
          >
            <button
              class="w-12 h-12 rounded-full bg-[#f3effb] flex items-center justify-center hover:bg-[#e8def8]"
            >
              <i class="pi pi-arrow-right text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Database Recipes Section -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <i class="pi pi-database text-xl"></i>
          <h2 class="headline-small m-0">Database</h2>
        </div>

        <!-- Show loading spinner while loading is true -->
        <div v-if="isLoading" class="flex items-center justify-center h-[150px]">
          <PulseLoader :loading="isLoading" color="#4f46e5" size="15" />
        </div>

        <div
          class="flex flex-nowrap gap-4 overflow-x-auto pb-2 w-full scroll-smooth touch-pan-x scrollbar-hide"
        >
          <!-- Recipe Cards (when available) -->
          <RecipeCard
            v-for="recipe in databaseRecipes"
            :key="recipe.id"
            :title="recipe.title"
            :image="recipe.image"
            class="flex-none w-[200px] h-[150px]"
          />

          <!-- Show More Button (only if more than 6 recipes) -->
          <div class="flex items-center justify-center w-20 h-[150px] flex-shrink-0">
            <button
              class="w-12 h-12 rounded-full bg-[#f3effb] flex items-center justify-center hover:bg-[#e8def8]"
            >
              <i class="pi pi-search text-xl text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
