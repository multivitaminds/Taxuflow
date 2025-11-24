import { createBrowserClient as createBrowserClientOriginal } from "@supabase/ssr"

export function createClient() {
  // Don't create browser client on server
  if (typeof window === "undefined") {
    console.log("[v0] Supabase client: Cannot create browser client on server")
    return null as any
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase config missing on client")
    return null as any
  }

  return createBrowserClientOriginal(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseBrowserClient() {
  return createClient()
}

export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export const createBrowserClient = createClient
