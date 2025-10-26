import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  const hostname = request.headers.get("host") || ""
  const isAdminSubdomain = hostname.startsWith("admin.")

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (isAdminSubdomain) {
      const pathname = request.nextUrl.pathname

      // Allow public admin login page
      if (pathname === "/admin/login") {
        return response
      }

      if (!user) {
        const loginUrl = new URL("/admin/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verify user is an admin
      const { data: adminUser } = await supabase.from("admin_users").select("*").eq("user_id", user.id).single()

      if (!adminUser) {
        const unauthorizedUrl = new URL("/admin/unauthorized", request.url)
        return NextResponse.redirect(unauthorizedUrl)
      }

      // Rewrite admin.taxu.io/* to /admin/*
      if (!pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone()
        url.pathname = `/admin${pathname}`
        return NextResponse.rewrite(url)
      }
    }
  } catch (error) {
    console.error("[v0] Middleware error:", error)
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
