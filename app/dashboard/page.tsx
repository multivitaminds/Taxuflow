import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function DashboardPage() {
  try {
    const cookieStore = await cookies()
    const supabase = await getSupabaseServerClient()

    if (supabase) {
      const {
        data: { user },
        error,
      } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error("Auth check timeout")), 5000),
        ),
      ]).catch((err) => {
        console.log("[v0] Dashboard auth check failed:", err.message)
        return { data: { user: null }, error: err }
      })

      if (!error && user) {
        console.log("[v0] Real user authenticated, clearing demo mode")
        cookieStore.delete("demo_mode")

        const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

        if (!profile) {
          console.log("[v0] User profile not found, creating new profile")
          const { data: newProfile } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            })
            .select()
            .single()

          return (
            <ErrorBoundary>
              <DashboardClient user={user} profile={newProfile} />
            </ErrorBoundary>
          )
        }

        return (
          <ErrorBoundary>
            <DashboardClient user={user} profile={profile} />
          </ErrorBoundary>
        )
      }
    }

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

      return (
        <ErrorBoundary>
          <DashboardClient user={demoUser as any} profile={demoProfile} />
        </ErrorBoundary>
      )
    }

    console.log("[v0] No authenticated user, redirecting to login")
    redirect("/login")
  } catch (error) {
    console.log("[v0] Dashboard error:", error)
    redirect("/login")
  }
}
