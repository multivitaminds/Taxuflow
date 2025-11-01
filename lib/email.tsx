import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendFilingAcceptedEmail(
  to: string,
  userName: string,
  taxYear: number,
  refundAmount: number,
  submissionId: string,
) {
  try {
    await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to,
      subject: `🎉 Your ${taxYear} Tax Return Was Accepted!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2ACBFF 0%, #0EA5E9 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Great News, ${userName}!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f9fafb;">
            <p style="font-size: 18px; color: #111827; margin-bottom: 20px;">
              Your ${taxYear} tax return has been <strong>accepted by the IRS</strong>! 🎉
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #2ACBFF;">
              <h2 style="color: #2ACBFF; margin-top: 0;">Refund Details</h2>
              <p style="font-size: 36px; font-weight: bold; color: #10b981; margin: 16px 0;">
                $${refundAmount.toLocaleString()}
              </p>
              <p style="color: #6b7280; margin: 0;">Expected in 7-21 business days</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 8px 0; color: #374151;">
                <strong>Submission ID:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${submissionId}</code>
              </p>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Tax Year:</strong> ${taxYear}
              </p>
            </div>
            
            <div style="margin-top: 32px; text-align: center;">
              <a href="https://taxu.io/dashboard/filing" 
                 style="display: inline-block; background: #2ACBFF; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                View Filing Details
              </a>
            </div>
            
            <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
              Questions? Reply to this email or chat with our AI team at taxu.io/chat
            </p>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Taxu. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    console.log("[v0] Filing accepted email sent to:", to)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending filing accepted email:", error)
    return { success: false, error }
  }
}

export async function sendFilingRejectedEmail(
  to: string,
  userName: string,
  taxYear: number,
  rejectionReasons: string[],
  submissionId: string,
) {
  try {
    await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to,
      subject: `Action Required: Your ${taxYear} Tax Return Needs Attention`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Action Required</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f9fafb;">
            <p style="font-size: 18px; color: #111827; margin-bottom: 20px;">
              Hi ${userName},
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
              Your ${taxYear} tax return was rejected by the IRS. Don't worry - this is common and easy to fix!
            </p>
            
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 24px 0; border-radius: 4px;">
              <h3 style="color: #dc2626; margin-top: 0;">Rejection Reasons:</h3>
              <ul style="color: #7f1d1d; margin: 0; padding-left: 20px;">
                ${rejectionReasons.map((reason) => `<li style="margin: 8px 0;">${reason}</li>`).join("")}
              </ul>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <p style="margin: 8px 0; color: #374151;">
                <strong>Submission ID:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${submissionId}</code>
              </p>
              <p style="margin: 8px 0; color: #374151;">
                <strong>Tax Year:</strong> ${taxYear}
              </p>
            </div>
            
            <div style="background: #dbeafe; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
              <p style="color: #1e3a8a; margin: 0;">
                Our AI team has already analyzed the issues. Log in to review the corrections and resubmit your return.
              </p>
            </div>
            
            <div style="margin-top: 32px; text-align: center;">
              <a href="https://taxu.io/dashboard/filing" 
                 style="display: inline-block; background: #2ACBFF; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Fix & Resubmit
              </a>
            </div>
            
            <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
              Need help? Chat with Sophie, our Lead Tax AI, at taxu.io/chat
            </p>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Taxu. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    console.log("[v0] Filing rejected email sent to:", to)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending filing rejected email:", error)
    return { success: false, error }
  }
}

export async function sendDocumentProcessedEmail(
  to: string,
  userName: string,
  fileName: string,
  documentType: string,
  extractedData: any,
) {
  try {
    await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to,
      subject: `✅ ${fileName} Processed Successfully`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Document Processed!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f9fafb;">
            <p style="font-size: 18px; color: #111827; margin-bottom: 20px;">
              Hi ${userName},
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
              We've successfully processed your <strong>${documentType.toUpperCase()}</strong> document.
            </p>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #10b981; margin-top: 0;">📄 ${fileName}</h3>
              <p style="color: #6b7280; margin: 0;">AI extracted ${Object.keys(extractedData).length} fields</p>
            </div>
            
            <div style="margin-top: 32px; text-align: center;">
              <a href="https://taxu.io/dashboard/documents" 
                 style="display: inline-block; background: #2ACBFF; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Review Extracted Data
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Taxu. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    console.log("[v0] Document processed email sent to:", to)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error sending document processed email:", error)
    return { success: false, error }
  }
}
