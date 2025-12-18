"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type CustomReport = {
  id: string
  user_id: string
  report_name: string
  report_type: string
  description?: string
  metrics: any
  filters: any
  created_at: string
}

export async function getCustomReports() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_custom_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return { data, error: error?.message }
}

export async function createCustomReport(report: Partial<CustomReport>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_custom_reports")
    .insert({
      ...report,
      user_id: user.id,
    })
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}

export async function generateReport(reportId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // Queue report generation
  const { data, error } = await supabase
    .from("investment_export_queue")
    .insert({
      user_id: user.id,
      report_id: reportId,
      export_type: "pdf",
      status: "queued",
    })
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}
