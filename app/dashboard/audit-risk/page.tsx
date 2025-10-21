import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuditRiskDetailsClient } from "@/components/audit-risk-details-client"

export default async function AuditRiskDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <AuditRiskDetailsClient user={user} profile={profile} />
}
