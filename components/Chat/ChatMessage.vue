<template>
  <!-- System Message (collapsed/expandable) -->
  <div v-if="message.role === 'system'" class="flex justify-center mb-2">
    <div class="w-full max-w-4xl">
      <div class="flex justify-center">
        <div 
          class="text-xs text-gray-400 dark:text-gray-600 italic cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          @click="toggleSystemMessage"
        >
          <div class="flex items-center gap-1">
            <UIcon 
              :name="isSystemExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'" 
              class="h-3 w-3" 
            />
            <span v-if="!isSystemExpanded">System prompt...</span>
            <span v-else>System prompt</span>
          </div>
          <div v-if="isSystemExpanded" class="mt-1 max-w-md text-left bg-gray-50 dark:bg-gray-900 p-2 rounded border text-gray-600 dark:text-gray-400">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Regular Messages -->
  <div v-else class="flex justify-center">
    <div class="w-full max-w-4xl">
      <div
        class="flex gap-3"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- Avatar for Assistant -->
        <div v-if="message.role === 'assistant'" class="flex-shrink-0">
          <div class="relative w-8 h-8">
            <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-br from-primary-400 to-blue-500 rounded-lg animate-pulse"></div>
            <div class="relative w-full h-full bg-gradient-to-br from-primary-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
              <UIcon
                v-if="isLoading"
                name="i-heroicons-ellipsis-horizontal"
                class="h-4 w-4 text-white animate-pulse"
              />
              <UIcon
                v-else
                name="i-heroicons-sparkles"
                class="h-4 w-4 text-white"
              />
            </div>
          </div>
        </div>

        <!-- Message Content -->
        <div class="flex-1" :class="message.role === 'user' ? 'max-w-md' : ''">
          <!-- Assistant Header (only for assistant messages) -->
          <div v-if="message.role === 'assistant' && (message.provider || message.metadata?.error)" class="flex items-center gap-2 mb-2">
            <div v-if="message.provider && !isLoading" class="flex items-center gap-1">
              <div class="w-1.5 h-1.5 rounded-full" :class="`bg-${getProviderColor(message.provider)}-500`"></div>
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {{ getProviderLabel(message.provider) }}
              </span>
            </div>
            <UBadge
              v-if="message.metadata?.error"
              label="Error"
              color="red"
              variant="soft"
              size="xs"
            />
          </div>

          <!-- User Message Bubble OR Assistant Plain Text -->
          <div v-if="message.role === 'user'" 
               class="relative bg-gradient-to-br from-primary-600 to-blue-700 text-white px-5 py-3 rounded-2xl rounded-br-md shadow-lg backdrop-blur-sm">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-2xl rounded-br-md"></div>
            <div class="relative">
              <div class="text-sm leading-relaxed font-medium">
                {{ message.content }}
              </div>
              <div class="mt-2 text-xs opacity-75 text-primary-100">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>
          
          <div v-else class="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <!-- Assistant Message Content -->
            <div class="text-sm leading-relaxed text-gray-900 dark:text-gray-100">
              <div
                v-if="isLoading"
                class="flex items-center gap-3"
              >
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
                <span class="text-gray-600 dark:text-gray-400 font-medium">{{ message.content }}</span>
              </div>
              <div
                v-else
                v-html="formatMessageContent(message.content)"
                class="prose prose-sm dark:prose-invert max-w-none"
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

            <!-- Timestamp -->
            <div v-if="!isLoading" class="mt-3 text-xs opacity-60 text-gray-500 dark:text-gray-400 font-medium">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Avatar for User -->
        <div v-if="message.role === 'user'" class="flex-shrink-0">
          <div class="relative w-8 h-8">
            <div class="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg"></div>
            <div class="relative w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
              <UIcon name="i-heroicons-user" class="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/api'

defineProps<{
  message: Message
  isLoading?: boolean
}>()

// System message expansion state
const isSystemExpanded = ref(false)

const toggleSystemMessage = () => {
  isSystemExpanded.value = !isSystemExpanded.value
}

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
  let formatted = content
    // Headings (h1-h6)
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary-500 hover:underline">$1</a>')
    // Code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded-md mt-2 mb-2 overflow-x-auto text-sm"><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">$1</code>')
    // Unordered lists
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside mt-2 mb-2 space-y-1">$1</ul>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ol class="list-decimal list-inside mt-2 mb-2 space-y-1">$1</ol>')
    // Line breaks
    .replace(/\n/g, '<br>')

  return formatted
}
</script>
