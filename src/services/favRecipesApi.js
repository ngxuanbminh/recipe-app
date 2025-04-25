import axios from 'axios';

const API_BASE_URL = 'http://localhost:4001';

export default {
  getAllFavorites() {
    return axios.get(`${API_BASE_URL}/fav-recipes`);
  },
  
  getFavoriteById(recipeId) {
    return axios.get(`${API_BASE_URL}/fav-recipes/${recipeId}`);
  },
  
  addToFavorites(recipe) {
    return axios.post(`${API_BASE_URL}/fav-recipes`, recipe);
  },
  
  updateFavorite(recipeId, recipe) {
    return axios.put(`${API_BASE_URL}/fav-recipes/${recipeId}`, recipe);
  },
  
  removeFromFavorites(recipeId) {
    return axios.delete(`${API_BASE_URL}/fav-recipes/${recipeId}`);
  }
};