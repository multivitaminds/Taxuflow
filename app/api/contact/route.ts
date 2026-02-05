import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Insert contact form submission into database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          subject,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
    }

    // TODO: Send email notification to support team
    // TODO: Send confirmation email to user

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
