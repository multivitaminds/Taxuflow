"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient()

  if (!supabase) {
    return { error: "Authentication service is not configured" }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("[v0] Server login error:", error.message)
    if (error.message === "Invalid login credentials") {
      return { error: "Invalid email or password. Don't have an account yet? Sign up to get started." }
    }
    return { error: error.message }
  }

  if (!data.session) {
    return { error: "No session returned from login" }
  }

  console.log("[v0] Server login successful for:", email)

  // Ensure cookies are set before redirect
  const cookieStore = await cookies()

  // Force refresh the session to ensure it's fully established
  await supabase.auth.getSession()

  // Redirect on successful login
  redirect("/dashboard")
}
