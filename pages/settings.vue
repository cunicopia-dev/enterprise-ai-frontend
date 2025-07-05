<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
          <UIcon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p class="text-gray-600 dark:text-gray-400">Configure your AI consultation platform preferences</p>
        </div>
      </div>
    </div>

    <!-- Backend Connection -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-server" class="h-6 w-6 text-primary-600" />
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Backend Connection</h2>
          </div>
          <UBadge 
            :color="backendConnected ? 'green' : 'red'" 
            variant="soft"
            :label="backendConnected ? 'Connected' : 'Disconnected'"
          />
        </div>
      </template>
      
      <div class="space-y-6">
        <div class="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-information-circle" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-1">How It Works</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Our backend handles all AI provider connections, advanced multi-provider logic, and MCP integration. 
                You get free access to enterprise-grade AI consultation - no setup required.
              </p>
            </div>
          </div>
        </div>

        <UFormGroup label="Backend API URL" help="Make It Real's AI consultation backend" class="mb-6">
          <USelect
            v-model="backendUrl"
            :items="backendUrlOptions"
            icon="i-heroicons-link"
            class="w-full mt-2"
            size="lg"
          />
        </UFormGroup>
        
        <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton 
            @click="testBackendConnection"
            :loading="testingBackend"
            variant="outline"
            icon="i-heroicons-signal"
            size="lg"
          >
            Test Connection
          </UButton>
          
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ lastConnectionTest ? `Last tested: ${formatTime(lastConnectionTest)}` : 'Never tested' }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- AI Platform Status -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-cpu-chip" class="h-6 w-6 text-primary-600" />
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">AI Platform Status</h2>
          </div>
          <UBadge 
            :color="backendConnected ? 'green' : 'orange'" 
            variant="soft"
            :label="backendConnected ? 'Platform Ready' : 'Check Connection'"
          />
        </div>
      </template>
      
      <div class="space-y-6">
        <div class="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-beaker" class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-1">AI Technology Demo</h3>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Experience our advanced AI capabilities firsthand. This demonstration showcases the type of 
                intelligent systems we build for enterprise clients using cutting-edge AI integration.
              </p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-cpu-chip" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">OpenAI GPT</h3>
            <p class="text-sm text-blue-700 dark:text-blue-300">Available & Ready</p>
          </div>
          
          <div class="text-center p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
            <div class="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-sparkles" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-orange-800 dark:text-orange-200 mb-2">Anthropic Claude</h3>
            <p class="text-sm text-orange-700 dark:text-orange-300">Available & Ready</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Platform Settings -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon name="i-heroicons-adjustments-horizontal" class="h-6 w-6 text-primary-600" />
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Platform Settings</h2>
        </div>
      </template>
      
      <div class="space-y-8">
        <UFormGroup label="Theme" help="Choose your preferred color theme" class="mb-6">
          <USelect
            v-model="platformSettings.theme"
            :items="themeOptions"
            icon="i-heroicons-paint-brush"
            class="w-full mt-2"
            size="lg"
          />
        </UFormGroup>
        
        <UFormGroup label="Preferred AI Model" help="Choose your preferred AI model for conversations" class="mb-6">
          <USelect
            v-model="platformSettings.defaultProvider"
            :items="availableProviders"
            icon="i-heroicons-cpu-chip"
            class="w-full mt-2"
            size="lg"
          />
        </UFormGroup>
        
        <UFormGroup label="Chat Settings" class="mb-6">
          <div class="space-y-4 mt-3">
            <UToggle v-model="platformSettings.autoScroll">
              <template #label>
                <span class="text-sm font-medium">Auto-scroll to new messages</span>
              </template>
            </UToggle>
            
            <UToggle v-model="platformSettings.saveHistory">
              <template #label>
                <span class="text-sm font-medium">Save chat history locally</span>
              </template>
            </UToggle>
            
            <UToggle v-model="platformSettings.showTimestamps">
              <template #label>
                <span class="text-sm font-medium">Show message timestamps</span>
              </template>
            </UToggle>
          </div>
        </UFormGroup>
      </div>
      
      <template #footer>
        <div class="flex justify-between items-center pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Settings are saved automatically to your browser.
          </p>
          
          <UButton 
            @click="saveSettings"
            :loading="saving"
            color="primary"
            icon="i-heroicons-check"
            size="lg"
          >
            Save Settings
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Support Information -->
    <UCard class="bg-gradient-to-r from-primary-50 dark:from-primary-950/50 to-blue-50 dark:to-blue-950/50 border-primary-200 dark:border-primary-800">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <UIcon name="i-heroicons-question-mark-circle" class="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need Help?</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              This enterprise AI platform is built by Make It Real Consulting. We specialize in cloud architecture, 
              AI implementation, and production-ready solutions.
            </p>
            <div class="flex flex-wrap gap-4 mt-6">
              <UButton 
                to="https://makeitrealconsulting.com" 
                target="_blank"
                variant="outline" 
                color="primary"
                icon="i-heroicons-arrow-top-right-on-square"
                size="md"
              >
                Visit Our Website
              </UButton>
              <UButton 
                to="mailto:kc@makeitrealconsulting.com"
                variant="outline" 
                color="primary"
                icon="i-heroicons-envelope"
                size="md"
              >
                Contact Support
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface PlatformSettings {
  theme: string
  defaultProvider: string
  autoScroll: boolean
  saveHistory: boolean
  showTimestamps: boolean
}

