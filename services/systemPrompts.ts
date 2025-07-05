/**
 * System Prompt service for managing AI conversation prompts
 * Integrates with FastAPI Multi-Provider LLM Platform system prompt endpoints
 */

import { ApiClient, ErrorHandler } from './api'

export interface SystemPrompt {
  id: string
  name: string
  content: string
  description?: string
  category: string
  is_active: boolean
  is_default: boolean
  tags: string[]
  created_at: Date
  updated_at: Date
  usage_count: number
  metadata?: Record<string, any>
}

export interface SystemPromptCategory {
  name: string
  description: string
  prompts: SystemPrompt[]
  color?: string
  icon?: string
}

export interface SystemPromptTemplate {
  name: string
  description: string
  content: string
  variables: SystemPromptVariable[]
  category: string
  tags: string[]
}

export interface SystemPromptVariable {
  name: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'select'
  required: boolean
  default_value?: any
  options?: string[]
  placeholder?: string
}

export interface SystemPromptsListResponse {
  prompts: SystemPrompt[]
  categories: string[]
  total: number
  active_prompt_id?: string
}

export interface SystemPromptUsage {
  prompt_id: string
  prompt_name: string
  usage_count: number
  last_used: Date
  success_rate: number
  average_response_time: number
}

/**
 * System Prompt service for managing conversation prompts
 */
