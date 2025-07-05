/**
 * MCP (Model Context Protocol) service for tool integration
 * Integrates with FastAPI Multi-Provider LLM Platform MCP endpoints
 */

import { ApiClient, ErrorHandler } from './api'

export interface MCPServer {
  name: string
  display_name: string
  description: string
  status: 'connected' | 'disconnected' | 'error' | 'connecting'
  transport_type: 'stdio' | 'websocket' | 'http'
  config: MCPServerConfig
  capabilities: string[]
  tools: MCPTool[]
  last_connected?: Date
  error_message?: string
  metadata?: Record<string, any>
}

export interface MCPServerConfig {
  command?: string
  args?: string[]
  env?: Record<string, string>
  url?: string
  auth_token?: string
  api_key?: string
  base_url?: string
  timeout_ms?: number
  retry_attempts?: number
}

export interface MCPTool {
  name: string
  description: string
  server: string
  schema: MCPToolSchema
  examples?: MCPToolExample[]
  metadata?: Record<string, any>
}

export interface MCPToolSchema {
  type: 'object'
  properties: Record<string, {
    type: string
    description?: string
    enum?: string[]
    default?: any
  }>
  required?: string[]
}

export interface MCPToolExample {
  name: string
  description: string
  input: Record<string, any>
  expected_output?: string
}

export interface MCPStatusResponse {
  enabled: boolean
  active_servers: number
  total_servers: number
  total_tools: number
  last_update: Date
  servers: MCPServer[]
}

export interface MCPToolExecution {
  tool_name: string
  server: string
  input: Record<string, any>
  output: any
  success: boolean
  execution_time_ms: number
  timestamp: Date
  error_message?: string
}

/**
 * MCP service for managing Model Context Protocol integration
 */
