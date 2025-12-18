import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OnboardingWizardClient from "./OnboardingWizardClient"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  return <OnboardingWizardClient user={user} />
}
