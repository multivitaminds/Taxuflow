import { NextResponse } from "next/server"
import { generateText } from "ai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("[v0] ========================================")
    console.log("[v0] AI 1099-NEC VALIDATION REQUEST RECEIVED")
    console.log("[v0] ========================================")

    const body = await request.json()
    const { contractors, taxYear, businessInfo } = body

    console.log("[v0] Validating", contractors?.length, "contractors for tax year", taxYear)

    if (!contractors || contractors.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No contractors provided for validation",
      })
    }

    const validationPrompt = `You are a tax form validation expert. Review these 1099-NEC forms for errors and inconsistencies.

IMPORTANT: This is a 1099-NEC form for TAX YEAR ${taxYear}.

VALIDATION RULES FOR 1099-NEC:
1. Minimum compensation: $600 (if less, 1099 filing is optional but data can still be valid)
2. Valid SSN or EIN format required for each contractor
3. Complete payer (business) information required
4. Complete recipient (contractor) information required
5. Federal tax withheld can be $0 (backup withholding is optional)
6. 1099-NEC does NOT have Social Security wages or Medicare wages
7. State information is optional but if provided must be complete

DO NOT flag as errors:
- Zero federal tax withheld (this is normal for 1099-NEC)
- Lack of Social Security or Medicare withholding (1099-NEC doesn't have these)
- Compensation under $600 (optional filing threshold, but data is still valid)

Business Information:
${JSON.stringify(businessInfo, null, 2)}

Contractors (${contractors.length}):
${JSON.stringify(contractors, null, 2)}

Provide validation results as JSON with:
{
  "hasErrors": boolean,
  "hasCriticalErrors": boolean,
  "hasWarnings": boolean,
  "errors": [{ "field": string, "message": string, "contractorIndex": number }],
  "warnings": [{ "field": string, "message": string, "contractorIndex": number }],
  "suggestions": [string],
  "overallAssessment": string
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: validationPrompt,
    })

    console.log("[v0] AI validation response received")

    let validation
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        validation = JSON.parse(jsonMatch[0])
      } else {
        validation = JSON.parse(text)
      }
    } catch {
      console.error("[v0] Failed to parse AI validation response")
      validation = {
        hasErrors: false,
        hasCriticalErrors: false,
        hasWarnings: false,
        errors: [],
        warnings: [],
        suggestions: ["AI validation completed but response format was unexpected. Please review manually."],
        overallAssessment: "Validation completed with unknown result",
      }
    }

    console.log("[v0] Validation complete:")
    console.log("[v0] - Has Errors:", validation.hasErrors)
    console.log("[v0] - Has Critical Errors:", validation.hasCriticalErrors)
    console.log("[v0] - Has Warnings:", validation.hasWarnings)

    return NextResponse.json({
      success: true,
      validation,
    })
  } catch (error: any) {
    console.error("[v0] 1099-NEC validation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: error?.message,
      },
      { status: 500 },
    )
  }
}
