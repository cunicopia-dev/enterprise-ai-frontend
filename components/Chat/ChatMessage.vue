<template>
  <div 
    class="flex gap-4"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <!-- Avatar -->
    <div v-if="message.role === 'assistant'" class="flex-shrink-0">
      <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
        <UIcon 
          v-if="isLoading"
          name="i-heroicons-ellipsis-horizontal" 
          class="h-5 w-5 text-white animate-pulse" 
        />
        <UIcon 
          v-else
          name="i-heroicons-sparkles" 
          class="h-5 w-5 text-white" 
        />
      </div>
    </div>
    
    <!-- Message Bubble -->
    <UCard 
      class="max-w-lg lg:max-w-2xl"
      :class="[
        message.role === 'user' 
          ? 'bg-primary-600 text-white border-primary-600' 
          : 'bg-white dark:bg-gray-800',
        message.metadata?.error ? 'border-red-200 dark:border-red-800' : ''
      ]"
    >
      <div class="p-4">
        <!-- Assistant Header -->
        <div v-if="message.role === 'assistant'" class="flex items-center gap-2 mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ isLoading ? 'AI Assistant' : 'AI Assistant' }}
          </span>
          <UBadge 
            v-if="message.provider && !isLoading"
            :label="getProviderLabel(message.provider)" 
            :color="getProviderColor(message.provider)" 
            variant="soft" 
            size="xs"
          />
          <UBadge 
            v-if="message.metadata?.error"
            label="Error" 
            color="red" 
            variant="soft" 
            size="xs"
          />
        </div>
        
        <!-- Message Content -->
        <div class="prose prose-sm max-w-none">
          <div 
            v-if="isLoading"
            class="flex items-center gap-2"
          >
            <UIcon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5 text-gray-400 animate-pulse" />
            <span class="text-sm text-gray-500">{{ message.content }}</span>
          </div>
          <div
            v-else
            :class="message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-gray-100'"
            v-html="formatMessageContent(message.content)"
          />
        </div>
        
        <!-- Tool Executions -->
        <div v-if="message.metadata?.tool_executions?.length" class="mt-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-wrench-screwdriver" class="h-4 w-4" />
            Tool Executions
          </h4>
          <div class="space-y-2">
            <div 
              v-for="execution in message.metadata.tool_executions" 
              :key="execution.tool_name"
              class="text-sm"
            >
              <div class="flex items-center gap-2">
                <UBadge 
                  :label="execution.tool_name" 
                  :color="execution.success ? 'green' : 'red'" 
                  variant="soft" 
                  size="xs"
                />
                <span class="text-gray-600 dark:text-gray-400">
                  {{ execution.execution_time }}ms
                </span>
              </div>
              <div v-if="execution.result" class="mt-1 text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                {{ typeof execution.result === 'string' ? execution.result : JSON.stringify(execution.result, null, 2) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Usage Info -->
        <div v-if="message.metadata?.usage && !isLoading" class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
          <span>{{ formatTime(message.timestamp) }}</span>
          <span v-if="message.metadata.usage.total_tokens">
            {{ message.metadata.usage.total_tokens }} tokens
          </span>
          <span v-if="message.model">
            {{ message.model }}
          </span>
        </div>
        
        <!-- Simple Timestamp -->
        <div v-else-if="!isLoading" class="mt-2 text-xs opacity-70">
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
</template>

<script setup lang="ts">
import type { Message } from '~/types/api'

const props = defineProps<{
  message: Message
  isLoading?: boolean
}>()

/**
 * Format message timestamp
 */
const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

/**
 * Get provider display label
 */
const getProviderLabel = (provider: string): string => {
  const labels: Record<string, string> = {
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'google': 'Google',
    'bedrock': 'Bedrock',
    'ollama': 'Ollama'
  }
  return labels[provider] || provider
}

/**
 * Get provider color for badge
 */
const getProviderColor = (provider: string): string => {
  const colors: Record<string, string> = {
    'openai': 'blue',
    'anthropic': 'orange',
    'google': 'green',
    'bedrock': 'purple',
    'ollama': 'gray'
  }
  return colors[provider] || 'gray'
}

/**
 * Format message content with basic markdown support
 */
const formatMessageContent = (content: string): string => {
  // Basic markdown formatting
  let formatted = content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')
    // Bullet points
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside mt-2 mb-2 space-y-1">$1</ul>')
  
  return formatted
}
</script>