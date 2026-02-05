import { createServerClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { generateText } from "ai"
import { validateFile, sanitizeFilename } from "@/lib/file-validation"

async function extractW9Data(dataUrl: string) {
  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: dataUrl,
            },
            {
              type: "text",
              text: `Extract all data from this W-9 form and return as JSON with this structure:
{
  "name": "full legal name",
  "business_name": "business name if different",
  "tax_classification": "one of: individual, c-corp, s-corp, partnership, trust, llc",
  "llc_tax_classification": "if LLC, one of: c-corp, s-corp, partnership",
  "tax_id": "TIN/EIN/SSN",
  "address": {
    "street": "street address",
    "city": "city",
    "state": "state",
    "zip": "zip code"
  },
  "account_numbers": "any account numbers listed"
}

Return ONLY valid JSON, no markdown or explanation.`,
            },
          ],
        },
      ],
      maxTokens: 2000,
    })

    const cleanedText = text
      .trim()
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim()
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error("[W9 Extraction Error]", error)
    return null
  }
}

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

    const validation = await validateFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const sanitizedFilename = sanitizeFilename(file.name)

    // Upload to Vercel Blob
    const blob = await put(`w9/${user.id}/${Date.now()}-${sanitizedFilename}`, file, {
      access: "public",
    })

    let extractedData = null
    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      extractedData = await extractW9Data(dataUrl)
      console.log("[W9 Upload] AI extraction result:", extractedData ? "success" : "failed")
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

    return NextResponse.json({ success: true, w9Form, extractedData })
  } catch (error) {
    console.error("[W9 Upload Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload W-9" },
      { status: 500 },
    )
  }
}
