import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TaxRateDetailsClient } from "@/components/tax-rate-details-client"

export default async function TaxRateDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <TaxRateDetailsClient user={user} profile={profile} />
}
