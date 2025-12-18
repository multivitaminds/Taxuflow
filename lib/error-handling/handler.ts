import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND")
    this.name = "NotFoundError"
  }
}

export async function logError(error: Error, context?: Record<string, any>) {
  console.error("[v0] Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })

  try {
    const supabase = await createClient()
    await supabase.from("security_logs").insert({
      event_type: "error",
      severity: error instanceof AppError && error.statusCode < 500 ? "warning" : "error",
      details: {
        error: {
          name: error.name,
          message: error.message,
          code: error instanceof AppError ? error.code : undefined,
        },
        context,
      },
    })
  } catch (logError) {
    console.error("[v0] Failed to log error:", logError)
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    logError(error)
    return NextResponse.json(
      {
        error: {
          message: "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      error: {
        message: "An unknown error occurred",
        code: "UNKNOWN_ERROR",
      },
    },
    { status: 500 },
  )
}
