import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, model = "openai/gpt-4o-mini", systemPrompt, diagnostic } = await req.json()

    console.log("[v0] Support chat: Processing request with model", model)

    // Get user context if available
    const supabase = await createClient()
    let userContext = ""

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        // Fetch user profile for context
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("account_mode, account_status, full_name, business_name")
          .eq("id", user.id)
          .single()

        if (profile) {
          userContext = `
USER CONTEXT:
- User ID: ${user.id}
- Name: ${profile.full_name || "Unknown"}
- Business: ${profile.business_name || "Individual"}
- Account Mode: ${profile.account_mode || "SANDBOX"}
- Account Status: ${profile.account_status || "Unknown"}
- Email: ${user.email}
`
        }
      }
    }

    const enhancedSystemPrompt = `${systemPrompt}

${userContext}

SUPPORT TOOLS AVAILABLE:
You have access to the user's account information. Use it to provide personalized support.

RESPONSE FORMAT:
- Start with acknowledgment of the issue
- Ask clarifying questions if needed (numbered list)
- Provide step-by-step solutions when possible
- Include relevant links or actions the user can take
- End with confirmation or next steps

IMPORTANT:
- Never share sensitive information in full (mask SSN, EIN, etc.)
- If discussing payments or refunds, always verify account ownership first
- For legal/compliance questions, recommend professional consultation
- Always maintain a helpful, professional tone`

    const result = await streamText({
      model: model,
      messages: messages,
      system: enhancedSystemPrompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Support chat error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process support request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
