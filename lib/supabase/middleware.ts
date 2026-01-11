import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/get-started",
    "/businesses",
    "/auth",
    "/api/webhooks",
    "/neobank/onboarding",
  ]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  const demoMode = request.cookies.get("demo_mode")?.value === "true"
  if (demoMode) {
    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  // v0 Preview Mode: Skip auth if no Supabase config
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Middleware: Running without Supabase configuration (preview mode)")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("[v0] Middleware: Session error:", sessionError.message)
    }

    if (!isPublicPath) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }

      if (
        (request.nextUrl.pathname.startsWith("/dashboard") ||
          request.nextUrl.pathname.startsWith("/accounting") ||
          request.nextUrl.pathname.startsWith("/neobank") ||
          request.nextUrl.pathname.startsWith("/investment")) &&
        !user
      ) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware: Error creating Supabase client:", error)
    return NextResponse.next({ request })
  }
}
