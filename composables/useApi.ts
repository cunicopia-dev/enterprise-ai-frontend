/**
 * Composable for API service integration
 * Provides reactive access to backend services with Nuxt integration
 */

import { ServiceFactory } from '~/utils/serviceFactory'
import type { ServiceConfig } from '~/utils/serviceFactory'

/**
 * Main API composable that provides access to all backend services
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const toast = useToast()

  // Get service factory instance
  const getServiceFactory = (): ServiceFactory => {
    const serviceConfig: ServiceConfig = {
      baseUrl: config.public.apiBaseUrl || 'http://localhost:8000',
      timeout: 30000,
      retryAttempts: 2
    }

    return ServiceFactory.getInstance(serviceConfig)
  }

  // Service getters
  const chatService = computed(() => getServiceFactory().getChatService())
  const providerService = computed(() => getServiceFactory().getProviderService())
  const mcpService = computed(() => getServiceFactory().getMCPService())
  const systemPromptService = computed(() => getServiceFactory().getSystemPromptService())
  const apiClient = computed(() => getServiceFactory().getApiClient())

  // Connection state
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const connectionError = ref<string | null>(null)
  const lastConnectionCheck = ref<Date | null>(null)

  /**
   * Set API key for all services
   */
  const setApiKey = (apiKey: string) => {
    getServiceFactory().setApiKey(apiKey)
  }

  /**
   * Clear API key from all services
   */
  const clearApiKey = () => {
    getServiceFactory().clearApiKey()
  }

  /**
   * Test connection to backend
   */
  const testConnection = async (): Promise<boolean> => {
    isConnecting.value = true
    connectionError.value = null

    try {
      const connected = await getServiceFactory().testConnection()
      isConnected.value = connected
      lastConnectionCheck.value = new Date()

      if (connected && toast) {
        toast.add({
          title: 'Connected',
          description: 'Successfully connected to AI backend',
          color: 'green'
        })
      }

      return connected
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      connectionError.value = errorMessage
      isConnected.value = false
      lastConnectionCheck.value = new Date()

      if (toast) {
        toast.add({
          title: 'Connection Failed',
          description: errorMessage,
          color: 'red'
        })
      }

      return false
    } finally {
      isConnecting.value = false
    }
  }

  /**
   * Health monitoring
   */
  const serviceHealth = ref<Record<string, boolean>>({})

  const checkServiceHealth = async () => {
    try {
      // Simplified health check - just test the connection
      const connected = await getServiceFactory().testConnection()
      serviceHealth.value = { api: connected }
      isConnected.value = connected
    } catch (error) {
      console.error('Health check failed:', error)
      isConnected.value = false
    }
  }

  return {
    // Services
    chatService,
    providerService,
    mcpService,
    systemPromptService,
    apiClient,

    // Connection state
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    connectionError: readonly(connectionError),
    lastConnectionCheck: readonly(lastConnectionCheck),
    serviceHealth: readonly(serviceHealth),

    // Methods
    setApiKey,
    clearApiKey,
    testConnection,
    checkServiceHealth
  }
}

/**
 * Composable for chat functionality
 */