// Backend configuration
const backendUrl = ref('http://localhost:8000')

const backendUrlOptions = [
  { label: 'Local Development (localhost:8000)', value: 'http://localhost:8000' },
  { label: 'Production API', value: 'https://api.makeitrealconsulting.com' }
]

const backendConnected = ref(false)
const testingBackend = ref(false)
const lastConnectionTest = ref<Date | null>(null)

const platformSettings = ref<PlatformSettings>({
  theme: 'system',
  defaultProvider: 'openai',
  autoScroll: true,
  saveHistory: true,
  showTimestamps: true
})

const saving = ref(false)

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

// Available AI providers (no user keys needed)
const availableProviders = [
  { label: 'OpenAI GPT-4', value: 'openai' },
  { label: 'Anthropic Claude', value: 'anthropic' }
]

const formatTime = (timestamp: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

// Backend API calls
const testBackendConnection = async () => {
  testingBackend.value = true
  
  try {
    // Test health endpoint first (no auth required)
    const healthResponse = await fetch(`${backendUrl.value}/health`)
    if (!healthResponse.ok) {
      throw new Error('Backend health check failed')
    }
    
    backendConnected.value = true
    lastConnectionTest.value = new Date()
    
    const toast = useToast()
    toast.add({
      title: 'Backend Connected',
      description: 'Successfully connected to Make It Real\'s AI backend',
      color: 'green'
    })
  } catch (error) {
    backendConnected.value = false
    lastConnectionTest.value = new Date()
    
    const toast = useToast()
    toast.add({
      title: 'Connection Failed',
      description: `Could not connect to backend: ${error.message}`,
      color: 'red'
    })
  } finally {
    testingBackend.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  
  try {
    // Save to localStorage in browser
    if (process.client) {
      localStorage.setItem('enterpriseAI.backendUrl', backendUrl.value)
      localStorage.setItem('enterpriseAI.platformSettings', JSON.stringify(platformSettings.value))
    }
    
    const toast = useToast()
    toast.add({
      title: 'Settings Saved',
      description: 'Your preferences have been saved successfully',
      color: 'green'
    })
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Save Failed',
      description: 'Could not save settings. Please try again.',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

// Load settings on mount
onMounted(() => {
  if (process.client) {
    const savedBackendUrl = localStorage.getItem('enterpriseAI.backendUrl')
    const savedPlatformSettings = localStorage.getItem('enterpriseAI.platformSettings')
    
    if (savedBackendUrl) {
      backendUrl.value = savedBackendUrl
    }
    
    if (savedPlatformSettings) {
      platformSettings.value = JSON.parse(savedPlatformSettings)
    }
    
    // Auto-test connection if we have a backend URL
    if (backendUrl.value) {
      testBackendConnection()
    }
  }
})

useHead({
  title: 'Settings - Make It Real Enterprise AI Platform',
  meta: [
    { name: 'description', content: 'Configure your preferences for Make It Real\'s enterprise AI consultation platform.' }
  ]
})
</script>