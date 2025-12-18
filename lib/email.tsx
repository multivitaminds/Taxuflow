import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.NODE_ENV === "production" ? "Taxu <noreply@taxu.io>" : "Taxu <onboarding@resend.dev>"

/**
 * Send email notification when a document has been processed
 * Fails gracefully if email service is unavailable
 */
export async function sendDocumentProcessedEmail(
  to: string,
  userName: string,
  documentName: string,
  documentType: string,
  extractedData: any,
) {
  try {
    console.log("[v0] Attempting to send document processed email to:", to)

    // If Resend API key is not configured, skip email sending
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Your ${documentType.toUpperCase()} has been processed`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>Great news! Your document <strong>${documentName}</strong> has been successfully processed.</p>
        <p><strong>Document Type:</strong> ${documentType.toUpperCase()}</p>
        <p>You can now view the extracted data and insights in your Taxu dashboard.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard">View Dashboard</a></p>
        <p>Best regards,<br>The Taxu Team</p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error: error.message }
    }

    console.log("[v0] Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    // Catch all errors and log them, but don't throw
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Send email notification when a tax filing has been accepted by the IRS
 * Fails gracefully if email service is unavailable
 */
export async function sendFilingAcceptedEmail(
  to: string,
  userName: string,
  taxYear: number,
  refundOrOwed: number,
  submissionId: string,
) {
  try {
    console.log("[v0] Attempting to send filing accepted email to:", to)

    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const refundText =
      refundOrOwed > 0
        ? `You're getting a refund of $${Math.abs(refundOrOwed).toFixed(2)}!`
        : `You owe $${Math.abs(refundOrOwed).toFixed(2)} to the IRS.`

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Your ${taxYear} Tax Return has been accepted by the IRS`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>Excellent news! Your <strong>${taxYear} Tax Return</strong> filing has been accepted by the IRS.</p>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Result:</strong> ${refundText}</p>
        <p>Your tax return has been successfully processed and is now complete.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/filing">View Filing Details</a></p>
        <p>Best regards,<br>The Taxu Team</p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error: error.message }
    }

    console.log("[v0] Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

/**
 * Send email notification when a tax filing has been rejected by the IRS
 * Fails gracefully if email service is unavailable
 */
export async function sendFilingRejectedEmail(
  to: string,
  userName: string,
  formType: string,
  submissionId: string,
  rejectionReason: string,
) {
  try {
    console.log("[v0] Attempting to send filing rejected email to:", to)

    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Action Required: Your ${formType} filing needs attention`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>Your <strong>${formType}</strong> filing has been rejected by the IRS and requires your attention.</p>
        <p><strong>Submission ID:</strong> ${submissionId}</p>
        <p><strong>Reason:</strong> ${rejectionReason}</p>
        <p>Please review the rejection details and resubmit your corrected filing.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/filing/${submissionId}">View Details & Resubmit</a></p>
        <p>If you need assistance, please contact our support team.</p>
        <p>Best regards,<br>The Taxu Team</p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error: error.message }
    }

    console.log("[v0] Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
