import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const demoMode = request.cookies.get("demo_mode")?.value === "true"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Supabase not configured in middleware")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.log("[v0] Middleware auth error:", error.message)
    }

    // Protect dashboard and other authenticated routes
    const protectedPaths = ["/dashboard", "/chat", "/documents", "/settings"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !user && !demoMode) {
      console.log("[v0] Middleware: No user found, redirecting to login")
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && user) {
      console.log("[v0] Middleware: User authenticated, redirecting to dashboard")
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // The page-level auth check will handle it
    console.log("[v0] Middleware error, allowing request to continue:", error)
    return supabaseResponse
  }
}
