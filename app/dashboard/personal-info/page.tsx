import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { PersonalInfoClient } from "@/components/personal-info-client"

export default async function PersonalInfoPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

  return <PersonalInfoClient user={user} profile={profile} />
}
