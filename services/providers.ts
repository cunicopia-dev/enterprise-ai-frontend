/**
 * Provider service for multi-LLM support and model management
 * Integrates with FastAPI Multi-Provider LLM Platform provider endpoints
 */

import { ApiClient, ErrorHandler } from './api'

export interface Provider {
  name: string
  display_name: string
  description: string
  is_active: boolean
  is_default: boolean
  requires_api_key: boolean
  config: Record<string, any>
  models: Model[]
}

export interface Model {
  model_name: string
  display_name: string
  description: string
  context_window: number
  max_tokens: number
  supports_streaming: boolean
  supports_functions: boolean
  cost_per_token?: {
    input: number
    output: number
  }
  metadata?: Record<string, any>
}

export interface ProviderHealth {
  provider: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  latency_ms?: number
  last_check: Date
  error_message?: string
  details?: Record<string, any>
}

export interface ProvidersListResponse {
  providers: Provider[]
  total: number
  enabled_count: number
  default_provider: string
}

export interface ModelsListResponse {
  models: Model[]
  provider: string
  total: number
}

/**
 * Provider service for managing AI providers and models
 */
export class ProviderService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Get all available providers
   */
  async getProviders(): Promise<ProvidersListResponse> {
    try {
      const response = await this.apiClient.get<ProvidersListResponse>('/providers')
      return response.data
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to fetch providers')
    }
  }

  /**
   * Get models for a specific provider
   */
  async getModels(provider: string): Promise<ModelsListResponse> {
    try {
      const response = await this.apiClient.get<ModelsListResponse>(`/providers/${provider}/models`)
      return response.data
    } catch (error) {
      ErrorHandler.handle(error, `Failed to fetch models for ${provider}`)
    }
  }

  /**
   * Check provider health status
   */
  async checkProviderHealth(provider: string): Promise<ProviderHealth> {
    try {
      const response = await this.apiClient.get<ProviderHealth>(`/providers/${provider}/health`)
      
      // Convert timestamp to Date object
      const health = response.data
      health.last_check = new Date(health.last_check)
      
      return health
    } catch (error) {
      ErrorHandler.handle(error, `Failed to check health for ${provider}`)
    }
  }

  /**
   * Check health for all providers
   */
  async checkAllProvidersHealth(): Promise<ProviderHealth[]> {
    try {
      const response = await this.apiClient.get<{ health_checks: ProviderHealth[] }>('/providers/health')
      
      // Convert timestamps to Date objects
      return response.data.health_checks.map(health => ({
        ...health,
        last_check: new Date(health.last_check)
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to check providers health')
    }
  }

  /**
   * Get provider configuration
   */
  async getProviderConfig(provider: string): Promise<Record<string, any>> {
    try {
      const response = await this.apiClient.get<{ config: Record<string, any> }>(`/providers/${provider}/config`)
      return response.data.config
    } catch (error) {
      ErrorHandler.handle(error, `Failed to get config for ${provider}`)
    }
  }

  /**
   * Update provider configuration
   */
  async updateProviderConfig(provider: string, config: Record<string, any>): Promise<boolean> {
    try {
      const response = await this.apiClient.put<{ success: boolean }>(`/providers/${provider}/config`, { config })
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to update config for ${provider}`)
    }
  }

  /**
   * Enable/disable a provider
   */
  async toggleProvider(provider: string, enabled: boolean): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>(`/providers/${provider}/${enabled ? 'enable' : 'disable'}`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to ${enabled ? 'enable' : 'disable'} ${provider}`)
    }
  }

  /**
   * Set default provider
   */
  async setDefaultProvider(provider: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>(`/providers/${provider}/set-default`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to set ${provider} as default`)
    }
  }

  /**
   * Test provider with a simple message
   */
  async testProvider(provider: string, model?: string, message = 'Hello, world!'): Promise<{
    success: boolean
    response?: string
    latency_ms?: number
    error?: string
  }> {
    try {
      const response = await this.apiClient.post<{
        success: boolean
        response?: string
        latency_ms?: number
        error?: string
      }>(`/providers/${provider}/test`, {
        model,
        message
      })
      return response.data
    } catch (error) {
      ErrorHandler.handle(error, `Failed to test ${provider}`)
    }
  }
}

/**
 * Provider configuration manager
 */
export class ProviderConfigManager {
  constructor(private providerService: ProviderService) {}

  /**
   * Get safe configuration (without sensitive data)
   */
  async getSafeConfig(provider: string): Promise<Record<string, any>> {
    const config = await this.providerService.getProviderConfig(provider)
    
    // Remove sensitive fields
    const safeConfig = { ...config }
    delete safeConfig.api_key
    delete safeConfig.secret_key
    delete safeConfig.password
    
    return safeConfig
  }

  /**
   * Validate configuration before saving
   */
  validateConfig(provider: string, config: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    switch (provider) {
      case 'openai':
        if (!config.api_key) errors.push('OpenAI API key is required')
        if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
          errors.push('Temperature must be between 0 and 2')
        }
        break

      case 'anthropic':
        if (!config.api_key) errors.push('Anthropic API key is required')
        if (config.max_tokens !== undefined && config.max_tokens < 1) {
          errors.push('Max tokens must be greater than 0')
        }
        break

      case 'google':
        if (!config.api_key) errors.push('Google API key is required')
        break

      case 'ollama':
        if (!config.base_url) errors.push('Ollama base URL is required')
        break
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * Model selector utility
 */
export class ModelSelector {
  private providers: Provider[] = []
  private healthStatus: Map<string, ProviderHealth> = new Map()

  constructor(private providerService: ProviderService) {}

  /**
   * Load providers and health status
   */
  async initialize(): Promise<void> {
    try {
      const [providersResponse, healthChecks] = await Promise.all([
        this.providerService.getProviders(),
        this.providerService.checkAllProvidersHealth()
      ])

      this.providers = providersResponse.providers
      this.healthStatus = new Map(
        healthChecks.map(health => [health.provider, health])
      )
    } catch (error) {
      console.error('Failed to initialize ModelSelector:', error)
    }
  }

  /**
   * Get all available models across providers
   */
  getAllModels(): Array<Model & { provider: string; available: boolean }> {
    const models: Array<Model & { provider: string; available: boolean }> = []

    for (const provider of this.providers) {
      if (!provider.is_active) continue

      const health = this.healthStatus.get(provider.name)
      const available = health?.status === 'healthy'

      for (const model of provider.models) {
        models.push({
          ...model,
          provider: provider.name,
          available
        })
      }
    }

    return models
  }

  /**
   * Get models for UI selection (grouped by provider)
   */
  getGroupedModels(): Array<{
    provider: string
    providerName: string
    healthy: boolean
    models: Array<Model & { value: string; label: string }>
  }> {
    const groups: Array<{
      provider: string
      providerName: string
      healthy: boolean
      models: Array<Model & { value: string; label: string }>
    }> = []

    for (const provider of this.providers) {
      if (!provider.is_active) continue

      const health = this.healthStatus.get(provider.name)
      const healthy = health?.status === 'healthy'

      const models = provider.models.map(model => ({
        ...model,
        value: `${provider.name}:${model.model_name}`,
        label: model.display_name
      }))

      groups.push({
        provider: provider.name,
        providerName: provider.display_name,
        healthy,
        models
      })
    }

    return groups
  }

  /**
   * Get recommended model based on use case
   */
  getRecommendedModel(useCase: 'chat' | 'code' | 'analysis' | 'creative'): string | null {
    const preferences = {
      chat: ['gpt-4o', 'claude-3.5-sonnet', 'gemini-2.5-flash'],
      code: ['gpt-4o', 'claude-3.5-sonnet', 'deepseek-coder'],
      analysis: ['claude-3.5-sonnet', 'gpt-4o', 'gemini-2.5-flash'],
      creative: ['claude-3.5-sonnet', 'gpt-4o', 'llama3.1:70b']
    }

    const preferredModels = preferences[useCase] || preferences.chat
    const availableModels = this.getAllModels().filter(m => m.available)

    for (const preferred of preferredModels) {
      const model = availableModels.find(m => 
        m.model_name.includes(preferred) || m.display_name.includes(preferred)
      )
      if (model) {
        return `${model.provider}:${model.model_name}`
      }
    }

    // Fallback to first available model
    const fallback = availableModels[0]
    return fallback ? `${fallback.provider}:${fallback.model_name}` : null
  }

  /**
   * Parse model string (provider:model) into components
   */
  parseModelString(modelString: string): { provider: string; model: string } | null {
    const parts = modelString.split(':')
    if (parts.length !== 2) return null
    
    return {
      provider: parts[0],
      model: parts[1]
    }
  }

  /**
   * Get model info by provider and model name
   */
  getModelInfo(provider: string, modelName: string): Model | null {
    const providerObj = this.providers.find(p => p.name === provider)
    if (!providerObj) return null

    return providerObj.models.find(m => m.model_name === modelName) || null
  }

  /**
   * Check if model is available
   */
  isModelAvailable(provider: string, modelName: string): boolean {
    const health = this.healthStatus.get(provider)
    if (health?.status !== 'healthy') return false

    const providerObj = this.providers.find(p => p.name === provider)
    if (!providerObj?.is_active) return false

    return providerObj.models.some(m => m.model_name === modelName)
  }
}