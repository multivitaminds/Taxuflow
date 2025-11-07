import { createBrowserClient } from "@supabase/ssr"

const getEnvVar = (key: string): string | undefined => {
  if (typeof window !== "undefined") {
    // Client-side: check window and process.env
    return (window as any)[key] || process.env[key]
  }
  return process.env[key]
}

export function createClient() {
  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Supabase not configured. Auth features will be disabled.")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "present" : "missing")
    console.error("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "present" : "missing")
    throw new Error("Supabase configuration error: Missing environment variables")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "taxu-auth",
    },
  })
}

// Keep singleton for backward compatibility
let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client

  try {
    client = createClient()
    return client
  } catch (error) {
    console.error("[v0] Failed to create Supabase browser client:", error)
    return null
  }
}

export function isSupabaseConfigured() {
  const supabaseUrl = getEnvVar("NEXT_PUBLIC_SUPABASE_URL")
  const supabaseAnonKey = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return !!(supabaseUrl && supabaseAnonKey)
}
