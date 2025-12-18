import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"
import { handleSupabaseError, checkResourceAccess } from "@/lib/supabase/error-handler"

export async function DELETE(request: NextRequest) {
  console.log("[v0] DELETE /api/delete-document - Starting document deletion")

  try {
    const { isDemoMode } = await checkDemoMode()

    if (isDemoMode) {
      return NextResponse.json(
        {
          error:
            "Document deletion is not available in demo mode. Please create a free account to manage your documents.",
          isDemoMode: true,
        },
        { status: 403 },
      )
    }

    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get document ID from request
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    console.log("[v0] Deleting document:", documentId, "for user:", user.id)

    const accessCheck = await checkResourceAccess(supabase, "documents", documentId, user.id)
    if (!accessCheck.hasAccess) {
      return accessCheck.error!
    }

    // Get document details to get file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (fetchError) {
      return handleSupabaseError(fetchError, {
        operation: "fetch document details",
        resource: "document",
        userId: user.id,
        details: { documentId },
      })
    }

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage.from("tax-documents").remove([document.file_path])

    if (storageError) {
      console.error("[v0] Error deleting file from storage:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete related records from tax_documents table (cascade will handle this)
    const { error: taxDocError } = await supabase.from("tax_documents").delete().eq("document_id", documentId)

    if (taxDocError) {
      console.error("[v0] Error deleting tax document record:", taxDocError)
    }

    // Delete document record from database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", documentId).eq("user_id", user.id)

    if (deleteError) {
      return handleSupabaseError(deleteError, {
        operation: "delete document",
        resource: "document",
        userId: user.id,
        details: { documentId },
      })
    }

    console.log("[v0] Document deleted successfully:", documentId)

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Unexpected error deleting document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
