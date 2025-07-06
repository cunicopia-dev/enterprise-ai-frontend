import { defineStore } from 'pinia'

import type { Provider, Model } from '~/services/providers'

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
      if (!provider) return []
      return provider.models.map(modelName => ({
        label: modelName,
        value: `${provider.name}:${modelName}`,
        provider: provider.name
      }))
    },
  },

  actions: {
    async loadProviders() {
      if (this.providers.length > 0) return
      this.isLoading = true
      this.error = null
      try {
        const { providerService } = useApi()
        const response = await providerService.value.getProviders()
        this.providers = response.providers
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
        this.currentModel = providerData.models[0]
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

  })