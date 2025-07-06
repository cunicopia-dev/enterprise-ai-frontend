<template>
  <div class="flex-1 overflow-y-auto p-4 message-container" ref="messagesContainer">
    <!-- Empty State -->
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
        <div v-if="isConnected" class="grid grid-cols-1 gap-2 text-sm">
          <UCard 
            v-for="sample in sampleMessages" 
            :key="sample.id"
            class="p-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors" 
            @click="$emit('sampleMessage', sample.text)"
          >
            <p class="text-gray-700 dark:text-gray-300">{{ sample.text }}</p>
          </UCard>
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

const emit = defineEmits<{
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