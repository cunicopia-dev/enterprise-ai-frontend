import { defineStore } from 'pinia'

interface Model {
  model_name: string
  display_name: string
  description?: string
  context_window?: number
  max_tokens?: number
}

interface Provider {
  name: string
  display_name: string
  is_active: boolean
  is_default: boolean
  models?: Model[]
}

interface ProviderState {
  providers: Provider[]
  currentProvider: string
  currentModel: string
  isLoading: boolean
  error: string | null
}

export const useProviderStore = defineStore('providers', {
  state: (): ProviderState => ({
    providers: [],
    currentProvider: 'ollama',
    currentModel: 'llama3.1:8b-instruct-q8_0',
    isLoading: false,
    error: null,
  }),

  getters: {
    allProviders: (state) => state.providers,
    activeProviders: (state) => state.providers.filter((p) => p.is_active),
    defaultProvider: (state) => state.providers.find((p) => p.is_default),
    selectedProvider: (state) => state.providers.find((p) => p.name === state.currentProvider),
    availableModels: (state) => {
      const provider = state.providers.find((p) => p.name === state.currentProvider)
      return provider?.models || []
    },
  },

  actions: {
    async loadProviders() {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement API call to load providers
        console.log('Loading providers...')
        
        // Mock data
        this.providers = [
          {
            name: 'ollama',
            display_name: 'Ollama',
            is_active: true,
            is_default: true,
            models: [
              {
                model_name: 'llama3.1:8b-instruct-q8_0',
                display_name: 'Llama 3.1 8B',
                context_window: 8192,
                max_tokens: 4096,
              },
            ],
          },
          {
            name: 'anthropic',
            display_name: 'Anthropic',
            is_active: true,
            is_default: false,
            models: [
              {
                model_name: 'claude-3-opus-20240229',
                display_name: 'Claude 3 Opus',
                context_window: 200000,
                max_tokens: 4096,
              },
            ],
          },
        ]
      } catch (error) {
        this.error = 'Failed to load providers'
        console.error('Load providers error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async loadModels(provider: string) {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Implement API call to load models for a provider
        console.log('Loading models for provider:', provider)
      } catch (error) {
        this.error = 'Failed to load models'
        console.error('Load models error:', error)
      } finally {
        this.isLoading = false
      }
    },

    setProvider(provider: string) {
      this.currentProvider = provider
      const providerData = this.providers.find((p) => p.name === provider)
      if (providerData?.models?.length) {
        this.currentModel = providerData.models[0].model_name
      }
    },

    setModel(model: string) {
      this.currentModel = model
    },

    async checkProviderHealth(provider: string) {
      try {
        // TODO: Implement API call to check provider health
        console.log('Checking health for provider:', provider)
        return true
      } catch (error) {
        console.error('Provider health check error:', error)
        return false
      }
    },
  },

  persist: {
    storage: persistedState.localStorage,
    paths: ['currentProvider', 'currentModel'],
  },
})