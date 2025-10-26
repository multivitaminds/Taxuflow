import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import FilingDetailClient from "@/components/filing-detail-client"

export default async function FilingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  // Fetch filing details
  const { data: filing, error } = await supabase
    .from("tax_filings")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !filing) {
    notFound()
  }

  return <FilingDetailClient filing={filing} />
}
