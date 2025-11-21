import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { filingStatusTool, filingHistoryTool, estimatedTimelineTool } from "@/lib/ai/filing-tools"
import { AGENT_PERSONALITIES } from "@/lib/ai/agent-intelligence"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API: Request received")
    const {
      messages,
      agent = "Sam",
      model = "openai/gpt-4o",
      context = "",
    }: {
      messages: Array<{ role: string; content: string }>
      agent?: string
      model?: string
      context?: string
    } = await req.json()

    const selectedAgent = AGENT_PERSONALITIES[agent as keyof typeof AGENT_PERSONALITIES] || AGENT_PERSONALITIES.Sam

    const supabase = await createClient()
    let user = null

    if (supabase) {
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    const systemPrompt = `
You are ${selectedAgent.name}, the ${selectedAgent.role} at Taxu.

PERSONALITY:
${selectedAgent.personality}

EXPERTISE:
${selectedAgent.expertise.map((item) => `- ${item}`).join("\n")}

COMMUNICATION STYLE:
${selectedAgent.communication_style}

DECISION MAKING:
${selectedAgent.decision_making}

---
INTELLIGENCE INSTRUCTIONS:
1. **Think Step-by-Step**: Before answering complex questions, break them down logically.
2. **Be Proactive**: Don't just answer the question; anticipate the user's next need.
3. **Context Aware**: Use the provided user context to personalize your answer.
4. **Safety & Compliance**: Never encourage tax evasion.
5. **Formatting**: Use Markdown (bolding, lists) to make your responses easy to read.
---

CONTEXT:
You are helping a user on the Taxu platform.
${user ? `User ID: ${user.id}` : "User is currently unauthenticated (Demo Mode)."}
${context ? `Current Page/State Context: ${context}` : ""}
`

    console.log(`[v0] Chat API: Streaming response for agent ${selectedAgent.name} with model ${model}`)

    const result = await streamText({
      model: model, // Pass the model string directly to use Vercel AI Gateway
      messages,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
      tools: {
        getFilingStatus: filingStatusTool,
        getFilingHistory: filingHistoryTool,
        getEstimatedTimeline: estimatedTimelineTool,
      },
      maxSteps: 5,
    })

    return result.toUIMessageStreamResponse()
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
