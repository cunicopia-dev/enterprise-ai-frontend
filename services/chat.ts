/**
 * Chat service for message management and conversation handling
 * Integrates with FastAPI Multi-Provider LLM Platform chat endpoints
 */

import { ApiClient, ErrorHandler, RetryHandler, type ApiResponse } from './api'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  provider?: string
  model?: string
  metadata?: Record<string, any>
}

export interface Conversation {
  id: string
  title?: string
  created_at: Date
  updated_at: Date
  message_count: number
  metadata?: Record<string, any>
}

export interface ChatRequest {
  message: string
  chat_id?: string | null
  provider?: string
  model?: string
  temperature?: number
  max_tokens?: number
  system_prompt?: string
}

export interface ChatResponse {
  response: string
  chat_id: string
  provider: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  tool_executions?: ToolExecution[]
  metadata?: Record<string, any>
}

export interface ToolExecution {
  tool_name: string
  input: any
  result: any
  execution_time: number
  success: boolean
}

export interface ChatHistory {
  chat_id: string
  title?: string
  messages: Message[]
  created_at: Date
  updated_at: Date
}

export interface ChatListResponse {
  chats: Conversation[]
  total: number
  page: number
  limit: number
}

/**
 * Chat service for managing conversations and messages
 */
export class ChatService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Send a message and get AI response
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('Sending chat request:', request)
      const response = await RetryHandler.withRetry(
        () => this.apiClient.post<ChatResponse>('/chat', request),
        2, // Retry twice for chat requests
        1500 // 1.5s base delay
      )
      console.log('Chat response:', response)

      return response.data
    } catch (error) {
      console.error('Chat request failed:', error)
      ErrorHandler.handle(error, 'Failed to send message')
    }
  }

  /**
   * Get chat history for a specific conversation
   */
  async getChatHistory(chatId: string): Promise<ChatHistory> {
    try {
      const response = await this.apiClient.get<{ history: ChatHistory }>(`/chat/history/${chatId}`)
      
      // Convert timestamp strings to Date objects
      const history = response.data.history
      history.created_at = new Date(history.created_at)
      history.updated_at = new Date(history.updated_at)
      history.messages = history.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))

      return history
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to load chat history')
    }
  }

  /**
   * Get list of all conversations
   */
  async getChatList(page = 1, limit = 50): Promise<ChatListResponse> {
    try {
      const response = await this.apiClient.get<ChatListResponse>('/chat/history', {
        body: JSON.stringify({ page, limit })
      })

      // Convert timestamp strings to Date objects
      const chatList = response.data
      chatList.chats = chatList.chats.map(chat => ({
        ...chat,
        created_at: new Date(chat.created_at),
        updated_at: new Date(chat.updated_at)
      }))

      return chatList
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to load chat list')
    }
  }

  /**
   * Delete a conversation
   */
  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.delete<{ success: boolean }>(`/chat/delete/${chatId}`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to delete chat')
    }
  }

  /**
   * Update conversation title/metadata
   */
  async updateChat(chatId: string, updates: { title?: string; metadata?: Record<string, any> }): Promise<boolean> {
    try {
      const response = await this.apiClient.put<{ success: boolean }>(`/chat/${chatId}`, updates)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to update chat')
    }
  }

  /**
   * Create a new conversation
   */
  async createChat(title?: string, metadata?: Record<string, any>): Promise<string> {
    try {
      const response = await this.apiClient.post<{ chat_id: string }>('/chat/new', {
        title,
        metadata
      })
      return response.data.chat_id
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to create chat')
    }
  }

  /**
   * Export conversation as text/JSON
   */
  async exportChat(chatId: string, format: 'text' | 'json' = 'text'): Promise<string> {
    try {
      const history = await this.getChatHistory(chatId)
      
      if (format === 'json') {
        return JSON.stringify(history, null, 2)
      }

      // Text format
      let output = `Chat: ${history.title || 'Untitled'}\n`
      output += `Created: ${history.created_at.toISOString()}\n`
      output += `Messages: ${history.messages.length}\n\n`

      for (const message of history.messages) {
        const role = message.role === 'user' ? 'You' : 'Assistant'
        const timestamp = message.timestamp.toLocaleString()
        output += `[${timestamp}] ${role}:\n${message.content}\n\n`
      }

      return output
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to export chat')
    }
  }

  /**
   * Search conversations by content
   */
  async searchChats(query: string, limit = 20): Promise<Conversation[]> {
    try {
      const response = await this.apiClient.post<{ chats: Conversation[] }>('/chat/search', {
        query,
        limit
      })

      // Convert timestamp strings to Date objects
      return response.data.chats.map(chat => ({
        ...chat,
        created_at: new Date(chat.created_at),
        updated_at: new Date(chat.updated_at)
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to search chats')
    }
  }
}

/**
 * Chat message builder utility
 */
export class ChatMessageBuilder {
  private request: Partial<ChatRequest> = {}

  message(content: string): this {
    this.request.message = content
    return this
  }

  chatId(id: string): this {
    this.request.chat_id = id
    return this
  }

  provider(provider: string): this {
    this.request.provider = provider
    return this
  }

  model(model: string): this {
    this.request.model = model
    return this
  }

  temperature(temp: number): this {
    this.request.temperature = Math.max(0, Math.min(2, temp))
    return this
  }

  maxTokens(tokens: number): this {
    this.request.max_tokens = Math.max(1, tokens)
    return this
  }

  systemPrompt(prompt: string): this {
    this.request.system_prompt = prompt
    return this
  }

  build(): ChatRequest {
    if (!this.request.message) {
      throw new Error('Message content is required')
    }
    return this.request as ChatRequest
  }
}

/**
 * Chat session manager for handling conversation state
 */
export class ChatSession {
  private messages: Message[] = []
  private conversationId: string | null = null
  private metadata: Record<string, any> = {}

  constructor(
    private chatService: ChatService,
    conversationId?: string
  ) {
    this.conversationId = conversationId || null
  }

  /**
   * Load existing conversation
   */
  async loadConversation(chatId: string): Promise<void> {
    const history = await this.chatService.getChatHistory(chatId)
    this.conversationId = chatId
    this.messages = history.messages
    this.metadata = history.metadata || {}
  }

  /**
   * Send message in this session
   */
  async sendMessage(
    content: string,
    options: Partial<ChatRequest> = {}
  ): Promise<ChatResponse> {
    const request = new ChatMessageBuilder()
      .message(content)
      .chatId(this.conversationId || undefined)
      .provider(options.provider)
      .model(options.model)
      .temperature(options.temperature)
      .maxTokens(options.max_tokens)
      .systemPrompt(options.system_prompt)
      .build()

    const response = await this.chatService.sendMessage(request)
    
    // Update session state
    this.conversationId = response.chat_id
    
    // Add messages to local state
    this.messages.push({
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    })

    this.messages.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.response,
      timestamp: new Date(),
      provider: response.provider,
      model: response.model,
      metadata: response.metadata
    })

    return response
  }

  /**
   * Get current conversation ID
   */
  getConversationId(): string | null {
    return this.conversationId
  }

  /**
   * Get current messages
   */
  getMessages(): Message[] {
    return [...this.messages]
  }

  /**
   * Clear session
   */
  clear(): void {
    this.messages = []
    this.conversationId = null
    this.metadata = {}
  }

  /**
   * Update session metadata
   */
  setMetadata(key: string, value: any): void {
    this.metadata[key] = value
  }

  /**
   * Get session metadata
   */
  getMetadata(): Record<string, any> {
    return { ...this.metadata }
  }
}