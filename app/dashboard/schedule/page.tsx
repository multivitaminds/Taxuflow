import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScheduleClient } from "@/components/schedule-client"

export default async function SchedulePage() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      // Supabase not configured, redirect to demo mode dashboard
      redirect("/dashboard")
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    return <ScheduleClient user={user} />
  } catch (error) {
    console.log("[v0] Schedule page auth error:", error)
    redirect("/dashboard")
  }
}
