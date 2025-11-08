import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"
import { ErrorBoundary } from "@/components/error-boundary"

export default async function DashboardPage() {
  try {
    const cookieStore = await cookies()

    const authCookies = cookieStore.getAll().filter((c) => c.name.includes("sb-") || c.name.includes("auth"))
    const hasAuthCookies = authCookies.length > 0

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

    const supabase = await getSupabaseServerClient()

    if (supabase && hasAuthCookies) {
      try {
        const {
          data: { user },
        } = await Promise.race([
          supabase.auth.getUser(),
          new Promise<{ data: { user: null } }>((_, reject) =>
            setTimeout(() => reject(new Error("Auth check timeout")), 2000),
          ),
        ])

        if (user) {
          console.log("[v0] Server auth successful for:", user.email)
          cookieStore.delete("demo_mode")

          const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

          if (!profile) {
            console.log("[v0] Creating user profile...")
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
      } catch (error) {
        console.log("[v0] Server auth failed, falling back to client-side auth:", error)
      }
    }

    if (hasAuthCookies) {
      console.log("[v0] Auth cookies present, loading with client-side auth")
      cookieStore.delete("demo_mode")

      return (
        <ErrorBoundary>
          <DashboardClient user={null} profile={null} />
        </ErrorBoundary>
      )
    }

    console.log("[v0] No authentication found, redirecting to login")
    redirect("/login")
  } catch (error) {
    console.log("[v0] Dashboard error:", error)
    redirect("/login")
  }
}
