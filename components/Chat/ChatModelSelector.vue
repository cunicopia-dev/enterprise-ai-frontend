<template>
  <USelect
    :model-value="modelValue"
    :items="selectItems"
    placeholder="Choose AI Model"
    size="sm"
    icon="i-heroicons-cpu-chip"
    class="w-56"
    :disabled="disabled"
    @update:model-value="handleModelChange"
  />
</template>

<script setup lang="ts">
interface AvailableModel {
  label: string
  value: string
  provider: string
}

interface SelectItem {
  label: string
  value: string
  icon?: string
  color?: string
  disabled?: boolean
}

const props = defineProps<{
  modelValue: AvailableModel | null
  availableModels: AvailableModel[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [model: AvailableModel]
}>()

// Convert available models to select items
const selectItems = computed((): SelectItem[] => {
  return props.availableModels.map(model => ({
    label: model.label,
    value: model.value,
    icon: getProviderIcon(model.provider),
    color: getProviderColor(model.provider),
    disabled: false
  }))
})

/**
 * Handle model selection change
 */
const handleModelChange = (value: string) => {
  const selectedModel = props.availableModels.find(m => m.value === value)
  if (selectedModel) {
    emit('update:modelValue', selectedModel)
  }
}

/**
 * Get icon for provider
 */
const getProviderIcon = (provider: string): string => {
  const icons: Record<string, string> = {
    'openai': 'i-heroicons-cpu-chip',
    'anthropic': 'i-heroicons-sparkles',
    'google': 'i-heroicons-beaker',
    'bedrock': 'i-heroicons-cloud',
    'ollama': 'i-heroicons-server'
  }
  return icons[provider] || 'i-heroicons-cpu-chip'
}

/**
 * Get color for provider
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
</script>