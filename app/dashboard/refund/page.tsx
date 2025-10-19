import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RefundDetailsClient } from "@/components/refund-details-client"

export default async function RefundDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <RefundDetailsClient user={user} profile={profile} />
}