export const useChat = () => {
  const { chatService } = useApi()
  
  // Chat state
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentChatId = ref<string | null>(null)

  /**
   * Send a message
   */
  const sendMessage = async (
    content: string,
    options: {
      chatId?: string
      provider?: string
      model?: string
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    } = {}
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await chatService.value.sendMessage({
        message: content,
        chat_id: options.chatId || currentChatId.value,
        provider: options.provider,
        model: options.model,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        system_prompt: options.systemPrompt
      })

      currentChatId.value = response.chat_id
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load chat history
   */
  const loadChatHistory = async (chatId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const history = await chatService.value.getChatHistory(chatId)
      currentChatId.value = chatId
      return history
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat history'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get chat list
   */
  const getChatList = async (page = 1, limit = 50) => {
    isLoading.value = true
    error.value = null

    try {
      return await chatService.value.getChatList(page, limit)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat list'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a chat
   */
  const deleteChat = async (chatId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const success = await chatService.value.deleteChat(chatId)
      if (currentChatId.value === chatId) {
        currentChatId.value = null
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentChatId: readonly(currentChatId),

    // Methods
    sendMessage,
    loadChatHistory,
    getChatList,
    deleteChat
  }
}

/**
 * Composable for provider functionality
 */
export const useProviders = () => {
  const { providerService } = useApi()
  
  // Provider state
  const providers = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load providers
   */
  const loadProviders = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await providerService.value.getProviders()
      providers.value = response.providers || []
      return response
    } catch (err) {
      console.error('Error loading providers:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load providers'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get models for a provider
   */
  const getModels = async (provider: string) => {
    isLoading.value = true
    error.value = null

    try {
      return await providerService.value.getModels(provider)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load models for ${provider}`
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Test a provider
   */
  const testProvider = async (provider: string, model?: string) => {
    isLoading.value = true
    error.value = null

    try {
      return await providerService.value.testProvider(provider, model)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to test ${provider}`
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    providers: readonly(providers),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    loadProviders,
    getModels,
    testProvider
  }
}

/**
 * Composable for MCP functionality
 */
export const useMCP = () => {
  const { mcpService } = useApi()
  
  // MCP state
  const mcpStatus = ref<any>(null)
  const servers = ref<any[]>([])
  const tools = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load MCP status
   */
  const loadStatus = async () => {
    isLoading.value = true
    error.value = null

    try {
      const status = await mcpService.value.getStatus()
      mcpStatus.value = status
      servers.value = status.servers
      return status
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load MCP status'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load available tools
   */
  const loadTools = async () => {
    isLoading.value = true
    error.value = null

    try {
      const toolsList = await mcpService.value.getTools()
      tools.value = toolsList
      return toolsList
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load MCP tools'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reconnect to a server
   */
  const reconnectServer = async (serverName: string) => {
    isLoading.value = true
    error.value = null

    try {
      const success = await mcpService.value.reconnectServer(serverName)
      if (success) {
        await loadStatus() // Refresh status
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to reconnect to ${serverName}`
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Execute a tool
   */
  const executeTool = async (toolName: string, input: Record<string, any>, serverName?: string) => {
    isLoading.value = true
    error.value = null

    try {
      return await mcpService.value.executeTool(toolName, input, serverName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to execute tool ${toolName}`
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    mcpStatus: readonly(mcpStatus),
    servers: readonly(servers),
    tools: readonly(tools),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    loadStatus,
    loadTools,
    reconnectServer,
    executeTool
  }
}

/**
 * Composable for system prompt functionality
 */
export const useSystemPrompts = () => {
  const { systemPromptService } = useApi()
  
  // System prompt state
  const activePrompt = ref<string>('')
  const prompts = ref<any[]>([])
  const categories = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Load active prompt
   */
  const loadActivePrompt = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await systemPromptService.value.getActivePrompt()
      activePrompt.value = response.prompt
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load active prompt'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set active prompt
   */
  const setActivePrompt = async (prompt: string) => {
    isLoading.value = true
    error.value = null

    try {
      const success = await systemPromptService.value.setActivePrompt(prompt)
      if (success) {
        activePrompt.value = prompt
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active prompt'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load all prompts
   */
  const loadPrompts = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await systemPromptService.value.getPrompts()
      prompts.value = response.prompts
      categories.value = response.categories
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load prompts'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new prompt
   */
  const createPrompt = async (prompt: {
    name: string
    content: string
    description?: string
    category?: string
    tags?: string[]
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const newPrompt = await systemPromptService.value.createPrompt(prompt)
      prompts.value.push(newPrompt)
      return newPrompt
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create prompt'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Activate a prompt
   */
  const activatePrompt = async (promptId: string) => {
    isLoading.value = true
    error.value = null

    try {
      const success = await systemPromptService.value.activatePrompt(promptId)
      if (success) {
        await loadActivePrompt() // Refresh active prompt
      }
      return success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate prompt'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    activePrompt: readonly(activePrompt),
    prompts: readonly(prompts),
    categories: readonly(categories),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    loadActivePrompt,
    setActivePrompt,
    loadPrompts,
    createPrompt,
    activatePrompt
  }
}