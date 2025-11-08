import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const demoMode = request.cookies.get("demo_mode")?.value === "true"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder"

  const authCookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name.includes("sb-") || cookie.name.includes("auth"))

  const hasAuthCookies = authCookies.length > 0

  console.log("[v0] Middleware auth check:", {
    path: request.nextUrl.pathname,
    hasAuthCookies,
    cookieCount: authCookies.length,
    demoMode,
  })

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

    let user = null

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      user = session?.user || null
    } catch (sessionError) {
      console.log("[v0] Session fetch error (non-fatal):", sessionError)
    }

    const isAuthenticated = user || (hasAuthCookies && !demoMode)

    const protectedPaths = ["/dashboard", "/chat", "/documents", "/settings"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && isAuthenticated) {
      console.log("[v0] Middleware: User already authenticated, redirecting to dashboard")
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }

    if (isProtectedPath && !isAuthenticated && !demoMode) {
      console.log("[v0] Middleware: Blocking unauthenticated access to protected path")
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.log("[v0] Middleware error (allowing through):", error)
    const protectedPaths = ["/dashboard", "/chat", "/documents", "/settings"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !hasAuthCookies && !demoMode) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  }
}
