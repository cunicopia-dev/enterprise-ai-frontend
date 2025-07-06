<template>
  <div class="space-y-0">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/30 -mx-4 -mt-8 px-4 pt-20 pb-24">
      <!-- Dynamic animated background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-primary-200/10 to-blue-200/10 dark:from-primary-800/10 dark:to-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 dark:from-blue-800/10 dark:to-purple-800/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/5 to-purple-200/5 dark:from-cyan-800/5 dark:to-purple-800/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s;"></div>
      </div>
      
      <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          <!-- Left Column - Content -->
          <div class="space-y-8">
            <div class="inline-block">
              <div class="relative group">
                <div class="absolute -inset-3 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div class="relative w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <UIcon name="i-heroicons-sparkles" class="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <div class="space-y-6">
              <h1 class="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Try My New <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">AI Consultant Bot</span>
              </h1>
              
              <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                Get free AI consultation with Make It Real Consulting best practices baked in. 
                Experience real enterprise insights powered by <strong class="text-gray-900 dark:text-white">7+ years of Fortune 100 experience</strong>.
              </p>
              
              <div class="flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">Free to Try</span>
                </div>
                <div class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">Real Expertise</span>
                </div>
                <div class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                  <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
                  <span class="text-gray-700 dark:text-gray-300 font-medium">Book Real Calls</span>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
                <UButton 
                  to="/chat" 
                  size="xl" 
                  color="primary" 
                  icon="i-heroicons-chat-bubble-left-right"
                  label="Start Chatting Now"
                  class="relative text-lg px-8 py-4 font-semibold"
                />
              </div>
              <UButton 
                to="#capabilities" 
                size="xl" 
                variant="outline" 
                color="primary"
                icon="i-heroicons-arrow-down"
                label="See How It Works"
                class="text-lg px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2"
              />
            </div>
          </div>
          
          <!-- Right Column - Animated SVG -->
          <div class="relative flex items-center justify-center lg:justify-end">
            <div class="relative w-full max-w-lg">
              <!-- Main AI Network Visualization -->
              <svg viewBox="0 0 500 500" class="w-full h-auto">
                <defs>
                  <!-- Gradients -->
                  <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#06B6D4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0.8" />
                  </radialGradient>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#06B6D4;stop-opacity:0.8" />
                    <stop offset="50%" style="stop-color:#8B5CF6;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#EC4899;stop-opacity:0.4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <!-- Animated connection lines -->
                <g class="opacity-60">
                  <!-- Central hub connections -->
                  <line x1="250" y1="250" x2="120" y2="150" stroke="url(#connectionGradient)" stroke-width="2" class="animate-pulse">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="250" y1="250" x2="380" y2="150" stroke="url(#connectionGradient)" stroke-width="2" class="animate-pulse" style="animation-delay: 0.5s;">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </line>
                  <line x1="250" y1="250" x2="120" y2="350" stroke="url(#connectionGradient)" stroke-width="2" class="animate-pulse" style="animation-delay: 1s;">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1s" />
                  </line>
                  <line x1="250" y1="250" x2="380" y2="350" stroke="url(#connectionGradient)" stroke-width="2" class="animate-pulse" style="animation-delay: 1.5s;">
                    <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1.5s" />
                  </line>
                  
                  <!-- Outer network connections -->
                  <line x1="120" y1="150" x2="380" y2="150" stroke="url(#connectionGradient)" stroke-width="1" opacity="0.4">
                    <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
                  </line>
                  <line x1="120" y1="350" x2="380" y2="350" stroke="url(#connectionGradient)" stroke-width="1" opacity="0.4">
                    <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
                  </line>
                  <line x1="120" y1="150" x2="120" y2="350" stroke="url(#connectionGradient)" stroke-width="1" opacity="0.4">
                    <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
                  </line>
                  <line x1="380" y1="150" x2="380" y2="350" stroke="url(#connectionGradient)" stroke-width="1" opacity="0.4">
                    <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" begin="1.5s" />
                  </line>
                </g>

                <!-- Data flow particles -->
                <g>
                  <circle r="3" fill="#06B6D4" opacity="0.8">
                    <animateMotion dur="4s" repeatCount="indefinite">
                      <path d="M 120,150 Q 185,200 250,250" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#8B5CF6" opacity="0.8">
                    <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
                      <path d="M 380,150 Q 315,200 250,250" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="1s" />
                  </circle>
                  <circle r="3" fill="#EC4899" opacity="0.8">
                    <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
                      <path d="M 120,350 Q 185,300 250,250" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="2s" />
                  </circle>
                  <circle r="3" fill="#F59E0B" opacity="0.8">
                    <animateMotion dur="4s" repeatCount="indefinite" begin="3s">
                      <path d="M 380,350 Q 315,300 250,250" />
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="3s" />
                  </circle>
                </g>

                <!-- Network nodes -->
                <g>
                  <!-- Central AI Core -->
                  <circle cx="250" cy="250" r="40" fill="url(#coreGradient)" filter="url(#glow)" class="animate-pulse">
                    <animate attributeName="r" values="38;42;38" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <text x="250" y="255" text-anchor="middle" fill="white" font-size="12" font-weight="bold">AI</text>
                  
                  <!-- Provider nodes -->
                  <circle cx="120" cy="150" r="25" fill="#10B981" opacity="0.9">
                    <animate attributeName="r" values="23;27;23" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="120" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">GPT</text>
                  
                  <circle cx="380" cy="150" r="25" fill="#3B82F6" opacity="0.9">
                    <animate attributeName="r" values="23;27;23" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                  <text x="380" y="155" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Claude</text>
                  
                  <circle cx="120" cy="350" r="25" fill="#8B5CF6" opacity="0.9">
                    <animate attributeName="r" values="23;27;23" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>
                  <text x="120" y="355" text-anchor="middle" fill="white" font-size="10" font-weight="bold">MCP</text>
                  
                  <circle cx="380" cy="350" r="25" fill="#EC4899" opacity="0.9">
                    <animate attributeName="r" values="23;27;23" dur="2s" repeatCount="indefinite" begin="1.5s" />
                  </circle>
                  <text x="380" y="355" text-anchor="middle" fill="white" font-size="9" font-weight="bold">Security</text>
                </g>

                <!-- Floating geometric elements -->
                <g opacity="0.3">
                  <rect x="80" y="80" width="20" height="20" fill="#06B6D4" transform="rotate(45 90 90)">
                    <animateTransform attributeName="transform" type="rotate" values="45 90 90;405 90 90;45 90 90" dur="8s" repeatCount="indefinite" />
                  </rect>
                  <rect x="400" y="400" width="15" height="15" fill="#8B5CF6" transform="rotate(0 407 407)">
                    <animateTransform attributeName="transform" type="rotate" values="0 407 407;360 407 407;0 407 407" dur="6s" repeatCount="indefinite" />
                  </rect>
                  <polygon points="450,100 460,120 440,120" fill="#EC4899">
                    <animateTransform attributeName="transform" type="rotate" values="0 450 110;360 450 110;0 450 110" dur="10s" repeatCount="indefinite" />
                  </polygon>
                </g>
              </svg>
              
              <!-- Floating stats overlay -->
              <div class="absolute top-4 right-4 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                <div class="text-xs font-mono text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>3 AI Providers</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
                    <span>Real-time MCP</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
                    <span>Enterprise Ready</span>
                  </div>
                </div>
              </div>
              
              <!-- Performance metrics floating card -->
              <div class="absolute bottom-4 left-4 bg-white/10 dark:bg-gray-900/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                <div class="text-xs font-mono text-gray-600 dark:text-gray-400">
                  <div>Response Time: <span class="text-green-500 font-bold">~200ms</span></div>
                  <div>Availability: <span class="text-blue-500 font-bold">99.9%</span></div>
                  <div>Scalability: <span class="text-purple-500 font-bold">∞</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Hire Me Section -->
    <div class="relative -mx-4 px-4 py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden" id="deployment">
      <!-- Deployment Flow Background -->
      <div class="absolute inset-0">
        <!-- Flowing Data Lines -->
        <svg class="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#06B6D4;stop-opacity:0" />
              <stop offset="50%" style="stop-color:#06B6D4;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0" />
            </linearGradient>
          </defs>
          <path d="M50,400 Q300,200 600,400 T1150,400" stroke="url(#flow1)" stroke-width="3" fill="none" class="animate-pulse" />
          <path d="M50,500 Q400,300 800,500 T1150,500" stroke="url(#flow1)" stroke-width="2" fill="none" class="animate-pulse" style="animation-delay: 1s" />
          <path d="M50,300 Q500,500 900,300 T1150,300" stroke="url(#flow1)" stroke-width="2" fill="none" class="animate-pulse" style="animation-delay: 2s" />
        </svg>
      </div>
      
      <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block p-6 bg-gradient-to-r from-white/10 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/20 mb-8">
            <UIcon name="i-heroicons-user-circle" class="h-16 w-16 text-cyan-300 mx-auto" />
          </div>
          
          <h2 class="text-5xl font-bold text-white mb-6">
            Want Me to Build This <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">For Your Team</span>?
          </h2>
          
          <p class="text-xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
            This entire system is <strong class="text-cyan-300">open source (GPL 3.0)</strong> so you can see exactly what you're getting. 
            I believe in transparency — you should know the quality of work before you hire.
          </p>
        </div>
        
        <!-- Why Hire Me Process -->
        <div class="relative">
          <!-- Process Steps -->
          <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
            <!-- Step 1: Consultation -->
            <div class="relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center min-w-[200px]">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="h-12 w-12 text-cyan-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-white mb-2">1. Discovery Call</h3>
                <p class="text-gray-200 text-sm">Understanding your technical challenges and business goals</p>
              </div>
            </div>
            
            <!-- Arrow -->
            <div class="text-cyan-300/60 transform rotate-90 lg:rotate-0">
              <UIcon name="i-heroicons-arrow-right" class="h-8 w-8" />
            </div>
            
            <!-- Step 2: Architecture -->
            <div class="relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center min-w-[200px]">
                <UIcon name="i-heroicons-cpu-chip" class="h-12 w-12 text-purple-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-white mb-2">2. Custom Architecture</h3>
                <p class="text-gray-200 text-sm">Designing solutions tailored to your specific needs</p>
              </div>
            </div>
            
            <!-- Arrow -->
            <div class="text-cyan-300/60 transform rotate-90 lg:rotate-0">
              <UIcon name="i-heroicons-arrow-right" class="h-8 w-8" />
            </div>
            
            <!-- Step 3: Implementation -->
            <div class="relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center min-w-[200px]">
                <UIcon name="i-heroicons-code-bracket" class="h-12 w-12 text-pink-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-white mb-2">3. Expert Implementation</h3>
                <p class="text-gray-200 text-sm">Building production-grade solutions with enterprise patterns</p>
              </div>
            </div>
            
            <!-- Arrow -->
            <div class="text-cyan-300/60 transform rotate-90 lg:rotate-0">
              <UIcon name="i-heroicons-arrow-right" class="h-8 w-8" />
            </div>
            
            <!-- Step 4: Support -->
            <div class="relative group">
              <div class="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center min-w-[200px]">
                <UIcon name="i-heroicons-shield-check" class="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-white mb-2">4. Ongoing Support</h3>
                <p class="text-gray-200 text-sm">Maintenance, optimization, and strategic guidance</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Why Choose Me -->
        <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-500"></div>
            <div class="relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <UIcon name="i-heroicons-eye" class="h-10 w-10 text-cyan-300 mb-4" />
              <h3 class="text-xl font-bold text-white mb-3">Full Transparency</h3>
              <p class="text-gray-200">Open source GPL 3.0 — inspect every line of code before you hire</p>
            </div>
          </div>
          
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-500"></div>
            <div class="relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <UIcon name="i-heroicons-trophy" class="h-10 w-10 text-purple-300 mb-4" />
              <h3 class="text-xl font-bold text-white mb-3">Proven Enterprise Experience</h3>
              <p class="text-gray-200">7+ years building AI systems for Fortune 100 companies</p>
            </div>
          </div>
          
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-500"></div>
            <div class="relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <UIcon name="i-heroicons-rocket-launch" class="h-10 w-10 text-pink-300 mb-4" />
              <h3 class="text-xl font-bold text-white mb-3">Production-Ready Code</h3>
              <p class="text-gray-200">Enterprise-grade security, scalability, and maintainability from day one</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Section -->
        <div class="mt-16 text-center">
          <div class="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20 mb-8">
            <h3 class="text-2xl font-bold text-white mb-4">
              Ready to Discuss Your AI Project?
            </h3>
            <p class="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
              Let's talk about how I can build something similar for your organization.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <UButton 
              to="/chat" 
              color="primary" 
              icon="i-heroicons-chat-bubble-left-right"
              label="Try the Demo First"
              size="xl"
              class="px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-2xl shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
            />
            <UButton 
              to="https://makeitrealconsulting.com/contact" 
              target="_blank"
              color="white"
              icon="i-heroicons-phone"
              label="Schedule a Consultation"
              size="xl"
              class="px-8 py-4 text-lg bg-white text-gray-900 hover:bg-gray-100 shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>


    <!-- Bot Capabilities Interactive Demo -->
    <div class="relative -mx-4 px-4 py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-hidden" id="capabilities">
      <!-- Terminal Window Mockup -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-full px-6 py-3 border border-green-500/20 mb-8">
            <UIcon name="i-heroicons-sparkles" class="h-6 w-6 text-green-600 dark:text-green-400 animate-pulse" />
            <span class="text-green-600 dark:text-green-400 font-semibold">Live AI Consultant</span>
          </div>
          
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            What Can This Bot <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">Actually Do</span>?
          </h2>
          
          <p class="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            It's trained on <strong>real enterprise projects</strong> I've architected and can help with actual technical challenges.
          </p>
        </div>
        
        <!-- Interactive Terminal Demo -->
        <div class="max-w-6xl mx-auto">
          <div class="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <!-- Terminal Header -->
            <div class="flex items-center justify-between bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div class="flex items-center gap-3">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span class="text-gray-300 font-mono text-sm">AI Consultant Chat</span>
              </div>
              <div class="text-gray-400 text-xs font-mono">Connected • Multi-Provider</div>
            </div>
            
            <!-- Terminal Content -->
            <div class="p-6 font-mono text-sm space-y-6 h-96 overflow-y-auto">
              <!-- Query 1: Architecture -->
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-green-400 shrink-0">user@terminal:~$</span>
                  <span class="text-gray-300">What's the best approach for auto-scaling a microservices architecture on AWS?</span>
                </div>
                <div class="bg-green-900/20 border-l-4 border-green-500 pl-4 py-2 ml-6">
                  <div class="text-green-300 space-y-1">
                    <div>🏗️ <strong>Recommended Architecture:</strong></div>
                    <div class="ml-4 text-green-200">• ECS Fargate with Application Load Balancer</div>
                    <div class="ml-4 text-green-200">• Target tracking scaling policies on CPU/memory</div>
                    <div class="ml-4 text-green-200">• CloudWatch custom metrics for business KPIs</div>
                    <div class="mt-2 text-green-300">💡 <em>Based on 15+ enterprise implementations from my experience</em></div>
                  </div>
                </div>
              </div>
              
              <!-- Query 2: Scheduling -->
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-blue-400 shrink-0">user@terminal:~$</span>
                  <span class="text-gray-300">Can you schedule a call to discuss migrating our legacy system to the cloud?</span>
                </div>
                <div class="bg-blue-900/20 border-l-4 border-blue-500 pl-4 py-2 ml-6">
                  <div class="text-blue-300 space-y-1">
                    <div>📅 <strong>Scheduling Strategy Call...</strong></div>
                    <div class="ml-4 text-blue-200">• Connecting to my calendar system</div>
                    <div class="ml-4 text-blue-200">• Available slots: [Next Tuesday 2PM, Wednesday 10AM]</div>
                    <div class="ml-4 text-blue-200">• Focus: Legacy migration patterns & cost optimization</div>
                    <div class="mt-2 text-blue-300">✅ <em>Calendar invite sent! Check your email.</em></div>
                  </div>
                </div>
              </div>
              
              <!-- Query 3: Implementation -->
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <span class="text-purple-400 shrink-0">user@terminal:~$</span>
                  <span class="text-gray-300">Show me how to implement blue-green deployments with zero downtime</span>
                </div>
                <div class="bg-purple-900/20 border-l-4 border-purple-500 pl-4 py-2 ml-6">
                  <div class="text-purple-300 space-y-1">
                    <div>⚙️ <strong>Blue-Green Deployment Pipeline:</strong></div>
                    <div class="ml-4 text-purple-200">1. CodePipeline → Build → Deploy to Green environment</div>
                    <div class="ml-4 text-purple-200">2. Run automated tests against Green</div>
                    <div class="ml-4 text-purple-200">3. Route 53 weighted routing: Blue 100% → 0%</div>
                    <div class="ml-4 text-purple-200">4. Monitor CloudWatch metrics for rollback triggers</div>
                    <div class="mt-2 text-purple-300">📋 <em>Full CloudFormation template available on request</em></div>
                  </div>
                </div>
              </div>
              
              <!-- Current Prompt -->
              <div class="flex items-center gap-3 mt-6">
                <span class="text-primary-400 shrink-0">user@terminal:~$</span>
                <span class="text-gray-400 animate-pulse">|</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Floating Action Buttons -->
        <div class="flex justify-center mt-12">
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton 
              to="/chat" 
              color="primary"
              icon="i-heroicons-chat-bubble-left-right"
              label="Try It Yourself"
              size="xl"
              class="px-8 py-4 text-lg shadow-xl shadow-primary-500/25 transform hover:scale-105 transition-all duration-300"
            />
            <UButton 
              to="#deployment" 
              variant="outline"
              color="primary"
              icon="i-heroicons-arrow-down"
              label="See How It Works"
              size="xl"
              class="px-8 py-4 text-lg border-2 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>


    <!-- Technical Architecture Showcase -->
    <div class="relative -mx-4 px-4 py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <!-- Animated Code Background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 text-green-400 font-mono text-xs leading-relaxed transform rotate-12">
          <div class="space-y-1">
            <div>const aiRouter = new MultiProviderRouter({</div>
            <div class="ml-4">providers: [OpenAI, Anthropic, Google],</div>
            <div class="ml-4">failover: true,</div>
            <div class="ml-4">loadBalancing: 'intelligent'</div>
            <div>});</div>
          </div>
        </div>
        <div class="absolute top-32 right-20 text-blue-400 font-mono text-xs leading-relaxed transform -rotate-6">
          <div class="space-y-1">
            <div>interface MCPProtocol {</div>
            <div class="ml-4">connect: (endpoint: string) => Promise&lt;Connection&gt;;</div>
            <div class="ml-4">execute: (command: MCPCommand) => Promise&lt;Result&gt;;</div>
            <div>}</div>
          </div>
        </div>
        <div class="absolute bottom-20 left-32 text-purple-400 font-mono text-xs leading-relaxed transform rotate-3">
          <div class="space-y-1">
            <div>export const securityLayer = {</div>
            <div class="ml-4">encryption: 'AES-256-GCM',</div>
            <div class="ml-4">auth: 'zero-trust',</div>
            <div class="ml-4">compliance: ['SOC2', 'GDPR']</div>
            <div>};</div>
          </div>
        </div>
      </div>
      
      <!-- Floating Geometric Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-1/4 w-32 h-32 border border-primary-500/30 rounded-full animate-pulse"></div>
        <div class="absolute top-40 right-1/4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform rotate-45"></div>
        <div class="absolute bottom-32 left-1/3 w-24 h-24 border-2 border-purple-500/40 transform rotate-12"></div>
      </div>
      
      <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-block p-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl mb-8 backdrop-blur-sm border border-white/20">
            <UIcon name="i-heroicons-beaker" class="h-12 w-12 text-cyan-300" />
          </div>
          
          <h2 class="text-5xl font-bold text-white mb-6 leading-tight">
            This Isn't Just a <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">Demo</span>
          </h2>
          
          <p class="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-12">
            It's a <strong class="text-white">live showcase</strong> of enterprise AI architecture. 
            Every interaction demonstrates production-grade patterns I deploy at scale.
          </p>
        </div>
        
        <!-- Interactive Architecture Diagram -->
        <div class="relative">
          <!-- Central Hub -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div class="w-32 h-32 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 animate-pulse">
              <UIcon name="i-heroicons-cpu-chip" class="h-16 w-16 text-white" />
            </div>
            <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
              AI Core
            </div>
          </div>
          
          <!-- Connecting Lines -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
            <defs>
              <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0" />
                <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0" />
              </linearGradient>
            </defs>
            <line x1="100" y1="100" x2="350" y2="180" stroke="url(#line1)" stroke-width="2" class="animate-pulse" />
            <line x1="700" y1="100" x2="450" y2="180" stroke="url(#line1)" stroke-width="2" class="animate-pulse" style="animation-delay: 0.5s" />
            <line x1="100" y1="300" x2="350" y2="220" stroke="url(#line1)" stroke-width="2" class="animate-pulse" style="animation-delay: 1s" />
            <line x1="700" y1="300" x2="450" y2="220" stroke="url(#line1)" stroke-width="2" class="animate-pulse" style="animation-delay: 1.5s" />
          </svg>
          
          <!-- Satellite Components -->
          <div class="relative h-96">
            <!-- Multi-Provider AI -->
            <div class="absolute top-0 left-0 group cursor-pointer">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <UIcon name="i-heroicons-squares-2x2" class="h-12 w-12 text-white" />
                </div>
                <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold whitespace-nowrap">
                  Multi-Provider
                </div>
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 w-64 bg-black/80 backdrop-blur-sm rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-gray-300 text-sm">
                    OpenAI, Anthropic, and Google unified through intelligent routing and automatic failover
                  </p>
                </div>
              </div>
            </div>
            
            <!-- MCP Integration -->
            <div class="absolute top-0 right-0 group cursor-pointer">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <UIcon name="i-heroicons-link" class="h-12 w-12 text-white" />
                </div>
                <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold whitespace-nowrap">
                  MCP Protocol
                </div>
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 w-64 bg-black/80 backdrop-blur-sm rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-gray-300 text-sm">
                    Model Context Protocol enabling AI to interact with external systems and data sources
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Enterprise Security -->
            <div class="absolute bottom-0 left-0 group cursor-pointer">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <UIcon name="i-heroicons-shield-check" class="h-12 w-12 text-white" />
                </div>
                <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold whitespace-nowrap">
                  Enterprise Security
                </div>
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-8 w-64 bg-black/80 backdrop-blur-sm rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-gray-300 text-sm">
                    Zero-trust architecture with end-to-end encryption and compliance-ready data handling
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Cloud-Native -->
            <div class="absolute bottom-0 right-0 group cursor-pointer">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300">
                  <UIcon name="i-heroicons-cloud-arrow-up" class="h-12 w-12 text-white" />
                </div>
                <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold whitespace-nowrap">
                  Cloud-Native
                </div>
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-8 w-64 bg-black/80 backdrop-blur-sm rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p class="text-gray-300 text-sm">
                    Serverless, auto-scaling, globally distributed infrastructure that handles enterprise load
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-20 text-center">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 class="text-2xl font-bold text-white mb-4">
              Ready to Scale Your AI Vision?
            </h3>
            <p class="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
              See how I can implement similar solutions that transform your business operations and customer experiences.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton 
                to="/chat" 
                color="primary"
                icon="i-heroicons-chat-bubble-left-right"
                label="Experience the Demo"
                size="lg"
                class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
              />
              <UButton 
                to="https://makeitrealconsulting.com" 
                target="_blank"
                variant="outline" 
                color="white"
                icon="i-heroicons-arrow-top-right-on-square"
                label="Explore My Work"
                size="lg"
                class="px-6 py-3 border-white/30 hover:bg-white/10 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

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