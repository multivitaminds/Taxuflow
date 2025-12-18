import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const documentId = searchParams.get("id")

  if (!documentId) {
    return NextResponse.json({ error: "Document ID required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get document metadata
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single()

  if (docError || !document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("tax-documents")
    .download(document.file_path)

  if (downloadError || !fileData) {
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }

  // Return file with appropriate headers
  return new NextResponse(fileData, {
    headers: {
      "Content-Type": document.file_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${document.file_name}"`,
    },
  })
}
