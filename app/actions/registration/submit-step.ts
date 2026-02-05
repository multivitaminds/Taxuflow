"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitRegistrationStep(applicationId: string, stepNumber: number, stepData: any) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    console.log(`[v0] Submitting registration step ${stepNumber} for user:`, user.id)

    // Map step numbers to their respective table names
    const stepTableMap: Record<number, string> = {
      1: "application_account_intent",
      2: "application_company_info", // or application_personal_identity
      3: "application_expected_activity",
      4: "application_residential_addresses",
      5: "application_identity_verifications",
      6: "application_tax_profile",
      7: "application_accounting_preferences",
      8: "application_document_uploads",
      9: "application_terms_acceptance",
      10: "application_review_submission",
    }

    const tableName = stepTableMap[stepNumber]

    if (!tableName) {
      return { success: false, error: "Invalid step number" }
    }

    // Insert or update step data
    const { data, error } = await supabase
      .from(tableName)
      .upsert(
        {
          application_id: applicationId,
          user_id: user.id,
          ...stepData,
          is_complete: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "application_id",
        },
      )
      .select()
      .single()

    if (error) {
      console.error(`[v0] Error submitting step ${stepNumber}:`, error)
      return { success: false, error: error.message }
    }

    // Progress to next step using database function
    const { data: progressData, error: progressError } = await supabase.rpc("progress_registration_step", {
      p_application_id: applicationId,
      p_user_id: user.id,
      p_current_step: stepNumber,
    })

    if (progressError) {
      console.error("[v0] Error progressing step:", progressError)
      return { success: false, error: progressError.message }
    }

    console.log(`[v0] Step ${stepNumber} completed, progressed to:`, progressData)

    // Revalidate registration path
    revalidatePath(`/live-registration/step-${stepNumber + 1}`)

    return {
      success: true,
      data,
      nextStep: stepNumber + 1,
    }
  } catch (error: any) {
    console.error("[v0] Failed to submit registration step:", error)
    return { success: false, error: error.message }
  }
}
