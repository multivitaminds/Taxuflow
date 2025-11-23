import { createClient } from "@/lib/supabase/server"
import { render } from "@react-email/render"
import { FilingStatusEmail } from "./templates/filing-status"
import { DocumentProcessedEmail } from "./templates/document-processed"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = "Taxu <notifications@taxu.io>"

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  userId?: string
  emailType: string
}

export async function sendEmail({ to, subject, html, userId, emailType }: SendEmailOptions) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email")
    }

    const supabase = await createClient()
    await supabase.from("email_logs").insert({
      user_id: userId,
      email_to: to,
      email_type: emailType,
      subject,
      status: "sent",
      provider_id: data.id,
    })

    console.log("[v0] ✅ Email sent successfully:", data.id)
    return { success: true, id: data.id }
  } catch (error) {
    console.error("[v0] ❌ Failed to send email:", error)

    if (userId) {
      const supabase = await createClient()
      await supabase.from("email_logs").insert({
        user_id: userId,
        email_to: to,
        email_type: emailType,
        subject,
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
    }

    return { success: false, error }
  }
}

export async function sendFilingStatusEmail(
  userId: string,
  userEmail: string,
  userName: string,
  filing: {
    id: string
    form_type: string
    filing_status: string
    submission_id: string
    refund_amount?: number
    rejection_reasons?: string[]
  },
) {
  const supabase = await createClient()
  const { data: prefs } = await supabase.from("email_preferences").select("*").eq("user_id", userId).single()

  if (prefs && !prefs.filing_updates) {
    console.log("[v0] User has disabled filing update emails")
    return
  }

  const html = render(
    FilingStatusEmail({
      userName,
      filingType: filing.form_type,
      status: filing.filing_status as any,
      submissionId: filing.submission_id,
      refundAmount: filing.refund_amount,
      rejectionReasons: filing.rejection_reasons,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/filing/${filing.id}`,
    }),
  )

  const statusText =
    filing.filing_status === "accepted" ? "Accepted" : filing.filing_status === "rejected" ? "Rejected" : "Updated"

  await sendEmail({
    to: userEmail,
    subject: `Your ${filing.form_type} Filing Has Been ${statusText}`,
    html,
    userId,
    emailType: "filing_status",
  })
}

export async function sendDocumentProcessedEmail(
  userId: string,
  userEmail: string,
  userName: string,
  document: {
    id: string
    file_name: string
    document_type: string
    extracted_data: Record<string, any>
  },
) {
  const supabase = await createClient()
  const { data: prefs } = await supabase.from("email_preferences").select("*").eq("user_id", userId).single()

  if (prefs && !prefs.document_processing) {
    console.log("[v0] User has disabled document processing emails")
    return
  }

  const html = render(
    DocumentProcessedEmail({
      userName,
      documentName: document.file_name,
      documentType: document.document_type,
      extractedData: document.extracted_data || {},
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/documents/${document.id}`,
    }),
  )

  await sendEmail({
    to: userEmail,
    subject: `Your ${document.document_type} Has Been Processed`,
    html,
    userId,
    emailType: "document_processed",
  })
}
