import { createServerClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipientId, recipientEmail, recipientName } = await request.json()

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // Create W-9 request record
    const { data: w9Form, error: w9Error } = await supabase
      .from("w9_forms")
      .insert({
        user_id: user.id,
        recipient_id: recipientId,
        name: recipientName || "",
        status: "pending",
        requested_at: new Date().toISOString(),
        street_address: "",
        city: "",
        state: "",
        zip_code: "",
      })
      .select()
      .single()

    if (w9Error) throw w9Error

    // Generate unique submission link
    const submissionLink = `${process.env.NEXT_PUBLIC_APP_URL}/w9/submit/${w9Form.id}`

    // Send W-9 request email
    await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to: recipientEmail,
      subject: "W-9 Form Request from Taxu",
      html: `
        <h2>W-9 Form Request</h2>
        <p>Hello ${recipientName || "there"},</p>
        <p>You have been requested to submit a W-9 form for tax reporting purposes.</p>
        <p>Please click the link below to submit your W-9 information:</p>
        <a href="${submissionLink}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Submit W-9 Form</a>
        <p>This link will expire in 30 days.</p>
        <p>If you have any questions, please contact the requester directly.</p>
        <p>Thank you,<br/>Taxu Team</p>
      `,
    })

    // Log email
    await supabase.from("email_logs").insert({
      user_id: user.id,
      email_type: "w9_request",
      email_address: recipientEmail,
      subject: "W-9 Form Request from Taxu",
      status: "sent",
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, w9Form, submissionLink })
  } catch (error) {
    console.error("[W9 Request Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send W-9 request" },
      { status: 500 },
    )
  }
}
