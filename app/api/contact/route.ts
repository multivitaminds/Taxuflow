import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

    try {
      await resend.emails.send({
        from: "Taxu Contact Form <noreply@taxu.io>",
        to: "support@taxu.io",
        subject: `New Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (emailError) {
      console.error("[v0] Failed to send support notification:", emailError)
    }

    try {
      await resend.emails.send({
        from: "Taxu Support <support@taxu.io>",
        to: email,
        subject: "We received your message",
        html: `
          <h2>Thank you for contacting Taxu</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and our support team will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
          <br>
          <p>Best regards,<br>Taxu Support Team</p>
        `,
      })
    } catch (emailError) {
      console.error("[v0] Failed to send confirmation email:", emailError)
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
