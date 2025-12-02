import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createUserWithBankAccount } from "@/app/actions/auth-enhanced"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  if (error) {
    console.log("[v0] OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || error)}`,
        request.url,
      ),
    )
  }

  if (code) {
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
            } catch {
              // Ignore errors from Server Component context
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

    if (data?.user) {
      console.log("[v0] OAuth successful for user:", data.user.email)

      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle()

      if (!existingProfile) {
        console.log("[v0] Creating new user profile with automatic bank accounts")
        await createUserWithBankAccount(
          data.user.id,
          data.user.email!,
          data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
          data.user.user_metadata?.user_type || "regular",
        )
      }

      const response = NextResponse.redirect(new URL("/dashboard", request.url))

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        response.cookies.set("sb-access-token", session.access_token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        })
        response.cookies.set("sb-refresh-token", session.refresh_token, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
        })
      }

      return response
    }

    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
