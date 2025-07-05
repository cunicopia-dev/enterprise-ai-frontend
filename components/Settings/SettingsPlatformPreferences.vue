<template>
  <UCard class="shadow-lg border-0">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <UIcon name="i-heroicons-adjustments-horizontal" class="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Platform Preferences</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Customize your AI experience</p>
          </div>
        </div>
        <UBadge color="primary" variant="soft" size="sm">Personal</UBadge>
      </div>
    </template>
    
    <div class="space-y-8">
      <!-- Appearance & Interface -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <UIcon name="i-heroicons-paint-brush" class="h-4 w-4 text-primary-600" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appearance & Interface</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Theme" description="Choose your preferred color scheme">
            <USelect
              v-model="settings.theme"
              :items="themeOptions"
              size="md"
              @update:model-value="handleSettingChange"
            />
          </UFormField>
          
          <UFormField label="Default AI Model" description="Your preferred model for new conversations">
            <USelect
              v-model="settings.defaultProvider"
              :items="providerOptions"
              size="md"
              :disabled="!providerOptions.length"
              @update:model-value="handleSettingChange"
            />
          </UFormField>
        </div>
      </div>

      <!-- Chat Behavior -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="h-4 w-4 text-primary-600" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Chat Behavior</h3>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <USwitch
              v-model="settings.autoScroll"
              size="md"
              color="primary"
              @update:model-value="handleSettingChange"
            >
              <template #label>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">Auto-scroll</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Follow new messages automatically</span>
                </div>
              </template>
            </USwitch>
            
            <USwitch
              v-model="settings.streamResponses"
              size="md"
              color="primary"
              @update:model-value="handleSettingChange"
            >
              <template #label>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">Streaming responses</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">See AI responses as they generate</span>
                </div>
              </template>
            </USwitch>
          </div>
          
          <div class="space-y-4">
            <USwitch
              v-model="settings.saveHistory"
              size="md"
              color="primary"
              @update:model-value="handleSettingChange"
            >
              <template #label>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">Save history</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Keep conversations in browser storage</span>
                </div>
              </template>
            </USwitch>
            
            <USwitch
              v-model="settings.showTimestamps"
              size="md"
              color="primary"
              @update:model-value="handleSettingChange"
            >
              <template #label>
                <div class="flex flex-col">
                  <span class="font-medium text-gray-900 dark:text-white">Show timestamps</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Display message time stamps</span>
                </div>
              </template>
            </USwitch>
          </div>
        </div>
      </div>

      <!-- Performance Settings -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          <UIcon name="i-heroicons-cog-6-tooth" class="h-4 w-4 text-primary-600" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Performance & Storage</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="History Limit" description="Messages to keep in storage">
            <UInput
              v-model.number="settings.maxHistoryLength"
              type="number"
              min="10"
              max="1000"
              size="md"
              placeholder="100"
              @update:model-value="handleSettingChange"
            >
              <template #trailing>
                <span class="text-xs text-gray-400">msgs</span>
              </template>
            </UInput>
          </UFormField>
          
          <UFormField label="Response Timeout" description="Maximum wait time for responses">
            <UInput
              v-model.number="settings.responseTimeout"
              type="number"
              min="10"
              max="120"
              size="md"
              placeholder="30"
              @update:model-value="handleSettingChange"
            >
              <template #trailing>
                <span class="text-xs text-gray-400">sec</span>
              </template>
            </UInput>
          </UFormField>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Settings are saved automatically to your browser.
        </p>
        
        <div class="flex gap-2">
          <UButton 
            @click="resetSettings"
            variant="outline"
            color="gray"
            icon="i-heroicons-arrow-path"
            size="md"
          >
            Reset to Defaults
          </UButton>
          
          <UButton 
            @click="exportSettings"
            variant="outline"
            color="primary"
            icon="i-heroicons-arrow-down-tray"
            size="md"
          >
            Export Settings
          </UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface PlatformSettings {
  theme: 'system' | 'light' | 'dark'
  defaultProvider: string
  autoScroll: boolean
  saveHistory: boolean
  showTimestamps: boolean
  streamResponses: boolean
  maxHistoryLength: number
  responseTimeout: number
}

// Use providers composable to get available providers
const { providers, loadProviders } = useProviders()
const toast = useToast()
const colorMode = useColorMode()

// Default settings
const defaultSettings: PlatformSettings = {
  theme: 'system',
  defaultProvider: 'google', // Default to Gemini 2.5 Flash (free)
  autoScroll: true,
  saveHistory: true,
  showTimestamps: true,
  streamResponses: true,
  maxHistoryLength: 100,
  responseTimeout: 30
}

