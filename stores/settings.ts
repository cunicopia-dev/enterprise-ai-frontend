import type { BackendConfig, UserApiKeys, PlatformSettings, SettingsState, ProviderType } from '~/types'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const backendConfig = ref<BackendConfig>({
    baseUrl: 'https://api.makeitrealconsulting.com',
    accessKey: '',
    connected: false
  })

  const userApiKeys = ref<UserApiKeys>({
    openai: '',
    anthropic: ''
  })

  const platformSettings = ref<PlatformSettings>({
    theme: 'system',
    defaultProvider: 'openai',
    autoScroll: true,
    saveHistory: true,
    showTimestamps: true,
    maxHistoryLength: 100,
    streamResponses: true
  })

  const isLoading = ref(false)
  const lastSaved = ref<Date | null>(null)

  // Getters
  const enabledProviders = computed(() => {
    const providers: ProviderType[] = []
    if (userApiKeys.value.openai) providers.push('openai')
    if (userApiKeys.value.anthropic) providers.push('anthropic')
    return providers
  })

  const hasValidConfiguration = computed(() => {
    return backendConfig.value.connected && (userApiKeys.value.openai || userApiKeys.value.anthropic)
  })

  const availableProviders = computed(() => {
    return enabledProviders.value.map(provider => ({
      label: getProviderDisplayName(provider),
      value: provider,
      icon: getProviderIcon(provider),
      color: getProviderColor(provider)
    }))
  })

  // Actions
  const loadSettings = () => {
    if (process.client) {
      try {
        const savedBackendConfig = localStorage.getItem('enterpriseAI.backendConfig')
        const savedUserApiKeys = localStorage.getItem('enterpriseAI.userApiKeys')
        const savedPlatformSettings = localStorage.getItem('enterpriseAI.platformSettings')

        if (savedBackendConfig) {
          backendConfig.value = { ...backendConfig.value, ...JSON.parse(savedBackendConfig) }
        }

        if (savedUserApiKeys) {
          userApiKeys.value = { ...userApiKeys.value, ...JSON.parse(savedUserApiKeys) }
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
      localStorage.setItem('enterpriseAI.backendConfig', JSON.stringify(backendConfig.value))
      localStorage.setItem('enterpriseAI.userApiKeys', JSON.stringify(userApiKeys.value))
      localStorage.setItem('enterpriseAI.platformSettings', JSON.stringify(platformSettings.value))
      
      lastSaved.value = new Date()
      
      const toast = useToast?.()
      if (toast) {
        toast.add({
          title: 'Settings Saved',
          description: 'Your configuration has been saved successfully',
          color: 'green'
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      
      const toast = useToast?.()
      if (toast) {
        toast.add({
          title: 'Save Failed',
          description: 'Could not save settings. Please try again.',
          color: 'red'
        })
      }
      
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateBackendConfig = (config: Partial<BackendConfig>) => {
    backendConfig.value = { ...backendConfig.value, ...config }
    nextTick(() => saveSettings())
  }

  const updateUserApiKeys = (keys: Partial<UserApiKeys>) => {
    userApiKeys.value = { ...userApiKeys.value, ...keys }
    nextTick(() => saveSettings())
  }

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    platformSettings.value = { ...platformSettings.value, ...settings }
    nextTick(() => saveSettings())
  }

  // Backend API helper
  const apiRequest = async (endpoint: string, options: any = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(backendConfig.value.accessKey && { 'Authorization': `Bearer ${backendConfig.value.accessKey}` })
      },
      ...options
    }
    
    const response = await fetch(`${backendConfig.value.baseUrl}${endpoint}`, config)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }

  const testBackendConnection = async (): Promise<boolean> => {
    try {
      // Test health endpoint first (no auth required)
      const healthResponse = await fetch(`${backendConfig.value.baseUrl}/health`)
      if (!healthResponse.ok) {
        throw new Error('Backend health check failed')
      }
      
      // Test authenticated endpoint if access key is provided
      if (backendConfig.value.accessKey) {
        await apiRequest('/providers')
      }
      
      backendConfig.value.connected = true
      
      const toast = useToast?.()
      if (toast) {
        toast.add({
          title: 'Backend Connected',
          description: 'Successfully connected to Make It Real\'s AI backend',
          color: 'green'
        })
      }
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      backendConfig.value.connected = false
      
      const toast = useToast?.()
      if (toast) {
        toast.add({
          title: 'Connection Failed',
          description: `Could not connect to backend: ${errorMessage}`,
          color: 'red'
        })
      }
      
      return false
    }
  }

  const resetSettings = () => {
    backendConfig.value = {
      baseUrl: 'https://api.makeitrealconsulting.com',
      accessKey: '',
      connected: false
    }

    userApiKeys.value = {
      openai: '',
      anthropic: ''
    }

    platformSettings.value = {
      theme: 'system',
      defaultProvider: 'openai',
      autoScroll: true,
      saveHistory: true,
      showTimestamps: true,
      maxHistoryLength: 100,
      streamResponses: true
    }

    if (process.client) {
      localStorage.removeItem('enterpriseAI.backendConfig')
      localStorage.removeItem('enterpriseAI.userApiKeys')
      localStorage.removeItem('enterpriseAI.platformSettings')
    }
  }

  // Helper functions
  const getProviderDisplayName = (provider: ProviderType): string => {
    const names = {
      openai: 'OpenAI GPT',
      anthropic: 'Anthropic Claude'
    }
    return names[provider]
  }

  const getProviderIcon = (provider: ProviderType): string => {
    const icons = {
      openai: 'i-heroicons-cpu-chip',
      anthropic: 'i-heroicons-sparkles'
    }
    return icons[provider]
  }

  const getProviderColor = (provider: ProviderType): string => {
    const colors = {
      openai: 'blue',
      anthropic: 'orange'
    }
    return colors[provider]
  }

  return {
    // State
    backendConfig: readonly(backendConfig),
    userApiKeys: readonly(userApiKeys),
    platformSettings: readonly(platformSettings),
    isLoading: readonly(isLoading),
    lastSaved: readonly(lastSaved),
    
    // Getters
    enabledProviders,
    hasValidConfiguration,
    availableProviders,
    
    // Actions
    loadSettings,
    saveSettings,
    updateBackendConfig,
    updateUserApiKeys,
    updatePlatformSettings,
    testBackendConnection,
    resetSettings,
    apiRequest,
    
    // Helper functions
    getProviderDisplayName,
    getProviderIcon,
    getProviderColor
  }
})