import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DeadlineDetailsClient } from "@/components/deadline-details-client"

export default async function DeadlineDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <DeadlineDetailsClient user={user} profile={profile} />
}