export class SystemPromptService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Get the currently active system prompt
   */
  async getActivePrompt(): Promise<{ prompt: string; prompt_id?: string }> {
    try {
      const response = await this.apiClient.get<{ prompt: string; prompt_id?: string }>('/system-prompt')
      return response.data
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get active system prompt')
    }
  }

  /**
   * Set the active system prompt
   */
  async setActivePrompt(prompt: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>('/system-prompt', { prompt })
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to set active system prompt')
    }
  }

  /**
   * Get all system prompts
   */
  async getPrompts(): Promise<SystemPromptsListResponse> {
    try {
      const response = await this.apiClient.get<SystemPromptsListResponse>('/system-prompts')
      
      // Convert timestamps to Date objects
      const promptsList = response.data
      promptsList.prompts = promptsList.prompts.map(prompt => ({
        ...prompt,
        created_at: new Date(prompt.created_at),
        updated_at: new Date(prompt.updated_at)
      }))
      
      return promptsList
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get system prompts')
    }
  }

  /**
   * Get a specific system prompt by ID
   */
  async getPrompt(promptId: string): Promise<SystemPrompt> {
    try {
      const response = await this.apiClient.get<{ prompt: SystemPrompt }>(`/system-prompts/${promptId}`)
      
      const prompt = response.data.prompt
      prompt.created_at = new Date(prompt.created_at)
      prompt.updated_at = new Date(prompt.updated_at)
      
      return prompt
    } catch (error) {
      ErrorHandler.handle(error, `Failed to get system prompt: ${promptId}`)
    }
  }

  /**
   * Create a new system prompt
   */
  async createPrompt(prompt: {
    name: string
    content: string
    description?: string
    category?: string
    tags?: string[]
    metadata?: Record<string, any>
  }): Promise<SystemPrompt> {
    try {
      const response = await this.apiClient.post<{ prompt: SystemPrompt }>('/system-prompts', prompt)
      
      const createdPrompt = response.data.prompt
      createdPrompt.created_at = new Date(createdPrompt.created_at)
      createdPrompt.updated_at = new Date(createdPrompt.updated_at)
      
      return createdPrompt
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to create system prompt')
    }
  }

  /**
   * Update a system prompt
   */
  async updatePrompt(promptId: string, updates: {
    name?: string
    content?: string
    description?: string
    category?: string
    tags?: string[]
    metadata?: Record<string, any>
  }): Promise<SystemPrompt> {
    try {
      const response = await this.apiClient.put<{ prompt: SystemPrompt }>(`/system-prompts/${promptId}`, updates)
      
      const updatedPrompt = response.data.prompt
      updatedPrompt.created_at = new Date(updatedPrompt.created_at)
      updatedPrompt.updated_at = new Date(updatedPrompt.updated_at)
      
      return updatedPrompt
    } catch (error) {
      ErrorHandler.handle(error, `Failed to update system prompt: ${promptId}`)
    }
  }

  /**
   * Delete a system prompt
   */
  async deletePrompt(promptId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.delete<{ success: boolean }>(`/system-prompts/${promptId}`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to delete system prompt: ${promptId}`)
    }
  }

  /**
   * Activate a system prompt (set as default)
   */
  async activatePrompt(promptId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.post<{ success: boolean }>(`/system-prompts/${promptId}/activate`)
      return response.data.success
    } catch (error) {
      ErrorHandler.handle(error, `Failed to activate system prompt: ${promptId}`)
    }
  }

  /**
   * Duplicate a system prompt
   */
  async duplicatePrompt(promptId: string, newName?: string): Promise<SystemPrompt> {
    try {
      const response = await this.apiClient.post<{ prompt: SystemPrompt }>(`/system-prompts/${promptId}/duplicate`, {
        name: newName
      })
      
      const duplicatedPrompt = response.data.prompt
      duplicatedPrompt.created_at = new Date(duplicatedPrompt.created_at)
      duplicatedPrompt.updated_at = new Date(duplicatedPrompt.updated_at)
      
      return duplicatedPrompt
    } catch (error) {
      ErrorHandler.handle(error, `Failed to duplicate system prompt: ${promptId}`)
    }
  }

  /**
   * Get system prompt usage statistics
   */
  async getUsageStats(): Promise<SystemPromptUsage[]> {
    try {
      const response = await this.apiClient.get<{ usage: SystemPromptUsage[] }>('/system-prompts/usage')
      
      return response.data.usage.map(usage => ({
        ...usage,
        last_used: new Date(usage.last_used)
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get system prompt usage stats')
    }
  }

  /**
   * Search system prompts
   */
  async searchPrompts(query: string, category?: string, tags?: string[]): Promise<SystemPrompt[]> {
    try {
      const params = new URLSearchParams({ query })
      if (category) params.append('category', category)
      if (tags) tags.forEach(tag => params.append('tags', tag))

      const response = await this.apiClient.get<{ prompts: SystemPrompt[] }>(`/system-prompts/search?${params}`)
      
      return response.data.prompts.map(prompt => ({
        ...prompt,
        created_at: new Date(prompt.created_at),
        updated_at: new Date(prompt.updated_at)
      }))
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to search system prompts')
    }
  }

  /**
   * Get system prompt templates
   */
  async getTemplates(): Promise<SystemPromptTemplate[]> {
    try {
      const response = await this.apiClient.get<{ templates: SystemPromptTemplate[] }>('/system-prompts/templates')
      return response.data.templates
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to get system prompt templates')
    }
  }

  /**
   * Create prompt from template
   */
  async createFromTemplate(
    templateName: string, 
    variables: Record<string, any>,
    promptName: string
  ): Promise<SystemPrompt> {
    try {
      const response = await this.apiClient.post<{ prompt: SystemPrompt }>('/system-prompts/from-template', {
        template: templateName,
        variables,
        name: promptName
      })
      
      const createdPrompt = response.data.prompt
      createdPrompt.created_at = new Date(createdPrompt.created_at)
      createdPrompt.updated_at = new Date(createdPrompt.updated_at)
      
      return createdPrompt
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to create prompt from template')
    }
  }
}

/**
 * System Prompt builder utility for creating prompts programmatically
 */
export class SystemPromptBuilder {
  private content: string[] = []
  private metadata: Record<string, any> = {}

  /**
   * Add a section to the prompt
   */
  addSection(title: string, content: string): this {
    this.content.push(`## ${title}\n\n${content}\n`)
    return this
  }

  /**
   * Add instructions
   */
  addInstructions(instructions: string[]): this {
    this.content.push('## Instructions\n')
    instructions.forEach((instruction, index) => {
      this.content.push(`${index + 1}. ${instruction}`)
    })
    this.content.push('\n')
    return this
  }

  /**
   * Add role definition
   */
  setRole(role: string, expertise: string[]): this {
    this.content.unshift(`You are ${role}.\n\nYour expertise includes:\n${expertise.map(e => `- ${e}`).join('\n')}\n\n`)
    return this
  }

  /**
   * Add context information
   */
  addContext(context: string): this {
    this.content.push(`## Context\n\n${context}\n`)
    return this
  }

  /**
   * Add constraints or guidelines
   */
  addConstraints(constraints: string[]): this {
    this.content.push('## Guidelines\n')
    constraints.forEach(constraint => {
      this.content.push(`- ${constraint}`)
    })
    this.content.push('\n')
    return this
  }

  /**
   * Add examples
   */
  addExamples(examples: Array<{ input: string; output: string }>): this {
    this.content.push('## Examples\n')
    examples.forEach((example, index) => {
      this.content.push(`### Example ${index + 1}`)
      this.content.push(`**Input:** ${example.input}`)
      this.content.push(`**Output:** ${example.output}\n`)
    })
    return this
  }

  /**
   * Add metadata
   */
  addMetadata(key: string, value: any): this {
    this.metadata[key] = value
    return this
  }

  /**
   * Build the final prompt
   */
  build(): { content: string; metadata: Record<string, any> } {
    return {
      content: this.content.join('\n'),
      metadata: this.metadata
    }
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.content = []
    this.metadata = {}
    return this
  }
}

