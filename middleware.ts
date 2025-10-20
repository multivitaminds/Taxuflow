import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
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
          cookiesToSet.forEach(({ name, value, options }) => {
            const enhancedOptions = {
              ...options,
              maxAge: 30 * 24 * 60 * 60, // 30 days
              sameSite: "lax" as const,
              secure: process.env.NODE_ENV === "production",
            }
            supabaseResponse.cookies.set(name, value, enhancedOptions)
          })
        },
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      // Session exists, refresh it to extend expiration
      await supabase.auth.refreshSession()
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes that require authentication
    const protectedPaths = ["/dashboard", "/accounting", "/review", "/file", "/developer-portal"]
    const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    // Redirect to login if accessing protected route without auth
    if (isProtectedPath && !user && !request.nextUrl.pathname.startsWith("/login")) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/login"
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (user && request.nextUrl.pathname.startsWith("/developer-portal")) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("subscription_tier")
        .eq("user_id", user.id)
        .maybeSingle()

      // Redirect free tier users to pricing page
      if (!profile || profile.subscription_tier === "Free") {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/pricing"
        redirectUrl.searchParams.set("upgrade", "developer")
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Redirect to dashboard if accessing login/signup while authenticated
    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = "/dashboard"
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
