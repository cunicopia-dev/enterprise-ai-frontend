import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  apiKey: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    apiKey: null,
  }),

  getters: {
    currentUser: (state) => state.user,
    hasApiKey: (state) => !!state.apiKey,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // TODO: Implement Firebase auth login
        console.log('Login:', { email, password })
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async logout() {
      try {
        // TODO: Implement Firebase auth logout
        this.user = null
        this.isAuthenticated = false
        this.apiKey = null
      } catch (error) {
        console.error('Logout error:', error)
        throw error
      }
    },

    setApiKey(apiKey: string) {
      this.apiKey = apiKey
      // TODO: Store encrypted API key
    },

    clearApiKey() {
      this.apiKey = null
    },
  },

  persist: {
    storage: persistedState.localStorage,
    paths: ['apiKey'],
  },
})