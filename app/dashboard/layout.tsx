import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { DashboardProvider } from "@/components/dashboard-provider"
import { DemoModeBanner } from "@/components/demo-mode-banner"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()

  const isDemoMode = cookieStore.get("demo_mode")?.value === "true"
  if (isDemoMode) {
    console.log("[v0] Dashboard: Using demo mode")
    const demoUser = {
      id: "demo-user-id",
      email: "demo@taxu.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: "authenticated",
      role: "authenticated",
    }

    const demoProfile = {
      id: "demo-user-id",
      email: "demo@taxu.com",
      full_name: "Demo User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_agent: "Sam",
      subscription_tier: "Free",
    }

    return (
      <DashboardProvider initialUser={demoUser as any} initialProfile={demoProfile}>
        <DemoModeBanner isDemoMode />
        {children}
      </DashboardProvider>
    )
  }

  const supabase = await createClient()

  if (!supabase) {
    console.log("[v0] Dashboard: Supabase not configured, using demo mode as fallback")
    cookieStore.set("demo_mode", "true", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    const demoUser = {
      id: "demo-user-id",
      email: "demo@taxu.com",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: "authenticated",
      role: "authenticated",
    }

    const demoProfile = {
      id: "demo-user-id",
      email: "demo@taxu.com",
      full_name: "Demo User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      preferred_agent: "Sam",
      subscription_tier: "Free",
    }

    return (
      <DashboardProvider initialUser={demoUser as any} initialProfile={demoProfile}>
        <DemoModeBanner isDemoMode />
        {children}
      </DashboardProvider>
    )
  }

  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error("[v0] Dashboard: Error fetching user:", error)
    } else {
      user = data.user
    }
  } catch (err) {
    console.error("[v0] Dashboard: Exception fetching user:", err)
  }

  if (!user) {
    console.log("[v0] Dashboard: No authenticated user, redirecting to login")
    redirect("/login")
  }

  console.log("[v0] Dashboard: Authenticated user found", { email: user.email })

  let profile = null
  try {
    const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()
    profile = data
  } catch (err) {
    console.error("[v0] Error fetching user profile:", err)
  }

  const userProfile = profile || {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.email || "User",
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
    preferred_agent: "Sam",
    subscription_tier: "Free",
  }

  return (
    <DashboardProvider initialUser={user} initialProfile={userProfile}>
      {children}
    </DashboardProvider>
  )
}
