"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient()

  if (!supabase) {
    return {
      error:
        "Authentication service is not available. Please use the 'Try Demo Account' button to explore the app, or contact support if you need to access your account.",
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("[v0] Sign in error:", error)
    if (error.message === "Invalid login credentials") {
      return {
        error:
          "Invalid email or password. Don't have an account? Click 'Sign up' below or use the 'Try Demo Account' button to explore without signing up.",
      }
    }
    if (error.message.includes("Email not confirmed")) {
      return {
        error: "Please check your email and click the confirmation link before signing in.",
      }
    }
    return { error: error.message }
  }

  if (!data.session) {
    return { error: "No session returned from login" }
  }

  // Redirect on successful login
  redirect("/dashboard")
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = await createClient()

  if (!supabase) {
    return {
      error: "Authentication service is not available.",
    }
  }

  const redirectUrl =
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: false,
    },
  })

  if (error) {
    console.error(`[v0] ${provider} OAuth error:`, error)
    return { error: error.message }
  }

  return { url: data.url }
}
