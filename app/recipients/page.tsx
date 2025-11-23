import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RecipientsClient } from "@/components/recipients-client"

export default async function RecipientsPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <RecipientsClient userId={user.id} />
}