// Reactive settings
const settings = ref<PlatformSettings>({ ...defaultSettings })

// Theme options
const themeOptions = [
  { label: 'System', value: 'system', icon: 'i-heroicons-computer-desktop' },
  { label: 'Light', value: 'light', icon: 'i-heroicons-sun' },
  { label: 'Dark', value: 'dark', icon: 'i-heroicons-moon' }
]

// Provider options (computed from loaded providers)
const providerOptions = computed(() => {
  if (!providers.value.length) {
    return [
      { label: 'Loading providers...', value: 'loading', disabled: true }
    ]
  }
  
  return providers.value
    .filter(provider => provider.is_active)
    .map(provider => ({
      label: provider.display_name,
      value: provider.name,
      icon: getProviderIcon(provider.name)
    }))
})

/**
 * Get provider icon
 */
const getProviderIcon = (providerName: string): string => {
  const icons: Record<string, string> = {
    'openai': 'i-heroicons-cpu-chip',
    'anthropic': 'i-heroicons-sparkles',
    'google': 'i-heroicons-beaker',
    'bedrock': 'i-heroicons-cloud',
    'ollama': 'i-heroicons-server'
  }
  return icons[providerName] || 'i-heroicons-cpu-chip'
}

/**
 * Handle setting changes with better error handling
 */
const handleSettingChange = (value: any) => {
  console.log('Setting changed:', value, 'Current settings:', settings.value)
  
  // Apply theme change immediately
  if (settings.value.theme !== colorMode.preference) {
    colorMode.preference = settings.value.theme
  }
  
  saveSettings()
}

/**
 * Save settings to localStorage
 */
const saveSettings = () => {
  if (process.client) {
    try {
      const settingsJson = JSON.stringify(settings.value)
      localStorage.setItem('enterpriseAI.platformSettings', settingsJson)
      console.log('Settings saved successfully:', settings.value)
      
      toast.add({
        title: 'Settings Saved',
        description: 'Your preferences have been saved successfully',
        color: 'green'
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.add({
        title: 'Save Failed',
        description: 'Could not save settings. Please try again.',
        color: 'red'
      })
    }
  }
}

/**
 * Load settings from localStorage
 */
const loadSettings = () => {
  if (process.client) {
    try {
      const saved = localStorage.getItem('enterpriseAI.platformSettings')
      console.log('Loading saved settings:', saved)
      if (saved) {
        const parsed = JSON.parse(saved)
        settings.value = { ...defaultSettings, ...parsed }
        console.log('Settings loaded successfully:', settings.value)
      } else {
        console.log('No saved settings found, using defaults:', defaultSettings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }
}

/**
 * Reset settings to defaults
 */
const resetSettings = () => {
  settings.value = { ...defaultSettings }
  saveSettings()
  
  toast.add({
    title: 'Settings Reset',
    description: 'All settings have been reset to defaults',
    color: 'blue'
  })
}

/**
 * Export settings as JSON file
 */
const exportSettings = () => {
  if (process.client) {
    try {
      const dataStr = JSON.stringify(settings.value, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `enterprise-ai-settings-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.add({
        title: 'Settings Exported',
        description: 'Settings file has been downloaded',
        color: 'green'
      })
    } catch (error) {
      toast.add({
        title: 'Export Failed',
        description: 'Could not export settings',
        color: 'red'
      })
    }
  }
}

// Load providers and settings on mount
onMounted(async () => {
  loadSettings()
  
  // Sync theme with color mode
  if (colorMode.preference && settings.value.theme !== colorMode.preference) {
    settings.value.theme = colorMode.preference as 'system' | 'light' | 'dark'
  }
  
  try {
    await loadProviders()
    
    // If no default provider is set or invalid, set to first available
    if (!settings.value.defaultProvider || !providers.value.find(p => p.name === settings.value.defaultProvider)) {
      const geminiProvider = providers.value.find(p => p.name === 'google')
      const firstActiveProvider = providers.value.find(p => p.is_active)
      
      if (geminiProvider?.is_active) {
        settings.value.defaultProvider = 'google'
      } else if (firstActiveProvider) {
        settings.value.defaultProvider = firstActiveProvider.name
      }
      
      saveSettings()
    }
  } catch (error) {
    console.error('Failed to load providers:', error)
  }
})

// Watch for external color mode changes and sync with settings
watch(() => colorMode.preference, (newMode) => {
  if (newMode && settings.value.theme !== newMode) {
    settings.value.theme = newMode as 'system' | 'light' | 'dark'
    saveSettings()
  }
})
</script>