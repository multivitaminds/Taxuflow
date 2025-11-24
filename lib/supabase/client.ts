import { createBrowserClient as createBrowserClientOriginal } from "@supabase/ssr"

export function createClient() {
  // Don't create browser client on server
  if (typeof window === "undefined") {
    return null as any
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key"

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("[v0] Supabase config missing on client, using mock values")
  }

  return createBrowserClientOriginal(supabaseUrl, supabaseAnonKey)
}

export function getSupabaseBrowserClient() {
  return createClient()
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const createBrowserClient = createClient
