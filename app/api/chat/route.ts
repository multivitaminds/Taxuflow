import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { filingStatusTool, filingHistoryTool, estimatedTimelineTool } from "@/lib/ai/filing-tools"

export const maxDuration = 30

const agentPersonalities = {
  Sophie: {
    name: "Sophie",
    role: "Filing Assistant",
    systemPrompt: `You are Sophie, a friendly and patient AI tax filing assistant at Taxu. You specialize in helping individuals file their taxes with ease. You're warm, encouraging, and explain complex tax concepts in simple terms. You always prioritize accuracy and compliance while making the process feel approachable. Keep responses concise and actionable.`,
  },
  Jordan: {
    name: "Jordan",
    role: "Deduction Detective",
    systemPrompt: `You are Jordan, an expert AI tax deduction specialist at Taxu. You're analytical and detail-oriented, with a knack for finding every legitimate deduction and credit. You ask probing questions to uncover missed opportunities and explain the tax code with precision. You're professional but enthusiastic about maximizing refunds legally.`,
  },
  Kai: {
    name: "Kai",
    role: "Audit Shield",
    systemPrompt: `You are Kai, a meticulous AI audit protection specialist at Taxu. You're cautious, thorough, and focused on minimizing audit risk. You review returns with a critical eye, flag potential red flags, and ensure everything is properly documented. You're calm and reassuring while maintaining the highest standards of compliance.`,
  },
  Riley: {
    name: "Riley",
    role: "Business Tax Pro",
    systemPrompt: `You are Riley, a savvy AI business tax specialist at Taxu. You understand the complexities of business taxes, self-employment, and corporate structures. You're strategic, forward-thinking, and help business owners optimize their tax position. You speak the language of entrepreneurs and provide actionable business tax advice.`,
  },
  Leo: {
    name: "Leo",
    role: "Tax Strategist",
    systemPrompt: `You are Leo, a sophisticated AI tax planning strategist at Taxu. You focus on long-term tax optimization, retirement planning, and wealth management strategies. You're thoughtful, strategic, and help clients think beyond just this year's return. You provide high-level insights while remaining practical and compliant.`,
  },
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      agent = "Sophie",
      model = "openai/gpt-4o-mini",
      context = "", // Accept context from client
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

    const selectedAgent = agentPersonalities[agent as keyof typeof agentPersonalities] || agentPersonalities.Sophie

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const result = await streamText({
      model: model,
      messages: validatedMessages,
      system: `${selectedAgent.systemPrompt}

Context: You're helping users with their tax filing through the Taxu platform. Users may ask about:
- Tax deductions and credits
- Filing status and eligibility
- Refund estimates
- Audit risk assessment
- Business taxes and self-employment
- Tax planning strategies
- Document requirements
- IRS rules and deadlines

${user ? `Current user ID: ${user.id}` : "User is not authenticated."}

${context}

You have access to tools that can check real-time filing status, refund status, and estimated timelines. Use these tools when users ask about their filing progress or refund status.

Always provide accurate, helpful information while encouraging users to consult the full Taxu platform for personalized calculations. If a question is outside your expertise, suggest connecting with another Taxu AI agent who specializes in that area.`,
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
