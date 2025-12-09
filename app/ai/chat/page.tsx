import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { UnifiedAgentChat } from "@/components/ai/unified-agent-chat"

export const metadata = {
  title: "AI Agents - Taxu Platform",
  description: "Chat with specialized AI agents for tax, accounting, neobank, and investment assistance",
}

export default async function AIAgentChatPage() {
  const supabase = await createClient()

  let user = null
  let profile = null

  if (supabase) {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      profile = profileData
    }
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UnifiedAgentChat user={user} profile={profile} />
    </Suspense>
  )
}
