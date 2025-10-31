import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  if (error) {
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

    // The handle_new_user() trigger function will create the profile when the user is created

    console.log("[v0] Auth successful for user:", data.user?.email)
  }

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
