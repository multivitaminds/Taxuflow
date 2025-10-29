import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Creating Supabase client with URL:", supabaseUrl)

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = `Missing Supabase environment variables. URL: ${supabaseUrl ? "✓" : "✗"}, Key: ${supabaseAnonKey ? "✓" : "✗"}`
    console.error("[v0]", errorMsg)
    throw new Error(errorMsg)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Keep singleton for backward compatibility
let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client
  client = createClient()
  return client
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
