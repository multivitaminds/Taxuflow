import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { query, template, dateRange } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: `You are a world-class financial analyst. Generate a comprehensive business report based on this query: "${query}"
      
Template type: ${template || "custom"}
Date range: ${dateRange || "current quarter"}

Provide:
1. Executive Summary (2-3 sentences)
2. Key Metrics with actual values
3. 5-7 detailed insights with specific data points
4. 3-5 actionable recommendations
5. Industry benchmark comparisons

Format your response as JSON with this structure:
{
  "title": "Report Title",
  "summary": "Executive summary",
  "metrics": { "revenue": "$X", "profit": "$Y", "growth": "Z%", "margin": "W%" },
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["rec 1", "rec 2", ...],
  "benchmarks": { "profitMargin": { "industry": 28, "yours": 35.7, "status": "above" } }
}`,
    })

    const report = JSON.parse(text)

    return NextResponse.json({
      success: true,
      report,
      generatedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("[AI Report Generation Error]:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
