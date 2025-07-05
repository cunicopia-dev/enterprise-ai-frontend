/**
 * Barrel exports for all services
 */

// Note: ServiceFactory is in utils/serviceFactory to avoid circular imports

// API service exports
export {
  ApiClient,
  ApiError,
  ErrorHandler,
  RetryHandler
} from './api'

export type {
  ApiRequestOptions,
  ApiResponse,
  ApiErrorInterface
} from './api'

// Chat service exports
export { 
  ChatService, 
  ChatMessageBuilder, 
  ChatSession 
} from './chat'

export type {
  Message,
  Conversation,
  ChatRequest,
  ChatResponse,
  ToolExecution,
  ChatHistory,
  ChatListResponse
} from './chat'

// Provider service exports
export { 
  ProviderService, 
  ProviderConfigManager, 
  ModelSelector 
} from './providers'

export type {
  Provider,
  Model,
  ProviderHealth,
  ProvidersListResponse,
  ModelsListResponse
} from './providers'

// MCP service exports
export { 
  MCPService, 
  MCPToolManager 
} from './mcp'

export type {
  MCPServer,
  MCPServerConfig,
  MCPTool,
  MCPToolSchema,
  MCPToolExample,
  MCPStatusResponse,
  MCPToolExecution
} from './mcp'

// System prompt service exports
export { 
  SystemPromptService, 
  SystemPromptBuilder, 
  SystemPromptManager 
} from './systemPrompts'

export type {
  SystemPrompt,
  SystemPromptCategory,
  SystemPromptTemplate,
  SystemPromptVariable,
  SystemPromptsListResponse,
  SystemPromptUsage
} from './systemPrompts'