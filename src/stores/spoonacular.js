import { defineStore } from 'pinia'
import { connectUser } from '../services/spoonacularApi'
import { updateUserMetadata, getUserMetadata } from '../services/auth0Service'

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
    async connectSpoonacularUser(authUser, getAccessTokenSilently) {
      if (!authUser || this.isConnecting) return

      this.isConnecting = true
      this.error = null

      try {
        // Connect the Auth0 user to Spoonacular
        const connectResponse = await connectUser(authUser)

        if (
          connectResponse &&
          connectResponse.username &&
          connectResponse.spoonacularPassword &&
          connectResponse.hash
        ) {
          this.spoonacularHash = connectResponse.hash
          this.spoonacularPassword = connectResponse.spoonacularPassword
          this.spoonacularUser = connectResponse.username
          this.isConnected = true

          // Store user connection data in Auth0 user metadata
          const spoonacularMetadata = {
            spoonacularUser: this.spoonacularUser,
            spoonacularHash: this.spoonacularHash,
            spoonacularPassword: this.spoonacularPassword,
          }

          try {
            // Update the user's metadata using Auth0 Management API
            await updateUserMetadata({
              user: authUser,
              metadata: { spoonacular: spoonacularMetadata },
              getAccessTokenSilently,
            })
          } catch (metadataError) {
            console.error(
              'Failed to update Auth0 metadata, but user is still connected to Spoonacular:',
              metadataError,
            )
          }
        }
      } catch (error) {
        this.error = error.message || 'Failed to connect to Spoonacular'
        console.error('Error connecting to Spoonacular:', error)
      } finally {
        this.isConnecting = false
      }
    },

    async restoreConnection(authUser) {
      try {
        if (!authUser) return

        // Get metadata directly from the user object
        const spoonacularMetadata = getUserMetadata(authUser, 'spoonacular')

        if (spoonacularMetadata) {
          const { spoonacularUser, spoonacularHash, spoonacularPassword } = spoonacularMetadata

          if (spoonacularUser && spoonacularHash && spoonacularPassword) {
            this.spoonacularUser = spoonacularUser
            this.spoonacularHash = spoonacularHash
            this.spoonacularPassword = spoonacularPassword
            this.isConnected = true
          }
        }
      } catch (error) {
        console.error('Error restoring Spoonacular connection:', error)
      }
    },

    async clearConnection(authUser, getAccessTokenSilently) {
      this.spoonacularUser = null
      this.spoonacularHash = null
      this.spoonacularPassword = null
      this.isConnected = false

      if (authUser && getAccessTokenSilently) {
        try {
          // Clear the spoonacular metadata from Auth0
          await updateUserMetadata({
            user: authUser,
            metadata: { spoonacular: null },
            getAccessTokenSilently,
          })
        } catch (error) {
          console.error('Error clearing Auth0 user metadata:', error)
        }
      }
    },
  },
})
