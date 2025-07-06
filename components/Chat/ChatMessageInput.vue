<template>
  <div class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
    <div>
      <!-- Input Row -->
      <div class="flex items-end gap-3">
        <div class="flex-1 flex flex-col gap-2">
          <!-- Model Selector -->
          <ChatModelSelector
            v-model="localSelectedModel"
            :available-models="availableModels"
            :disabled="isLoading || !isConnected"
            @update:model-value="handleModelChange"
            class="w-full"
          />
          <UTextarea
            v-model="messageText"
            placeholder="Ask about cloud architecture, AI implementation, or get consulting advice..."
            :rows="3"
            variant="outline"
            class="flex-1"
            :disabled="isLoading || !isConnected"
            @keydown.enter.prevent.exact="handleSend"
            @keydown.enter.shift.prevent="addNewLine"
          />
        </div>
        
        <UButton
          icon="i-heroicons-paper-airplane"
          :disabled="!canSend"
          :loading="isLoading"
          size="lg"
          color="primary"
          @click="handleSend"
          class="self-end"
        >
          Send
        </UButton>
      </div>
      
      <!-- Input Help Text -->
      <div class="mt-2 flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </div>
        
        <!-- Connection Status -->
        <div v-if="!isConnected" class="flex items-center gap-2 text-xs text-red-500">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4" />
          <span>Not connected to backend</span>
        </div>
        
        <!-- Character/Token Counter -->
        <div v-else-if="messageText.length > 0" class="text-xs text-gray-500 dark:text-gray-400">
          {{ messageText.length }} characters
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AvailableModel {
  label: string
  value: string
  provider: string
}

const props = defineProps<{
  isLoading: boolean
  isConnected: boolean
  selectedModel: AvailableModel | null
  availableModels: AvailableModel[]
}>()

const emit = defineEmits<{
  sendMessage: [message: string]
  modelChange: [model: AvailableModel]
}>()

// Local state
const messageText = ref('')
const localSelectedModel = ref<AvailableModel | null>(props.selectedModel)

// Watch for external model changes
watch(() => props.selectedModel, (newModel) => {
  localSelectedModel.value = newModel
})

// Computed properties
const canSend = computed(() => {
  return messageText.value.trim().length > 0 && 
         !props.isLoading && 
         props.isConnected && 
         localSelectedModel.value
})

/**
 * Handle sending message
 */
const handleSend = () => {
  if (!canSend.value) return
  
  const message = messageText.value.trim()
  if (message) {
    emit('sendMessage', message)
    messageText.value = ''
  }
}

/**
 * Add new line to message
 */
const addNewLine = () => {
  messageText.value += '\n'
}

/**
 * Handle model selection change
 */
const handleModelChange = (model: AvailableModel) => {
  localSelectedModel.value = model
  emit('modelChange', model)
}

/**
 * Get color for model provider
 */
const getModelColor = (provider: string): string => {
  const colors: Record<string, string> = {
    'openai': 'blue',
    'anthropic': 'orange',
    'google': 'green',
    'bedrock': 'purple',
    'ollama': 'gray'
  }
  return colors[provider] || 'gray'
}

// Focus input on mount
const textarea = ref<HTMLTextAreaElement>()
onMounted(() => {
  if (textarea.value) {
    textarea.value.focus()
  }
})
</script>