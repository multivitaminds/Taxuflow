import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ConfidenceDetailsClient } from "@/components/confidence-details-client"

export default async function ConfidenceDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <ConfidenceDetailsClient user={user} profile={profile} />
}
