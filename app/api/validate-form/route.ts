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

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a tax form validation expert. Review this ${formType.toUpperCase()} form data for errors and inconsistencies.

Form Data:
${JSON.stringify(formData, null, 2)}

Check for:
1. Math errors (e.g., Box 2 federal tax withheld should not exceed Box 1 wages)
2. Format issues (SSN should be XXX-XX-XXXX, EIN should be XX-XXXXXXX)
3. Missing required fields
4. Inconsistencies (e.g., state tax without state wages)
5. Common mistakes (e.g., Box 3 Social Security wages capped at $168,600 for 2024)
6. Audit risk factors

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
      temperature: 0.3,
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