export class MCPService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Get MCP system status
   */
  async getStatus(): Promise<MCPStatusResponse> {
    try {
      const response = await this.apiClient.get<MCPStatusResponse>('/mcp/status')
      
      // Convert timestamps to Date objects
      const status = response.data
      status.last_update = new Date(status.last_update)
      status.servers = status.servers.map(server => ({
        ...server,
        last_connected: server.last_connected ? new Date(server.last_connected) : undefined
      }))
      
      return status
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get MCP status')
    }
  }

  /**
   * Get list of MCP servers
   */
  async getServers(): Promise<MCPServer[]> {
    try {
      const response = await this.apiClient.get<{ servers: MCPServer[] }>('/mcp/servers')
      
      // Convert timestamps to Date objects
      return response.data.servers.map(server => ({
        ...server,
        last_connected: server.last_connected ? new Date(server.last_connected) : undefined
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get MCP servers')
    }
  }

  /**
   * Get details for a specific MCP server
   */
  async getServer(serverName: string): Promise<MCPServer> {
    try {
      const response = await this.apiClient.get<{ server: MCPServer }>(`/mcp/servers/${serverName}`)
      
      const server = response.data.server
      if (server.last_connected) {
        server.last_connected = new Date(server.last_connected)
      }
      
      return server
    } catch (error) {
      ErrorHandler.handle(error, `Failed to get MCP server: ${serverName}`)
    }
  }

  /**
   * Get all available tools across all servers
   */
  async getTools(): Promise<MCPTool[]> {
    try {
      const response = await this.apiClient.get<{ tools: MCPTool[] }>('/mcp/tools')
      return response.data.tools
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get MCP tools')
    }
  }

  /**
   * Get tools for a specific server
   */
  async getServerTools(serverName: string): Promise<MCPTool[]> {
    try {
      const response = await this.apiClient.get<{ tools: MCPTool[] }>(`/mcp/servers/${serverName}/tools`)
      return response.data.tools
    } catch (error) {
      ErrorHandler.handle(error, `Failed to get tools for server: ${serverName}`)
    }
  }

  /**
   * Reconnect to an MCP server
   */
  async reconnectServer(serverName: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>(`/mcp/servers/${serverName}/reconnect`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to reconnect to server: ${serverName}`)
    }
  }

  /**
   * Disconnect from an MCP server
   */
  async disconnectServer(serverName: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>(`/mcp/servers/${serverName}/disconnect`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to disconnect from server: ${serverName}`)
    }
  }

  /**
   * Add a new MCP server configuration
   */
  async addServer(serverConfig: {
    name: string
    display_name?: string
    description?: string
    transport_type: 'stdio' | 'websocket' | 'http'
    config: MCPServerConfig
  }): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>('/mcp/servers', serverConfig)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to add MCP server')
    }
  }

  /**
   * Update MCP server configuration
   */
  async updateServer(serverName: string, updates: {
    display_name?: string
    description?: string
    config?: MCPServerConfig
  }): Promise<boolean> {
    try {
      const response = await this.apiClient.put<{ success: boolean }>(`/mcp/servers/${serverName}`, updates)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to update MCP server: ${serverName}`)
    }
  }

  /**
   * Remove an MCP server
   */
  async removeServer(serverName: string): Promise<boolean> {
    try {
      const response = await this.apiClient.delete<{ success: boolean }>(`/mcp/servers/${serverName}`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to remove MCP server: ${serverName}`)
    }
  }

  /**
   * Execute a tool directly (for testing)
   */
  async executeTool(
    toolName: string, 
    input: Record<string, any>, 
    serverName?: string
  ): Promise<MCPToolExecution> {
    try {
      const response = await this.apiClient.post<MCPToolExecution>('/mcp/tools/execute', {
        tool_name: toolName,
        input,
        server: serverName
      })

      const execution = response.data
      execution.timestamp = new Date(execution.timestamp)
      
      return execution
    } catch (error) {
      ErrorHandler.handle(error, `Failed to execute tool: ${toolName}`)
    }
  }

  /**
   * Get tool execution history
   */
  async getToolExecutions(limit = 50): Promise<MCPToolExecution[]> {
    try {
      const response = await this.apiClient.get<{ executions: MCPToolExecution[] }>(`/mcp/tools/executions?limit=${limit}`)
      
      return response.data.executions.map(execution => ({
        ...execution,
        timestamp: new Date(execution.timestamp)
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get tool executions')
    }
  }

  /**
   * Test MCP server connection
   */
  async testServer(serverName: string): Promise<{
    success: boolean
    latency_ms?: number
    capabilities?: string[]
    tools_count?: number
    error?: string
  }> {
    try {
      const response = await this.apiClient.post<{
        success: boolean
        latency_ms?: number
        capabilities?: string[]
        tools_count?: number
        error?: string
      }>(`/mcp/servers/${serverName}/test`)
      
      return response.data
    } catch (error) {
      ErrorHandler.handle(error, `Failed to test MCP server: ${serverName}`)
    }
  }
}

/**
 * MCP tool manager for organizing and categorizing tools
 */
export class MCPToolManager {
  private tools: MCPTool[] = []
  private servers: MCPServer[] = []

  constructor(private mcpService: MCPService) {}

  /**
   * Initialize with current tools and servers
   */
  async initialize(): Promise<void> {
    try {
      const [tools, servers] = await Promise.all([
        this.mcpService.getTools(),
        this.mcpService.getServers()
      ])
      
      this.tools = tools
      this.servers = servers
    } catch (error) {
      console.error('Failed to initialize MCPToolManager:', error)
    }
  }

  /**
   * Get tools grouped by server
   */
  getToolsByServer(): Map<string, MCPTool[]> {
    const toolsByServer = new Map<string, MCPTool[]>()
    
    for (const tool of this.tools) {
      if (!toolsByServer.has(tool.server)) {
        toolsByServer.set(tool.server, [])
      }
      toolsByServer.get(tool.server)!.push(tool)
    }
    
    return toolsByServer
  }

  /**
   * Get tools grouped by category (inferred from tool names/descriptions)
   */
  getToolsByCategory(): Map<string, MCPTool[]> {
    const categories = new Map<string, MCPTool[]>()
    
    for (const tool of this.tools) {
      const category = this.inferToolCategory(tool)
      
      if (!categories.has(category)) {
        categories.set(category, [])
      }
      categories.get(category)!.push(tool)
    }
    
    return categories
  }

  /**
   * Search tools by name or description
   */
  searchTools(query: string): MCPTool[] {
    const lowercaseQuery = query.toLowerCase()
    
    return this.tools.filter(tool => 
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Get tool by name
   */
  getTool(toolName: string): MCPTool | null {
    return this.tools.find(tool => tool.name === toolName) || null
  }

  /**
   * Get tools for a specific server
   */
  getServerTools(serverName: string): MCPTool[] {
    return this.tools.filter(tool => tool.server === serverName)
  }

  /**
   * Check if tool is available (server connected)
   */
  isToolAvailable(toolName: string): boolean {
    const tool = this.getTool(toolName)
    if (!tool) return false
    
    const server = this.servers.find(s => s.name === tool.server)
    return server?.status === 'connected'
  }

  /**
   * Get tool usage examples
   */
  getToolExamples(toolName: string): MCPToolExample[] {
    const tool = this.getTool(toolName)
    return tool?.examples || []
  }

  /**
   * Validate tool input against schema
   */
  validateToolInput(toolName: string, input: Record<string, any>): {
    valid: boolean
    errors: string[]
  } {
    const tool = this.getTool(toolName)
    if (!tool) {
      return { valid: false, errors: ['Tool not found'] }
    }

    const errors: string[] = []
    const schema = tool.schema
    
    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in input)) {
          errors.push(`Required field '${field}' is missing`)
        }
      }
    }
    
    // Check field types and constraints
    for (const [field, value] of Object.entries(input)) {
      const fieldSchema = schema.properties[field]
      if (!fieldSchema) {
        errors.push(`Unknown field '${field}'`)
        continue
      }
      
      // Type checking (basic)
      if (fieldSchema.type === 'string' && typeof value !== 'string') {
        errors.push(`Field '${field}' must be a string`)
      } else if (fieldSchema.type === 'number' && typeof value !== 'number') {
        errors.push(`Field '${field}' must be a number`)
      } else if (fieldSchema.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Field '${field}' must be a boolean`)
      }
      
      // Enum checking
      if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
        errors.push(`Field '${field}' must be one of: ${fieldSchema.enum.join(', ')}`)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Infer tool category from name and description
   */
  private inferToolCategory(tool: MCPTool): string {
    const name = tool.name.toLowerCase()
    const desc = tool.description.toLowerCase()
    
    if (name.includes('file') || desc.includes('file') || name.includes('read') || name.includes('write')) {
      return 'File System'
    }
    
    if (name.includes('git') || desc.includes('git') || name.includes('repo')) {
      return 'Version Control'
    }
    
    if (name.includes('web') || name.includes('http') || desc.includes('web') || name.includes('url')) {
      return 'Web & APIs'
    }
    
    if (name.includes('db') || name.includes('database') || desc.includes('database')) {
      return 'Database'
    }
    
    if (name.includes('search') || desc.includes('search') || name.includes('find')) {
      return 'Search & Discovery'
    }
    
    if (name.includes('analysis') || desc.includes('analy') || name.includes('process')) {
      return 'Data Processing'
    }
    
    return 'General'
  }
}