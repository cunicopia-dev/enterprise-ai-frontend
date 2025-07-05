<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-bold text-gray-900 dark:text-white">Make It Real</span>
              <span class="text-xs text-primary-600 dark:text-primary-400 -mt-1">Enterprise AI Platform</span>
            </div>
          </NuxtLink>

          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-home"
              color="gray"
              variant="ghost"
              size="sm"
              to="/"
              label="Home"
            />
            
            <UButton
              icon="i-heroicons-chat-bubble-left-right"
              color="primary"
              variant="ghost"
              size="sm"
              to="/chat"
              label="Chat"
            />
            
            <UDivider orientation="vertical" class="h-6" />
            
            <UButton
              :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
              color="gray"
              variant="ghost"
              size="sm"
              @click="toggleColorMode"
            />
            
            <UButton
              icon="i-heroicons-cog-6-tooth"
              color="gray"
              variant="ghost"
              size="sm"
              to="/settings"
            />
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>