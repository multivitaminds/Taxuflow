import { createServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const recipientId = formData.get("recipientId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`w9/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Extract data from W-9 using AI (if PDF)
    const extractedData = null
    if (file.type === "application/pdf") {
      // TODO: Implement AI extraction for W-9 forms
      // This would extract: name, business name, TIN, address, tax classification
    }

    // Store W-9 record in database
    const { data: w9Form, error } = await supabase
      .from("w9_forms")
      .insert({
        user_id: user.id,
        recipient_id: recipientId || null,
        document_url: blob.url,
        status: "pending",
        submitted_at: new Date().toISOString(),
        ai_extracted: !!extractedData,
        ...extractedData,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, w9Form })
  } catch (error) {
    console.error("[W9 Upload Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload W-9" },
      { status: 500 },
    )
  }
}
