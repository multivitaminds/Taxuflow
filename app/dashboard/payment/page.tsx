import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PaymentFlowClient } from "@/components/payment-flow-client"

export default async function PaymentPage() {
  const supabase = await getSupabaseServerClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile to check subscription status
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

  return <PaymentFlowClient user={user} profile={profile} />
}
