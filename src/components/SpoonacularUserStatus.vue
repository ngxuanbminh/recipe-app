<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useSpoonacularStore } from '../stores/spoonacular'

const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
const spoonacularStore = useSpoonacularStore()
const showCredentials = ref(false)

const isUserConnected = computed(() => spoonacularStore.isConnected)
const isConnecting = computed(() => spoonacularStore.isConnecting)
const connectionError = computed(() => spoonacularStore.error)
const spoonacularCredentials = computed(() => {
  return {
    username: spoonacularStore.spoonacularUser || '',
    password: spoonacularStore.spoonacularPassword || '',
  }
})

// Restore connection from Auth0 user metadata when component mounts or user changes
onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    await spoonacularStore.restoreConnection(user.value)
  }
})

watch(user, async (newUser) => {
  if (newUser && isAuthenticated.value) {
    await spoonacularStore.restoreConnection(newUser)
  }
})

const toggleCredentialsVisibility = () => {
  showCredentials.value = !showCredentials.value
}

const connectUserToSpoonacular = async () => {
  if (isAuthenticated.value && user.value) {
    await spoonacularStore.connectSpoonacularUser(user.value, getAccessTokenSilently)
  }
}

const disconnectUser = async () => {
  if (isAuthenticated.value && user.value) {
    await spoonacularStore.clearConnection(user.value, getAccessTokenSilently)
  } else {
    spoonacularStore.clearConnection()
  }
  showCredentials.value = false
}

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Copied to clipboard')
    })
    .catch((err) => {
      console.error('Failed to copy: ', err)
    })
}
</script>

<template>
  <div class="spoonacular-user-status">
    <h3 class="text-lg font-semibold mb-2">Spoonacular Connection</h3>

    <div v-if="isUserConnected" class="mb-4">
      <div class="flex items-center mb-2">
        <span class="inline-flex h-4 w-4 rounded-full bg-green-500 mr-2"></span>
        <span class="text-green-600">Connected to Spoonacular</span>
      </div>
      <p class="text-sm text-gray-600 mb-3">
        Your account is connected to Spoonacular. You can save preferences, meal plans, and more.
      </p>

      <!-- Credentials Section -->
      <div class="mb-3">
        <button
          @click="toggleCredentialsVisibility"
          class="text-sm bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded transition-colors mb-2"
        >
          {{ showCredentials ? 'Hide Credentials' : 'View Credentials' }}
        </button>

        <div v-if="showCredentials" class="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
          <h4 class="font-medium text-sm mb-1">Spoonacular Credentials</h4>

          <div class="mb-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium">Username:</span>
              <button
                @click="copyToClipboard(spoonacularCredentials.username)"
                class="text-xs text-blue-600 hover:text-blue-800"
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div class="p-2 bg-white rounded border border-gray-200 text-xs font-mono break-all">
              {{ spoonacularCredentials.username }}
            </div>
          </div>

          <div class="mb-1">
            <div class="flex justify-between items-center">
              <span class="text-xs font-medium">Password:</span>
              <button
                @click="copyToClipboard(spoonacularCredentials.password)"
                class="text-xs text-blue-600 hover:text-blue-800"
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div class="p-2 bg-white rounded border border-gray-200 text-xs font-mono break-all">
              {{ spoonacularCredentials.password }}
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-2">
            These credentials can be used for direct API integration or third-party applications.
          </p>
        </div>
      </div>

      <button
        @click="disconnectUser"
        class="text-sm bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded transition-colors"
      >
        Disconnect
      </button>
    </div>

    <div v-else class="mb-4">
      <div class="flex items-center mb-2">
        <span class="inline-flex h-4 w-4 rounded-full bg-gray-300 mr-2"></span>
        <span class="text-gray-600">Not connected to Spoonacular</span>
      </div>
      <p class="text-sm text-gray-600 mb-3">
        Connect your account to Spoonacular to save preferences, meal plans, and more across
        devices.
      </p>
      <button
        @click="connectUserToSpoonacular"
        :disabled="isConnecting"
        class="text-sm bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] py-1 px-3 rounded transition-colors disabled:opacity-50"
      >
        <span v-if="isConnecting">Connecting...</span>
        <span v-else>Connect to Spoonacular</span>
      </button>
    </div>

    <div v-if="connectionError" class="text-sm text-red-600 mt-2">Error: {{ connectionError }}</div>
  </div>
</template>
