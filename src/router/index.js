import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import RecipeView from '@/views/RecipeView.vue'
import GroceriesView from '@/views/GroceriesView.vue'
import MealPlanView from '@/views/MealPlanView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'

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
    },
    {
      path: '/meal-plan',
      name: 'meal-plan',
      component: MealPlanView,
    },
  ],
})

export default router
