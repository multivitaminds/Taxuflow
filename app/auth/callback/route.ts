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
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent("Authentication failed. Please try again.")}`, request.url),
      )
    }

    console.log("[v0] OAuth successful for user:", data.user?.email)

    // Just check if onboarding is needed
    let needsOnboarding = false

    try {
      // Wait a moment for the trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id, onboarding_completed")
        .eq("id", data.user.id)
        .maybeSingle()

      if (existingProfile && !existingProfile.onboarding_completed) {
        needsOnboarding = true
      } else if (!existingProfile) {
        // Profile doesn't exist yet, assume new user needs onboarding
        needsOnboarding = true
      }
    } catch (err) {
      console.error("[v0] Error checking onboarding status:", err)
      // Default to dashboard if we can't check
    }

    // Clear demo mode
    cookieStore.set({ name: "demo_mode", value: "", maxAge: 0, path: "/" })

    const redirectUrl = new URL(needsOnboarding ? "/onboarding" : "/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  const redirectUrl = new URL("/dashboard", request.url)
  return NextResponse.redirect(redirectUrl)
}
