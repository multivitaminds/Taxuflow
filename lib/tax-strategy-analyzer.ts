import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

export class TaxStrategyAnalyzer {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async analyzeEntityStructure(businessData: {
    revenue: number
    expenses: number
    industry: string
    employeeCount: number
    currentStructure: string
  }) {
    console.log("[v0] Tax Strategy Analyzer: Analyzing entity structure")

    const prompt = `You are an expert tax strategist analyzing the optimal business entity structure.

Business Profile:
- Annual Revenue: $${businessData.revenue}
- Annual Expenses: $${businessData.expenses}
- Taxable Income: $${businessData.revenue - businessData.expenses}
- Industry: ${businessData.industry}
- Employee Count: ${businessData.employeeCount}
- Current Structure: ${businessData.currentStructure}

Analyze and recommend the optimal entity structure (Sole Proprietorship, LLC, S Corporation, C Corporation).

Consider:
1. Self-employment tax savings
2. Administrative complexity and costs
3. Liability protection
4. Growth plans and funding needs
5. Multi-state operations
6. Fringe benefit opportunities
7. Exit strategy considerations

Return a comprehensive analysis with:
- Recommended entity structure
- Tax savings calculation
- Implementation timeline
- Transition costs
- Ongoing compliance requirements
- Risk assessment`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        recommended_entity: z.enum(["Sole Proprietorship", "LLC", "S Corporation", "C Corporation"]),
        confidence_score: z.number().min(0).max(100),
        annual_tax_savings: z.number(),
        reasoning: z.string(),
        implementation_steps: z.array(
          z.object({
            step: z.string(),
            timeline: z.string(),
            estimated_cost: z.number(),
          }),
        ),
        ongoing_requirements: z.array(z.string()),
        risk_factors: z.array(z.string()),
        alternative_structures: z.array(
          z.object({
            entity_type: z.string(),
            pros: z.array(z.string()),
            cons: z.array(z.string()),
          }),
        ),
      }),
      prompt,
    })

    // Store analysis
    await this.supabase.from("tax_optimization_strategies").insert({
      user_id: this.userId,
      strategy_type: "entity_structure",
      recommended_entity: object.recommended_entity,
      annual_tax_savings: object.annual_tax_savings,
      confidence_score: object.confidence_score,
      implementation_steps: object.implementation_steps,
      reasoning: object.reasoning,
      status: "recommended",
    })

    return object
  }

  async generateMultiYearPlan(projections: {
    currentIncome: number
    growthRate: number
    years: number
  }) {
    console.log("[v0] Tax Strategy Analyzer: Generating multi-year tax plan")

    const yearlyProjections = []
    for (let year = 0; year < projections.years; year++) {
      const projectedIncome = projections.currentIncome * Math.pow(1 + projections.growthRate / 100, year)
      yearlyProjections.push({
        year: new Date().getFullYear() + year,
        projected_income: projectedIncome,
      })
    }

    const prompt = `Generate a comprehensive multi-year tax strategy plan.

Income Projections:
${JSON.stringify(yearlyProjections, null, 2)}

For each year, provide:
1. Optimal entity structure
2. Estimated tax liability
3. Tax saving opportunities
4. Retirement contribution strategies
5. State tax considerations
6. Key tax law changes to monitor`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        yearly_strategies: z.array(
          z.object({
            year: z.number(),
            projected_income: z.number(),
            recommended_entity: z.string(),
            estimated_tax: z.number(),
            tax_savings_opportunities: z.array(z.string()),
            retirement_contribution_limit: z.number(),
            key_milestones: z.array(z.string()),
          }),
        ),
        total_projected_savings: z.number(),
        strategic_recommendations: z.array(z.string()),
      }),
      prompt,
    })

    return object
  }

  async calculateQuarterlyEstimates(annualIncome: number, deductions: number, entityType: string) {
    const taxableIncome = annualIncome - deductions

    let selfEmploymentTax = 0
    let incomeTax = 0

    if (entityType === "S Corporation") {
      // S-Corp: SE tax only on reasonable salary (40% of profit)
      const reasonableSalary = taxableIncome * 0.4
      selfEmploymentTax = reasonableSalary * 0.153
      incomeTax = taxableIncome * 0.24
    } else {
      // Sole Prop / LLC: SE tax on all profit
      selfEmploymentTax = taxableIncome * 0.153
      incomeTax = taxableIncome * 0.24
    }

    const totalAnnualTax = selfEmploymentTax + incomeTax
    const quarterlyPayment = totalAnnualTax / 4

    return {
      taxable_income: taxableIncome,
      self_employment_tax: selfEmploymentTax,
      income_tax: incomeTax,
      total_annual_tax: totalAnnualTax,
      quarterly_payment: quarterlyPayment,
      due_dates: [
        { quarter: "Q1", due_date: "April 15", amount: quarterlyPayment },
        { quarter: "Q2", due_date: "June 15", amount: quarterlyPayment },
        { quarter: "Q3", due_date: "September 15", amount: quarterlyPayment },
        { quarter: "Q4", due_date: "January 15", amount: quarterlyPayment },
      ],
    }
  }
}
