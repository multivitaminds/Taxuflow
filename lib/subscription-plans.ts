export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  priceId: string | null
  interval: "month" | "year" | "one-time" | null
  category: "individual" | "business"
  features: string[]
  description: string
  popular?: boolean
  comparePrice?: number // TurboTax comparison price
  savings?: string
}

// Add-ons available for all plans
export interface AddOn {
  id: string
  name: string
  price: number
  priceId: string
  description: string
  turbotaxPrice?: number
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // ===================================================================
  // INDIVIDUAL TAX FILERS
  // ===================================================================
  {
    id: "basic-w2",
    name: "Basic / Simple (W-2 Only)",
    price: 49,
    priceId: "price_basic_w2_49",
    interval: "one-time",
    category: "individual",
    description: "W-2 filing with AI error checking",
    comparePrice: 89,
    savings: "Save $40 vs TurboTax Deluxe",
    features: [
      "W-2 filing and import",
      "AI-powered error checking",
      "Federal e-file included",
      "Standard deduction",
      "Refund tracking",
      "Email support",
      "IRS accuracy guarantee",
    ],
  },
  {
    id: "plus-families",
    name: "Plus (Families, Homeowners, Investors)",
    price: 99,
    priceId: "price_plus_99",
    interval: "one-time",
    category: "individual",
    description: "For complex returns with deductions and investments",
    popular: true,
    comparePrice: 149,
    savings: "Save $50 vs TurboTax Premier",
    features: [
      "Everything in Basic",
      "Itemized deductions",
      "Mortgage interest deduction",
      "Multiple W-2s and 1099s",
      "Investment income (stocks, crypto)",
      "Dependent management",
      "Child tax credits",
      "State filing included",
      "Priority email support",
      "Audit risk assessment",
    ],
  },
  {
    id: "self-employed",
    name: "Self-Employed / Gig Worker",
    price: 179,
    priceId: "price_self_employed_179",
    interval: "one-time",
    category: "individual",
    description: "1099 filing with AI bookkeeping and write-offs",
    comparePrice: 249,
    savings: "Save $70 vs TurboTax Self-Employed",
    features: [
      "Everything in Plus",
      "Schedule C filing",
      "1099-NEC and 1099-K filing",
      "AI-powered expense tracking",
      "Business write-offs maximizer",
      "Mileage tracking and logging",
      "Home office deduction",
      "Quarterly tax estimates",
      "Self-employment tax optimization",
      "AI bookkeeping assistant",
      "Unlimited tax questions",
    ],
  },
  {
    id: "cpa-assisted",
    name: "Full CPA Assisted (Live Help)",
    price: 299,
    priceId: "price_cpa_assisted_299",
    interval: "one-time",
    category: "individual",
    description: "CPA review with audit protection and unlimited support",
    comparePrice: 499,
    savings: "Save $200 vs TurboTax Live Full Service",
    features: [
      "Everything in Self-Employed",
      "Dedicated CPA review",
      "Unlimited tax expert consultations",
      "Phone and video support",
      "Audit defense and representation",
      "IRS correspondence handling",
      "Year-round tax planning",
      "Priority filing (24-hour turnaround)",
      "Tax strategy consultation",
      "Peace of mind guarantee",
    ],
  },

  // ===================================================================
  // BUSINESS FILERS
  // ===================================================================
  {
    id: "business-basic",
    name: "Business Basic (Single-Member LLC)",
    price: 399,
    priceId: "price_business_basic_399",
    interval: "one-time",
    category: "business",
    description: "Schedule C and LLC filing with AI bookkeeping",
    comparePrice: 650,
    savings: "Save $251 vs traditional CPA",
    features: [
      "Schedule C filing",
      "Single-member LLC support",
      "1099 contractor management",
      "AI bookkeeping guidance",
      "Quarterly estimated taxes",
      "Expense categorization",
      "Profit & loss statements",
      "State business filing",
      "Business deduction maximizer",
    ],
  },
  {
    id: "business-pro",
    name: "Business Pro (S-Corp, Partnership)",
    price: 799,
    priceId: "price_business_pro_799",
    interval: "one-time",
    category: "business",
    description: "S-Corp, Partnership with payroll and AI cleanup",
    comparePrice: 1500,
    savings: "Save $701 vs traditional CPA",
    features: [
      "Everything in Business Basic",
      "Form 1120S (S-Corp filing)",
      "Form 1065 (Partnership filing)",
      "K-1 generation for partners",
      "Payroll tax filing (Form 941)",
      "W-2 and 1099 bulk filing",
      "AI bookkeeping cleanup",
      "QuickBooks integration",
      "Monthly financial close assistance",
      "Multi-state nexus analysis",
      "Dedicated business advisor",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise (Multi-State, Complex)",
    price: 1499,
    priceId: "price_enterprise_1499",
    interval: "one-time",
    category: "business",
    description: "Corporate filings with dedicated support",
    comparePrice: 5000,
    savings: "Save $3,501 vs traditional CPA firm",
    features: [
      "Everything in Business Pro",
      "Form 1120 (C-Corp filing)",
      "Multi-state tax compliance",
      "Sales tax nexus analysis",
      "International tax considerations",
      "R&D tax credit analysis",
      "Corporate structure optimization",
      "Monthly bookkeeping service",
      "Dedicated CFO-level advisor",
      "24/7 priority support",
      "Custom integrations",
      "White-glove onboarding",
    ],
  },
]

export const ADD_ONS: AddOn[] = [
  {
    id: "state-return",
    name: "State Return",
    price: 35,
    priceId: "addon_state_35",
    description: "Additional state tax return filing",
    turbotaxPrice: 60,
  },
  {
    id: "audit-defense",
    name: "Audit Defense",
    price: 89,
    priceId: "addon_audit_89",
    description: "Full IRS audit representation and support",
    turbotaxPrice: 150,
  },
  {
    id: "crypto-import",
    name: "Crypto Tax Import",
    price: 49,
    priceId: "addon_crypto_49",
    description: "Import and calculate crypto gains/losses",
    turbotaxPrice: 99,
  },
  {
    id: "prior-year",
    name: "Prior Year Return",
    price: 49,
    priceId: "addon_prior_year_49",
    description: "File an amended or prior year tax return",
    turbotaxPrice: 99,
  },
  {
    id: "estimated-tax",
    name: "Estimated Tax Setup",
    price: 79,
    priceId: "addon_estimated_79",
    description: "Quarterly estimated tax calculation and reminders",
  },
  {
    id: "bookkeeping-cleanup",
    name: "Bookkeeping Cleanup",
    price: 150,
    priceId: "addon_bookkeeping_monthly_150",
    description: "Monthly AI-powered bookkeeping cleanup service",
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}

export function getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.priceId === priceId)
}

export function getAddOnById(addOnId: string): AddOn | undefined {
  return ADD_ONS.find((addon) => addon.id === addOnId)
}

export function getIndividualPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS.filter((plan) => plan.category === "individual")
}

export function getBusinessPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS.filter((plan) => plan.category === "business")
}
