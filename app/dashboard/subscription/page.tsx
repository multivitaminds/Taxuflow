import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SubscriptionManagementClient } from "@/components/subscription-management-client"

export default async function SubscriptionPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <SubscriptionManagementClient profile={profile} />
}
