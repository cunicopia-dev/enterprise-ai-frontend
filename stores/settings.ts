/**
 * Settings store using our new service layer
 * Simplified to work with backend-managed providers (no user API keys)
 */

interface PlatformSettings {
  theme: 'system' | 'light' | 'dark'
  defaultProvider: string
  autoScroll: boolean
  saveHistory: boolean
  showTimestamps: boolean
  streamResponses: boolean
  maxHistoryLength: number
  responseTimeout: number
}

interface BackendConfig {
  baseUrl: string
  connected: boolean
  lastCheck?: Date
}

export const useSettingsStore = defineStore('settings', () => {
  // Use our composables
  const { isConnected, testConnection } = useApi()
  const { providers, loadProviders } = useProviders()
  
  // State
  const backendConfig = ref<BackendConfig>({
    baseUrl: 'http://localhost:8000',
    connected: false
  })

  const platformSettings = ref<PlatformSettings>({
    theme: 'system',
    defaultProvider: 'google', // Default to Gemini 2.5 Flash (free)
    autoScroll: true,
    saveHistory: true,
    showTimestamps: true,
    streamResponses: true,
    maxHistoryLength: 100,
    responseTimeout: 30
  })

  const isLoading = ref(false)
  const lastSaved = ref<Date | null>(null)

  // Getters - simplified since providers come from backend
  const availableProviders = computed(() => {
    return providers.value
      .filter(provider => provider.is_active)
      .map(provider => ({
        label: provider.display_name,
        value: provider.name,
        icon: getProviderIcon(provider.name),
        color: getProviderColor(provider.name),
        models: provider.models || []
      }))
  })

  const hasValidConfiguration = computed(() => {
    return isConnected.value && availableProviders.value.length > 0
  })

  const currentProvider = computed(() => {
    return providers.value.find(p => p.name === platformSettings.value.defaultProvider)
  })

  // Actions
  const loadSettings = () => {
    if (process.client) {
      try {
        const savedBackendUrl = localStorage.getItem('enterpriseAI.backendUrl')
        const savedPlatformSettings = localStorage.getItem('enterpriseAI.platformSettings')

        if (savedBackendUrl) {
          backendConfig.value.baseUrl = savedBackendUrl
        }

        if (savedPlatformSettings) {
          platformSettings.value = { ...platformSettings.value, ...JSON.parse(savedPlatformSettings) }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }

  const saveSettings = async () => {
    if (!process.client) return

    isLoading.value = true
    
    try {
      localStorage.setItem('enterpriseAI.backendUrl', backendConfig.value.baseUrl)
      localStorage.setItem('enterpriseAI.platformSettings', JSON.stringify(platformSettings.value))
      
      lastSaved.value = new Date()
      
      const toast = useToast()
      toast.add({
        title: 'Settings Saved',
        description: 'Your configuration has been saved successfully',
        color: 'green'
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      
      const toast = useToast()
      toast.add({
        title: 'Save Failed',
        description: 'Could not save settings. Please try again.',
        color: 'red'
      })
      
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateBackendConfig = (config: Partial<BackendConfig>) => {
    backendConfig.value = { ...backendConfig.value, ...config }
    nextTick(() => saveSettings())
  }

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    platformSettings.value = { ...platformSettings.value, ...settings }
    nextTick(() => saveSettings())
  }

  // Initialize providers and connection
  const initializeSettings = async () => {
    isLoading.value = true
    
    try {
      // Load saved settings first
      loadSettings()
      
      // Test connection
      const connected = await testConnection()
      backendConfig.value.connected = connected
      backendConfig.value.lastCheck = new Date()
      
      // Load providers if connected
      if (connected) {
        await loadProviders()
        
        // Ensure default provider is valid
        const validProvider = providers.value.find(p => p.name === platformSettings.value.defaultProvider && p.is_active)
        if (!validProvider && providers.value.length > 0) {
          // Set to Gemini if available, otherwise first active provider
          const geminiProvider = providers.value.find(p => p.name === 'google' && p.is_active)
          const firstActiveProvider = providers.value.find(p => p.is_active)
          
          if (geminiProvider) {
            platformSettings.value.defaultProvider = 'google'
          } else if (firstActiveProvider) {
            platformSettings.value.defaultProvider = firstActiveProvider.name
          }
          
          saveSettings()
        }
      }
    } catch (error) {
      console.error('Failed to initialize settings:', error)
      backendConfig.value.connected = false
    } finally {
      isLoading.value = false
    }
  }

  // Watch for connection changes
  watch(isConnected, (connected) => {
    backendConfig.value.connected = connected
    if (connected) {
      loadProviders()
    }
  })

  const testBackendConnectionLegacy = async (): Promise<boolean> => {
    try {
      const connected = await testConnection()
      backendConfig.value.connected = connected
      backendConfig.value.lastCheck = new Date()
      
      const toast = useToast()
      toast.add({
        title: 'Backend Connected',
        description: 'Successfully connected to Make It Real\'s AI backend',
        color: 'green'
      })
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      backendConfig.value.connected = false
      
      const toast = useToast()
      toast.add({
        title: 'Connection Failed',
        description: `Could not connect to backend: ${errorMessage}`,
        color: 'red'
      })
      
      return false
    }
  }

  const resetSettings = () => {
    backendConfig.value = {
      baseUrl: 'http://localhost:8000',
      connected: false
    }

    platformSettings.value = {
      theme: 'system',
      defaultProvider: 'google',
      autoScroll: true,
      saveHistory: true,
      showTimestamps: true,
      streamResponses: true,
      maxHistoryLength: 100,
      responseTimeout: 30
    }

    if (process.client) {
      localStorage.removeItem('enterpriseAI.backendUrl')
      localStorage.removeItem('enterpriseAI.platformSettings')
    }
  }

  // Helper functions
  const getProviderIcon = (provider: string): string => {
    const icons: Record<string, string> = {
      openai: 'i-heroicons-cpu-chip',
      anthropic: 'i-heroicons-sparkles',
      google: 'i-heroicons-beaker',
      bedrock: 'i-heroicons-cloud',
      ollama: 'i-heroicons-server'
    }
    return icons[provider] || 'i-heroicons-cpu-chip'
  }

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      openai: 'blue',
      anthropic: 'orange',
      google: 'green',
      bedrock: 'purple',
      ollama: 'gray'
    }
    return colors[provider] || 'gray'
  }

  return {
    // State
    backendConfig: readonly(backendConfig),
    platformSettings: readonly(platformSettings),
    isLoading: readonly(isLoading),
    lastSaved: readonly(lastSaved),
    
    // Getters
    availableProviders,
    hasValidConfiguration,
    currentProvider,
    
    // Actions
    loadSettings,
    saveSettings,
    updateBackendConfig,
    updatePlatformSettings,
    initializeSettings,
    resetSettings,
    
    // Helper functions
    getProviderIcon,
    getProviderColor
  }
})