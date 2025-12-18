// API endpoint for advanced AI agent intelligence features

import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import {
  AgentMemory,
  AgentCollaboration,
  InsightGenerator,
  TaxOptimizationEngine,
  PredictiveTaxModel,
} from "@/lib/ai/agent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, data } = await request.json()

    switch (action) {
      case "generate_insights": {
        const generator = new InsightGenerator(supabase, user.id)
        const insights = await generator.generateInsights(data.context)
        return NextResponse.json({ success: true, insights })
      }

      case "find_optimizations": {
        const engine = new TaxOptimizationEngine(supabase, user.id)
        const strategies = await engine.findOptimizations(data.taxData)
        return NextResponse.json({ success: true, strategies })
      }

      case "predict_refund": {
        const model = new PredictiveTaxModel(supabase, user.id)
        const prediction = await model.predictRefund(data.historicalData, data.currentData)
        return NextResponse.json({ success: true, prediction })
      }

      case "agent_collaboration": {
        const collaboration = new AgentCollaboration(supabase, user.id)
        const result = await collaboration.initiateCollaboration(
          data.collaborationType,
          data.participatingAgents,
          data.triggerEvent,
          data.context,
        )
        return NextResponse.json(result)
      }

      case "agent_memory": {
        const memory = new AgentMemory(supabase, user.id, data.agentName)

        if (data.operation === "remember") {
          const result = await memory.remember(data.memoryType, data.content, data.tags)
          return NextResponse.json({ success: true, memory: result })
        } else if (data.operation === "recall") {
          const memories = await memory.recall(data.memoryType, data.tags, data.limit)
          return NextResponse.json({ success: true, memories })
        } else if (data.operation === "learn") {
          await memory.learn(data.learningType, data.context, data.lesson)
          return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid memory operation" }, { status: 400 })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[Agent Intelligence] Error:", error)
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
