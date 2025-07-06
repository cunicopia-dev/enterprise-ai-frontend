<template>
  <div class="flex-1 overflow-y-auto p-6 message-container relative z-10" ref="messagesContainer">
    <!-- Empty State -->
    <div v-if="!messages.length" class="flex h-full items-center justify-center">
      <div class="text-center max-w-lg">
        <div class="relative w-20 h-20 mx-auto mb-8">
          <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-3xl animate-pulse"></div>
          <div class="relative w-full h-full bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center shadow-lg">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">AI Console</span> Ready
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
          Enterprise-grade AI consultation at your fingertips. Ask about cloud architecture, AI implementation, or strategic technology decisions.
        </p>
        
        <!-- Connection Status Warning -->
        <div v-if="!isConnected" class="bg-red-50 dark:bg-red-950/50 rounded-lg p-4 border border-red-200 dark:border-red-800 mb-6">
          <div class="flex items-center gap-2 text-red-700 dark:text-red-300">
            <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5" />
            <span class="text-sm font-medium">Not connected to AI backend</span>
          </div>
          <p class="text-sm text-red-600 dark:text-red-400 mt-1">
            Please check your connection in settings before starting a conversation.
          </p>
        </div>
        
        <!-- Sample Messages -->
        <div v-if="isConnected" class="grid grid-cols-1 gap-3">
          <div 
            v-for="sample in sampleMessages" 
            :key="sample.id"
            class="group relative p-4 cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            @click="$emit('sampleMessage', sample.text)"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-blue-50/50 dark:from-primary-950/20 dark:to-blue-950/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-primary-500 mt-2 opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <p class="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-medium">{{ sample.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Messages -->
    <div v-else class="space-y-4">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      
      <!-- Loading Indicator -->
      <ChatMessage
        v-if="isLoading"
        :message="loadingMessage"
        :is-loading="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/api'

interface SampleMessage {
  id: string
  text: string
  category: string
}

const props = defineProps<{
  messages: Message[]
  isLoading: boolean
  isConnected: boolean
}>()

defineEmits<{
  sampleMessage: [message: string]
}>()

const messagesContainer = ref<HTMLElement>()

// Sample messages for empty state
const sampleMessages: SampleMessage[] = [
  {
    id: '1',
    text: 'What are the best practices for AWS serverless architecture?',
    category: 'cloud'
  },
  {
    id: '2',
    text: 'How can I implement multi-provider AI in my application?',
    category: 'ai'
  },
  {
    id: '3',
    text: 'What are the cost optimization strategies for cloud infrastructure?',
    category: 'optimization'
  }
]

// Loading message for typing indicator
const loadingMessage: Message = {
  id: 'loading',
  role: 'assistant',
  content: 'AI is thinking...',
  timestamp: new Date(),
  metadata: { loading: true }
}

// Scroll to bottom when messages change
watch(() => props.messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

// Expose scroll method for parent component
defineExpose({
  scrollToBottom: () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
})
</script>