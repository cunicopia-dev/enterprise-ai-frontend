/**
 * Core API service layer for FastAPI Multi-Provider LLM Platform integration
 * Based on the frontend-api-guide.md specifications
 */

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean
  timeout?: number
}

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  error?: string
}

export interface ApiErrorInterface {
  message: string
  status: number
  code?: string
  details?: any
}

/**
 * Core API client for all backend communication
 * Handles authentication, error handling, and request/response processing
 */
export class ApiClient {
  private baseUrl: string
  private apiKey: string | null = null
  private defaultTimeout = 30000 // 30 seconds

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }

  /**
   * Set API key for authenticated requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * Clear API key
   */
  clearApiKey(): void {
    this.apiKey = null
  }

  /**
   * Get default headers for requests
   */
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Make an authenticated API request
   */
  async request<T = any>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      skipAuth = false,
      timeout = this.defaultTimeout,
      ...requestOptions
    } = options

    // Build URL
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

    // Prepare headers
    const headers = {
      ...this.getDefaultHeaders(),
      ...requestOptions.headers
    }

    // Skip auth header if requested
    if (skipAuth && headers.Authorization) {
      delete headers.Authorization
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}

        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText || response.statusText }
        }

        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code,
          errorData
        )
      }

      // Parse response
      const contentType = response.headers.get('content-type')
      let data: T

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text() as any
      }

      return {
        data,
        success: true
      }

    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      // Handle network/timeout errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408)
        }
        throw new ApiError(error.message, 0)
      }

      throw new ApiError('Unknown error occurred', 0)
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string, 
    data?: any, 
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string, 
    data?: any, 
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Health check endpoint (no auth required)
   */
  async health(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get('/health', { skipAuth: true })
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Export the interface with the same name for compatibility
export type { ApiError as ApiErrorInterface }

/**
 * Error handler utility
 */
export class ErrorHandler {
  static handle(error: any, context = ''): never {
    console.error(`${context}:`, error)

    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          throw new Error('Authentication failed - please check your API key')
        case 403:
          throw new Error('Access denied - insufficient permissions')
        case 429:
          throw new Error('Rate limit exceeded - please wait before trying again')
        case 422:
          throw new Error(`Validation error: ${error.details?.detail || error.message}`)
        case 500:
          throw new Error('Server error - please try again later')
        default:
          throw new Error(error.message)
      }
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('An unexpected error occurred')
  }

  static isRetryable(error: any): boolean {
    if (error instanceof ApiError) {
      return error.status >= 500 || error.status === 429
    }
    return false
  }
}

/**
 * Retry utility for API requests
 */
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error

        // Don't retry if not retryable or on last attempt
        if (!ErrorHandler.isRetryable(error) || attempt === maxRetries) {
          break
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }
}