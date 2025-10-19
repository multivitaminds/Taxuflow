import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TimelineDetailsClient } from "@/components/timeline-details-client"

export default async function TimelineDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <TimelineDetailsClient user={user} profile={profile} />
}
