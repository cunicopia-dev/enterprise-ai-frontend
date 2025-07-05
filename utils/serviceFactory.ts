/**
 * Service factory for creating and managing service instances
 * Provides a centralized way to configure and access all backend services
 */

import { 
  ApiClient, 
  ChatService, 
  ProviderService, 
  MCPService, 
  SystemPromptService 
} from '~/services'

/**
 * Service configuration interface
 */
export interface ServiceConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
  retryAttempts?: number
}

/**
 * Service factory for managing all backend service instances
 */
export class ServiceFactory {
  private static instance: ServiceFactory | null = null
  private apiClient: ApiClient
  private services: Map<string, any> = new Map()

  private constructor(config: ServiceConfig) {
    this.apiClient = new ApiClient(config.baseUrl)
    
    if (config.apiKey) {
      this.apiClient.setApiKey(config.apiKey)
    }
  }

  /**
   * Get or create the singleton instance
   */
  static getInstance(config?: ServiceConfig): ServiceFactory {
    if (!ServiceFactory.instance) {
      if (!config) {
        throw new Error('ServiceFactory must be initialized with config on first use')
      }
      ServiceFactory.instance = new ServiceFactory(config)
    }
    return ServiceFactory.instance
  }

  /**
   * Update API key for all services
   */
  setApiKey(apiKey: string): void {
    this.apiClient.setApiKey(apiKey)
  }

  /**
   * Clear API key from all services
   */
  clearApiKey(): void {
    this.apiClient.clearApiKey()
  }

  /**
   * Get or create chat service
   */
  getChatService(): ChatService {
    if (!this.services.has('chat')) {
      this.services.set('chat', new ChatService(this.apiClient))
    }
    return this.services.get('chat')
  }

  /**
   * Get or create provider service
   */
  getProviderService(): ProviderService {
    if (!this.services.has('provider')) {
      this.services.set('provider', new ProviderService(this.apiClient))
    }
    return this.services.get('provider')
  }

  /**
   * Get or create MCP service
   */
  getMCPService(): MCPService {
    if (!this.services.has('mcp')) {
      this.services.set('mcp', new MCPService(this.apiClient))
    }
    return this.services.get('mcp')
  }

  /**
   * Get or create system prompt service
   */
  getSystemPromptService(): SystemPromptService {
    if (!this.services.has('systemPrompt')) {
      this.services.set('systemPrompt', new SystemPromptService(this.apiClient))
    }
    return this.services.get('systemPrompt')
  }

  /**
   * Get the underlying API client
   */
  getApiClient(): ApiClient {
    return this.apiClient
  }

  /**
   * Test connectivity to the backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.apiClient.health()
      return response.success
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }

  /**
   * Reset the factory (mainly for testing)
   */
  static reset(): void {
    ServiceFactory.instance = null
  }
}

/**
 * Configuration validator
 */
export class ServiceConfigValidator {
  static validate(config: ServiceConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate base URL
    if (!config.baseUrl) {
      errors.push('Base URL is required')
    } else {
      try {
        new URL(config.baseUrl)
      } catch {
        errors.push('Base URL must be a valid URL')
      }
    }

    // Validate timeout
    if (config.timeout !== undefined && config.timeout <= 0) {
      errors.push('Timeout must be greater than 0')
    }

    // Validate retry attempts
    if (config.retryAttempts !== undefined && config.retryAttempts < 0) {
      errors.push('Retry attempts must be 0 or greater')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

/**
 * Default service configurations
 */
export const defaultConfigs = {
  development: {
    baseUrl: 'http://localhost:8000',
    timeout: 30000,
    retryAttempts: 2
  },
  production: {
    baseUrl: 'https://api.makeitrealconsulting.com',
    timeout: 15000,
    retryAttempts: 3
  }
} as const

/**
 * Service health monitor
 */
export class ServiceHealthMonitor {
  private factory: ServiceFactory
  private healthChecks: Map<string, Date> = new Map()
  private healthStatus: Map<string, boolean> = new Map()

  constructor(factory: ServiceFactory) {
    this.factory = factory
  }

  /**
   * Check health of all services
   */
  async checkAllServices(): Promise<{
    overall: boolean
    services: Record<string, { healthy: boolean; lastCheck: Date; error?: string }>
  }> {
    const services = {
      api: this.factory.getApiClient(),
      chat: this.factory.getChatService(),
      provider: this.factory.getProviderService(),
      mcp: this.factory.getMCPService(),
      systemPrompt: this.factory.getSystemPromptService()
    }

    const results: Record<string, { healthy: boolean; lastCheck: Date; error?: string }> = {}

    for (const [name, service] of Object.entries(services)) {
      try {
        let healthy = false
        
        if (name === 'api') {
          healthy = await this.factory.testConnection()
        } else {
          // For other services, we could implement health checks
          // For now, assume healthy if API is healthy
          healthy = await this.factory.testConnection()
        }

        const now = new Date()
        this.healthChecks.set(name, now)
        this.healthStatus.set(name, healthy)

        results[name] = {
          healthy,
          lastCheck: now
        }
      } catch (error) {
        const now = new Date()
        this.healthChecks.set(name, now)
        this.healthStatus.set(name, false)

        results[name] = {
          healthy: false,
          lastCheck: now,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    const overall = Object.values(results).every(result => result.healthy)

    return { overall, services: results }
  }

  /**
   * Get current health status
   */
  getHealthStatus(): Record<string, boolean> {
    return Object.fromEntries(this.healthStatus)
  }

  /**
   * Get last health check times
   */
  getLastHealthChecks(): Record<string, Date> {
    return Object.fromEntries(this.healthChecks)
  }

  /**
   * Start periodic health checks
   */
  startPeriodicChecks(intervalMs = 60000): () => void {
    const interval = setInterval(() => {
      this.checkAllServices().catch(console.error)
    }, intervalMs)

    // Return cleanup function
    return () => clearInterval(interval)
  }
}

/**
 * Service metrics collector
 */
export class ServiceMetricsCollector {
  private metrics: Map<string, {
    calls: number
    errors: number
    totalTime: number
    lastCall: Date
  }> = new Map()

  /**
   * Record a service call
   */
  recordCall(service: string, success: boolean, durationMs: number): void {
    const existing = this.metrics.get(service) || {
      calls: 0,
      errors: 0,
      totalTime: 0,
      lastCall: new Date()
    }

    existing.calls++
    existing.totalTime += durationMs
    existing.lastCall = new Date()
    
    if (!success) {
      existing.errors++
    }

    this.metrics.set(service, existing)
  }

  /**
   * Get metrics for a service
   */
  getServiceMetrics(service: string): {
    calls: number
    errors: number
    averageTimeMs: number
    errorRate: number
    lastCall: Date
  } | null {
    const metrics = this.metrics.get(service)
    if (!metrics) return null

    return {
      calls: metrics.calls,
      errors: metrics.errors,
      averageTimeMs: metrics.calls > 0 ? metrics.totalTime / metrics.calls : 0,
      errorRate: metrics.calls > 0 ? metrics.errors / metrics.calls : 0,
      lastCall: metrics.lastCall
    }
  }

  /**
   * Get all service metrics
   */
  getAllMetrics(): Record<string, ReturnType<ServiceMetricsCollector['getServiceMetrics']>> {
    const result: Record<string, any> = {}
    
    for (const [service] of this.metrics) {
      result[service] = this.getServiceMetrics(service)
    }
    
    return result
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics.clear()
  }
}