/**
 * Nuxt plugin to initialize API services
 */

import { ServiceFactory } from '~/utils/serviceFactory'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Initialize service factory with API key
  const serviceConfig = {
    baseUrl: config.public.apiBaseUrl || 'http://localhost:8000',
    apiKey: '1aaf00cd3388f04065350b36bdc767283d21bcf547c7222df81ada6a14fbc296',
    timeout: 30000,
    retryAttempts: 2
  }

  try {
    ServiceFactory.getInstance(serviceConfig)
  } catch (error) {
    console.warn('Failed to initialize service factory:', error)
  }

  return {
    provide: {
      // Services are provided through composables
    }
  }
})