// Auth0 service for managing user metadata
import axios from 'axios'

/**
 * Updates the user metadata in Auth0
 * @param {Object} options - Options for updating user metadata
 * @param {Object} options.user - Auth0 user object
 * @param {Object} options.metadata - Metadata to update
 * @param {Function} options.getAccessTokenSilently - Auth0's getAccessTokenSilently function
 * @returns {Promise} - Promise resolving to updated user
 */
export const updateUserMetadata = async ({ user, metadata, getAccessTokenSilently }) => {
  try {
    if (!user || !user.sub) {
      throw new Error('User not authenticated or user ID not available')
    }

    // Get an access token to call the Auth0 Management API
    const token = await getAccessTokenSilently()

    const domain = import.meta.env.VITE_AUTH0_DOMAIN
    const url = `https://${domain}/api/v2/users/${encodeURIComponent(user.sub)}`

    // Update the user metadata
    const response = await axios.patch(
      url,
      {
        user_metadata: metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('Error updating Auth0 user metadata:', error)
    throw error
  }
}

/**
 * Gets the user metadata from Auth0
 * @param {Object} user - Auth0 user object
 * @param {String} key - Optional specific metadata key to retrieve
 * @returns {Object|any} - User metadata or specific value
 */
export const getUserMetadata = (user, key = null) => {
  try {
    if (!user || !user.user_metadata) {
      return key ? null : {}
    }

    const metadata = user.user_metadata
    return key ? metadata[key] : metadata
  } catch (error) {
    console.error('Error getting Auth0 user metadata:', error)
    return key ? null : {}
  }
}
