import { VoiceAssistantClient } from "@/components/ai/voice-assistant-client"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "AI Voice Assistant | Taxu",
  description: "Hands-free tax filing with voice commands",
}

export default async function VoiceAssistantPage() {
  const supabase = await createClient()

  let user = null
  let profile = null

  if (supabase) {
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()
      profile = profileData
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <VoiceAssistantClient user={user} profile={profile} />
    </div>
  )
}
