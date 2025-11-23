import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get document from database
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Download file from storage
    const { data: fileData, error: storageError } = await supabase.storage
      .from("tax-documents")
      .download(document.file_path)

    if (storageError || !fileData) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
    }

    // Return file as blob
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": document.file_type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${document.file_name}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
