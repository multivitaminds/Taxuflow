import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const demoMode = request.cookies.get("demo_mode")?.value === "true"
  if (demoMode) {
    console.log("[v0] Middleware: Demo mode active")
    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next({ request })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Middleware: Supabase config not available", {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasPublicKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      path: request.nextUrl.pathname,
    })
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

    // Do not run code between createServerClient and supabase.auth.getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] Middleware: User check", {
      hasUser: !!user,
      path: request.nextUrl.pathname,
      userId: user?.id,
    })

    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      console.log("[v0] Middleware: Redirecting authenticated user to dashboard from", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (
      (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/accounting")) &&
      !user
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      console.log("[v0] Middleware: Redirecting to login from", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware: Error creating Supabase client:", error)
    return NextResponse.next({ request })
  }
}
