import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

function getEnvVars() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

export function createClient() {
  const { url, key } = getEnvVars()

  if (!url || !key) {
    return null
  }

  try {
    return createBrowserClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey: "taxu-auth",
      },
    })
  } catch (error) {
    console.error("[v0] Error creating Supabase client:", error)
    return null
  }
}

export function getSupabaseBrowserClient() {
  if (client) return client
  client = createClient()
  return client
}

export function isSupabaseConfigured() {
  const { url, key } = getEnvVars()
  return !!(url && key)
}

export function resetSupabaseClient() {
  client = null
}

export async function waitForSupabase(timeoutMs = 5000): Promise<ReturnType<typeof createBrowserClient> | null> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      return supabase
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.error("[v0] Timeout waiting for Supabase environment variables")
  return null
}
