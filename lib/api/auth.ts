import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import crypto from "crypto"

export interface APIKeyData {
  id: string
  user_id: string
  name: string
  environment: "sandbox" | "production"
  permissions: string[]
  rate_limit: number
}

/**
 * Generate a new API key
 * Format: taxu_{env}_{random_string}
 */
export function generateAPIKey(environment: "sandbox" | "production"): {
  key: string
  keyPrefix: string
  keyHash: string
} {
  const randomBytes = crypto.randomBytes(32).toString("hex")
  const key = `taxu_${environment === "production" ? "live" : "test"}_${randomBytes}`
  const keyPrefix = key.substring(0, 20) // First 20 chars for display
  const keyHash = crypto.createHash("sha256").update(key).digest("hex")

  return { key, keyPrefix, keyHash }
}

/**
 * Verify API key and return associated data
 */
export async function verifyAPIKey(apiKey: string): Promise<APIKeyData | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  // Hash the provided key
  const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")

  // Look up the key in the database
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, name, environment, permissions, rate_limit, last_used_at, expires_at, is_active")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return null
  }

  // Check if key is expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Update last_used_at
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id)

  return data as APIKeyData
}

/**
 * Middleware to authenticate API requests
 */
export async function authenticateAPIRequest(
  request: NextRequest,
): Promise<{ authenticated: boolean; keyData?: APIKeyData; error?: string }> {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, error: "Missing or invalid Authorization header" }
  }

  const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix

  const keyData = await verifyAPIKey(apiKey)

  if (!keyData) {
    return { authenticated: false, error: "Invalid or expired API key" }
  }

  return { authenticated: true, keyData }
}

/**
 * Log API request
 */
export async function logAPIRequest(params: {
  apiKeyId?: string
  userId?: string
  method: string
  endpoint: string
  statusCode: number
  requestBody?: any
  responseBody?: any
  ipAddress?: string
  userAgent?: string
  durationMs: number
}) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  await supabase.from("api_logs").insert({
    api_key_id: params.apiKeyId,
    user_id: params.userId,
    method: params.method,
    endpoint: params.endpoint,
    status_code: params.statusCode,
    request_body: params.requestBody,
    response_body: params.responseBody,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    duration_ms: params.durationMs,
  })
}
