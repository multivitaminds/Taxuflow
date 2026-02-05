import { streamText, tool } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, userId, context } = await req.json()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Fetch user's tax profile for context
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    const { data: documents } = await supabase
      .from("documents")
      .select("file_name, ai_document_type, extracted_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    const systemPrompt = `You are an expert tax advisor powered by GPT-4o-mini, optimized for fast and accurate tax assistance.

EXPERTISE:
- Deep knowledge of US tax law (IRS regulations, tax code, recent changes)
- Tax optimization strategies
- Deduction discovery and maximization
- Audit risk assessment
- Tax planning and forecasting

USER CONTEXT:
${profile ? `Name: ${profile.full_name}\nBusiness: ${profile.business_name || "Individual"}` : "New user"}

RECENT DOCUMENTS:
${documents?.map((d) => `- ${d.file_name} (${d.ai_document_type})`).join("\n") || "No documents uploaded yet"}

INSTRUCTIONS:
1. Provide accurate, detailed tax advice
2. Cite specific IRS regulations when relevant
3. Explain complex concepts simply
4. Suggest optimization strategies proactively
5. Warn about audit risks
6. Always prioritize legal compliance

IMPORTANT: You are NOT a substitute for a licensed CPA or tax attorney. For complex situations, recommend consulting a professional.`

    const result = await streamText({
      model: "openai/gpt-4o-mini",
      messages,
      system: systemPrompt,
      temperature: 0.3, // Lower temperature for more precise tax advice
      maxTokens: 4000,
      tools: {
        calculateTax: tool({
          description: "Calculate estimated tax based on income and deductions",
          parameters: z.object({
            income: z.number().describe("Total income"),
            deductions: z.number().describe("Total deductions"),
            filingStatus: z.enum(["single", "married_joint", "married_separate", "head_of_household"]),
          }),
          execute: async ({ income, deductions, filingStatus }) => {
            const taxableIncome = Math.max(0, income - deductions)
            // Simplified 2024 tax brackets
            let tax = 0
            if (filingStatus === "single") {
              if (taxableIncome <= 11600) tax = taxableIncome * 0.1
              else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12
              else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22
              else tax = 17168.5 + (taxableIncome - 100525) * 0.24
            }
            return {
              taxableIncome,
              estimatedTax: Math.round(tax),
              effectiveTaxRate: ((tax / income) * 100).toFixed(2) + "%",
            }
          },
        }),
        findDeductions: tool({
          description: "Search for applicable tax deductions based on user situation",
          parameters: z.object({
            userType: z.enum(["individual", "business", "freelancer"]),
            categories: z.array(z.string()).describe("Categories to search: home_office, vehicle, travel, etc"),
          }),
          execute: async ({ userType, categories }) => {
            const deductions: Record<string, any> = {
              home_office: {
                name: "Home Office Deduction",
                maxAmount: 1500,
                requirements: "Exclusive and regular use for business",
                irs_form: "Form 8829",
              },
              vehicle: {
                name: "Business Vehicle Deduction",
                mileageRate: 0.67,
                requirements: "Track business miles with log",
                irs_form: "Schedule C",
              },
            }
            return categories.map((cat) => deductions[cat] || null).filter(Boolean)
          },
        }),
      },
      maxSteps: 5,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[Tax Assistant Error]", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 })
  }
}
