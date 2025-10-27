import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  console.log("[v0] Auth callback - code:", !!code, "error:", error)

  if (error) {
    console.error("[v0] OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/signup?error=${encodeURIComponent(error_description || error)}`, request.url),
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

    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[v0] Session exchange error:", exchangeError)
      const errorMessage = exchangeError.message.includes("user_profiles")
        ? "Database error saving new user. Please contact support."
        : exchangeError.message
      return NextResponse.redirect(new URL(`/signup?error=${encodeURIComponent(errorMessage)}`, request.url))
    }

    console.log("[v0] OAuth successful for user:", data.user?.email)

    try {
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle()

      if (!existingProfile) {
        console.log("[v0] Creating user profile for:", data.user.email)
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User",
        })

        if (profileError) {
          console.error("[v0] Error creating profile:", profileError)
          // Don't fail the auth flow, profile will be created on dashboard load
        } else {
          console.log("[v0] User profile created successfully")
        }
      }
    } catch (err) {
      console.error("[v0] Unexpected error creating profile:", err)
      // Don't fail the auth flow
    }

    // Clear demo mode
    cookieStore.set({ name: "demo_mode", value: "", maxAge: 0, path: "/" })
  }

  const redirectUrl = new URL("/dashboard", request.url)
  return NextResponse.redirect(redirectUrl)
}
