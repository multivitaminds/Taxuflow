import { type NextRequest, NextResponse } from "next/server"
import { extractReceiptData } from "@/lib/ai/receipt-ocr"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const imageData = `data:${file.type};base64,${base64}`

    const receiptData = await extractReceiptData(imageData)

    const { data: receipt, error } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        vendor: receiptData.vendor,
        date: receiptData.date,
        total: receiptData.total,
        tax: receiptData.tax,
        category: receiptData.category,
        payment_method: receiptData.paymentMethod,
        items: receiptData.items,
        image_url: imageData,
        status: "processed",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error storing receipt:", error)
      return NextResponse.json({ error: "Failed to store receipt" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: receipt })
  } catch (error) {
    console.error("[v0] Receipt extraction error:", error)
    return NextResponse.json({ error: "Failed to extract receipt data" }, { status: 500 })
  }
}
