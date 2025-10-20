import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScheduleClient } from "@/components/schedule-client"

export default async function SchedulePage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Auth error or no user, redirecting to login")
      redirect("/login")
    }

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

    return <ScheduleClient user={user} profile={profile} />
  } catch (error) {
    console.log("[v0] Error in schedule page:", error)
    redirect("/login")
  }
}
