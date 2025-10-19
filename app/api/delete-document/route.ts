import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  console.log("[v0] DELETE /api/delete-document - Starting document deletion")

  try {
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

    // Get document details to verify ownership and get file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !document) {
      console.error("[v0] Document not found or unauthorized:", fetchError)
      return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 404 })
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage.from("tax-documents").remove([document.file_path])

    if (storageError) {
      console.error("[v0] Error deleting file from storage:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete related records from tax_documents table
    const { error: taxDocError } = await supabase.from("tax_documents").delete().eq("document_id", documentId)

    if (taxDocError) {
      console.error("[v0] Error deleting tax document record:", taxDocError)
    }

    // Delete document record from database
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", documentId).eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Error deleting document from database:", deleteError)
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
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
