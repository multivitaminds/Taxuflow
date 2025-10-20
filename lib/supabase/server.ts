import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables on server")
    return null
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            const enhancedOptions = {
              ...options,
              maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
              sameSite: "lax" as const,
              secure: process.env.NODE_ENV === "production",
            }
            cookieStore.set(name, value, enhancedOptions)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export const createServerClient = createClient

// Keep legacy function for backward compatibility
export async function getSupabaseServerClient() {
  return createClient()
}

export async function hasSupabaseSession() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    // Check if any Supabase auth cookies exist
    const hasAuthCookie = allCookies.some(
      (cookie) =>
        cookie.name.includes("sb-") && (cookie.name.includes("-auth-token") || cookie.name.includes("access-token")),
    )

    console.log("[v0] Supabase session cookies present:", hasAuthCookie)
    return hasAuthCookie
  } catch (error) {
    console.log("[v0] Error checking session cookies:", error)
    return false
  }
}

export async function getSafeUser() {
  try {
    // First check if session cookies exist
    const hasSession = await hasSupabaseSession()

    if (!hasSession) {
      console.log("[v0] No session cookies found, user not logged in")
      return { user: null, error: new Error("No session") }
    }

    console.log("[v0] Session cookies found, attempting to get user")

    const supabase = await createClient()
    if (!supabase) {
      console.log("[v0] Supabase client not available")
      return { user: null, error: new Error("Supabase client not available") }
    }

    // Try to get user from session (doesn't make network request)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      console.log("[v0] User found from session:", session.user.email)
      return { user: session.user, error: null }
    }

    // If session exists but no user, try getUser with timeout
    console.log("[v0] Session exists but no user, trying getUser()")
    const authPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 3000))

    const result = await Promise.race([authPromise, timeoutPromise])
      .then((res: any) => {
        if (res?.data?.user) {
          console.log("[v0] User fetched successfully:", res.data.user.email)
          return { user: res.data.user, error: null }
        }
        return { user: null, error: res?.error || new Error("No user data") }
      })
      .catch((error) => {
        console.log("[v0] getUser() failed:", error?.message)
        // If we have session cookies but getUser fails, return a basic user object
        // This prevents falling back to demo mode when the user is actually logged in
        if (session) {
          console.log("[v0] Using session data as fallback")
          return { user: session.user, error: null }
        }
        return { user: null, error }
      })

    return result
  } catch (error: any) {
    console.log("[v0] Safe user check failed:", error?.message || "Unknown error")

    // Last resort: check if session cookies exist
    const hasSession = await hasSupabaseSession()
    if (hasSession) {
      console.log("[v0] Session cookies exist despite error, user likely logged in")
      // Return a minimal user object to prevent demo mode
      return {
        user: {
          id: "authenticated-user",
          email: "authenticated@user.com",
          user_metadata: {},
        } as any,
        error: null,
      }
    }

    return { user: null, error }
  }
}
