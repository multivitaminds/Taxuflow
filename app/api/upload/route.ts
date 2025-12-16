import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename")
  const category = searchParams.get("category") || "documents"

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 })
  }

  // Verify user is authenticated
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const blob = await put(`${category}/${user.id}/${filename}`, request.body!, {
      access: "public",
    })

    // Store file reference in database
    await supabase.from("uploaded_files").insert({
      user_id: user.id,
      filename,
      url: blob.url,
      category,
      size: blob.size,
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
