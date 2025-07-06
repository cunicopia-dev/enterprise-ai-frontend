<template>
  <div class="flex h-[calc(100vh-240px)] flex-col bg-white dark:bg-gray-950">
    <!-- Chat Header -->
    <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-3">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 class="text-base font-medium text-gray-900 dark:text-white">Enterprise AI Chat</h1>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <UBadge 
            :color="isConnected ? 'green' : 'red'" 
            variant="soft"
            :label="isConnected ? 'Connected' : 'Disconnected'"
            size="xs"
          />
          <UButton 
            icon="i-heroicons-arrow-path" 
            variant="ghost" 
            color="gray" 
            size="xs"
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
import { useApi, useChat, useProviders } from '~/composables/useApi'
import { useProviderStore } from '~/stores/providers'

interface AvailableModel {
  label: string
  value: string
  provider: string
}

const route = useRoute()
const router = useRouter()
const providerStore = useProviderStore()
const { isConnected, testConnection } = useApi()
const { sendMessage, loadChatHistory, isLoading } = useChat()
const { providers } = useProviders()

// Component state
const messages = ref<Message[]>([])
const selectedModel = ref<AvailableModel | null>(null)
const availableModels = ref<AvailableModel[]>([])
// Current chat ID from route
const currentRouteChatId = computed(() => route.params.id as string | undefined)

// Setup available models from providers
const setupAvailableModels = () => {
  const models: AvailableModel[] = []
  
  providerStore.providers.forEach(provider => {
    if (provider.is_active && provider.models) {
      // Models are strings from the API
      provider.models.forEach((model: string) => {
        models.push({
          label: `${provider.display_name} - ${model}`,
          value: `${provider.name}:${model}`,
          provider: provider.name
        })
      })
    }
  })
  
  availableModels.value = models
  
  // Set default model if none selected
  if (!selectedModel.value && models.length > 0) {
    selectedModel.value = models[0]
  }
}

// Load initial data
onMounted(async () => {
  try {
    // Test connection first
    await testConnection()
    
    // Load providers and set up models
    await providerStore.loadProviders()
    setupAvailableModels()
    
    // Don't load chat here - let the watcher handle it
  } catch (error) {
    console.error('Failed to initialize chat:', error)
  }
})

// Watch for route.params.id changes to load new chat history
watch(currentRouteChatId, async (newChatId, oldChatId) => {
  if (newChatId && newChatId !== oldChatId) {
    await loadExistingChat(newChatId)
  } else if (!newChatId) {
    messages.value = [] // Clear messages if no chat ID
  }
}, { immediate: true })

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
    // If chat not found, navigate back to main chat
    await router.push('/chat')
  }
}

/**
 * Handle sending a message
 */
const handleSendMessage = async (content: string) => {
  if (!content.trim() || !selectedModel.value) return
  
  // Parse model selection
  const [provider, modelName] = selectedModel.value.value.split(':')
  
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
      chatId: currentRouteChatId.value || undefined,
      provider,
      model: modelName,
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
    
    // If this created a new chat, update the route
    if (!currentRouteChatId.value && response.chat_id) {
      await router.push(`/chat/${response.chat_id}`)
    }
    
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
 * Clear chat messages and start new chat
 */
const clearChat = async () => {
  messages.value = []
  await router.push('/chat')
}

/**
 * Scroll to bottom of messages
 */
const scrollToBottom = () => {
  nextTick(() => {
    const container = document.querySelector('.message-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

// Watch for provider changes and update models
watch(() => providerStore.providers, () => {
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