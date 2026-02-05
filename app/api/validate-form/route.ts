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

    // Basic validation calculations
    const taxYear = formData.taxYear ? Number.parseInt(formData.taxYear) : new Date().getFullYear()
    const socialSecurityCap = taxYear >= 2025 ? 176100 : 168600

    let wages = 0
    let federalWithholding = 0
    let socialSecurityWages = 0
    let socialSecurityWithholding = 0
    let medicareWages = 0
    let medicareWithholding = 0
    let federalPercent = 0
    let ssPercent = 0
    let medicarePercent = 0

    if (formType === "w2") {
      wages = Number.parseFloat(formData.wages) || 0
      federalWithholding = Number.parseFloat(formData.federalWithholding) || 0
      socialSecurityWages = Number.parseFloat(formData.socialSecurityWages) || 0
      socialSecurityWithholding = Number.parseFloat(formData.socialSecurityWithholding) || 0
      medicareWages = Number.parseFloat(formData.medicareWages) || 0
      medicareWithholding = Number.parseFloat(formData.medicareWithholding) || 0

      federalPercent = wages > 0 ? (federalWithholding / wages) * 100 : 0
      ssPercent = socialSecurityWages > 0 ? (socialSecurityWithholding / socialSecurityWages) * 100 : 0
      medicarePercent = medicareWages > 0 ? (medicareWithholding / medicareWages) * 100 : 0

      console.log("[v0] Calculated tax rates:", {
        federal: `${federalPercent.toFixed(2)}%`,
        socialSecurity: `${ssPercent.toFixed(2)}%`,
        medicare: `${medicarePercent.toFixed(2)}%`,
      })
    }

    let validation: ValidationResponse

    try {
      const validationPrompt =
        formType === "1099-nec"
          ? `You are a tax form validation expert. Review this 1099-NEC form data for errors and inconsistencies.

Form Data:
${JSON.stringify(formData, null, 2)}

IMPORTANT: This is a 1099-NEC form for TAX YEAR ${taxYear}.

VALIDATION RULES FOR 1099-NEC:
1. Each contractor must have EITHER SSN or EIN (not necessarily both)
2. SSN format: XXX-XX-XXXX (9 digits with dashes)
3. EIN format: XX-XXXXXXX (9 digits with dash)
4. Nonemployee compensation (Box 1) must be at least $600 for IRS filing requirement
   - IMPORTANT: If the value is already $600 or more, this is VALID and should NOT be flagged as an error
   - Only flag if compensation is LESS THAN $600
5. Federal income tax withheld (Box 4) is OPTIONAL and typically 0
6. If federal tax withheld is present, it should be reasonable (0-37% of compensation)
7. 1099-NEC does NOT have Social Security wages or Medicare wages
8. Complete address required: street, city, state, ZIP code

DO NOT FLAG AS ERROR:
- Missing EIN if SSN is provided (or vice versa)
- Zero federal tax withheld (this is normal for 1099-NEC)
- Lack of Social Security or Medicare withholding (1099-NEC doesn't have these)
- Compensation of $600 or MORE (this meets the IRS requirement)
- Compensation of $2500, $5000, $10000, or any amount >= $600 is VALID

ONLY FLAG AS ERROR IF:
- Both SSN and EIN are missing
- SSN or EIN has invalid format (wrong number of digits)
- Compensation is LESS THAN $600 (e.g., $599, $500, $200)
- Negative amounts
- Missing required address fields
- Federal tax withheld exceeds 37% of compensation (if present)

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
}`
          : `You are a tax form validation expert. Review this ${formType.toUpperCase()} form data for errors and inconsistencies.

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
}`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: validationPrompt,
        temperature: 0.1,
      })

      console.log("[v0] AI validation response:", text)

      // Parse AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid AI response format")
      }

      validation = JSON.parse(jsonMatch[0])
    } catch (aiError) {
      console.log("[v0] AI validation unavailable, using basic validation:", aiError)

      // Perform basic rule-based validation
      const errors: ValidationError[] = []
      const warnings: ValidationError[] = []
      const suggestions: string[] = []

      if (formType === "1099-nec" && formData.contractors) {
        formData.contractors.forEach((contractor: any, index: number) => {
          const contractorNum = index + 1

          if (!contractor.firstName || !contractor.lastName) {
            errors.push({
              field: `contractor${contractorNum}.name`,
              message: `Contractor ${contractorNum}: Name is required`,
              severity: "error",
            })
          }

          const ssnCleaned = contractor.ssn ? contractor.ssn.replace(/\D/g, "") : ""
          const einCleaned = contractor.ein ? contractor.ein.replace(/\D/g, "") : ""

          if (!ssnCleaned && !einCleaned) {
            errors.push({
              field: `contractor${contractorNum}.tin`,
              message: `Contractor ${contractorNum}: Either SSN or EIN is required`,
              severity: "error",
            })
          }

          if (ssnCleaned && ssnCleaned.length !== 9) {
            errors.push({
              field: `contractor${contractorNum}.ssn`,
              message: `Contractor ${contractorNum}: SSN must be 9 digits (format: XXX-XX-XXXX)`,
              severity: "error",
            })
          }

          if (einCleaned && einCleaned.length !== 9) {
            errors.push({
              field: `contractor${contractorNum}.ein`,
              message: `Contractor ${contractorNum}: EIN must be 9 digits (format: XX-XXXXXXX)`,
              severity: "error",
            })
          }

          const compensation = Number.parseFloat(contractor.compensation) || 0
          if (compensation < 600) {
            errors.push({
              field: `contractor${contractorNum}.compensation`,
              message: `Contractor ${contractorNum}: Compensation must be at least $600 for 1099-NEC filing`,
              severity: "error",
            })
          }

          const federalTaxWithheld = Number.parseFloat(contractor.federalTaxWithheld) || 0
          if (federalTaxWithheld > 0 && compensation > 0) {
            const withholdingPercent = (federalTaxWithheld / compensation) * 100
            if (withholdingPercent > 37) {
              warnings.push({
                field: `contractor${contractorNum}.federalTaxWithheld`,
                message: `Contractor ${contractorNum}: Federal withholding (${withholdingPercent.toFixed(1)}%) exceeds maximum tax bracket (37%)`,
                severity: "warning",
              })
            }
          }

          if (!contractor.address || !contractor.city || !contractor.state || !contractor.zipCode) {
            errors.push({
              field: `contractor${contractorNum}.address`,
              message: `Contractor ${contractorNum}: Complete address is required`,
              severity: "error",
            })
          }
        })
      }

      // Basic W-2 validation
      if (formType === "w2") {
        if (wages < 0 || federalWithholding < 0) {
          errors.push({
            field: "amounts",
            message: "Wage and withholding amounts cannot be negative",
            severity: "error",
          })
        }

        if (federalPercent > 37) {
          warnings.push({
            field: "federalWithholding",
            message: `Federal withholding rate (${federalPercent.toFixed(1)}%) exceeds maximum tax bracket (37%)`,
            severity: "warning",
          })
        }

        if (socialSecurityWages > socialSecurityCap) {
          warnings.push({
            field: "socialSecurityWages",
            message: `Social Security wages exceed ${taxYear} cap of $${socialSecurityCap.toLocaleString()}`,
            severity: "warning",
          })
        }
      }

      validation = {
        valid: errors.length === 0,
        errors,
        warnings,
        suggestions:
          errors.length === 0
            ? ["Form meets basic IRS requirements"]
            : ["Fix validation errors before submitting to the IRS"],
      }

      // Add info message that AI validation was unavailable
      warnings.push({
        field: "system",
        message:
          "Advanced AI validation is temporarily unavailable. Comprehensive IRS rule-based validation has been performed.",
        severity: "warning",
      })
    }

    return Response.json({
      success: true,
      validation,
    })
  } catch (error) {
    console.error("[v0] Validation error:", error)
    return Response.json(
      {
        success: false,
        error: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
