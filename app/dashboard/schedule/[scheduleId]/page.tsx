import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScheduleDetailClient } from "@/components/schedule-detail-client"

export default async function ScheduleDetailPage({ params }: { params: { scheduleId: string } }) {
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

    return <ScheduleDetailClient user={user} profile={profile} scheduleId={params.scheduleId} />
  } catch (error) {
    console.log("[v0] Error in schedule detail page:", error)
    redirect("/login")
  }
}
