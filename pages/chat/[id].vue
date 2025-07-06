<template>
  <div class="flex h-[calc(100vh-8rem)]">
    <!-- Left Column: Chat History -->
    <div class="w-64 flex-shrink-0">
      <ChatHistoryList />
    </div>

    <!-- Middle Column: Chat Interface -->
    <div class="flex-1 flex flex-col">
      <ChatInterface :key="route.params.id as string" class="flex-1" />
    </div>

    <!-- Right Column: Call to Action Banner -->
    <div class="w-64 flex-shrink-0">
      <div class="h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-4">
        <div class="bg-primary-50 dark:bg-primary-950/50 rounded-lg p-3 border border-primary-200 dark:border-primary-800">
          <p class="text-xs text-primary-700 dark:text-primary-300 text-right">
            💡 <strong>Interested in AI services like this for your company?</strong> With your own data, use cases, and servers?
            <a href="https://makeitrealconsulting.com/contact" target="_blank" class="font-semibold underline hover:text-primary-800">Let's chat!</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({
  title: 'Enterprise AI Chat - Make It Real Consulting',
  meta: [
    { name: 'description', content: 'Multi-provider AI chat interface for enterprise consultation and cloud architecture guidance.' }
  ]
})
</script>