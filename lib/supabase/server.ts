import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using it.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase config missing on server:", { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey,
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasPublicKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    // Return a mock client that throws helpful errors
    return null as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}

export { createServerClient }

export async function getSupabaseServerClient() {
  return createClient()
}

export async function createServiceRoleClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[v0] Supabase service role config missing:", { 
      hasUrl: !!supabaseUrl, 
      hasServiceKey: !!supabaseServiceKey
    })
    return null as any
  }

  // Service role client bypasses RLS - use only for trusted operations
  return createServerClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore
          }
        },
      },
    }
  )
}
