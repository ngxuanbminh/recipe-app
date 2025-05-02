<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import favRecipesApi from '@/services/favRecipesApi';
import myRecipesApi from '@/services/myRecipesApi';
import IconButtonRound from '@/components/IconButtonRound.vue';

const route = useRoute();
const recipeId = route.params.id;
const recipe = ref(null);
const loading = ref(true);
const error = ref(null);
const toast = useToast();
const measurementSystem = ref('metric'); // Default to metric system

// Scaling functionality
const showScaleSlider = ref(false);
const scaleFactor = ref(1); // Default scale factor is 1x (unchanged)
const originalServings = ref(0); // Store original servings count
const appliedScaleFactor = ref(1); // Store the confirmed scale factor

onMounted(async () => {
  loading.value = true;
  console.log('Recipe detail - Starting to fetch data for recipe ID:', recipeId);
  
  try {
    // Try to find recipe in my recipes
    try {
      const myRecipesResponse = await myRecipesApi.getAllRecipes();
      
      const myRecipes = Array.isArray(myRecipesResponse.data)
        ? myRecipesResponse.data
        : myRecipesResponse.data['my-recipes'] || [];
      
      const foundRecipe = myRecipes.find(r => r.id.toString() === recipeId.toString());
      
      if (foundRecipe) {
        recipe.value = foundRecipe;
        originalServings.value = foundRecipe.servings; // Store original servings
        loading.value = false;
        return;
      } else {
        console.log('Recipe detail - Recipe not found in My Recipes');
      }
    } catch (error) {
      console.error("Error fetching from my recipes:", error);
    }

    // Try to find recipe in favorite recipes
    try {
      const favResponse = await favRecipesApi.getAllFavorites();
      
      const favRecipes = Array.isArray(favResponse.data)
        ? favResponse.data
        : favResponse.data['fav-recipes'] || [];
      
      const foundRecipe = favRecipes.find(r => r.id.toString() === recipeId.toString());
      
      if (foundRecipe) {
        // console.log('Recipe detail - Found recipe in Favorite Recipes:', foundRecipe);
        recipe.value = foundRecipe;
        originalServings.value = foundRecipe.servings; // Store original servings
        loading.value = false;
        return;
      } else {
        console.log('Recipe detail - Recipe not found in Favorite Recipes');
      }
    } catch (error) {
      console.error("Error fetching from favorite recipes:", error);
    }

    // If not found in local data, try fetching from API
    try {
      // Use relative path to leverage Vite's proxy configuration
      const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
      
      const response = await axios.get(`/api/recipes/${recipeId}/information`, {
        params: {
          apiKey: apiKey,
        }
      });
      recipe.value = response.data;
      originalServings.value = response.data.servings; // Store original servings
      loading.value = false;
    } catch (apiError) {
      console.error("Error fetching from Spoonacular API:", apiError);
      error.value = "Failed to load recipe details from database";
      loading.value = false;
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    error.value = "Failed to load recipe details";
    loading.value = false;
  }
});

// Function to toggle between metric and US measurement systems
function toggleMeasurementSystem() {
  measurementSystem.value = measurementSystem.value === 'metric' ? 'us' : 'metric';
}

// Toggle scale slider visibility
function toggleScaleSlider() {
  showScaleSlider.value = !showScaleSlider.value;
}

// Reset scale to original (1x)
function resetScale() {
  scaleFactor.value = 1;
}

// Apply the current scale and hide the slider
function applyScale() {
  appliedScaleFactor.value = scaleFactor.value;
  toast.success(`Recipe scaled to ${formatScaleFactor(scaleFactor.value)}`, {
    timeout: 2000,
  });
  showScaleSlider.value = false;
}

// Computed value for scaled servings
const scaledServings = computed(() => {
  if (!recipe.value || !originalServings.value) return 0;
  return Math.round((originalServings.value * scaleFactor.value) * 100) / 100;
});

// Update scale factor when slider changes
function updateScaleFactor(event) {
  scaleFactor.value = parseFloat(event.target.value);
}

// Format scale factor to 2 decimal places for display
function formatScaleFactor(value) {
  return `x${parseFloat(value).toFixed(2)}`;
}

// Get the correct measurement for an ingredient based on the current system and scale factor
function getIngredientMeasure(ingredient) {
  let measureData;
  
  if (!ingredient.measures) {
    measureData = {
      amount: ingredient.amount,
      unit: ingredient.unit
    };
  } else {
    const measure = ingredient.measures[measurementSystem.value];
    if (!measure) {
      measureData = {
        amount: ingredient.amount,
        unit: ingredient.unit
      };
    } else {
      measureData = {
        amount: measure.amount,
        unit: measure.unitShort || measure.unitLong || ''
      };
    }
  }
  
  // Apply scaling factor to the amount
  measureData.amount = parseFloat((measureData.amount * scaleFactor.value).toFixed(2));
  
  return measureData;
}

function addToGroceries() {
  // Use toast notification instead of alert
  toast.success(`Added "${recipe.value?.title || 'Recipe'}" to groceries!`, {
    icon: "pi pi-shopping-cart",
  });
}
</script>

<template>
  <div class="recipe-detail-view bg-[var(--color-primary)] p-2 h-full w-full overflow-y-auto">
    <!-- Loading state with pulse loader -->
    <div v-if="loading" class="flex flex-col justify-center items-center h-full">
      <PulseLoader :loading="loading" color=var(--color-tertiary) size="15px" />
      <div class="text-xl mt-4">Loading recipe details...</div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="flex justify-center items-center h-full">
      <div class="text-red-500 text-xl">{{ error }}</div>
    </div>
    
    <!-- Recipe content -->
    <div v-else-if="recipe" class="pb-16">
      <!-- Recipe Hero Image -->
      <div 
        class="w-full h-[240px] bg-cover bg-center rounded-lg relative" 
        :style="{ backgroundImage: recipe.image ? `url(${recipe.image})` : 'none' }"
      >
        <!-- <div class="absolute inset-0 bg-black bg-opacity-30"></div> -->
        
        <!-- Header actions and back button -->
        <div class="absolute top-4 w-full flex items-center justify-between px-4">
          <RouterLink to="/recipe">
            <IconButtonRound icon="arrow-left" />
          </RouterLink>
          
          <div class="flex space-x-2">
            <IconButtonRound icon="heart" />
            <IconButtonRound icon="ellipsis-v" />
          </div>
        </div>
        
        <!-- Recipe title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t rounded-lg from-black/70 to-transparent text-white">
          <h1 class="headline-large font-bold">{{ recipe.title }}</h1>
        </div>
      </div>
      
      <!-- Recipe info -->
      <div class="p-4 flex items-center gap-3 justify-left">
        <!-- Servings -->
        <div class="flex items-center bg-[var(--color-secondary)] px-[10px] py-[5px] rounded-lg border border-[var(--color-tertiary)]">
          <i class="pi pi-users mr-2"></i>
          <span class="label-large">{{ scaledServings }} </span>
        </div>
        
        <!-- Ready time -->
        <div class="flex items-center bg-[var(--color-secondary)] px-[10px] py-[5px] rounded-lg border border-[var(--color-tertiary)]">
          <i class="pi pi-clock mr-2"></i>
          <span class="label-large">{{ recipe.readyInMinutes }} mins</span>
        </div>
        
        <!-- Action buttons -->
        <button 
          @click="toggleMeasurementSystem" 
          class="flex items-center bg-[var(--color-tertiary)] px-[10px] py-[5px] rounded-lg cursor-pointer"
        >
          <i class="pi pi-sliders-h mr-2"></i>
          <span class="label-large"> {{ measurementSystem === 'metric' ? 'Metric' : 'US' }}</span>
        </button>
        <button 
          @click="toggleScaleSlider" 
          class="flex items-center bg-[var(--color-tertiary)] px-[10px] py-[5px] rounded-lg cursor-pointer"
        >
          <i class="pi pi-percentage mr-2"></i>
          <span class="label-large"> Scale (x{{ appliedScaleFactor }}) </span>
        </button>
      </div>
      
      <!-- Scale slider -->
      <div v-if="showScaleSlider" class="p-4 bg-[var(--color-secondary)] mx-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm">x0.25</span>
          <span class="font-medium">{{ formatScaleFactor(scaleFactor) }}</span>
          <span class="text-sm">x10</span>
        </div>
        <input 
          type="range" 
          min="0.25" 
          max="10" 
          step="0.25" 
          v-model="scaleFactor" 
          @input="updateScaleFactor"
          class="w-full accent-[var(--color-tertiary)] h-2 rounded-lg appearance-none cursor-pointer bg-gray-300"
        />
        <div class="flex justify-end mt-3 gap-2">
          <button 
            @click="resetScale" 
            class="px-3 py-1 border border-[var(--color-tertiary)] text-black rounded-md text-sm cursor-pointer"
          >
            Reset
          </button>
          <button 
            @click="applyScale" 
            class="px-3 py-1 bg-[var(--color-tertiary)] text-black rounded-md text-sm cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
      
      <!-- Recipe content in two columns -->
      <div class="flex flex-col md:flex-row px-4 gap-5">
        <!-- Ingredients column -->
        <div class="flex-1 py-4">
          <h2 class="title-large mb-4">Ingredients</h2>
          <ul class="space-y-2 bg-[var(--color-secondary)] p-4 rounded-lg">
            <li v-for="(ingredient, index) in recipe.extendedIngredients || []" :key="index" class="body-medium">
              {{ getIngredientMeasure(ingredient).amount }} {{ getIngredientMeasure(ingredient).unit }} {{ ingredient.name }}
            </li>
            <!-- Placeholder ingredients if none available -->
            <template v-if="!recipe.extendedIngredients || recipe.extendedIngredients.length === 0">
              <li v-for="i in 6" :key="i" class="body-medium">
                100g Ingredient
              </li>
            </template>
          </ul>
        </div>
        
        <!-- Method column -->
        <div class="flex-1 py-4">
          <h2 class="title-large mb-4">Method</h2>
          <ol class="space-y-3 bg-[var(--color-secondary)] p-4 rounded-lg">
            <li v-for="(step, index) in recipe.analyzedInstructions?.[0]?.steps || []" :key="index" class="body-medium">
              <div class="font-medium">STEP {{ index + 1 }}.</div>
              <div>{{ step.step }}</div>
            </li>
            <!-- Placeholder steps if none available -->
            <template v-if="!recipe.analyzedInstructions || !recipe.analyzedInstructions[0] || !recipe.analyzedInstructions[0].steps">
              <li v-for="i in 6" :key="i" class="body-medium">
                <div class="font-medium">STEP {{ i }}.</div>
                <div>Lorem ipsum dolor sit amet</div>
              </li>
            </template>
          </ol>
        </div>
      </div>
      
      <!-- Add to groceries button (fixed at bottom) -->
      <div class="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-center">
        <button 
          @click="addToGroceries" 
          class="w-full max-w-md py-3 bg-[var(--color-secondary)] rounded-full font-medium flex items-center justify-center gap-2"
        >
          <i class="pi pi-shopping-cart"></i>
          <span>Add to groceries</span>
        </button>
      </div>
    </div>
  </div>
</template>


