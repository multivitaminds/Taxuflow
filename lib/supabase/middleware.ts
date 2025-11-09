import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const demoMode = request.cookies.get("demo_mode")?.value === "true"

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const authCookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name.includes("sb-") || cookie.name.includes("auth"))

  const hasAuthCookies = authCookies.length > 0

  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/auth/callback", "/_vercel", "/api/webhooks"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Middleware: Missing Supabase config, allowing through")
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

    let user = null
    const protectedPaths = ["/dashboard", "/chat", "/documents", "/settings"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath || request.nextUrl.pathname === "/auth/callback") {
      try {
        const {
          data: { user: fetchedUser },
        } = await Promise.race([
          supabase.auth.getUser(),
          new Promise<{ data: { user: null } }>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000)),
        ])
        user = fetchedUser
      } catch (error) {
        console.log("[v0] Middleware: User fetch timeout (non-fatal)")
      }
    }

    const isAuthenticated = user || hasAuthCookies || demoMode

    if (isProtectedPath && !isAuthenticated) {
      console.log("[v0] Middleware: Unauthenticated access to protected path, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.log("[v0] Middleware error (non-fatal):", error)

    const protectedPaths = ["/dashboard", "/chat", "/documents", "/settings"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedPath && !hasAuthCookies && !demoMode) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return supabaseResponse
  }
}
