import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`tax-documents/${userId}/${file.name}`, file, {
      access: "public",
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
        error: error instanceof Error ? error.message : "Failed to upload document",
      },
      { status: 500 },
    )
  }
}
