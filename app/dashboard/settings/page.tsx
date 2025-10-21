import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { SettingsClient } from "@/components/settings-client"

export default async function SettingsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).maybeSingle()

  return <SettingsClient user={user} profile={profile} />
}
