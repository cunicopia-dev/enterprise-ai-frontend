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
          <p class="text-gray-600 dark:text-gray-400">Configure your AI platform preferences and connection settings</p>
        </div>
      </div>
    </div>

    <!-- Backend Connection -->
    <SettingsBackendConnection />

    <!-- AI Provider Status -->
    <SettingsProviderStatus />

    <!-- Platform Preferences -->
    <SettingsPlatformPreferences />

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
// Import settings components from subdirectory
import SettingsBackendConnection from '~/components/Settings/SettingsBackendConnection.vue'
import SettingsProviderStatus from '~/components/Settings/SettingsProviderStatus.vue'
import SettingsPlatformPreferences from '~/components/Settings/SettingsPlatformPreferences.vue'

useHead({
  title: 'Settings - Make It Real Enterprise AI Platform',
  meta: [
    { name: 'description', content: 'Configure your preferences for Make It Real\'s enterprise AI consultation platform.' }
  ]
})
</script>