import { generateText } from "ai"

export const maxDuration = 30

interface ValidationRequest {
  formType: "w2" | "1099-nec" | "941"
  formData: Record<string, any>
}

interface ValidationError {
  field: string
  message: string
  severity: "error" | "warning"
}

interface ValidationResponse {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  suggestions: string[]
}

export async function POST(req: Request) {
  try {
    const { formType, formData }: ValidationRequest = await req.json()

    console.log("[v0] Validating form:", formType)

    const taxYear = formData.taxYear ? Number.parseInt(formData.taxYear) : new Date().getFullYear()
    const socialSecurityCap = taxYear >= 2025 ? 176100 : 168600

    const wages = Number.parseFloat(formData.wages) || 0
    const federalWithholding = Number.parseFloat(formData.federalWithholding) || 0
    const socialSecurityWages = Number.parseFloat(formData.socialSecurityWages) || 0
    const socialSecurityWithholding = Number.parseFloat(formData.socialSecurityWithholding) || 0
    const medicareWages = Number.parseFloat(formData.medicareWages) || 0
    const medicareWithholding = Number.parseFloat(formData.medicareWithholding) || 0

    const federalPercent = wages > 0 ? (federalWithholding / wages) * 100 : 0
    const ssPercent = socialSecurityWages > 0 ? (socialSecurityWithholding / socialSecurityWages) * 100 : 0
    const medicarePercent = medicareWages > 0 ? (medicareWithholding / medicareWages) * 100 : 0

    console.log("[v0] Calculated tax rates:", {
      federal: `${federalPercent.toFixed(2)}%`,
      socialSecurity: `${ssPercent.toFixed(2)}%`,
      medicare: `${medicarePercent.toFixed(2)}%`,
    })

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a tax form validation expert. Review this ${formType.toUpperCase()} form data for errors and inconsistencies.

Form Data:
${JSON.stringify(formData, null, 2)}

PRE-CALCULATED TAX RATES (already verified correct):
- Federal withholding: ${federalPercent.toFixed(2)}% (${federalWithholding} ÷ ${wages})
- Social Security withholding: ${ssPercent.toFixed(2)}% (${socialSecurityWithholding} ÷ ${socialSecurityWages})
- Medicare withholding: ${medicarePercent.toFixed(2)}% (${medicareWithholding} ÷ ${medicareWages})

IMPORTANT: This form is for TAX YEAR ${taxYear}. Use ${taxYear} rules and limits.

VALIDATION RULES:
1. Federal withholding 0-37% is VALID (most employees: 10-25%)
2. Social Security withholding should be ~6.2% (accept 6.0-6.5% for rounding)
3. Medicare withholding should be ~1.45% (accept 1.4-1.5% for rounding)
4. Social Security wages cap for ${taxYear}: $${socialSecurityCap.toLocaleString()}
5. State withholding 0-13.3% is VALID (varies by state)

DO NOT FLAG AS ERROR:
- Federal withholding between 10-25% (this is NORMAL)
- Social Security withholding at 6.2% (this is CORRECT)
- Medicare withholding at 1.45% (this is CORRECT)
- Tax year ${taxYear} (future years are valid for advance filing)

ONLY FLAG AS ERROR IF:
- Negative numbers
- Federal withholding > 37% of wages
- Social Security wages > $${socialSecurityCap.toLocaleString()}
- Social Security withholding > 6.5% or < 6.0%
- Medicare withholding > 1.5% or < 1.4%
- Missing required fields (employer name, EIN, employee name, SSN, wages)

Return ONLY valid JSON in this exact format:
{
  "valid": boolean,
  "errors": [
    { "field": "fieldName", "message": "error description", "severity": "error" }
  ],
  "warnings": [
    { "field": "fieldName", "message": "warning description", "severity": "warning" }
  ],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`,
      temperature: 0.1,
    })

    console.log("[v0] AI validation response:", text)

    // Parse AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid AI response format")
    }

    const validation: ValidationResponse = JSON.parse(jsonMatch[0])

    return Response.json(validation)
  } catch (error) {
    console.error("[v0] Validation error:", error)
    return Response.json(
      {
        error: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
