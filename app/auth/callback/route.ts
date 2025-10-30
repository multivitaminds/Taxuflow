import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error_description || error)}`, request.url))
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

    if (!sessionError && data.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        user_id: data.user.id,
        email: data.user.email || "",
        full_name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
        subscription_tier: "free",
        subscription_status: "active",
      })

      if (profileError && !profileError.message.includes("duplicate")) {
        console.log("[v0] Profile creation skipped:", profileError.message)
      }
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
