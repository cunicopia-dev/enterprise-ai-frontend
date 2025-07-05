import type { Message, Conversation, ChatState, ProviderType, ChatResponse } from '~/types'

export const useChatStore = defineStore('chat', () => {
  // State
  const currentConversation = ref<Conversation | null>(null)
  const conversations = ref<Conversation[]>([])
  const messages = ref<Message[]>([])
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const selectedProvider = ref<ProviderType | null>(null)
  const selectedModel = ref<string | null>(null)
  const error = ref<string | null>(null)

  // Get settings store
  const settingsStore = useSettingsStore()

  // Getters
  const hasMessages = computed(() => messages.value.length > 0)
  const latestMessage = computed(() => messages.value[messages.value.length - 1])
  const conversationHistory = computed(() => 
    conversations.value.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  )

  const canSendMessage = computed(() => {
    return !isLoading.value && 
           !isStreaming.value && 
           selectedProvider.value && 
           selectedModel.value &&
           settingsStore.hasValidConfiguration
  })

  // Actions
  const initializeChat = () => {
    loadConversations()
    
    // Set default provider from settings
    if (!selectedProvider.value && settingsStore.enabledProviders.length > 0) {
      selectedProvider.value = settingsStore.platformSettings.defaultProvider
      
      const providerConfig = settingsStore.providers[selectedProvider.value]
      if (providerConfig.defaultModel) {
        selectedModel.value = providerConfig.defaultModel
      }
    }
  }

  const loadConversations = () => {
    if (process.client && settingsStore.platformSettings.saveHistory) {
      try {
        const saved = localStorage.getItem('enterpriseAI.conversations')
        if (saved) {
          const parsed = JSON.parse(saved)
          conversations.value = parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
        }
      } catch (error) {
        console.error('Error loading conversations:', error)
      }
    }
  }

  const saveConversations = () => {
    if (process.client && settingsStore.platformSettings.saveHistory) {
      try {
        // Limit history length
        const maxLength = settingsStore.platformSettings.maxHistoryLength
        const limited = conversations.value.slice(0, maxLength)
        
        localStorage.setItem('enterpriseAI.conversations', JSON.stringify(limited))
      } catch (error) {
        console.error('Error saving conversations:', error)
      }
    }
  }

  const createNewConversation = (): Conversation => {
    const conversation: Conversation = {
      id: generateId(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: selectedProvider.value!,
      model: selectedModel.value!
    }

    conversations.value.unshift(conversation)
    currentConversation.value = conversation
    messages.value = []
    
    return conversation
  }

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      currentConversation.value = conversation
      messages.value = [...conversation.messages]
      selectedProvider.value = conversation.provider
      selectedModel.value = conversation.model
    }
  }

  const updateConversationTitle = (conversationId: string, title: string) => {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.title = title
      conversation.updatedAt = new Date()
      saveConversations()
    }
  }

  const deleteConversation = (conversationId: string) => {
    conversations.value = conversations.value.filter(c => c.id !== conversationId)
    
    if (currentConversation.value?.id === conversationId) {
      currentConversation.value = null
      messages.value = []
    }
    
    saveConversations()
  }

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: new Date()
    }

    messages.value.push(newMessage)

    // Update current conversation
    if (currentConversation.value) {
      currentConversation.value.messages.push(newMessage)
      currentConversation.value.updatedAt = new Date()
      
      // Auto-generate title from first user message
      if (currentConversation.value.title === 'New Conversation' && 
          message.role === 'user' && 
          message.content.length > 0) {
        const title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
        currentConversation.value.title = title
      }
    }

    saveConversations()
    return newMessage
  }

  const sendMessage = async (content: string): Promise<void> => {
    if (!canSendMessage.value || !content.trim()) {
      throw new Error('Cannot send message: Invalid state or empty content')
    }

    error.value = null

    // Create new conversation if none exists
    if (!currentConversation.value) {
      createNewConversation()
    }

    // Add user message
    const userMessage = addMessage({
      role: 'user',
      content: content.trim(),
      provider: selectedProvider.value!,
      model: selectedModel.value!
    })

    isLoading.value = true

    try {
      // Call API (mock for now)
      const response = await callAI(content, selectedProvider.value!, selectedModel.value!)
      
      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response.message,
        provider: response.provider,
        model: response.model,
        tokens: response.tokens
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      error.value = errorMessage
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please check your provider configuration and try again.`,
        provider: selectedProvider.value!,
        model: selectedModel.value!
      })
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentChat = () => {
    messages.value = []
    currentConversation.value = null
    error.value = null
  }

  const clearAllChats = () => {
    conversations.value = []
    messages.value = []
    currentConversation.value = null
    error.value = null
    
    if (process.client) {
      localStorage.removeItem('enterpriseAI.conversations')
    }
  }

  const retryLastMessage = async () => {
    if (messages.value.length < 2) return

    const lastUserMessage = [...messages.value]
      .reverse()
      .find(msg => msg.role === 'user')

    if (lastUserMessage) {
      // Remove the last assistant message if it exists
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage.role === 'assistant') {
        messages.value.pop()
        if (currentConversation.value) {
          currentConversation.value.messages.pop()
        }
      }

      await sendMessage(lastUserMessage.content)
    }
  }

  // Mock AI API call
  const callAI = async (message: string, provider: ProviderType, model: string): Promise<ChatResponse> => {
    // Simulate API delay
    const delay = provider === 'ollama' ? 800 : 1500
    await new Promise(resolve => setTimeout(resolve, delay))

    // Mock different provider responses
    let responseContent = ''
    
    switch (provider) {
      case 'ollama':
        responseContent = `**Local AI Response (${model}):** This is a demonstration of local Ollama integration. In production, this would connect to your local Ollama instance. Your query: "${message}"`
        break
      case 'anthropic':
        responseContent = `**Claude AI Response (${model}):** As an enterprise AI assistant, I can help with complex reasoning and analysis. Your question about "${message}" would receive detailed insights in production.`
        break
      case 'openai':
        responseContent = `**GPT Response (${model}):** This demonstrates OpenAI integration. In production, this would leverage GPT models for comprehensive responses to: "${message}"`
        break
      default:
        responseContent = `Mock response from ${provider} using ${model}: "${message}"`
    }

    // Random chance of simulated error
    if (Math.random() < 0.05) {
      throw new Error(`${provider.toUpperCase()} API temporarily unavailable`)
    }

    return {
      message: responseContent,
      provider,
      model,
      tokens: {
        input: Math.floor(message.length / 4),
        output: Math.floor(responseContent.length / 4),
        total: Math.floor((message.length + responseContent.length) / 4)
      }
    }
  }

  // Helper function to generate IDs
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    // State
    currentConversation: readonly(currentConversation),
    conversations: readonly(conversations),
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    isStreaming: readonly(isStreaming),
    selectedProvider,
    selectedModel,
    error: readonly(error),

    // Getters
    hasMessages,
    latestMessage,
    conversationHistory,
    canSendMessage,

    // Actions
    initializeChat,
    loadConversations,
    saveConversations,
    createNewConversation,
    selectConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
    sendMessage,
    clearCurrentChat,
    clearAllChats,
    retryLastMessage
  }
})