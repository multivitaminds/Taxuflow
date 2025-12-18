import { withRetry } from "./errors"

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  code?: string
  statusCode?: number
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await withRetry(
        async () => {
          const res = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
          })

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw {
              statusCode: res.status,
              message: errorData.error || res.statusText,
              code: errorData.code,
            }
          }

          return res
        },
        {
          maxRetries: 2,
          shouldRetry: (error) => error?.statusCode >= 500,
        },
      )

      const data = await response.json()
      return { data, statusCode: response.status }
    } catch (error: any) {
      console.error(`[v0] API request failed: ${endpoint}`, error)
      return {
        error: error.message || "Request failed",
        code: error.code || "REQUEST_FAILED",
        statusCode: error.statusCode || 500,
      }
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const apiClient = new ApiClient()
