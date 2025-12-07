"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ScheduleReportParams {
  name: string
  reportType: string
  schedule: string
  recipients: string[]
  formats: string[]
  params: any
}

export async function scheduleReport(data: ScheduleReportParams) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const { error } = await supabase.from("scheduled_reports").insert({
      user_id: user.id,
      name: data.name,
      report_type: data.reportType,
      schedule: data.schedule,
      recipients: data.recipients,
      formats: data.formats,
      params: data.params,
      is_active: true,
    })

    if (error) throw error

    console.log("[v0] Scheduled report:", data.name)

    revalidatePath("/reports")

    return {
      success: true,
      message: "Report scheduled successfully",
    }
  } catch (error) {
    console.error("[v0] Error scheduling report:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to schedule report",
    }
  }
}

export async function deleteScheduledReport(reportId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const { error } = await supabase.from("scheduled_reports").delete().eq("id", reportId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/reports")

    return { success: true, message: "Scheduled report deleted" }
  } catch (error) {
    console.error("[v0] Error deleting scheduled report:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete scheduled report",
    }
  }
}
