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

    // Use AI to validate the W-2 form
    const { object: validation } = await generateObject({
      model: "openai/gpt-4o",
      schema: validationSchema,
      messages: [
        {
          role: "system",
          content: `You are an expert IRS tax form validator. Analyze the W-2 form data and identify:

1. ERRORS: Critical issues that will cause IRS rejection (invalid formats, impossible values, math errors)
2. WARNINGS: Issues that may cause problems (unusual values, missing recommended fields)
3. SUGGESTIONS: Optimizations and best practices

IRS W-2 Rules:
- EIN format: XX-XXXXXXX (9 digits with hyphen after 2nd digit)
- SSN format: XXX-XX-XXXX (9 digits with hyphens)
- Social Security tax rate: 6.2% of wages up to $168,600 (2024)
- Medicare tax rate: 1.45% of all wages (+ 0.9% additional for high earners)
- Federal withholding: Cannot exceed total wages
- Box 3 (SS wages) usually equals Box 1 (wages) unless over SS wage base
- Box 5 (Medicare wages) usually equals Box 1 (wages)
- State wages typically equal federal wages unless state-specific rules apply

Check for:
- Missing required fields
- Invalid formats (EIN, SSN, addresses)
- Math inconsistencies (withholding rates, wage calculations)
- Year-specific limits and thresholds
- Common mistakes (wrong box values, transposed numbers)`,
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
    })

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
        errors: [
          {
            field: "system",
            message: `AI validation service error: ${error.message}`,
            severity: "critical",
          },
        ],
        warnings: [],
        suggestions: [],
      },
      { status: 500 },
    )
  }
}
