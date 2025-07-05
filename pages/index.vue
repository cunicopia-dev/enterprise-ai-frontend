<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <div class="text-center bg-gradient-to-br from-primary-50 dark:from-gray-900 to-white dark:to-gray-950 -mx-4 -mt-8 px-4 pt-16 pb-12 rounded-b-3xl">
      <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
        <UIcon name="i-heroicons-sparkles" class="h-8 w-8 text-white" />
      </div>
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Get Your <span class="text-primary-600">Free AI Consultation</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
        Experience our expertise firsthand with an AI consultant trained on Make It Real's cloud and AI best practices. 
        Get tailored recommendations, ask technical questions, or even schedule a strategy call - all in under 10 messages.
      </p>
      <div class="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500" />
          <span>Free consultation</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500" />
          <span>Expert knowledge base</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500" />
          <span>Schedule real meetings</span>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton 
          to="/chat" 
          size="xl" 
          color="primary" 
          icon="i-heroicons-chat-bubble-left-right"
          label="Try the AI Demo"
          class="shadow-lg animate-bounce"
        />
        <UButton 
          to="#demo" 
          size="xl" 
          variant="outline" 
          color="primary"
          icon="i-heroicons-play"
          label="See How It Works"
        />
      </div>
    </div>

    <!-- What You Can Do Section -->
    <div id="demo" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <UCard class="border-green-100 dark:border-green-900/50 hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex items-center gap-3 p-4">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-light-bulb" class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold">Get Expert Recommendations</h3>
          </div>
        </template>
        <div class="px-4 pb-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Our AI consultant analyzes your challenges and provides tailored recommendations based on 50+ Fortune 100 projects and AWS best practices.
          </p>
          <div class="text-sm text-green-600 dark:text-green-400 font-medium">
            "What's the best serverless architecture for my e-commerce platform?"
          </div>
        </div>
      </UCard>

      <UCard class="border-blue-100 dark:border-blue-900/50 hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex items-center gap-3 p-4">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-calendar-days" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold">Schedule Strategy Calls</h3>
          </div>
        </template>
        <div class="px-4 pb-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Like what you're hearing? The AI can instantly connect you with Keith's calendar to book a real strategy session and dive deeper into your project.
          </p>
          <div class="text-sm text-blue-600 dark:text-blue-400 font-medium">
            "I'd like to schedule a call to discuss this further"
          </div>
        </div>
      </UCard>

      <UCard class="border-primary-100 dark:border-primary-900/50 hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex items-center gap-3 p-4">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold">Advanced AI Capabilities</h3>
          </div>
        </template>
        <div class="px-4 pb-4">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Powered by multiple AI providers with MCP (Model Context Protocol) support, demonstrating our cutting-edge technical capabilities.
          </p>
          <div class="flex flex-wrap gap-2">
            <UBadge color="blue" variant="soft" size="sm">OpenAI</UBadge>
            <UBadge color="orange" variant="soft" size="sm">Anthropic</UBadge>
            <UBadge color="green" variant="soft" size="sm">MCP Support</UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Tech Demo Showcase -->
    <UCard class="bg-gradient-to-r from-primary-50 dark:from-primary-950/50 to-blue-50 dark:to-blue-950/50 border-primary-200 dark:border-primary-800">
      <div class="p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            This is More Than Just a Chat Bot
          </h2>
          <p class="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            This tech demo showcases Make It Real Consulting's advanced AI implementation capabilities. 
            Every conversation demonstrates enterprise-grade architecture, security, and integration patterns 
            that we implement for businesses ready to scale with AI.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-cpu-chip" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Multi-Provider AI</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">OpenAI, Anthropic & Ollama unified</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-link" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">MCP Integration</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Remote context & tool calling</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-shield-check" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Zero-trust, encrypted, compliant</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UIcon name="i-heroicons-cloud-arrow-up" class="h-6 w-6 text-white" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Cloud-Native</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Serverless, scalable, global</p>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Ready to see how we can implement similar solutions for your business?
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/chat" 
              color="primary"
              icon="i-heroicons-chat-bubble-left-right"
              label="Try the AI Demo"
              size="lg"
            />
            <UButton 
              to="https://makeitrealconsulting.com" 
              target="_blank"
              variant="outline" 
              color="primary"
              icon="i-heroicons-arrow-top-right-on-square"
              label="Visit Our Main Website"
              size="lg"
            />
          </div>
        </div>
      </div>
    </UCard>

    <!-- How It Works -->
    <UCard>
      <template #header>
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">How This AI Demo Works</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Experience our technology capabilities firsthand</p>
        </div>
      </template>
      <div class="p-6 space-y-6">
        <div class="flex items-start gap-4">
          <div class="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            1
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Start the Demo</h3>
            <p class="text-gray-600 dark:text-gray-400">
              No setup required! Click "Try the AI Demo" and experience our advanced AI capabilities. Ask about cloud architecture, AI implementation, or scaling challenges.
            </p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            2
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">See Our AI in Action</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Experience how we integrate expert knowledge into AI systems. This demonstrates the type of intelligent solutions we build for enterprise clients.
            </p>
          </div>
        </div>
        
        <div class="flex items-start gap-4">
          <div class="bg-primary-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            3
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Discuss Your Project</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Ready to build something similar for your organization? The AI can connect you with Keith to discuss custom AI solutions tailored to your business needs.
            </p>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-purple-50 dark:from-purple-950/50 to-blue-50 dark:to-blue-950/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div class="flex items-center gap-3 mb-2">
            <UIcon name="i-heroicons-beaker" class="h-5 w-5 text-purple-600" />
            <span class="font-semibold text-purple-800 dark:text-purple-200">Technology Showcase</span>
          </div>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            This demo represents the caliber of AI solutions we deliver to forward-thinking businesses. Ready to discuss your project?
          </p>
        </div>
        
        <div class="flex gap-4 pt-4">
          <UButton 
            to="/chat" 
            color="primary" 
            icon="i-heroicons-chat-bubble-left-right"
            label="Try the AI Demo"
            class="flex-1"
            size="lg"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Home - Make It Real Enterprise AI Platform',
  meta: [
    { name: 'description', content: 'Enterprise AI consultation platform powered by Make It Real Consulting. Multi-provider AI access with enterprise security and cloud-native architecture.' }
  ]
})
</script>