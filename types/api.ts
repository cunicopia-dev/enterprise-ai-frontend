/**
 * API-specific TypeScript types for the FastAPI Multi-Provider LLM Platform
 * These types correspond to the backend API responses and requests
 */

// Re-export service types for convenience
export type {
  ApiRequestOptions,
  ApiResponse,
  ApiErrorInterface as ApiError,
  Message,
  Conversation,
  ChatRequest,
  ChatResponse,
  ToolExecution,
  ChatHistory,
  ChatListResponse,
  Provider,
  Model,
  ProviderHealth,
  ProvidersListResponse,
  ModelsListResponse,
  MCPServer,
  MCPServerConfig,
  MCPTool,
  MCPToolSchema,
  MCPToolExample,
  MCPStatusResponse,
  MCPToolExecution,
  SystemPrompt,
  SystemPromptCategory,
  SystemPromptTemplate,
  SystemPromptVariable,
  SystemPromptsListResponse,
  SystemPromptUsage
} from '~/services'

export { ApiError as ApiErrorClass } from '~/services'

// Additional common types used across the application

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface SortParams {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface SearchParams {
  query?: string
  filters?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: 'healthy' | 'unhealthy'
    redis: 'healthy' | 'unhealthy'
    mcp: 'healthy' | 'unhealthy'
  }
  uptime_seconds: number
}

export interface ErrorResponse {
  error: string
  message: string
  code?: string
  details?: any
  timestamp: string
  request_id?: string
}

// Request/Response wrappers for consistent API communication

export interface BaseRequest {
  request_id?: string
  timestamp?: string
  user_id?: string
}

export interface BaseResponse<T = any> {
  success: boolean
  data?: T
  error?: ErrorResponse
  metadata?: {
    request_id: string
    timestamp: string
    execution_time_ms: number
  }
}

// Authentication related types

export interface AuthRequest {
  api_key: string
}

export interface AuthResponse {
  authenticated: boolean
  user_id?: string
  permissions: string[]
  expires_at?: string
}

export interface UserProfile {
  id: string
  email?: string
  name?: string
  created_at: Date
  last_login?: Date
  preferences: Record<string, any>
  subscription_tier: 'free' | 'pro' | 'enterprise'
  usage_stats: {
    messages_sent: number
    tokens_used: number
    api_calls: number
  }
}

// Configuration types

export interface ApiConfiguration {
  base_url: string
  api_key?: string
  timeout_ms: number
  retry_attempts: number
  retry_delay_ms: number
}

export interface FrontendConfiguration {
  api: ApiConfiguration
  features: {
    mcp_enabled: boolean
    system_prompts_enabled: boolean
    multi_provider_enabled: boolean
    chat_history_enabled: boolean
  }
  ui: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
  }
}

// Websocket types for real-time features

export interface WebSocketMessage<T = any> {
  type: string
  data: T
  timestamp: string
  message_id: string
}

export interface ChatStreamMessage extends WebSocketMessage {
  type: 'chat_stream'
  data: {
    chat_id: string
    content: string
    finished: boolean
    metadata?: Record<string, any>
  }
}

export interface ProviderStatusMessage extends WebSocketMessage {
  type: 'provider_status'
  data: {
    provider: string
    status: 'healthy' | 'unhealthy'
    latency_ms?: number
  }
}

export interface MCPServerStatusMessage extends WebSocketMessage {
  type: 'mcp_status'
  data: {
    server: string
    status: 'connected' | 'disconnected' | 'error'
    tools_count?: number
  }
}

// Analytics and metrics types

export interface UsageMetrics {
  user_id: string
  date: string
  metrics: {
    messages_sent: number
    tokens_consumed: number
    api_calls: number
    unique_conversations: number
    providers_used: string[]
    tools_executed: number
    errors_encountered: number
  }
}

export interface PerformanceMetrics {
  endpoint: string
  method: string
  average_response_time_ms: number
  success_rate: number
  total_requests: number
  error_count: number
  last_24h_stats: {
    requests: number
    errors: number
    average_latency_ms: number
  }
}

// Export utility types

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'bedrock' | 'ollama'

export type ModelCapability = 
  | 'text_generation' 
  | 'function_calling' 
  | 'vision' 
  | 'code_completion' 
  | 'embedding'

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

export type ConversationStatus = 'active' | 'archived' | 'deleted'

export type ServerStatus = 'connected' | 'disconnected' | 'connecting' | 'error'

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type ResponseFormat = 'json' | 'text' | 'stream'

// Validation types

export interface ValidationRule {
  field: string
  rules: Array<{
    type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'custom'
    value?: any
    message: string
    validator?: (value: any) => boolean
  }>
}

export interface ValidationResult {
  valid: boolean
  errors: Array<{
    field: string
    message: string
    value?: any
  }>
}

// Cache types for client-side caching

export interface CacheEntry<T> {
  key: string
  data: T
  timestamp: Date
  expires_at?: Date
  metadata?: Record<string, any>
}

export interface CacheOptions {
  ttl_seconds?: number
  max_entries?: number
  persist_to_storage?: boolean
}

// Event types for application events

export interface AppEvent<T = any> {
  type: string
  data: T
  timestamp: Date
  source: string
  user_id?: string
}

export type ChatEventType = 
  | 'message_sent' 
  | 'message_received' 
  | 'conversation_created' 
  | 'conversation_updated'
  | 'provider_switched'
  | 'tool_executed'

export type SystemEventType = 
  | 'provider_connected' 
  | 'provider_disconnected' 
  | 'mcp_server_connected'
  | 'mcp_server_disconnected'
  | 'system_prompt_activated'
  | 'error_occurred'

export interface ChatEvent extends AppEvent {
  type: ChatEventType
  data: {
    conversation_id?: string
    message_id?: string
    provider?: string
    model?: string
    metadata?: Record<string, any>
  }
}

export interface SystemEvent extends AppEvent {
  type: SystemEventType
  data: {
    component: string
    status?: string
    error?: string
    metadata?: Record<string, any>
  }
}