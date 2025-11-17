"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from 'next/navigation'

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
