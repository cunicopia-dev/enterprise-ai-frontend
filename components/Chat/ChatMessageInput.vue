<template>
  <div class="relative z-10 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6">
    <div>
      <!-- Input Row -->
      <div class="relative">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-blue-500/20 rounded-2xl blur-sm"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div class="p-4">
            <!-- Model Selector -->
            <div class="mb-3">
              <ChatModelSelector
                v-model="localSelectedModel"
                :available-models="availableModels"
                :disabled="isLoading || !isConnected"
                @update:model-value="handleModelChange"
                class="w-full"
              />
            </div>
            
            <div class="flex items-end gap-4">
              <UTextarea
                v-model="messageText"
                placeholder="Ask about cloud architecture, AI implementation, or get consulting advice..."
                :rows="3"
                variant="none"
                class="flex-1 border-0 focus:ring-0 resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :disabled="isLoading || !isConnected"
                @keydown.enter.prevent.exact="handleSend"
                @keydown.enter.shift.prevent="addNewLine"
              />
              
              <div class="relative">
                <div v-if="canSend" class="absolute inset-0 bg-gradient-to-r from-primary-500 to-blue-600 rounded-xl animate-pulse"></div>
                <UButton
                  icon="i-heroicons-paper-airplane"
                  :disabled="!canSend"
                  :loading="isLoading"
                  size="lg"
                  class="relative bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                  @click="handleSend"
                >
                  Send
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input Help Text -->
      <div class="mt-4 flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
          <span class="inline-flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">Enter</kbd>
            to send,
            <kbd class="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">Shift+Enter</kbd>
            for new line
          </span>
        </div>
        
        <!-- Connection Status -->
        <div v-if="!isConnected" class="flex items-center gap-2 text-xs text-red-500 font-medium">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4" />
          <span>Backend offline</span>
        </div>
        
        <!-- Character/Token Counter -->
        <div v-else-if="messageText.length > 0" class="text-xs text-gray-500 dark:text-gray-400 font-medium">
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

// Removed unused getModelColor function

// Focus input on mount
const textarea = ref<HTMLTextAreaElement>()
onMounted(() => {
  if (textarea.value) {
    textarea.value.focus()
  }
})
</script>