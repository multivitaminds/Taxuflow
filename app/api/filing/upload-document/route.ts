import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const timestamp = Date.now()
    const filename = `${timestamp}-${sanitizedFilename}`

    const blob = await put(`tax-documents/${userId}/${filename}`, file, {
      access: "private", // Changed from "public" to "private"
      addRandomSuffix: true,
    })

    await supabase.from("admin_activity_logs").insert({
      admin_id: user.id,
      action: "document_upload",
      resource_type: "tax_document",
      details: { filename: sanitizedFilename, size: file.size, url: blob.url },
    })

    return NextResponse.json({
      success: true,
      fileId: blob.url,
      url: blob.url,
    })
  } catch (error) {
    console.error("[v0] Document upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload document",
      },
      { status: 500 },
    )
  }
}
