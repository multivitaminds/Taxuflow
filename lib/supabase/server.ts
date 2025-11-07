import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Server env check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Server env vars not available, will use client-side auth")
    return null
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore errors from Server Components
        }
      },
    },
  })
}

// Keep legacy function for backward compatibility
export async function getSupabaseServerClient() {
  return createClient()
}

export const createServerClient = createClient
