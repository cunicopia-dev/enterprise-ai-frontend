<template>
  <div class="space-y-4">
    <!-- Call to Action Banner -->
    <div class="bg-primary-50 dark:bg-primary-950/50 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
      <p class="text-sm text-primary-700 dark:text-primary-300 text-center">
        💡 <strong>Interested in AI services like this for your company?</strong> With your own data, use cases, and servers? 
        <a href="https://makeitrealconsulting.com/contact" target="_blank" class="font-semibold underline hover:text-primary-800">Let's chat!</a>
      </p>
    </div>
    
    <!-- Chat Interface -->
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
          />
        </div>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="flex-1 overflow-y-auto p-6" ref="messagesContainer">
      <div v-if="!messages.length" class="flex h-full items-center justify-center">
        <div class="text-center max-w-md">
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Start Your AI Consultation
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Ask questions about cloud architecture, AI implementation, or get expert consulting advice from our enterprise-grade AI platform.
          </p>
          <div class="grid grid-cols-1 gap-2 text-sm">
            <UCard class="p-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors" @click="sendSampleMessage('What are the best practices for AWS serverless architecture?')">
              <p class="text-gray-700 dark:text-gray-300">"What are the best practices for AWS serverless architecture?"</p>
            </UCard>
            <UCard class="p-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors" @click="sendSampleMessage('How can I implement multi-provider AI in my application?')">
              <p class="text-gray-700 dark:text-gray-300">"How can I implement multi-provider AI in my application?"</p>
            </UCard>
            <UCard class="p-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors" @click="sendSampleMessage('What are the cost optimization strategies for cloud infrastructure?')">
              <p class="text-gray-700 dark:text-gray-300">"What are the cost optimization strategies for cloud infrastructure?"</p>
            </UCard>
          </div>
        </div>
      </div>
      
      <div v-else class="mx-auto max-w-4xl space-y-6">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="flex gap-4"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Avatar -->
          <div v-if="message.role === 'assistant'" class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
            </div>
          </div>
          
          <!-- Message Bubble -->
          <UCard 
            class="max-w-lg lg:max-w-2xl"
            :class="message.role === 'user' 
              ? 'bg-primary-600 text-white border-primary-600' 
              : 'bg-white dark:bg-gray-800'
            "
          >
            <div class="p-4">
              <div v-if="message.role === 'assistant'" class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300">AI Assistant</span>
                <UBadge 
                  :label="message.provider || selectedProvider?.label || 'AI'" 
                  color="primary" 
                  variant="soft" 
                  size="xs"
                />
              </div>
              <div class="prose prose-sm max-w-none">
                <p :class="message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'">
                  {{ message.content }}
                </p>
              </div>
              <div class="mt-2 text-xs opacity-70">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </UCard>
          
          <!-- User Avatar -->
          <div v-if="message.role === 'user'" class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex gap-4 justify-start">
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
          </div>
          <UCard class="max-w-xs">
            <div class="p-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5 text-gray-400 animate-pulse" />
                <span class="text-sm text-gray-500">AI is thinking...</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div class="mx-auto max-w-4xl">
        
        <div class="flex items-center gap-3 mb-3">
          <USelect
            v-model="selectedModel"
            :items="availableModels"
            placeholder="Choose AI Model"
            size="sm"
            icon="i-heroicons-cpu-chip"
            class="w-56"
          />
          <UBadge 
            v-if="selectedModel"
            :color="getModelColor(selectedModel.provider)" 
            variant="soft" 
            :label="selectedModel.label"
          />
        </div>
        
        <div class="flex gap-3">
          <UTextarea
            v-model="newMessage"
            placeholder="Ask about cloud architecture, AI implementation, or get consulting advice..."
            :rows="3"
            variant="outline"
            class="flex-1"
            @keydown.enter.prevent.exact="sendMessage"
            @keydown.enter.shift.prevent="newMessage += '\n'"
          />
          
          <UButton
            icon="i-heroicons-paper-airplane"
            :disabled="!newMessage.trim() || isLoading || !selectedModel"
            :loading="isLoading"
            size="lg"
            color="primary"
            @click="sendMessage"
            class="self-end"
          >
            Send
          </UButton>
        </div>
        
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  provider?: string
}

const newMessage = ref('')
const messages = ref<Message[]>([])
const selectedModel = ref(null as any)
const isLoading = ref(false)
const isConnected = ref(true)
const messagesContainer = ref(null)

const availableModels = [
  { label: 'GPT-4o (OpenAI)', value: 'gpt-4o', provider: 'openai' },
  { label: 'Claude 3.5 Haiku (Anthropic)', value: 'claude-3.5-haiku', provider: 'anthropic' },
  { label: 'Gemini 2.5 Flash (Google)', value: 'gemini-2.5-flash', provider: 'gemini' },
  { label: 'Claude 3.5 Sonnet (Bedrock)', value: 'claude-3.5-sonnet-bedrock', provider: 'bedrock' }
]

// Set default model to Gemini 2.5 Flash (free)
onMounted(() => {
  selectedModel.value = availableModels[2] // Gemini 2.5 Flash
})

const getModelColor = (provider: string) => {
  switch (provider) {
    case 'openai': return 'blue'
    case 'anthropic': return 'orange' 
    case 'gemini': return 'green'
    case 'bedrock': return 'purple'
    default: return 'gray'
  }
}

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendSampleMessage = (message: string) => {
  newMessage.value = message
  sendMessage()
}

const clearChat = () => {
  messages.value = []
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !selectedModel.value) return
  
  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content: newMessage.value.trim(),
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  scrollToBottom()
  
  const messageText = newMessage.value
  newMessage.value = ''
  isLoading.value = true
  
  try {
    // Simulate different response characteristics per model
    const modelInfo = {
      'gpt-4o': { time: 1000, style: 'comprehensive and analytical' },
      'claude-3.5-haiku': { time: 800, style: 'fast and efficient' },
      'gemini-2.5-flash': { time: 600, style: 'quick and direct' },
      'claude-3.5-sonnet-bedrock': { time: 1200, style: 'thoughtful and detailed' }
    }
    
    const currentModel = modelInfo[selectedModel.value.value] || modelInfo['gpt-4o']
    await new Promise(resolve => setTimeout(resolve, currentModel.time))
    
    // Model-specific response demonstrating capabilities
    const responseContent = `**${selectedModel.value.label} Response:**

I understand you're asking about "${messageText}". As a ${currentModel.style} AI model, I can demonstrate how Make It Real integrates different AI capabilities for various use cases.

This multi-model approach allows us to:
• Choose the optimal AI for each specific task
• Leverage unique strengths of different providers
• Ensure redundancy and reliability in production
• Customize responses based on your business needs

Try switching between models to see how each one handles your question differently. This showcases the kind of intelligent model selection we build into enterprise systems.`
    
    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      provider: selectedModel.value.label
    }
    
    messages.value.push(assistantMessage)
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
    
    const errorMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: 'I apologize, but I encountered an error processing your request. Please check your provider configuration in the settings.',
      timestamp: new Date(),
      provider: selectedModel.value.label
    }
    
    messages.value.push(errorMessage)
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Enterprise AI Chat - Make It Real Consulting',
  meta: [
    { name: 'description', content: 'Multi-provider AI chat interface for enterprise consultation and cloud architecture guidance.' }
  ]
})
</script>