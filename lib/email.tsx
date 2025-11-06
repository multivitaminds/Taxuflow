import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendDocumentProcessedEmail(
  to: string,
  userName: string,
  documentName: string,
  documentType: string,
  extractedData: any,
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to: [to],
      subject: `Your ${documentType.toUpperCase()} has been processed`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>Great news! We've successfully processed your <strong>${documentName}</strong>.</p>
        <h3>What we found:</h3>
        <ul>
          <li>Document Type: ${documentType.toUpperCase()}</li>
          ${extractedData?.wages ? `<li>Wages: $${extractedData.wages.toLocaleString()}</li>` : ""}
          ${extractedData?.federal_tax_withheld ? `<li>Federal Tax Withheld: $${extractedData.federal_tax_withheld.toLocaleString()}</li>` : ""}
        </ul>
        <p>Your tax team is now analyzing this document to maximize your refund!</p>
        <p><a href="https://taxu.io/dashboard">View your dashboard</a></p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error }
    }

    console.log("[v0] Document processed email sent to:", to)
    return { success: true, data }
  } catch (error) {
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error }
  }
}

export async function sendFilingAcceptedEmail(
  to: string,
  userName: string,
  filingType: string,
  submissionId: string,
  filingDetails: any,
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to: [to],
      subject: `✅ Your ${filingType} has been accepted by the IRS`,
      html: `
        <h2>Great news, ${userName}!</h2>
        <p>Your <strong>${filingType}</strong> has been successfully accepted by the IRS.</p>
        <h3>Filing Details:</h3>
        <ul>
          <li>Submission ID: ${submissionId}</li>
          <li>Status: Accepted</li>
          <li>Filing Type: ${filingType}</li>
          ${filingDetails?.taxYear ? `<li>Tax Year: ${filingDetails.taxYear}</li>` : ""}
          ${filingDetails?.employeeName ? `<li>Employee: ${filingDetails.employeeName}</li>` : ""}
        </ul>
        <p>Your filing has been successfully transmitted to the IRS and is now being processed.</p>
        <p><a href="https://taxu.io/dashboard/filings">View your filings</a></p>
        <hr />
        <p style="color: #666; font-size: 12px;">This is an automated notification from Taxu. Please do not reply to this email.</p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error }
    }

    console.log("[v0] Filing accepted email sent to:", to)
    return { success: true, data }
  } catch (error) {
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error }
  }
}

export async function sendFilingRejectedEmail(
  to: string,
  userName: string,
  filingType: string,
  submissionId: string,
  rejectionReason: string,
  filingDetails: any,
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] Resend API key not configured, skipping email")
      return { success: false, reason: "API key not configured" }
    }

    const { data, error } = await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to: [to],
      subject: `⚠️ Action Required: Your ${filingType} was rejected by the IRS`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>Unfortunately, your <strong>${filingType}</strong> was rejected by the IRS and requires your attention.</p>
        <h3>Filing Details:</h3>
        <ul>
          <li>Submission ID: ${submissionId}</li>
          <li>Status: Rejected</li>
          <li>Filing Type: ${filingType}</li>
          ${filingDetails?.taxYear ? `<li>Tax Year: ${filingDetails.taxYear}</li>` : ""}
        </ul>
        <h3>Rejection Reason:</h3>
        <p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          ${rejectionReason}
        </p>
        <h3>Next Steps:</h3>
        <ol>
          <li>Review the rejection reason above</li>
          <li>Correct the identified issues in your filing</li>
          <li>Resubmit your corrected filing</li>
        </ol>
        <p><a href="https://taxu.io/dashboard/filings" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Review and Resubmit</a></p>
        <hr />
        <p style="color: #666; font-size: 12px;">Need help? Contact our support team at support@taxu.io</p>
      `,
    })

    if (error) {
      console.log("[v0] Email sending failed (non-critical):", error.message)
      return { success: false, error }
    }

    console.log("[v0] Filing rejected email sent to:", to)
    return { success: true, data }
  } catch (error) {
    console.log("[v0] Email sending failed (non-critical):", error instanceof Error ? error.message : String(error))
    return { success: false, error }
  }
}
