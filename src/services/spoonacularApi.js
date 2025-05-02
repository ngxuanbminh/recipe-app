// Spoonacular API service
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || '';
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Connect a user with Spoonacular
 * @param {Object} userData - User data from Auth0
 * @returns {Promise} - Response from Spoonacular containing user info and hash
 */
export const connectUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/connect?apiKey=${SPOONACULAR_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userData.email || userData.name,
        firstName: userData.given_name || userData.name?.split(' ')[0] || '',
        lastName: userData.family_name || userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email || ''
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to connect user: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Connected user data:', data);
    return data; // This already contains user info and hash
  } catch (error) {
    console.error('Error connecting user to Spoonacular:', error);
    throw error;
  }
};

/**
 * Other Spoonacular API functions can be added here
 */