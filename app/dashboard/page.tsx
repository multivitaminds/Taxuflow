import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  try {
    const cookieStore = await cookies()
    const demoMode = cookieStore.get("demo_mode")?.value === "true"

    if (demoMode) {
      console.log("[v0] Demo mode detected, loading dashboard with demo data")

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

      return <DashboardClient user={demoUser as any} profile={demoProfile} />
    }

    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      console.log("[v0] Supabase not configured, redirecting to login")
      redirect("/login")
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.log("[v0] No authenticated user, redirecting to login")
      redirect("/login")
    }

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    return <DashboardClient user={user} profile={profile} />
  } catch (error) {
    console.log("[v0] Auth error caught, redirecting to login:", error)
    redirect("/login")
  }
}
