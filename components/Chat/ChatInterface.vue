<template>
  <div class="flex h-[calc(100vh-240px)] flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Chat Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Enterprise AI Chat</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Powered by Make It Real's AI Platform
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <UBadge 
            :color="isConnected ? 'green' : 'red'" 
            variant="soft"
            :label="isConnected ? 'Connected' : 'Disconnected'"
          />
          <UButton 
            icon="i-heroicons-arrow-path" 
            variant="ghost" 
            color="gray" 
            size="sm"
            @click="clearChat"
            :disabled="isLoading"
          />
        </div>
      </div>
    </div>

    <!-- Messages Container -->
    <ChatMessageList 
      :messages="messages"
      :is-loading="isLoading"
      :is-connected="isConnected"
      @sample-message="handleSampleMessage"
      class="flex-1"
    />
    
    <!-- Input Area -->
    <ChatMessageInput
      :is-loading="isLoading"
      :is-connected="isConnected"
      :selected-model="selectedModel"
      :available-models="availableModels"
      @send-message="handleSendMessage"
      @model-change="handleModelChange"
    />
  </div>
</template>

<script setup lang="ts">
import type { Message, ChatResponse } from '~/types/api'

interface AvailableModel {
  label: string
  value: string
  provider: string
}

const props = defineProps<{
  chatId?: string
}>()

// Composables
const { sendMessage, loadChatHistory, isLoading, error, currentChatId } = useChat()
const { providers, loadProviders, checkProviderHealth, isLoading: providersLoading } = useProviders()
const { isConnected, testConnection } = useApi()

// State
const messages = ref<Message[]>([])
const selectedModel = ref<AvailableModel | null>(null)
const availableModels = ref<AvailableModel[]>([])
const messagesContainer = ref<HTMLElement>()

// Load initial data
onMounted(async () => {
  try {
    // Test connection first
    await testConnection()
    
    // Load providers and set up models
    await loadProviders()
    setupAvailableModels()
    
    // Load existing chat if chatId provided
    if (props.chatId) {
      await loadExistingChat(props.chatId)
    }
    
    // Check provider health
    await checkProviderHealth()
  } catch (error) {
    console.error('Failed to initialize chat:', error)
  }
})

/**
 * Set up available models from providers
 */
const setupAvailableModels = () => {
  const models: AvailableModel[] = []
  
  // Add models based on actual providers from backend
  for (const provider of providers.value) {
    if (!provider.is_active) continue
    
    for (const model of provider.models || []) {
      models.push({
        label: `${model.display_name} (${provider.display_name})`,
        value: `${provider.name}:${model.model_name}`,
        provider: provider.name
      })
    }
  }
  
  // Fallback models if no providers loaded yet
  if (models.length === 0) {
    models.push(
      { label: 'GPT-4o (OpenAI)', value: 'openai:gpt-4o', provider: 'openai' },
      { label: 'Claude 3.5 Haiku (Anthropic)', value: 'anthropic:claude-3.5-haiku', provider: 'anthropic' },
      { label: 'Gemini 2.5 Flash (Google)', value: 'google:gemini-2.5-flash', provider: 'google' },
      { label: 'Claude 3.5 Sonnet (Bedrock)', value: 'bedrock:claude-3.5-sonnet', provider: 'bedrock' }
    )
  }
  
  availableModels.value = models
  
  // Set default to Gemini 2.5 Flash if available, otherwise first model
  const defaultModel = models.find(m => m.value.includes('gemini-2.5-flash')) || models[0]
  selectedModel.value = defaultModel
}

/**
 * Load existing chat conversation
 */
const loadExistingChat = async (chatId: string) => {
  try {
    const history = await loadChatHistory(chatId)
    messages.value = history.messages
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load chat history:', error)
  }
}

/**
 * Handle sending a message
 */
const handleSendMessage = async (content: string) => {
  if (!content.trim() || !selectedModel.value) return
  
  // Parse model selection
  const [provider, model] = selectedModel.value.value.split(':')
  
  // Add user message immediately
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  scrollToBottom()
  
  try {
    // Send to backend
    const response = await sendMessage(content, {
      chatId: props.chatId || currentChatId.value || undefined,
      provider,
      model,
      temperature: 0.7,
      maxTokens: 2048
    })
    
    // Add assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.response,
      timestamp: new Date(),
      provider: response.provider,
      model: response.model,
      metadata: {
        usage: response.usage,
        tool_executions: response.tool_executions
      }
    }
    messages.value.push(assistantMessage)
    scrollToBottom()
    
  } catch (error) {
    // Add error message
    const errorMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: 'assistant',
      content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your connection and try again.`,
      timestamp: new Date(),
      metadata: { error: true }
    }
    messages.value.push(errorMessage)
    scrollToBottom()
  }
}

/**
 * Handle sample message click
 */
const handleSampleMessage = (message: string) => {
  handleSendMessage(message)
}

/**
 * Handle model selection change
 */
const handleModelChange = (model: AvailableModel) => {
  selectedModel.value = model
}

/**
 * Clear chat messages
 */
const clearChat = () => {
  messages.value = []
}

/**
 * Scroll to bottom of messages
 */
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch for provider changes and update models
watch(providers, () => {
  setupAvailableModels()
}, { deep: true })

// Set page title
useHead({
  title: 'Enterprise AI Chat - Make It Real Consulting',
  meta: [
    { name: 'description', content: 'Multi-provider AI chat interface for enterprise consultation and cloud architecture guidance.' }
  ]
})
</script>