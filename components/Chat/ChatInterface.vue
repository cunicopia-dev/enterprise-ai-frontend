<template>
  <div class="flex h-[calc(100vh-240px)] flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/30 relative overflow-hidden">
    <!-- Subtle animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-32 h-32 bg-gradient-to-br from-primary-200/5 to-blue-200/5 dark:from-primary-800/5 dark:to-blue-800/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-24 -left-24 w-32 h-32 bg-gradient-to-br from-blue-200/5 to-purple-200/5 dark:from-blue-800/5 dark:to-purple-800/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 3s;"></div>
    </div>
    
    <!-- Chat Header -->
    <div class="relative z-10 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-6 py-4">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <div class="relative w-10 h-10">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl animate-pulse"></div>
            <div class="relative w-full h-full bg-gradient-to-br from-primary-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Enterprise AI Console</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Multi-Provider Intelligence</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="relative">
              <div class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"></div>
              <div v-if="isConnected" class="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <span class="text-xs font-medium" :class="isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ isConnected ? 'ONLINE' : 'OFFLINE' }}
            </span>
          </div>
          <UButton 
            icon="i-heroicons-arrow-path" 
            variant="ghost" 
            color="gray" 
            size="sm"
            @click="clearChat"
            :disabled="isLoading"
            class="hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200"
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
import type { Message } from '~/types/api'
import { useApi, useChat } from '~/composables/useApi'
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
// Removed unused providers destructuring

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