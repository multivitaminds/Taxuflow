import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      console.log("[v0] Supabase not configured, redirecting to login")
      redirect("/login")
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (user && !error) {
      console.log("[v0] Authenticated user found:", user.email)

      // Clear demo mode cookie if it exists
      const cookieStore = await cookies()
      if (cookieStore.get("demo_mode")?.value === "true") {
        console.log("[v0] Clearing demo mode cookie for authenticated user")
        cookieStore.delete("demo_mode")
      }

      const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle()

      let userProfile = profile
      if (!userProfile) {
        console.log("[v0] No profile found, creating new profile for user:", user.id)
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          })
          .select()
          .single()

        if (createError) {
          console.log("[v0] Error creating profile:", createError.message)
          userProfile = null
        } else {
          console.log("[v0] Profile created successfully")
          userProfile = newProfile
        }
      }

      return <DashboardClient user={user} profile={userProfile} />
    }

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

    console.log("[v0] No authenticated user, redirecting to login")
    redirect("/login")
  } catch (error) {
    console.log("[v0] Auth error caught, redirecting to login:", error)
    redirect("/login")
  }
}
