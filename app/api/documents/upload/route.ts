import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentId = formData.get("documentId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`documents/${user.id}/${documentId}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Store document metadata in database
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        document_id: documentId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: blob.url,
        status: "uploaded",
      })
      .select()
      .single()

    if (dbError) {
      // Continue even if DB insert fails
      return NextResponse.json({
        success: true,
        documentId,
        fileUrl: blob.url,
        fileName: file.name,
        warning: "File uploaded but database record may be incomplete",
      })
    }

    return NextResponse.json({
      success: true,
      documentId,
      fileUrl: blob.url,
      fileName: file.name,
      document,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
