import { cookies } from "next/headers"
import { getSafeUser, hasSupabaseSession } from "@/lib/supabase/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const hasSession = await hasSupabaseSession()
  const demoModeCookie = cookieStore.get("demo_mode")?.value === "true"

  // Only use demo mode if explicitly set AND no session cookies exist
  const demoMode = demoModeCookie && !hasSession

  // Demo user data
  const demoUser = {
    id: "demo-user-id",
    email: "demo@example.com",
    user_metadata: {
      full_name: "Demo User",
    },
  }

  const demoProfile = {
    id: "demo-user-id",
    full_name: "Demo User",
    email: "demo@example.com",
    created_at: new Date().toISOString(),
  }

  if (hasSession && demoModeCookie) {
    console.log("[v0] Clearing demo mode cookie - user has active session")
    cookieStore.delete("demo_mode")
  }

  if (demoMode) {
    console.log("[v0] Demo mode active, skipping auth")
    return <DashboardClient user={demoUser as any} profile={demoProfile} />
  }

  const { user, error } = await getSafeUser()

  if (user) {
    console.log("[v0] Authenticated user:", user.email)

    let profile = null
    try {
      const supabase = await getSupabaseServerClient()
      if (supabase) {
        const result = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle()

        profile = result.data
      }
    } catch (profileError: any) {
      console.log("[v0] Profile fetch failed:", profileError?.message)
    }

    return <DashboardClient user={user} profile={profile} />
  }

  if (!hasSession) {
    console.log("[v0] No authenticated user and no session, using demo mode")
    cookieStore.set("demo_mode", "true", { maxAge: 60 * 60 * 24 })
    return <DashboardClient user={demoUser as any} profile={demoProfile} />
  }

  // If we have session cookies but couldn't get user, show error instead of demo
  console.log("[v0] Session exists but couldn't fetch user data")
  return <DashboardClient user={user} profile={null} />
}
