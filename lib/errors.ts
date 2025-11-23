/**
 * Custom error classes for better error handling and categorization
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public isOperational = true,
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "AUTHENTICATION_ERROR", 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, "AUTHORIZATION_ERROR", 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, "RATE_LIMIT", 429)
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `${service} service error`, "EXTERNAL_SERVICE_ERROR", 502)
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, "DATABASE_ERROR", 500)
  }
}

/**
 * Error response formatter for API routes
 */
export interface ErrorResponse {
  error: string
  code: string
  statusCode: number
  details?: any
  timestamp: string
  requestId?: string
}

export function formatErrorResponse(error: unknown, requestId?: string): ErrorResponse {
  const timestamp = new Date().toISOString()

  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp,
      requestId,
    }
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: "INTERNAL_ERROR",
      statusCode: 500,
      timestamp,
      requestId,
    }
  }

  return {
    error: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    statusCode: 500,
    timestamp,
    requestId,
  }
}

/**
 * Error logger with context
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const timestamp = new Date().toISOString()

  if (error instanceof AppError) {
    console.error(`[${timestamp}] ${error.name}:`, {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      ...context,
    })
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] Error:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...context,
    })
  } else {
    console.error(`[${timestamp}] Unknown error:`, error, context)
  }
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      logError(error, { handler: handler.name })
      const errorResponse = formatErrorResponse(error)

      return Response.json(errorResponse, {
        status: errorResponse.statusCode,
      })
    }
  }) as T
}

/**
 * Retry logic for external API calls
 */
export interface RetryOptions {
  maxRetries?: number
  delayMs?: number
  backoff?: boolean
  shouldRetry?: (error: any) => boolean
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = true,
    shouldRetry = (error) => {
      // Retry on network errors and 5xx status codes
      return error?.code === "ECONNRESET" || error?.code === "ETIMEDOUT" || error?.statusCode >= 500
    },
  } = options

  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }

      const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs
      console.log(`[v0] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync<T>(fn: () => Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))]
  }
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(vars: string[]): void {
  const missing = vars.filter((v) => !process.env[v])

  if (missing.length > 0) {
    throw new AppError(`Missing required environment variables: ${missing.join(", ")}`, "ENV_VAR_MISSING", 500)
  }
}

export enum ErrorCode {
  // Client errors (4xx)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  RATE_LIMIT = "RATE_LIMIT",
  DEMO_MODE_RESTRICTION = "DEMO_MODE_RESTRICTION",

  // Server errors (5xx)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_API_ERROR = "EXTERNAL_API_ERROR",
  INTEGRATION_ERROR = "INTEGRATION_ERROR",
  ENCRYPTION_ERROR = "ENCRYPTION_ERROR",

  // Unknown
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode?: number,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"

    // Set default status code based on error code
    if (!statusCode) {
      switch (code) {
        case ErrorCode.VALIDATION_ERROR:
          this.statusCode = 400
          break
        case ErrorCode.UNAUTHORIZED:
          this.statusCode = 401
          break
        case ErrorCode.FORBIDDEN:
        case ErrorCode.DEMO_MODE_RESTRICTION:
          this.statusCode = 403
          break
        case ErrorCode.NOT_FOUND:
          this.statusCode = 404
          break
        case ErrorCode.CONFLICT:
          this.statusCode = 409
          break
        case ErrorCode.RATE_LIMIT:
          this.statusCode = 429
          break
        case ErrorCode.EXTERNAL_API_ERROR:
        case ErrorCode.INTEGRATION_ERROR:
          this.statusCode = 502
          break
        default:
          this.statusCode = 500
      }
    }

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleApiError(error: unknown): Response {
  const timestamp = new Date().toISOString()

  if (error instanceof ApiError) {
    console.error(`[v0] API Error [${error.code}]:`, error.message, error.details)

    return Response.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof AppError) {
    console.error(`[v0] App Error [${error.code}]:`, error.message)

    return Response.json(
      {
        error: error.message,
        code: error.code,
        timestamp,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    console.error(`[v0] Unexpected Error:`, error.message, error.stack)

    return Response.json(
      {
        error: error.message,
        code: ErrorCode.INTERNAL_ERROR,
        timestamp,
      },
      { status: 500 },
    )
  }

  console.error(`[v0] Unknown Error:`, error)

  return Response.json(
    {
      error: "An unexpected error occurred",
      code: ErrorCode.UNKNOWN_ERROR,
      timestamp,
    },
    { status: 500 },
  )
}
