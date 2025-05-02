import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import RecipeView from '@/views/RecipeView.vue'
import GroceriesView from '@/views/GroceriesView.vue'
import MealPlanView from '@/views/MealPlanView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import { useAuth0 } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: RecipeView,
    },
    { path: '/recipe/:id', 
      name: 'recipe-id', 
      component: RecipeDetailView 
    },
    {
      path: '/groceries',
      name: 'groceries',
      component: GroceriesView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/meal-plan',
      name: 'meal-plan',
      component: MealPlanView,
      meta: {
        requiresAuth: true
      }
    },
  ],
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !isLoading.value && !isAuthenticated.value) {
    // Redirect to home page if authentication is required but user is not authenticated
    next({ name: 'home' });
  } else {
    // Continue with navigation
    next();
  }
})

export default router
