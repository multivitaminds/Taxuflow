import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    })
    return null
  }

  try {
    const rememberMe = typeof window !== "undefined" ? localStorage.getItem("taxu_remember_me") === "true" : false

    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating Supabase client:", error)
    return null
  }
}

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client
  client = createClient()
  return client
}

export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}