/**
 * System Prompt manager for organizing and categorizing prompts
 */
export class SystemPromptManager {
  private prompts: SystemPrompt[] = []
  private categories: SystemPromptCategory[] = []

  constructor(private systemPromptService: SystemPromptService) {}

  /**
   * Initialize with current prompts
   */
  async initialize(): Promise<void> {
    try {
      const response = await this.systemPromptService.getPrompts()
      this.prompts = response.prompts
      this.categories = this.organizePropsByCategory(response.prompts)
    } catch (error) {
      console.error('Failed to initialize SystemPromptManager:', error)
    }
  }

  /**
   * Get prompts organized by category
   */
  getCategories(): SystemPromptCategory[] {
    return this.categories
  }

  /**
   * Get prompts for a specific category
   */
  getPromptsInCategory(category: string): SystemPrompt[] {
    return this.prompts.filter(prompt => prompt.category === category)
  }

  /**
   * Get most used prompts
   */
  getMostUsedPrompts(limit = 10): SystemPrompt[] {
    return [...this.prompts]
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, limit)
  }

  /**
   * Get recently created prompts
   */
  getRecentPrompts(limit = 10): SystemPrompt[] {
    return [...this.prompts]
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit)
  }

  /**
   * Search prompts with advanced filters
   */
  searchPrompts(options: {
    query?: string
    category?: string
    tags?: string[]
    isActive?: boolean
    createdAfter?: Date
  }): SystemPrompt[] {
    let results = [...this.prompts]

    if (options.query) {
      const query = options.query.toLowerCase()
      results = results.filter(prompt => 
        prompt.name.toLowerCase().includes(query) ||
        prompt.description?.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query)
      )
    }

    if (options.category) {
      results = results.filter(prompt => prompt.category === options.category)
    }

    if (options.tags && options.tags.length > 0) {
      results = results.filter(prompt => 
        options.tags!.some(tag => prompt.tags.includes(tag))
      )
    }

    if (options.isActive !== undefined) {
      results = results.filter(prompt => prompt.is_active === options.isActive)
    }

    if (options.createdAfter) {
      results = results.filter(prompt => prompt.created_at > options.createdAfter!)
    }

    return results
  }

  /**
   * Get prompt statistics
   */
  getStatistics(): {
    total: number
    byCategory: Record<string, number>
    activeCount: number
    averageUsage: number
  } {
    const byCategory: Record<string, number> = {}
    let totalUsage = 0

    for (const prompt of this.prompts) {
      byCategory[prompt.category] = (byCategory[prompt.category] || 0) + 1
      totalUsage += prompt.usage_count
    }

    return {
      total: this.prompts.length,
      byCategory,
      activeCount: this.prompts.filter(p => p.is_active).length,
      averageUsage: this.prompts.length > 0 ? totalUsage / this.prompts.length : 0
    }
  }

  /**
   * Organize prompts by category
   */
  private organizePropsByCategory(prompts: SystemPrompt[]): SystemPromptCategory[] {
    const categoryMap = new Map<string, SystemPrompt[]>()

    for (const prompt of prompts) {
      if (!categoryMap.has(prompt.category)) {
        categoryMap.set(prompt.category, [])
      }
      categoryMap.get(prompt.category)!.push(prompt)
    }

    return Array.from(categoryMap.entries()).map(([name, prompts]) => ({
      name,
      description: this.getCategoryDescription(name),
      prompts,
      color: this.getCategoryColor(name),
      icon: this.getCategoryIcon(name)
    }))
  }

  /**
   * Get category description
   */
  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      'general': 'General purpose prompts for everyday conversations',
      'consulting': 'Business and consulting focused prompts',
      'technical': 'Technical and development related prompts',
      'creative': 'Creative writing and content generation prompts',
      'analysis': 'Data analysis and research prompts',
      'support': 'Customer support and help desk prompts'
    }
    return descriptions[category.toLowerCase()] || 'Custom category prompts'
  }

  /**
   * Get category color
   */
  private getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'general': 'blue',
      'consulting': 'green',
      'technical': 'purple',
      'creative': 'pink',
      'analysis': 'orange',
      'support': 'teal'
    }
    return colors[category.toLowerCase()] || 'gray'
  }

  /**
   * Get category icon
   */
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'general': 'i-heroicons-chat-bubble-left-right',
      'consulting': 'i-heroicons-briefcase',
      'technical': 'i-heroicons-code-bracket',
      'creative': 'i-heroicons-sparkles',
      'analysis': 'i-heroicons-chart-bar',
      'support': 'i-heroicons-lifebuoy'
    }
    return icons[category.toLowerCase()] || 'i-heroicons-document-text'
  }
}