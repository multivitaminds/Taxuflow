import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("[v0] Supabase not configured, clearing cookies anyway")
      // Clear all cookies
      const allCookies = cookieStore.getAll()
      allCookies.forEach((cookie) => {
        cookieStore.delete(cookie.name)
      })
      return NextResponse.json({ success: true })
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (error) {
            console.log("[v0] Cookie setting error during signout:", error)
          }
        },
      },
    })

    await supabase.auth.signOut({ scope: "local" })

    const allCookies = cookieStore.getAll()
    for (const cookie of allCookies) {
      try {
        cookieStore.delete(cookie.name)
      } catch (error) {
        console.log(`[v0] Error deleting cookie ${cookie.name}:`, error)
      }
    }

    const response = NextResponse.json({ success: true })

    // Set cookie clearing headers
    allCookies.forEach((cookie) => {
      response.cookies.delete(cookie.name)
    })

    return response
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    return NextResponse.json({ success: true })
  }
}
