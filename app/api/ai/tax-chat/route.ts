import { streamText, tool } from "ai"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Get user context
    const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    const { data: documents } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    const { data: filings } = await supabase
      .from("tax_filings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    const result = await streamText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Sam, an expert AI tax assistant for Taxu. You have deep knowledge of:
- All IRS tax forms and regulations
- Federal and state tax laws
- Business and individual taxation
- Tax deductions, credits, and optimization strategies
- E-filing processes and requirements
- Tax deadline management
- Document requirements for filing

User Context:
- Name: ${userProfile?.full_name || "User"}
- Account Type: ${userProfile?.account_type || "Individual"}
- Business Type: ${userProfile?.business_type || "N/A"}
- Recent Documents: ${documents?.length || 0} uploaded
- Recent Filings: ${filings?.length || 0} filed

Your capabilities:
- Answer any tax question with precision
- Calculate tax estimates and scenarios
- Recommend deductions and credits
- Guide through filing processes
- Search IRS documentation
- Analyze uploaded documents
- Track filing requirements

Be conversational, helpful, and precise. Always cite relevant tax codes when appropriate.`,
        },
        ...messages,
      ],
      tools: {
        calculateTaxEstimate: tool({
          description: "Calculate estimated tax liability or refund",
          parameters: z.object({
            income: z.number().describe("Total income"),
            deductions: z.number().describe("Total deductions"),
            credits: z.number().describe("Total tax credits"),
            filingStatus: z.enum(["single", "married_joint", "married_separate", "head_of_household"]),
            taxYear: z.number(),
          }),
          execute: async ({ income, deductions, credits, filingStatus, taxYear }) => {
            console.log("[v0] Calculating tax estimate...")
            const standardDeduction = filingStatus === "married_joint" ? 27700 : 13850
            const taxableIncome = Math.max(0, income - Math.max(deductions, standardDeduction))

            // Simplified progressive tax calculation (2024 rates)
            let tax = 0
            if (taxableIncome <= 11000) {
              tax = taxableIncome * 0.1
            } else if (taxableIncome <= 44725) {
              tax = 1100 + (taxableIncome - 11000) * 0.12
            } else if (taxableIncome <= 95375) {
              tax = 5147 + (taxableIncome - 44725) * 0.22
            } else if (taxableIncome <= 182100) {
              tax = 16290 + (taxableIncome - 95375) * 0.24
            } else if (taxableIncome <= 231250) {
              tax = 37104 + (taxableIncome - 182100) * 0.32
            } else if (taxableIncome <= 578125) {
              tax = 52832 + (taxableIncome - 231250) * 0.35
            } else {
              tax = 174238.5 + (taxableIncome - 578125) * 0.37
            }

            const finalTax = Math.max(0, tax - credits)

            return {
              taxableIncome,
              estimatedTax: Math.round(finalTax),
              effectiveRate: ((finalTax / income) * 100).toFixed(2),
              marginalRate: taxableIncome > 578125 ? 37 : taxableIncome > 231250 ? 35 : 24,
            }
          },
        }),
        searchDocuments: tool({
          description: "Search user's uploaded tax documents",
          parameters: z.object({
            query: z.string().describe("Search query"),
            documentType: z.string().optional().describe("Filter by document type"),
            taxYear: z.number().optional().describe("Filter by tax year"),
          }),
          execute: async ({ query, documentType, taxYear }) => {
            console.log("[v0] Searching documents:", query)

            let queryBuilder = supabase
              .from("documents")
              .select("*")
              .eq("user_id", user.id)
              .ilike("file_name", `%${query}%`)

            if (documentType) {
              queryBuilder = queryBuilder.eq("document_type", documentType)
            }

            if (taxYear) {
              queryBuilder = queryBuilder.eq("tax_year", taxYear)
            }

            const { data } = await queryBuilder.limit(5)

            return {
              found: data?.length || 0,
              documents: data?.map((d) => ({
                name: d.file_name,
                type: d.document_type,
                year: d.tax_year,
                uploaded: d.created_at,
              })),
            }
          },
        }),
        getFilingStatus: tool({
          description: "Check filing status and requirements",
          parameters: z.object({
            taxYear: z.number().describe("Tax year to check"),
          }),
          execute: async ({ taxYear }) => {
            console.log("[v0] Checking filing status for year:", taxYear)

            const { data: filings } = await supabase
              .from("tax_filings")
              .select("*")
              .eq("user_id", user.id)
              .eq("tax_year", taxYear)

            const { data: docs } = await supabase
              .from("documents")
              .select("document_type, tax_year")
              .eq("user_id", user.id)
              .eq("tax_year", taxYear)

            return {
              filings: filings || [],
              uploadedDocuments: docs || [],
              status: filings && filings.length > 0 ? "filed" : "not_filed",
              deadline: `April 15, ${taxYear + 1}`,
            }
          },
        }),
        recommendDeductions: tool({
          description: "Recommend tax deductions based on user profile and documents",
          parameters: z.object({
            taxYear: z.number(),
          }),
          execute: async ({ taxYear }) => {
            console.log("[v0] Recommending deductions for year:", taxYear)

            const { data: docs } = await supabase
              .from("documents")
              .select("*")
              .eq("user_id", user.id)
              .eq("tax_year", taxYear)

            const recommendations = []

            if (userProfile?.business_type) {
              recommendations.push({
                category: "Business Expenses",
                items: ["Office supplies", "Software subscriptions", "Professional fees"],
                estimatedValue: 5000,
              })
            }

            // Check for specific document types
            const hasHomeOffice = docs?.some((d) => d.file_name?.toLowerCase().includes("home"))
            if (hasHomeOffice) {
              recommendations.push({
                category: "Home Office Deduction",
                items: ["Portion of rent/mortgage", "Utilities", "Internet"],
                estimatedValue: 3000,
              })
            }

            return {
              recommended: recommendations,
              totalEstimatedValue: recommendations.reduce((sum, r) => sum + r.estimatedValue, 0),
            }
          },
        }),
      },
      maxSteps: 5,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[v0] Tax chat error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
