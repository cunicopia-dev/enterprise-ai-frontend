<template>
  <div class="space-y-4">
    <!-- Call to Action Banner -->
    <div class="bg-primary-50 dark:bg-primary-950/50 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
      <p class="text-sm text-primary-700 dark:text-primary-300 text-center">
        💡 <strong>Interested in AI services like this for your company?</strong> With your own data, use cases, and servers? 
        <a href="https://makeitrealconsulting.com/contact" target="_blank" class="font-semibold underline hover:text-primary-800">Let's chat!</a>
      </p>
    </div>
    
    <!-- Chat Interface -->
    <ChatInterface :chat-id="chatId" />
  </div>
</template>

<script setup lang="ts">
// Get chat ID from route if provided
const route = useRoute()
const chatId = computed(() => route.params.id as string | undefined)

useHead({
  title: 'Enterprise AI Chat - Make It Real Consulting',
  meta: [
    { name: 'description', content: 'Multi-provider AI chat interface for enterprise consultation and cloud architecture guidance.' }
  ]
})
</script>