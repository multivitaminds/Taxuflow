/**
 * Comprehensive Supabase Error Handler
 * Provides RLS-aware error handling with user-friendly messages
 */

import { type PostgrestError } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export interface SupabaseErrorContext {
  operation?: string
  resource?: string
  userId?: string
  details?: Record<string, any>
}

/**
 * Supabase/PostgreSQL Error Codes
 */
export const ErrorCodes = {
  // RLS and Permission Errors
  INSUFFICIENT_PRIVILEGE: "42501", // RLS policy violation
  PGRST116: "PGRST116", // Row not found (PostgREST)
  PGRST301: "PGRST301", // Invalid JWT token
  
  // Constraint Violations
  UNIQUE_VIOLATION: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",
  CHECK_VIOLATION: "23514",
  
  // Database Errors
  FUNCTION_NOT_FOUND: "42883",
  UNDEFINED_TABLE: "42P01",
  UNDEFINED_COLUMN: "42703",
  
  // Connection Errors
  CONNECTION_FAILURE: "08006",
  CONNECTION_TIMEOUT: "08001",
} as const

/**
 * Check if error is an RLS policy violation
 */
export function isRLSError(error: PostgrestError | any): boolean {
  return (
    error?.code === ErrorCodes.INSUFFICIENT_PRIVILEGE ||
    error?.message?.toLowerCase().includes("row-level security") ||
    error?.message?.toLowerCase().includes("insufficient privilege") ||
    error?.message?.toLowerCase().includes("permission denied")
  )
}

/**
 * Check if error is a "not found" error
 */
export function isNotFoundError(error: PostgrestError | any): boolean {
  return error?.code === ErrorCodes.PGRST116 || error?.message?.toLowerCase().includes("not found")
}

/**
 * Check if error is a constraint violation
 */
export function isConstraintError(error: PostgrestError | any): boolean {
  const constraintCodes = [
    ErrorCodes.UNIQUE_VIOLATION,
    ErrorCodes.FOREIGN_KEY_VIOLATION,
    ErrorCodes.NOT_NULL_VIOLATION,
    ErrorCodes.CHECK_VIOLATION,
  ]
  return constraintCodes.includes(error?.code)
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: PostgrestError | any): boolean {
  return (
    error?.code === ErrorCodes.PGRST301 ||
    error?.message?.toLowerCase().includes("jwt") ||
    error?.message?.toLowerCase().includes("authentication") ||
    error?.message?.toLowerCase().includes("unauthorized")
  )
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: PostgrestError | any, context?: SupabaseErrorContext): string {
  const operation = context?.operation || "perform this operation"
  const resource = context?.resource || "resource"

  // RLS Policy Violations
  if (isRLSError(error)) {
    return `You don't have permission to ${operation}. This ${resource} may belong to another user or organization.`
  }

  // Not Found Errors
  if (isNotFoundError(error)) {
    return `The ${resource} you're looking for doesn't exist or has been deleted.`
  }

  // Authentication Errors
  if (isAuthError(error)) {
    return "Your session has expired. Please log in again to continue."
  }

  // Constraint Violations
  if (error?.code === ErrorCodes.UNIQUE_VIOLATION) {
    return `This ${resource} already exists. Please use a different value.`
  }

  if (error?.code === ErrorCodes.FOREIGN_KEY_VIOLATION) {
    return `Cannot ${operation} because it's linked to other records. Please remove those links first.`
  }

  if (error?.code === ErrorCodes.NOT_NULL_VIOLATION) {
    const field = error?.details?.match(/column "([^"]+)"/)?.[1] || "required field"
    return `The field "${field}" is required and cannot be empty.`
  }

  // Database Configuration Errors
  if (error?.code === ErrorCodes.FUNCTION_NOT_FOUND) {
    return "A required database function is missing. Please contact support."
  }

  if (error?.code === ErrorCodes.UNDEFINED_TABLE || error?.code === ErrorCodes.UNDEFINED_COLUMN) {
    return "Database configuration error. Please contact support."
  }

  // Connection Errors
  if (error?.code === ErrorCodes.CONNECTION_FAILURE || error?.code === ErrorCodes.CONNECTION_TIMEOUT) {
    return "Unable to connect to the database. Please try again in a moment."
  }

  // Generic fallback
  return `Failed to ${operation}. Please try again or contact support if the problem persists.`
}

/**
 * Handle Supabase errors and return appropriate NextResponse
 */
export function handleSupabaseError(
  error: PostgrestError | any,
  context?: SupabaseErrorContext
): NextResponse {
  const userMessage = getUserFriendlyMessage(error, context)
  const timestamp = new Date().toISOString()

  // Log detailed error for debugging
  console.error("[v0] Supabase Error:", {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    context,
    timestamp,
  })

  // Determine HTTP status code
  let statusCode = 500

  if (isRLSError(error)) {
    statusCode = 403 // Forbidden
  } else if (isNotFoundError(error)) {
    statusCode = 404 // Not Found
  } else if (isAuthError(error)) {
    statusCode = 401 // Unauthorized
  } else if (isConstraintError(error)) {
    statusCode = 409 // Conflict
  }

  return NextResponse.json(
    {
      error: userMessage,
      code: error?.code || "UNKNOWN_ERROR",
      timestamp,
      // Include technical details in development only
      ...(process.env.NODE_ENV === "development" && {
        technical: {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
        },
      }),
    },
    { status: statusCode }
  )
}

/**
 * Wrapper for Supabase operations with automatic error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  context?: SupabaseErrorContext
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const { data, error } = await operation()

    if (error) {
      return {
        data: null,
        error: handleSupabaseError(error, context),
      }
    }

    if (!data) {
      return {
        data: null,
        error: handleSupabaseError(
          { code: ErrorCodes.PGRST116, message: "Not found" },
          context
        ),
      }
    }

    return { data, error: null }
  } catch (error) {
    console.error("[v0] Unexpected error in withErrorHandling:", error)
    return {
      data: null,
      error: NextResponse.json(
        {
          error: "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      ),
    }
  }
}

/**
 * Check if user has access to resource (for pre-flight checks)
 */
export async function checkResourceAccess(
  supabase: any,
  table: string,
  resourceId: string,
  userId: string
): Promise<{ hasAccess: boolean; error?: NextResponse }> {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", resourceId)
    .eq("user_id", userId)
    .single()

  if (error) {
    if (isNotFoundError(error) || isRLSError(error)) {
      return {
        hasAccess: false,
        error: NextResponse.json(
          {
            error: `You don't have permission to access this resource or it doesn't exist.`,
            code: error.code,
          },
          { status: 403 }
        ),
      }
    }

    return {
      hasAccess: false,
      error: handleSupabaseError(error, { operation: "check access", resource: table }),
    }
  }

  return { hasAccess: !!data }
}
