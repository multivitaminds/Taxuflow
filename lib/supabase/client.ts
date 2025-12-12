import { createBrowserClient as createBrowserClientOriginal } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

const originalFetch = typeof window !== "undefined" ? window.fetch.bind(window) : fetch

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  if (supabaseInstance) {
    return supabaseInstance
  }

  supabaseInstance = createBrowserClientOriginal(supabaseUrl, supabaseAnonKey)

  return supabaseInstance
}

export function getSupabaseBrowserClient() {
  return createClient()
}

export function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export const createBrowserClient = createClient
