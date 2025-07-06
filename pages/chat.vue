<template>
  <div class="relative min-h-[calc(100vh-8rem)] bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/30">
    <!-- Subtle animated background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary-200/5 to-blue-200/5 dark:from-primary-800/5 dark:to-blue-800/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-200/5 to-purple-200/5 dark:from-blue-800/5 dark:to-purple-800/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 3s;"></div>
    </div>
    
    <div class="relative z-10 flex h-[calc(100vh-8rem)]">
      <!-- Left Column: Chat History -->
      <div class="w-72 flex-shrink-0">
        <ChatHistoryList />
      </div>

      <!-- Middle Column: Chat Interface -->
      <div class="flex-1 flex flex-col">
        <ChatInterface class="flex-1" />
      </div>

      <!-- Right Column: Enhanced CTA -->
      <div class="w-80 flex-shrink-0">
        <div class="h-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50 p-6">
          <!-- Status Card -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-4 border border-green-200 dark:border-green-800 mb-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-green-900 dark:text-green-100">Live Demo Active</h3>
                <p class="text-xs text-green-700 dark:text-green-300">Powered by enterprise AI</p>
              </div>
            </div>
            <div class="space-y-2 text-xs text-green-700 dark:text-green-300">
              <div class="flex justify-between">
                <span>Multi-Provider AI:</span>
                <span class="font-mono">✓ Active</span>
              </div>
              <div class="flex justify-between">
                <span>Response Time:</span>
                <span class="font-mono text-green-600 dark:text-green-400">~200ms</span>
              </div>
              <div class="flex justify-between">
                <span>Uptime:</span>
                <span class="font-mono text-green-600 dark:text-green-400">99.9%</span>
              </div>
            </div>
          </div>
          
          <!-- CTA Card -->
          <div class="bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-950 dark:to-purple-950 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
            <div class="text-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UIcon name="i-heroicons-rocket-launch" class="h-6 w-6 text-white" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Impressed?</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                This is just a <strong>demo</strong>. I can build AI systems like this for your organization with your data, your infrastructure, your requirements.
              </p>
            </div>
            
            <div class="space-y-3">
              <UButton 
                to="https://makeitrealconsulting.com/contact" 
                target="_blank"
                color="primary"
                icon="i-heroicons-phone"
                label="Schedule a Call"
                size="sm"
                class="w-full"
              />
              <UButton 
                to="/" 
                variant="outline"
                color="primary"
                icon="i-heroicons-arrow-left"
                label="Back to Demo Info"
                size="sm"
                class="w-full"
              />
            </div>
            
            <div class="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
              <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
                <strong>Open Source:</strong> GPL 3.0 license<br />
                Review the code before you hire
              </p>
            </div>
          </div>
          
          <!-- Technical Specs -->
          <div class="mt-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">This Demo Uses:</h4>
            <div class="space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>OpenAI GPT-4 Turbo</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Anthropic Claude 3.5</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Model Context Protocol</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>FastAPI + Nuxt 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Enterprise AI Chat - Make It Real Consulting',
  meta: [
    { name: 'description', content: 'Multi-provider AI chat interface for enterprise consultation and cloud architecture guidance.' }
  ]
})
</script>