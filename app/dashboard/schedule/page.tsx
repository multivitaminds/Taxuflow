import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ScheduleClient } from "@/components/schedule-client"

export default async function SchedulePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ScheduleClient user={user} />
}
