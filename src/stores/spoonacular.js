import { defineStore } from 'pinia';
import { connectUser } from '../services/spoonacularApi';

export const useSpoonacularStore = defineStore('spoonacular', {
  state: () => ({
    spoonacularUser: null,
    spoonacularPassword: null,
    spoonacularHash: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  }),
  
  actions: {
    async connectSpoonacularUser(authUser) {
      if (!authUser || this.isConnecting) return;
      
      this.isConnecting = true;
      this.error = null;
      
      try {
        // Connect the Auth0 user to Spoonacular
        const connectResponse = await connectUser(authUser);
        
        if (connectResponse && connectResponse.username && connectResponse.spoonacularPassword && connectResponse.hash) {
          this.spoonacularHash = connectResponse.hash;
          this.spoonacularPassword = connectResponse.spoonacularPassword;
          this.spoonacularUser = connectResponse;
          this.isConnected = true;
          
          // Store user connection data in localStorage for persistence
          localStorage.setItem('spoonacularUser', JSON.stringify(this.spoonacularUser));
          localStorage.setItem('spoonacularHash', this.spoonacularHash);
          localStorage.setItem('spoonacularPassword', this.spoonacularPassword);
        }
      } catch (error) {
        this.error = error.message || 'Failed to connect to Spoonacular';
        console.error('Error connecting to Spoonacular:', error);
      } finally {
        this.isConnecting = false;
      }
    },
    
    restoreConnection() {
      try {
        const savedUser = localStorage.getItem('spoonacularUser');
        const savedHash = localStorage.getItem('spoonacularHash');
        const savedPassword = localStorage.getItem('spoonacularPassword');
        
        if (savedUser && savedHash && savedPassword) {
          this.spoonacularUser = JSON.parse(savedUser);
          this.spoonacularHash = savedHash;
          this.spoonacularPassword = savedPassword;
          this.isConnected = true;
        }
      } catch (error) {
        console.error('Error restoring Spoonacular connection:', error);
      }
    },
    
    clearConnection() {
      this.spoonacularUser = null;
      this.spoonacularHash = null;
      this.spoonacularPassword = null;
      this.isConnected = false;
      localStorage.removeItem('spoonacularUser');
      localStorage.removeItem('spoonacularHash');
      localStorage.removeItem('spoonacularPassword');
    }
  }
});