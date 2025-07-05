<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-server" class="h-6 w-6 text-primary-600" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Backend Connection</h2>
        </div>
        <UBadge 
          :color="isConnected ? 'green' : 'red'" 
          variant="soft"
          :label="isConnected ? 'Connected' : 'Disconnected'"
        />
      </div>
    </template>
    
    <div class="space-y-6">
      <div class="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-3">
          <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-1">How It Works</h3>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Our backend handles all AI provider connections, advanced multi-provider logic, and MCP integration. 
              You get free access to enterprise-grade AI consultation - no setup required.
            </p>
          </div>
        </div>
      </div>

      <UFormGroup label="Backend API URL" help="Make It Real's AI consultation backend" class="mb-6">
        <USelect
          v-model="selectedBackendUrl"
          :items="backendUrlOptions"
          icon="i-heroicons-link"
          class="w-full mt-2"
          size="lg"
          @update:model-value="handleBackendUrlChange"
        />
      </UFormGroup>
      
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <UButton 
          @click="testConnection"
          :loading="isConnecting"
          variant="outline"
          icon="i-heroicons-signal"
          size="lg"
        >
          Test Connection
        </UButton>
        
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ lastConnectionCheck ? `Last tested: ${formatTime(lastConnectionCheck)}` : 'Never tested' }}
        </div>
      </div>

      <!-- Connection Error -->
      <div v-if="connectionError" class="bg-red-50 dark:bg-red-950/50 rounded-lg p-4 border border-red-200 dark:border-red-800">
        <div class="flex items-start gap-3">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <h3 class="font-semibold text-red-800 dark:text-red-200 mb-1">Connection Error</h3>
            <p class="text-sm text-red-700 dark:text-red-300">{{ connectionError }}</p>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Use our API composable
const { isConnected, isConnecting, connectionError, lastConnectionCheck, testConnection } = useApi()
const config = useRuntimeConfig()

// Backend URL options
const backendUrlOptions = [
  { 
    label: 'Local Development (localhost:8000)', 
    value: 'http://localhost:8000',
    icon: 'i-heroicons-computer-desktop'
  },
  { 
    label: 'Production API', 
    value: 'https://api.makeitrealconsulting.com',
    icon: 'i-heroicons-cloud'
  }
]

// Current backend URL (from runtime config or localStorage)
const selectedBackendUrl = ref(config.public.apiBaseUrl || 'http://localhost:8000')

/**
 * Handle backend URL change
 */
const handleBackendUrlChange = (newUrl: string) => {
  selectedBackendUrl.value = newUrl
  
  // Save to localStorage for persistence
  if (process.client) {
    localStorage.setItem('enterpriseAI.backendUrl', newUrl)
  }
  
  // TODO: Update the service factory with new URL
  // This would require reinitializing the service factory
}

/**
 * Format timestamp
 */
const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(timestamp)
}

// Load saved backend URL on mount
onMounted(() => {
  if (process.client) {
    const savedUrl = localStorage.getItem('enterpriseAI.backendUrl')
    if (savedUrl) {
      selectedBackendUrl.value = savedUrl
    }
  }
  
  // Auto-test connection on mount
  testConnection()
})
</script>