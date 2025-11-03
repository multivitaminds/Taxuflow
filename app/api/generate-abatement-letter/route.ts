import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

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
    // Check authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessName, ein, taxYear, formType, reason, additionalContext }: AbatementRequest = await req.json()

    console.log("[v0] Generating penalty abatement letter for:", businessName)

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

    console.log("[v0] Generated abatement letter")

    // Log usage for billing
    await supabase.from("ai_usage_logs").insert({
      user_id: user.id,
      feature: "penalty_abatement_letter",
      model: "openai/gpt-4o",
      tokens_used: text.length,
      metadata: { taxYear, formType },
    })

    return Response.json({
      letter: text,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Abatement letter generation error:", error)
    return Response.json(
      {
        error: "Failed to generate letter",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
