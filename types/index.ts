// Backend API Configuration
export interface BackendConfig {
  baseUrl: string
  accessKey: string
  connected: boolean
}

// User API Keys (sent to backend)
export interface UserApiKeys {
  openai: string
  anthropic: string
}

export type ProviderType = 'openai' | 'anthropic'

// Message Types
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  provider?: string
  model?: string
  tokens?: {
    input?: number
    output?: number
    total?: number
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  provider: ProviderType
  model: string
}

// API Response Types
export interface ChatResponse {
  message: string
  provider: ProviderType
  model: string
  tokens?: {
    input: number
    output: number
    total: number
  }
  metadata?: Record<string, any>
}

export interface ApiError {
  error: string
  code?: string
  details?: string
}

// Platform Settings Types
export interface PlatformSettings {
  theme: 'light' | 'dark' | 'system'
  defaultProvider: ProviderType
  autoScroll: boolean
  saveHistory: boolean
  showTimestamps: boolean
  maxHistoryLength: number
  streamResponses: boolean
}

// Model Options
export interface ModelOption {
  label: string
  value: string
  description?: string
  maxTokens?: number
  costPer1kTokens?: number
}

export interface ProviderInfo {
  name: string
  label: string
  icon: string
  color: string
  models: ModelOption[]
  requiresApiKey: boolean
  supportsStreaming: boolean
}

// Connection Status
export interface ConnectionStatus {
  provider: ProviderType
  connected: boolean
  lastChecked: Date
  error?: string
}

// Settings State
export interface SettingsState {
  backendConfig: BackendConfig
  userApiKeys: UserApiKeys
  platformSettings: PlatformSettings
  isLoading: boolean
  lastSaved: Date | null
}

// Chat State
export interface ChatState {
  currentConversation: Conversation | null
  conversations: Conversation[]
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  selectedProvider: ProviderType | null
  selectedModel: string | null
  error: string | null
}

// Provider State
export interface ProviderState {
  availableProviders: Record<ProviderType, ProviderInfo>
  models: Record<ProviderType, ModelOption[]>
  isRefreshing: boolean
  lastRefreshed: Date | null
}