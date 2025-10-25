import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NewFilingClient } from "@/components/new-filing-client"

export default async function NewFilingPage() {
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

  return <NewFilingClient userId={user.id} />
}
