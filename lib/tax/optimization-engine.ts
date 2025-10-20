import { createServerClient } from "@/lib/supabase/server"

export interface TaxOptimization {
  category: string
  title: string
  description: string
  potentialSavings: number
  confidence: "high" | "medium" | "low"
  actionItems: string[]
  deadline?: string
}

/**
 * AI-powered tax optimization engine
 * Analyzes user's financial data and suggests tax-saving strategies
 */
export async function analyzeTaxOptimizations(userId: string): Promise<TaxOptimization[]> {
  const supabase = await createServerClient()
  const optimizations: TaxOptimization[] = []

  // Get user's W-2 data
  const { data: w2Data } = await supabase
    .from("w2_data")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get user's expenses
  const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", userId)

  // Get user's deductions
  const { data: deductions } = await supabase.from("deductions").select("*").eq("user_id", userId)

  if (w2Data) {
    const wages = Number.parseFloat(w2Data.wages || "0")

    // 1. Retirement Contribution Optimization
    const currentRetirement = Number.parseFloat(w2Data.retirement_plan_contributions || "0")
    const maxContribution = 23000 // 2024 401(k) limit
    const remainingSpace = maxContribution - currentRetirement

    if (remainingSpace > 0) {
      optimizations.push({
        category: "Retirement",
        title: "Maximize 401(k) Contributions",
        description: `You have $${remainingSpace.toLocaleString()} remaining in your 401(k) contribution limit. Maxing out reduces your taxable income.`,
        potentialSavings: remainingSpace * 0.22, // Assuming 22% tax bracket
        confidence: "high",
        actionItems: [
          "Contact your HR department to increase 401(k) contributions",
          "Consider catch-up contributions if you're 50 or older ($7,500 additional)",
          "Review your investment allocation",
        ],
        deadline: "December 31, 2024",
      })
    }

    // 2. HSA Optimization
    if (wages > 50000) {
      optimizations.push({
        category: "Health Savings",
        title: "Open a Health Savings Account (HSA)",
        description:
          "HSAs offer triple tax benefits: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.",
        potentialSavings: 4150 * 0.22, // Individual limit * tax rate
        confidence: "high",
        actionItems: [
          "Verify you have a high-deductible health plan (HDHP)",
          "Open an HSA account",
          "Contribute up to $4,150 (individual) or $8,300 (family)",
          "Save receipts for future tax-free reimbursements",
        ],
        deadline: "April 15, 2025",
      })
    }

    // 3. Home Office Deduction
    const homeOfficeExpenses =
      expenses?.filter(
        (e) => e.category?.toLowerCase().includes("office") || e.category?.toLowerCase().includes("home"),
      ) || []

    if (homeOfficeExpenses.length === 0 && wages > 40000) {
      optimizations.push({
        category: "Business Expenses",
        title: "Track Home Office Expenses",
        description:
          "If you work from home, you may qualify for home office deductions including rent, utilities, internet, and equipment.",
        potentialSavings: 1500,
        confidence: "medium",
        actionItems: [
          "Measure your dedicated office space",
          "Calculate percentage of home used for business",
          "Track utilities, rent/mortgage, insurance, and repairs",
          "Keep receipts for office equipment and supplies",
        ],
      })
    }

    // 4. Charitable Contributions
    const charitableDeductions = deductions?.filter((d) => d.category?.toLowerCase().includes("charitable")) || []

    if (charitableDeductions.length === 0 && wages > 75000) {
      optimizations.push({
        category: "Charitable Giving",
        title: "Maximize Charitable Deductions",
        description: "Strategic charitable giving can reduce your tax burden while supporting causes you care about.",
        potentialSavings: 2000,
        confidence: "medium",
        actionItems: [
          "Donate appreciated stocks instead of cash (avoid capital gains)",
          "Bunch donations into one year to exceed standard deduction",
          "Consider a donor-advised fund for larger contributions",
          "Get written acknowledgment for donations over $250",
        ],
        deadline: "December 31, 2024",
      })
    }

    // 5. Tax Loss Harvesting
    if (wages > 100000) {
      optimizations.push({
        category: "Investment Strategy",
        title: "Tax Loss Harvesting",
        description:
          "Sell investments at a loss to offset capital gains and reduce taxable income by up to $3,000 per year.",
        potentialSavings: 3000 * 0.24,
        confidence: "medium",
        actionItems: [
          "Review your investment portfolio for unrealized losses",
          "Sell losing positions before year-end",
          "Reinvest in similar (but not identical) securities",
          "Avoid wash sale rules (30-day waiting period)",
        ],
        deadline: "December 31, 2024",
      })
    }

    // 6. Education Credits
    optimizations.push({
      category: "Education",
      title: "Claim Education Tax Credits",
      description:
        "American Opportunity Credit (up to $2,500) or Lifetime Learning Credit (up to $2,000) for qualified education expenses.",
      potentialSavings: 2500,
      confidence: "low",
      actionItems: [
        "Gather Form 1098-T from educational institutions",
        "Calculate qualified education expenses",
        "Determine eligibility based on income limits",
        "Choose between AOTC and LLC (can't claim both)",
      ],
    })

    // 7. Energy Efficiency Credits
    optimizations.push({
      category: "Home Improvements",
      title: "Energy Efficiency Tax Credits",
      description:
        "30% tax credit for solar panels, heat pumps, and other energy-efficient home improvements (up to $3,200 annually).",
      potentialSavings: 3200,
      confidence: "low",
      actionItems: [
        "Review eligible energy-efficient improvements",
        "Get quotes from certified installers",
        "Keep receipts and manufacturer certifications",
        "File Form 5695 with your tax return",
      ],
    })
  }

  // Sort by potential savings (highest first)
  return optimizations.sort((a, b) => b.potentialSavings - a.potentialSavings)
}
