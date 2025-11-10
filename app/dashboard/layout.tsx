import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardProvider } from "@/components/dashboard-provider"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log("[v0] Server: Dashboard layout loading...")

  const supabase = await createClient()

  if (!supabase) {
    console.log("[v0] Server: No Supabase client, redirecting to login")
    redirect("/login")
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log("[v0] Server: Session check:", {
    hasSession: !!session,
    hasUser: !!session?.user,
  })

  if (!session?.user) {
    console.log("[v0] Server: No authenticated session, redirecting to login")
    redirect("/login")
  }

  const user = session.user

  // Fetch profile on server
  let profile = null
  try {
    const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

    if (!data) {
      // Create profile if it doesn't exist
      const { data: newProfile } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.email?.split("@")[0] || "User",
        })
        .select()
        .maybeSingle()
      profile = newProfile
    } else {
      profile = data
    }
  } catch (error) {
    console.error("[v0] Error fetching profile:", error)
  }

  console.log("[v0] Server: Dashboard layout loaded for user:", user.email)

  return (
    <DashboardProvider initialUser={user} initialProfile={profile}>
      {children}
    </DashboardProvider>
  )
}
