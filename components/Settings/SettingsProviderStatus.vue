<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-cpu-chip" class="h-6 w-6 text-primary-600" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI Provider Status</h2>
        </div>
        <UBadge 
          :color="overallHealthy ? 'green' : 'orange'" 
          variant="soft"
          :label="overallHealthy ? 'All Systems Ready' : 'Check Providers'"
        />
      </div>
    </template>
    
    <div class="space-y-6">
      <div class="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-3">
          <UIcon name="i-heroicons-beaker" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-1">AI Technology Demo</h3>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Experience our advanced AI capabilities firsthand. This demonstration showcases the type of 
              intelligent systems we build for enterprise clients using cutting-edge AI integration.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Provider Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-24"></div>
        </div>
      </div>
      
      <div v-else-if="providers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="provider in providers" 
          :key="provider.name"
          class="text-center p-4 rounded-lg border transition-colors"
          :class="getProviderCardClasses(provider)"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
               :class="getProviderIconClasses(provider)">
            <UIcon :name="getProviderIcon(provider.name)" class="h-6 w-6 text-white" />
          </div>
          <h3 class="font-semibold mb-2" :class="getProviderTextClasses(provider)">
            {{ provider.display_name }}
          </h3>
          <div class="flex items-center justify-center gap-2">
            <UBadge 
              :color="provider.is_active ? 'green' : 'gray'"
              variant="soft"
              :label="provider.is_active ? 'Active' : 'Inactive'"
              size="xs"
            />
            <UBadge 
              v-if="getProviderHealth(provider.name)"
              :color="getProviderHealth(provider.name).status === 'healthy' ? 'green' : 'red'"
              variant="soft"
              :label="getProviderHealth(provider.name).status === 'healthy' ? 'Healthy' : 'Unhealthy'"
              size="xs"
            />
          </div>
          <p class="text-xs mt-2" :class="getProviderTextClasses(provider, true)">
            {{ provider.models?.length || 0 }} models available
          </p>
        </div>
      </div>
      
      <!-- No providers message -->
      <div v-else-if="!isLoading" class="text-center py-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Providers Available</h3>
        <p class="text-gray-600 dark:text-gray-400">
          Unable to load AI providers. Please check your backend connection.
        </p>
      </div>
      
      <!-- Refresh Button -->
      <div class="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <UButton 
          @click="refreshProviders"
          :loading="isLoading"
          variant="outline"
          icon="i-heroicons-arrow-path"
          size="sm"
        >
          Refresh Provider Status
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
// Use our providers composable
const { providers, providerHealth, isLoading, loadProviders, checkProviderHealth } = useProviders()

// Computed properties
const overallHealthy = computed(() => {
  if (!providers.value.length) return false
  
  const activeProviders = providers.value.filter(p => p.is_active)
  if (!activeProviders.length) return false
  
  return activeProviders.every(provider => {
    const health = getProviderHealth(provider.name)
    return health?.status === 'healthy'
  })
})

/**
 * Get provider health info
 */
const getProviderHealth = (providerName: string) => {
  return providerHealth.value[providerName] || null
}

/**
 * Get provider icon
 */
const getProviderIcon = (providerName: string): string => {
  const icons: Record<string, string> = {
    'openai': 'i-heroicons-cpu-chip',
    'anthropic': 'i-heroicons-sparkles',
    'google': 'i-heroicons-beaker',
    'bedrock': 'i-heroicons-cloud',
    'ollama': 'i-heroicons-server'
  }
  return icons[providerName] || 'i-heroicons-cpu-chip'
}

/**
 * Get provider card styling classes
 */
const getProviderCardClasses = (provider: any): string => {
  if (!provider.is_active) {
    return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  }
  
  const health = getProviderHealth(provider.name)
  if (health?.status === 'healthy') {
    return 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'
  } else if (health?.status === 'unhealthy') {
    return 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
  }
  
  return 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800'
}

/**
 * Get provider icon styling classes
 */
const getProviderIconClasses = (provider: any): string => {
  if (!provider.is_active) {
    return 'bg-gray-600'
  }
  
  const health = getProviderHealth(provider.name)
  if (health?.status === 'healthy') {
    return 'bg-green-600'
  } else if (health?.status === 'unhealthy') {
    return 'bg-red-600'
  }
  
  return 'bg-yellow-600'
}

/**
 * Get provider text styling classes
 */
const getProviderTextClasses = (provider: any, small = false): string => {
  const baseClasses = small ? 'text-xs' : ''
  
  if (!provider.is_active) {
    return `${baseClasses} text-gray-600 dark:text-gray-400`
  }
  
  const health = getProviderHealth(provider.name)
  if (health?.status === 'healthy') {
    return `${baseClasses} text-green-800 dark:text-green-200`
  } else if (health?.status === 'unhealthy') {
    return `${baseClasses} text-red-800 dark:text-red-200`
  }
  
  return `${baseClasses} text-yellow-800 dark:text-yellow-200`
}

/**
 * Refresh providers and health status
 */
const refreshProviders = async () => {
  try {
    await loadProviders()
    await checkProviderHealth()
  } catch (error) {
    console.error('Failed to refresh providers:', error)
  }
}

// Load data on mount
onMounted(async () => {
  await refreshProviders()
})
</script>