import { streamText, tool } from "ai"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

export const maxDuration = 60

// Support conversation state manager
const SUPPORT_SYSTEM_PROMPT = `You are Sam, Taxu's primary Customer Service AI Agent powered by Claude.

## YOUR CORE IDENTITY
You are tax-first by design. Every interaction must consider tax implications before responding.
You support all Taxu platforms: Neobank, Investment, Accounting, and Tax Filing.
You can reason across platforms and understand indirect tax effects.

## DIAGNOSIS APPROACH
1. **Ask structured questions before open-ended ones** - Start with specific, answerable questions
2. **Confirm understanding before proposing fixes** - Repeat back what you understand
3. **Prefer step-by-step guidance** - Break complex solutions into numbered steps
4. **If the issue cannot be resolved, summarize clearly and escalate** - Know your limits
5. **Never guess; request logs or screenshots if needed** - Be precise

## TAX IMPACT SCAN (ALWAYS ACTIVE)
Every response should silently consider:
- Does this affect taxable income?
- Does this affect deductions or credits?
- Are there reporting requirements?
- What's the compliance impact?

## COMMUNICATION RULES
- Be conversational, helpful, and precise
- Always cite relevant tax codes when appropriate
- Use Markdown formatting for clarity (bold, lists, code blocks)
- Keep responses focused and actionable
- If escalation is needed, say: "To make sure this is handled correctly, I'm escalating this to a Taxu specialist. I've included everything we discussed so you won't need to repeat yourself."

## PRODUCT KNOWLEDGE
- **Tax Filing**: W-2, 1099-NEC, 1099-MISC, 941, Form W-9, e-filing with TaxBandits
- **Neobank**: Business accounts, cards, transfers, bill pay, tax buckets
- **Accounting**: Books, invoices, expenses, payroll, fixed assets, depreciation
- **Investment**: Portfolio, tax-loss harvesting, capital gains, wash sales

## RESPONSE FORMAT
When diagnosing issues:
1. Acknowledge the user's concern
2. Ask 1-2 clarifying questions if needed
3. Provide clear, actionable steps
4. Offer to help with the next step`

export async function POST(request: Request) {
  try {
    const { messages, conversationState, product, account } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Build context from user data
    let userContext = ""
    if (user) {
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      const { data: recentFilings } = await supabase
        .from("tax_filings")
        .select("form_type, status, tax_year")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      userContext = `
USER CONTEXT:
- Name: ${profile?.full_name || "User"}
- Account Type: ${profile?.account_type || "Individual"}
- Account Mode: ${profile?.account_mode || "SANDBOX"}
- Business: ${profile?.business_name || "N/A"}
- Recent Filings: ${recentFilings?.map((f) => `${f.form_type} (${f.tax_year}): ${f.status}`).join(", ") || "None"}
${product ? `- Selected Product: ${product}` : ""}
${account ? `- Selected Account: ${account}` : ""}`
    }

    const result = await streamText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SUPPORT_SYSTEM_PROMPT + userContext,
        },
        ...messages,
      ],
      tools: {
        // Tool to check filing status
        checkFilingStatus: tool({
          description: "Check the status of a user's tax filing",
          parameters: z.object({
            formType: z.string().describe("The form type to check (e.g., W-2, 1099-NEC)"),
            taxYear: z.number().describe("The tax year"),
          }),
          execute: async ({ formType, taxYear }) => {
            if (!user) return { error: "User not authenticated" }

            const { data } = await supabase
              .from("tax_filings")
              .select("*")
              .eq("user_id", user.id)
              .eq("form_type", formType)
              .eq("tax_year", taxYear)
              .single()

            return data || { status: "not_found", message: "No filing found for this form type and year" }
          },
        }),

        // Tool to search help articles
        searchHelpArticles: tool({
          description: "Search Taxu help articles and documentation",
          parameters: z.object({
            query: z.string().describe("Search query"),
          }),
          execute: async ({ query }) => {
            // Simulated help article search
            const articles = [
              {
                title: "How to file a W-2",
                url: "/help/filing/w2",
                summary: "Step-by-step guide to filing Form W-2",
              },
              {
                title: "Understanding 1099-NEC",
                url: "/help/filing/1099-nec",
                summary: "Everything you need to know about 1099-NEC forms",
              },
              {
                title: "E-Filing with TaxBandits",
                url: "/help/efile/taxbandits",
                summary: "How to e-file your tax forms to the IRS",
              },
              {
                title: "Going Live from Sandbox",
                url: "/help/account/go-live",
                summary: "How to activate your live account",
              },
            ]

            const relevant = articles.filter(
              (a) =>
                a.title.toLowerCase().includes(query.toLowerCase()) ||
                a.summary.toLowerCase().includes(query.toLowerCase()),
            )

            return { articles: relevant.length > 0 ? relevant : articles.slice(0, 2) }
          },
        }),

        // Tool to escalate to human support
        escalateToHuman: tool({
          description: "Escalate the conversation to a human support agent",
          parameters: z.object({
            reason: z.string().describe("Reason for escalation"),
            priority: z.enum(["low", "medium", "high", "urgent"]).describe("Priority level"),
            summary: z.string().describe("Summary of the conversation so far"),
          }),
          execute: async ({ reason, priority, summary }) => {
            // In production, this would create a support ticket
            return {
              ticketId: `TKT-${Date.now()}`,
              status: "created",
              message:
                "Your request has been escalated to our support team. They will reach out within 24 hours (4 hours for urgent issues).",
              priority,
            }
          },
        }),

        // Tool to get tax deadline information
        getTaxDeadlines: tool({
          description: "Get relevant tax deadlines and due dates",
          parameters: z.object({
            formType: z.string().optional().describe("Specific form type"),
            taxYear: z.number().optional().describe("Tax year"),
          }),
          execute: async ({ formType, taxYear }) => {
            const year = taxYear || new Date().getFullYear()
            const deadlines = [
              { form: "W-2", deadline: `January 31, ${year + 1}`, description: "Employer deadline to provide W-2s" },
              {
                form: "1099-NEC",
                deadline: `January 31, ${year + 1}`,
                description: "Deadline for 1099-NEC to contractors",
              },
              {
                form: "1099-MISC",
                deadline: `February 28, ${year + 1}`,
                description: "Paper filing deadline for 1099-MISC",
              },
              { form: "Form 941", deadline: "Quarterly", description: "Due by end of month following quarter" },
              {
                form: "Individual Tax Return",
                deadline: `April 15, ${year + 1}`,
                description: "Personal tax return deadline",
              },
            ]

            if (formType) {
              return deadlines.filter((d) => d.form.toLowerCase().includes(formType.toLowerCase()))
            }
            return deadlines
          },
        }),
      },
      maxSteps: 5,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.error("[v0] Support chat error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
