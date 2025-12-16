import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createUserWithBankAccount } from "@/app/actions/auth-enhanced"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  console.log("[v0] Auth callback received:", { code: !!code, error, error_description })

  if (error) {
    console.error("[v0] OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || error)}`,
        request.url,
      ),
    )
  }

  if (!code) {
    console.error("[v0] No code provided in callback")
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch (error) {
              console.error("[v0] Cookie setting error:", error)
            }
          },
        },
      },
    )

    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error("[v0] Session exchange error:", sessionError)
      return NextResponse.redirect(
        new URL(`/login?error=auth_error&error_description=${encodeURIComponent(sessionError.message)}`, request.url),
      )
    }

    if (!data?.user) {
      console.error("[v0] No user data after session exchange")
      return NextResponse.redirect(new URL("/login?error=no_user", request.url))
    }

    console.log("[v0] OAuth successful for user:", data.user.email)

    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle()

    if (!existingProfile) {
      console.log("[v0] Creating new user profile")
      try {
        await createUserWithBankAccount(
          data.user.id,
          data.user.email!,
          data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
          data.user.user_metadata?.user_type || "regular",
        )
      } catch (profileError) {
        console.error("[v0] Error creating user profile:", profileError)
        // Continue anyway as the auth succeeded
      }
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url))

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      response.cookies.set("sb-access-token", session.access_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      response.cookies.set("sb-refresh-token", session.refresh_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
    }

    return response
  } catch (err: any) {
    console.error("[v0] Auth callback error:", err)
    return NextResponse.redirect(
      new URL(`/login?error=callback_error&error_description=${encodeURIComponent(err.message)}`, request.url),
    )
  }
}
