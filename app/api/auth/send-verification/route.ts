import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, userId, fullName } = await request.json()

    if (!email || !userId) {
      return NextResponse.json({ error: "Email and userId are required" }, { status: 400 })
    }

    // Get the verification link from Supabase
    const supabase = await createClient()

    // Generate a verification token link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/auth/confirm?token_hash=${userId}&type=signup`

    // Send custom verification email via Resend
    const { data, error } = await resend.emails.send({
      from: "Taxu <noreply@taxu.io>",
      to: email,
      subject: "Verify your Taxu account",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0B0C0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0B0C0E; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1F1F1F; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px;">
                    <tr>
                      <td align="center" style="padding-bottom: 32px;">
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2ACBFF 0%, #0EA5E9 100%); border-radius: 12px; display: inline-block; margin-bottom: 16px;"></div>
                        <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; padding: 0;">Welcome to Taxu!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #9CA3AF; font-size: 16px; line-height: 24px; padding-bottom: 32px;">
                        Hi ${fullName || "there"},<br><br>
                        Thanks for signing up! Please verify your email address to get started with Taxu.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom: 32px;">
                        <a href="${verificationLink}" style="display: inline-block; background-color: #2ACBFF; color: #0B0C0E; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6B7280; font-size: 14px; line-height: 20px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${verificationLink}" style="color: #2ACBFF; word-break: break-all;">${verificationLink}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6B7280; font-size: 12px; line-height: 18px; padding-top: 24px; text-align: center;">
                        This link will expire in 24 hours. If you didn't create a Taxu account, you can safely ignore this email.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend email error:", error)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    console.log("[v0] Verification email sent successfully:", data)
    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error: any) {
    console.error("[v0] Send verification error:", error)
    return NextResponse.json({ error: error.message || "Failed to send verification email" }, { status: 500 })
  }
}
