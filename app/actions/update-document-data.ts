"use server"

import { createClient } from "@/lib/supabase/server"

export async function updateDocumentData(documentId: string, extractedData: any) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Update the document's extracted data
    const { error } = await supabase
      .from("documents")
      .update({
        extracted_data: extractedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error updating document data:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Failed to update document data:", error)
    return { success: false, error: error.message }
  }
}
