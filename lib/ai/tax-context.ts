// Tax Context Retrieval System
// Fetches user's complete tax situation for AI context

import type { SupabaseClient } from "@supabase/supabase-js"

export interface TaxContext {
  documents: Array<{
    name: string
    type: string
    extracted_data: any
    uploaded_at: string
  }>
  taxInterview: {
    filing_status?: string
    income?: any
    deductions?: any
    credits?: any
    life_events?: any
  }
  userProfile: {
    full_name?: string
    email?: string
  }
  summary: {
    total_documents: number
    total_income: number
    total_deductions: number
    total_credits: number
    estimated_refund: number
  }
}

export async function getUserTaxContext(supabase: SupabaseClient, userId: string): Promise<TaxContext> {
  console.log("[v0] Fetching tax context for user:", userId)

  // Fetch uploaded documents with extracted data
  const { data: documents } = await supabase
    .from("tax_documents")
    .select("name, document_type, extracted_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  // Fetch tax interview data
  const { data: taxInterview } = await supabase
    .from("tax_interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("full_name, email")
    .eq("id", userId)
    .maybeSingle()

  // Calculate summary statistics
  const totalIncome = calculateTotalIncome(documents, taxInterview)
  const totalDeductions = calculateTotalDeductions(taxInterview)
  const totalCredits = calculateTotalCredits(taxInterview)
  const estimatedRefund = calculateEstimatedRefund(totalIncome, totalDeductions, totalCredits)

  return {
    documents:
      documents?.map((doc) => ({
        name: doc.name,
        type: doc.document_type || "Unknown",
        extracted_data: doc.extracted_data || {},
        uploaded_at: doc.created_at,
      })) || [],
    taxInterview: {
      filing_status: taxInterview?.filing_status,
      income: taxInterview?.income_data,
      deductions: taxInterview?.deductions_data,
      credits: taxInterview?.credits_data,
      life_events: taxInterview?.life_events_data,
    },
    userProfile: {
      full_name: userProfile?.full_name,
      email: userProfile?.email,
    },
    summary: {
      total_documents: documents?.length || 0,
      total_income: totalIncome,
      total_deductions: totalDeductions,
      total_credits: totalCredits,
      estimated_refund: estimatedRefund,
    },
  }
}

function calculateTotalIncome(documents: any[], taxInterview: any): number {
  let total = 0

  // Sum W-2 wages from documents
  documents?.forEach((doc) => {
    if (doc.extracted_data?.wages) {
      total += Number.parseFloat(doc.extracted_data.wages) || 0
    }
  })

  // Add other income from tax interview
  if (taxInterview?.income_data) {
    const income = taxInterview.income_data
    total += Number.parseFloat(income.w2_income || 0)
    total += Number.parseFloat(income.self_employment_income || 0)
    total += Number.parseFloat(income.interest_income || 0)
    total += Number.parseFloat(income.dividend_income || 0)
    total += Number.parseFloat(income.capital_gains || 0)
    total += Number.parseFloat(income.rental_income || 0)
  }

  return total
}

function calculateTotalDeductions(taxInterview: any): number {
  if (!taxInterview?.deductions_data) return 0

  const deductions = taxInterview.deductions_data
  let total = 0

  total += Number.parseFloat(deductions.mortgage_interest || 0)
  total += Number.parseFloat(deductions.charitable_donations || 0)
  total += Number.parseFloat(deductions.state_local_taxes || 0)
  total += Number.parseFloat(deductions.medical_expenses || 0)
  total += Number.parseFloat(deductions.student_loan_interest || 0)

  return total
}

function calculateTotalCredits(taxInterview: any): number {
  if (!taxInterview?.credits_data) return 0

  const credits = taxInterview.credits_data
  let total = 0

  total += Number.parseFloat(credits.child_tax_credit || 0)
  total += Number.parseFloat(credits.education_credits || 0)
  total += Number.parseFloat(credits.earned_income_credit || 0)

  return total
}

function calculateEstimatedRefund(income: number, deductions: number, credits: number): number {
  // Simplified calculation - actual calculation is more complex
  const standardDeduction = 13850 // 2024 single filer
  const effectiveDeduction = Math.max(deductions, standardDeduction)
  const taxableIncome = Math.max(0, income - effectiveDeduction)

  // Simplified tax calculation (2024 brackets)
  let tax = 0
  if (taxableIncome <= 11000) {
    tax = taxableIncome * 0.1
  } else if (taxableIncome <= 44725) {
    tax = 1100 + (taxableIncome - 11000) * 0.12
  } else if (taxableIncome <= 95375) {
    tax = 5147 + (taxableIncome - 44725) * 0.22
  } else {
    tax = 16290 + (taxableIncome - 95375) * 0.24
  }

  // Assume 15% withholding for estimate
  const withheld = income * 0.15

  return withheld - tax + credits
}

export function formatTaxContextForAI(context: TaxContext): string {
  const { documents, taxInterview, userProfile, summary } = context

  let formatted = `# User Tax Context\n\n`

  // User Info
  if (userProfile.full_name) {
    formatted += `**Taxpayer:** ${userProfile.full_name}\n`
  }
  if (taxInterview.filing_status) {
    formatted += `**Filing Status:** ${taxInterview.filing_status}\n`
  }
  formatted += `\n`

  // Summary
  formatted += `## Summary\n`
  formatted += `- Total Documents Uploaded: ${summary.total_documents}\n`
  formatted += `- Total Income: $${summary.total_income.toLocaleString()}\n`
  formatted += `- Total Deductions: $${summary.total_deductions.toLocaleString()}\n`
  formatted += `- Total Credits: $${summary.total_credits.toLocaleString()}\n`
  formatted += `- Estimated Refund: $${summary.estimated_refund.toLocaleString()}\n\n`

  // Documents
  if (documents.length > 0) {
    formatted += `## Uploaded Documents\n`
    documents.forEach((doc, idx) => {
      formatted += `\n### Document ${idx + 1}: ${doc.name}\n`
      formatted += `- Type: ${doc.type}\n`
      formatted += `- Uploaded: ${new Date(doc.uploaded_at).toLocaleDateString()}\n`

      if (doc.extracted_data && Object.keys(doc.extracted_data).length > 0) {
        formatted += `- Extracted Data:\n`
        Object.entries(doc.extracted_data).forEach(([key, value]) => {
          if (value) {
            formatted += `  - ${key}: ${value}\n`
          }
        })
      }
    })
    formatted += `\n`
  }

  // Income Details
  if (taxInterview.income) {
    formatted += `## Income Details\n`
    Object.entries(taxInterview.income).forEach(([key, value]) => {
      if (value && Number.parseFloat(value as string) > 0) {
        formatted += `- ${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: $${Number.parseFloat(
          value as string,
        ).toLocaleString()}\n`
      }
    })
    formatted += `\n`
  }

  // Deductions
  if (taxInterview.deductions) {
    formatted += `## Deductions\n`
    Object.entries(taxInterview.deductions).forEach(([key, value]) => {
      if (value && Number.parseFloat(value as string) > 0) {
        formatted += `- ${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: $${Number.parseFloat(
          value as string,
        ).toLocaleString()}\n`
      }
    })
    formatted += `\n`
  }

  // Credits
  if (taxInterview.credits) {
    formatted += `## Tax Credits\n`
    Object.entries(taxInterview.credits).forEach(([key, value]) => {
      if (value && Number.parseFloat(value as string) > 0) {
        formatted += `- ${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}: $${Number.parseFloat(
          value as string,
        ).toLocaleString()}\n`
      }
    })
    formatted += `\n`
  }

  return formatted
}

// 2024/2025 Tax Knowledge Base
export const TAX_KNOWLEDGE_BASE = `
# 2024/2025 Tax Knowledge Base

## Standard Deductions (2024)
- Single: $13,850
- Married Filing Jointly: $27,700
- Head of Household: $20,800
- Married Filing Separately: $13,850

## Tax Brackets (2024)
### Single Filers
- 10%: $0 to $11,000
- 12%: $11,001 to $44,725
- 22%: $44,726 to $95,375
- 24%: $95,376 to $182,100
- 32%: $182,101 to $231,250
- 35%: $231,251 to $578,125
- 37%: $578,126 or more

### Married Filing Jointly
- 10%: $0 to $22,000
- 12%: $22,001 to $89,075
- 22%: $89,076 to $190,750
- 24%: $190,751 to $364,200
- 32%: $364,201 to $462,500
- 35%: $462,501 to $693,750
- 37%: $693,751 or more

## Key Tax Credits (2024)
- **Child Tax Credit**: Up to $2,000 per qualifying child under 17
- **Earned Income Tax Credit (EITC)**: Up to $7,430 (3+ children), income limits apply
- **American Opportunity Credit**: Up to $2,500 per student for first 4 years of college
- **Lifetime Learning Credit**: Up to $2,000 per tax return for education expenses
- **Child and Dependent Care Credit**: Up to $3,000 (1 dependent) or $6,000 (2+ dependents)

## Common Deductions
- **Student Loan Interest**: Up to $2,500 deduction
- **IRA Contributions**: Up to $6,500 ($7,500 if 50+)
- **HSA Contributions**: $3,850 (individual), $7,750 (family)
- **Charitable Donations**: Must itemize, limited to 60% of AGI for cash
- **State and Local Taxes (SALT)**: Limited to $10,000
- **Mortgage Interest**: On loans up to $750,000

## Important Deadlines (2025)
- **April 15, 2025**: Tax filing deadline for 2024 returns
- **October 15, 2025**: Extended filing deadline (if extension filed)
- **January 15, 2025**: Q4 2024 estimated tax payment
- **April 15, 2025**: Q1 2025 estimated tax payment

## Audit Red Flags
- Income significantly higher or lower than previous years
- Large charitable deductions relative to income
- Home office deductions
- Cash-intensive businesses
- Claiming 100% business use of vehicle
- Math errors or missing information
- Unreported income (IRS receives W-2s and 1099s)

## IRS Compliance Rules
- All income must be reported (W-2, 1099, self-employment, etc.)
- Deductions must be substantiated with receipts/documentation
- Business expenses must be "ordinary and necessary"
- Home office must be used "regularly and exclusively" for business
- Mileage logs required for vehicle deductions
- Charitable donations require receipts for amounts over $250
`
