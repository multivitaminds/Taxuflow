import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatClient from "@/components/chat-client"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).maybeSingle()

  return <ChatClient userProfile={profile} />
}
