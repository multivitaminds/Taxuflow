import { generateText } from "ai"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const maxDuration = 30

interface AbatementRequest {
  businessName: string
  ein: string
  taxYear: number
  formType: string
  reason: string
  additionalContext?: string
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    console.log("[v0] Server env check:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasClient: !!supabase,
    })

    if (!supabase) {
      console.error("[v0] Supabase client unavailable")
      return Response.json(
        { error: "Service temporarily unavailable", details: "Database connection failed" },
        { status: 503 },
      )
    }

    let user
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (authError) {
      console.error("[v0] Auth error:", authError)
      return Response.json(
        { error: "Authentication failed", details: "Unable to verify user session" },
        { status: 401 },
      )
    }

    if (!user) {
      console.error("[v0] Unauthorized letter generation attempt")
      return Response.json({ error: "Unauthorized", details: "Please log in to generate letters" }, { status: 401 })
    }

    const { businessName, ein, taxYear, formType, reason, additionalContext }: AbatementRequest = await req.json()

    console.log("[v0] Generating penalty abatement letter for:", businessName, "User:", user.email)

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `Generate a professional IRS penalty abatement request letter.

Details:
- Business/Taxpayer Name: ${businessName}
- EIN: ${ein}
- Tax Year: ${taxYear}
- Form Type: ${formType}
- Reason for Late Filing: ${reason}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

The letter should:
1. Be addressed to the IRS
2. Reference "reasonable cause" provisions under IRC Section 6651
3. Explain the specific circumstances that caused the late filing
4. Request penalty waiver or abatement
5. Express commitment to future compliance
6. Use professional, respectful tone
7. Be formatted as a formal business letter
8. Include placeholders for signature and date

Make it persuasive but honest. Focus on reasonable cause arguments that the IRS typically accepts.`,
      temperature: 0.7,
      maxTokens: 1500,
    })

    console.log("[v0] Generated abatement letter successfully")

    try {
      await supabase.from("ai_usage_logs").insert({
        user_id: user.id,
        feature: "penalty_abatement_letter",
        model: "openai/gpt-4o",
        tokens_used: text.length,
        metadata: { taxYear, formType },
      })
    } catch (logError) {
      console.error("[v0] Failed to log usage:", logError)
      // Don't fail the request if logging fails
    }

    return Response.json({
      letter: text,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Abatement letter generation error:", error)
    return Response.json(
      {
        error: "Failed to generate letter",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
