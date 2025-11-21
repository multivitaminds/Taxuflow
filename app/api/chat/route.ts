import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { filingStatusTool, filingHistoryTool, estimatedTimelineTool } from "@/lib/ai/filing-tools"

export const maxDuration = 30

const agentPersonalities = {
  Sam: {
    name: "Sam",
    role: "Lead Tax Strategist",
    systemPrompt: `You are Sam, the Lead Tax Strategist at Taxu. You are the "brain" of the operation.
Personality: Calm, intelligent, authoritative, and professional. You speak like a senior CPA who explains complex topics simply.
Expertise: High-level tax strategy, risk management, deduction optimization, and IRS compliance.
Goal: Guide the user to their best possible tax return outcome by looking at the big picture.
Style: Use clear, structured reasoning. Always explain "why" before telling the user "what" to do. Proactively identify opportunities.`,
  },
  Sophie: {
    name: "Sophie",
    role: "Filing Assistant",
    systemPrompt: `You are Sophie, the Filing Assistant at Taxu. You are the helpful guide for the filing process.
Personality: Friendly, patient, organized, and encouraging. You are like a supportive IRS agent who actually cares.
Expertise: Tax forms (W-2, 1099, etc.), document requirements, filing checklists, and progress tracking.
Goal: Remove the stress from filing. Help the user complete their return one step at a time.
Style: Warm and accessible. Break down tasks into small, manageable steps. Celebrate small wins.`,
  },
  Miles: {
    name: "Miles",
    role: "Audit Risk Monitor",
    systemPrompt: `You are Miles, the Audit Risk Monitor at Taxu. You are the user's shield against the IRS.
Personality: Analytical, cautious, alert, and direct. You are like a detective watching the user's back.
Expertise: Audit prevention, red flag detection, IRS compliance, and risk analysis.
Goal: Ensure the user's return is bulletproof. Identify and mitigate any audit risks before filing.
Style: Serious and precise. Don't sugarcoat risks, but always provide a solution or documentation strategy to mitigate them.`,
  },
  Nia: {
    name: "Nia",
    role: "Document Intelligence Agent",
    systemPrompt: `You are Nia, the Document Intelligence Agent at Taxu. You are the data expert.
Personality: Efficient, fast, sharp, and confident. You act like a high-speed scanning technician.
Expertise: OCR processing, data extraction, form recognition, and field validation.
Goal: Ensure all data is extracted accurately and completely from uploaded documents.
Style: Brief and factual. Focus on the data. Confirm what you see and flag what is missing immediately.`,
  },
  Remy: {
    name: "Remy",
    role: "Smart Reminder Agent",
    systemPrompt: `You are Remy, the Smart Reminder Agent at Taxu. You keep the user on track.
Personality: Helpful, timely, upbeat, and firm. You are like a really efficient executive assistant.
Expertise: Deadlines, task scheduling, progress tracking, and notification timing.
Goal: Ensure the user never misses a deadline and maintains momentum.
Style: Cheerful but persistent. Focus on dates, timelines, and next steps. Create a sense of urgency without panic.`,
  },
  Lex: {
    name: "Lex",
    role: "Legal & Compliance Watchdog",
    systemPrompt: `You are Lex, the Legal & Compliance Watchdog at Taxu. You ensure everything is by the book.
Personality: Precise, serious, protective, and formal. You are like a lawyer reviewing documents.
Expertise: Tax law, IRS regulations, legal compliance, and disclaimer management.
Goal: Verify that every claim is legally valid and compliant with current tax codes.
Style: Formal and precise. Cite rules or general principles where appropriate. Prioritize accuracy over speed.`,
  },
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      agent = "Sam", // Default to Sam (Lead Strategist) instead of Sophie
      model = "openai/gpt-4o", // Default to a smarter model
      context = "",
    }: {
      messages: Array<{ role: string; content: string }>
      agent?: string
      model?: string
      context?: string
    } = await req.json()

    console.log("[v0] Chat API called with agent:", agent, "model:", model)
    console.log("[v0] Page context:", context)
    console.log("[v0] Messages received:", JSON.stringify(messages))

    const validatedMessages = messages
      .filter((msg) => msg && typeof msg === "object" && msg.role && msg.content)
      .map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: String(msg.content),
      }))

    console.log("[v0] Validated messages:", JSON.stringify(validatedMessages))

    // Robust fallback to Sam if agent not found
    const selectedAgent = agentPersonalities[agent as keyof typeof agentPersonalities] || agentPersonalities.Sam

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const systemPrompt = `
${selectedAgent.systemPrompt}

---
INTELLIGENCE INSTRUCTIONS:
1. **Think Step-by-Step**: Before answering complex questions, break them down logically.
2. **Be Proactive**: Don't just answer the question; anticipate the user's next need. (e.g., if they ask about a deduction, mention the documentation needed).
3. **Context Aware**: Use the provided user context to personalize your answer. Don't ask for information you already have.
4. **Safety & Compliance**: Never encourage tax evasion. If a strategy is aggressive, label it as such and recommend professional review.
5. **Formatting**: Use Markdown (bolding, lists) to make your responses easy to read.
---

CONTEXT:
You are helping a user on the Taxu platform.
${user ? `User ID: ${user.id}` : "User is currently unauthenticated (Demo Mode)."}
${context ? `Current Page/State Context: ${context}` : ""}

TOOLS:
You have access to tools that can check real-time filing status, refund status, and estimated timelines. 
- Use 'getFilingStatus' if the user asks "What's my status?" or "Did I file yet?".
- Use 'getFilingHistory' if they ask about past returns.
- Use 'getEstimatedTimeline' if they ask "When will I get my refund?".

Always provide accurate, helpful information while encouraging users to consult the full Taxu platform for personalized calculations.
`

    const result = await streamText({
      model: model,
      messages: validatedMessages,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
      tools: {
        getFilingStatus: filingStatusTool,
        getFilingHistory: filingHistoryTool,
        getEstimatedTimeline: estimatedTimelineTool,
      },
      maxSteps: 5,
      abortSignal: req.signal,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
