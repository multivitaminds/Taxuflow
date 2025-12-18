import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

export class DeductionMaximizer {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async findIndustrySpecificDeductions(industry: string, revenue: number, expenses: any[]) {
    console.log("[v0] AI Deduction Maximizer: Analyzing industry-specific deductions for", industry)

    const prompt = `You are an expert tax strategist analyzing deduction opportunities for a ${industry} business.

Business Profile:
- Industry: ${industry}
- Annual Revenue: $${revenue}
- Number of Expenses: ${expenses.length}

Find 8-12 industry-specific tax deductions this business qualifies for. Consider:
1. Industry-specific write-offs (e.g., creative professionals can deduct portfolio costs)
2. Equipment and depreciation opportunities
3. Home office potential
4. Vehicle usage patterns
5. Professional development
6. Insurance deductions
7. Retirement contribution opportunities
8. Overlooked deductions specific to this industry

Return a JSON array of deductions:
[
  {
    "name": "Deduction name",
    "category": "Office|Transportation|Technology|Insurance|Retirement|Education|Marketing|Other",
    "estimated_savings": 0.00,
    "audit_risk": "low|medium|high",
    "description": "Clear explanation of the deduction",
    "requirements": ["requirement 1", "requirement 2"],
    "documentation": ["doc 1", "doc 2"],
    "tax_form_line": "Schedule C, Line X",
    "confidence": 0-100,
    "industry_specific": true/false,
    "irs_publication": "IRS Pub XXX"
  }
]

Be specific, accurate, and focus on deductions that maximize tax savings while minimizing audit risk.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        deductions: z.array(
          z.object({
            name: z.string(),
            category: z.string(),
            estimated_savings: z.number(),
            audit_risk: z.enum(["low", "medium", "high"]),
            description: z.string(),
            requirements: z.array(z.string()),
            documentation: z.array(z.string()),
            tax_form_line: z.string(),
            confidence: z.number(),
            industry_specific: z.boolean(),
            irs_publication: z.string(),
          }),
        ),
        total_potential_savings: z.number(),
        audit_risk_summary: z.string(),
      }),
      prompt,
    })

    // Store deductions in database
    for (const deduction of object.deductions) {
      await this.supabase.from("deductions_credits").insert({
        user_id: this.userId,
        name: deduction.name,
        amount: deduction.estimated_savings,
        category: deduction.category,
        type: "deduction",
        status: "suggested",
        description: deduction.description,
        audit_risk: deduction.audit_risk,
        confidence: deduction.confidence,
        requirements: deduction.requirements,
        documentation_required: deduction.documentation,
        tax_form_line: deduction.tax_form_line,
        recommended_by: "AI Deduction Maximizer",
      })
    }

    console.log(
      "[v0] AI Deduction Maximizer: Found",
      object.deductions.length,
      "deductions worth $" + object.total_potential_savings,
    )

    return object
  }

  async optimizeAuditDefense(deductions: any[]) {
    console.log("[v0] Audit Defense Optimizer: Analyzing", deductions.length, "deductions")

    const prompt = `You are an IRS audit defense expert. Analyze these deductions for audit risk and provide optimization strategies.

Deductions:
${JSON.stringify(deductions, null, 2)}

For each deduction, assess:
1. Audit trigger risk
2. Documentation sufficiency
3. Reasonableness for business type
4. IRS scrutiny patterns
5. Optimization opportunities

Return a JSON object:
{
  "overall_risk_score": 0-100,
  "overall_risk_level": "low|medium|high",
  "risk_factors": ["factor 1", "factor 2"],
  "optimization_recommendations": [
    {
      "deduction_name": "name",
      "current_risk": "low|medium|high",
      "optimized_risk": "low|medium|high",
      "strategy": "How to reduce risk",
      "additional_documentation": ["doc 1", "doc 2"]
    }
  ],
  "audit_defense_checklist": ["item 1", "item 2"]
}`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        overall_risk_score: z.number(),
        overall_risk_level: z.enum(["low", "medium", "high"]),
        risk_factors: z.array(z.string()),
        optimization_recommendations: z.array(
          z.object({
            deduction_name: z.string(),
            current_risk: z.enum(["low", "medium", "high"]),
            optimized_risk: z.enum(["low", "medium", "high"]),
            strategy: z.string(),
            additional_documentation: z.array(z.string()),
          }),
        ),
        audit_defense_checklist: z.array(z.string()),
      }),
      prompt,
    })

    // Store audit defense analysis
    await this.supabase.from("audit_defense_analyses").insert({
      user_id: this.userId,
      overall_risk_score: object.overall_risk_score,
      overall_risk_level: object.overall_risk_level,
      risk_factors: object.risk_factors,
      optimization_recommendations: object.optimization_recommendations,
      audit_defense_checklist: object.audit_defense_checklist,
      analyzed_at: new Date().toISOString(),
    })

    return object
  }

  async generateDocumentationTemplate(deduction: any) {
    console.log("[v0] Template Generator: Creating documentation template for", deduction.name)

    const prompt = `Create a comprehensive documentation template for this tax deduction:

Deduction: ${deduction.name}
Category: ${deduction.category}
Description: ${deduction.description}
Requirements: ${JSON.stringify(deduction.requirements)}

Generate a structured template that includes:
1. Required fields to track
2. Supporting documentation checklist
3. Calculation worksheet
4. IRS requirements
5. Best practices

Return JSON with template structure.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        template_name: z.string(),
        description: z.string(),
        required_fields: z.array(
          z.object({
            field_name: z.string(),
            field_type: z.string(),
            required: z.boolean(),
            help_text: z.string(),
          }),
        ),
        documentation_checklist: z.array(z.string()),
        calculation_instructions: z.string(),
        irs_references: z.array(z.string()),
        best_practices: z.array(z.string()),
      }),
      prompt,
    })

    return object
  }
}
