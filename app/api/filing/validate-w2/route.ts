import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"

const validationSchema = z.object({
  valid: z.boolean(),
  errors: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
      severity: z.enum(["critical", "error"]),
    }),
  ),
  warnings: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
      severity: z.enum(["warning", "info"]),
    }),
  ),
  suggestions: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
      type: z.enum(["optimization", "best-practice", "tip"]),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] ========================================")
    console.log("[v0] AI W-2 VALIDATION REQUEST RECEIVED")
    console.log("[v0] ========================================")

    const formData = await request.json()

    console.log("[v0] Form data received:", {
      employer: formData.employerName,
      employee: `${formData.employeeFirstName} ${formData.employeeLastName}`,
      wages: formData.wages,
      federalWithholding: formData.federalWithholding,
      socialSecurityWages: formData.socialSecurityWages,
      taxYear: formData.taxYear,
      filingType: formData.filingType,
    })

    // Basic validation checks before AI validation
    const errors: any[] = []
    const warnings: any[] = []
    const suggestions: any[] = []

    // Basic field validation
    if (!formData.employerName) {
      errors.push({
        field: "employerName",
        message: "Employer name is required for IRS filing",
        severity: "critical",
      })
    }

    if (!formData.employerEIN) {
      errors.push({
        field: "employerEIN",
        message: "Employer EIN is required for IRS filing",
        severity: "critical",
      })
    } else if (!/^\d{2}-\d{7}$/.test(formData.employerEIN)) {
      errors.push({
        field: "employerEIN",
        message: "EIN must be in format XX-XXXXXXX (e.g., 12-3456789)",
        severity: "error",
      })
    }

    if (!formData.employeeFirstName || !formData.employeeLastName) {
      errors.push({
        field: "employeeName",
        message: "Employee first and last name are required",
        severity: "critical",
      })
    }

    if (!formData.employeeSSN) {
      errors.push({
        field: "employeeSSN",
        message: "Employee SSN is required for IRS filing",
        severity: "critical",
      })
    } else if (!/^\d{3}-\d{2}-\d{4}$/.test(formData.employeeSSN)) {
      errors.push({
        field: "employeeSSN",
        message: "SSN must be in format XXX-XX-XXXX (e.g., 123-45-6789)",
        severity: "error",
      })
    }

    if (!formData.wages || Number.parseFloat(formData.wages) <= 0) {
      errors.push({
        field: "wages",
        message: "Wages must be greater than $0",
        severity: "critical",
      })
    }

    // If critical errors exist, return early
    if (errors.some((e) => e.severity === "critical")) {
      console.log("[v0] Critical validation errors found, returning early")
      return NextResponse.json({
        valid: false,
        errors,
        warnings,
        suggestions,
      })
    }

    console.log("[v0] Basic validation passed, calling AI validation...")

    let validation: any

    try {
      const result = await generateObject({
        model: "openai/gpt-4o",
        schema: validationSchema,
        messages: [
          {
            role: "system",
            content: `You are an expert IRS tax form validator. You MUST respond in valid JSON format matching this exact structure:

{
  "valid": boolean,
  "errors": [{ "field": "string", "message": "string", "severity": "critical" | "error" }],
  "warnings": [{ "field": "string", "message": "string", "severity": "warning" | "info" }],
  "suggestions": [{ "field": "string", "message": "string", "type": "optimization" | "best-practice" | "tip" }]
}

Analyze the W-2 form data and identify:

1. ERRORS: Critical issues that will cause IRS rejection (invalid formats, impossible values, math errors)
   - Use severity "critical" for must-fix issues, "error" for important issues
2. WARNINGS: Issues that may cause problems (unusual values, missing recommended fields)
   - Use severity "warning" for important notices, "info" for FYI items
3. SUGGESTIONS: Optimizations and best practices
   - Use type "optimization" for efficiency, "best-practice" for IRS guidelines, "tip" for helpful hints

IRS W-2 Rules:
- EIN format: XX-XXXXXXX (9 digits with hyphen after 2nd digit)
- SSN format: XXX-XX-XXXX (9 digits with hyphens)
- Social Security tax rate: 6.2% of wages up to $168,600 (2024)
- Medicare tax rate: 1.45% of all wages (+ 0.9% additional for high earners)
- Federal withholding: Cannot exceed total wages
- Box 3 (SS wages) usually equals Box 1 (wages) unless over SS wage base
- Box 5 (Medicare wages) usually equals Box 1 (wages)
- State wages typically equal federal wages unless state-specific rules apply

IMPORTANT: Always return valid JSON. If there are no issues in a category, return an empty array for that category.`,
          },
          {
            role: "user",
            content: JSON.stringify({
              formData,
              context: {
                currentYear: new Date().getFullYear(),
                filingType: formData.filingType,
                taxYear: formData.taxYear,
              },
            }),
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent structured output
        abortSignal: AbortSignal.timeout(20000), // 20 second timeout
      })

      validation = result.object
    } catch (aiError) {
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError)
      console.log("[v0] AI validation failed:", errorMessage)

      if (errorMessage.includes("No object generated") || errorMessage.includes("schema")) {
        console.log("[v0] AI response schema mismatch, using basic validation only")

        return NextResponse.json({
          valid: errors.length === 0,
          errors,
          warnings: [
            ...warnings,
            {
              field: "system",
              message:
                "Advanced AI validation experienced a temporary issue. Basic validation has been performed successfully.",
              severity: "info",
            },
          ],
          suggestions,
        })
      }

      if (
        errorMessage.includes("Gateway") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout")
      ) {
        console.log("[v0] AI service unavailable, using basic validation only")

        return NextResponse.json({
          valid: errors.length === 0,
          errors,
          warnings: [
            ...warnings,
            {
              field: "system",
              message: "Advanced AI validation is temporarily unavailable. Basic validation has been performed.",
              severity: "info",
            },
          ],
          suggestions,
        })
      }

      // Re-throw other types of errors
      throw aiError
    }

    // Merge basic validation errors with AI validation
    const finalValidation = {
      valid: validation.valid && errors.length === 0,
      errors: [...errors, ...validation.errors],
      warnings: [...warnings, ...validation.warnings],
      suggestions: [...suggestions, ...validation.suggestions],
    }

    console.log("[v0] ========================================")
    console.log("[v0] AI VALIDATION COMPLETED")
    console.log("[v0] ========================================")
    console.log("[v0] Results:", {
      valid: finalValidation.valid,
      errorCount: finalValidation.errors.length,
      warningCount: finalValidation.warnings.length,
      suggestionCount: finalValidation.suggestions.length,
    })

    return NextResponse.json(finalValidation)
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] AI VALIDATION ERROR")
    console.error("[v0] ========================================")
    console.error("[v0] Error:", error)
    console.error("[v0] Stack:", error.stack)

    return NextResponse.json(
      {
        valid: false,
        errors: [],
        warnings: [
          {
            field: "system",
            message: "AI validation service unavailable. Please proceed with caution and verify all fields carefully.",
            severity: "warning",
          },
        ],
        suggestions: [],
      },
      { status: 200 },
    )
  }
}
