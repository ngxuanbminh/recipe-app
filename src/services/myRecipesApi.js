import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export default {
  getAllRecipes() {
    return axios.get(`${API_BASE_URL}/my-recipes`);
  },
  
  getRecipeById(recipeId) {
    return axios.get(`${API_BASE_URL}/my-recipes/${recipeId}`);
  },
  
  addRecipe(recipe) {
    return axios.post(`${API_BASE_URL}/my-recipes`, recipe);
  },
  
  updateRecipe(recipeId, recipe) {
    return axios.put(`${API_BASE_URL}/my-recipes/${recipeId}`, recipe);
  },
  
  deleteRecipe(recipeId) {
    return axios.delete(`${API_BASE_URL}/my-recipes/${recipeId}`);
  }
};