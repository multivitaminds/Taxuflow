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
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // Individual Plans
  {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    interval: null,
    category: "individual",
    description: "Perfect for simple W-2 returns",
    features: [
      "W-2 income filing",
      "Standard deduction",
      "Federal e-file included",
      "AI chat support",
      "Refund tracking",
      "Basic audit protection",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 29,
    priceId: "price_premium_29",
    interval: "one-time",
    category: "individual",
    description: "For complex returns with deductions",
    popular: true,
    features: [
      "Everything in Free",
      "State filing included",
      "Itemized deductions",
      "Multiple income sources",
      "Investment income (1099-DIV, 1099-INT)",
      "Dependent management",
      "Home office deduction",
      "Unlimited amendments",
      "Priority support",
    ],
  },
  {
    id: "ai-copilot",
    name: "AI Co-Pilot",
    price: 5,
    priceId: "price_copilot_5_monthly",
    interval: "month",
    category: "individual",
    description: "Year-round tax assistant",
    features: [
      "Everything in Premium",
      "24/7 AI tax advisor",
      "Receipt scanning & tracking",
      "Quarterly tax estimates",
      "Tax planning calendar",
      "Expense categorization",
      "Real-time tax law updates",
      "Unlimited tax questions",
    ],
  },
  // Business Plans
  {
    id: "business-filing",
    name: "Business Filing",
    price: 10,
    priceId: "price_business_10_monthly",
    interval: "month",
    category: "business",
    description: "For freelancers and sole proprietors",
    features: [
      "Schedule C filing",
      "1099 management",
      "Quarterly estimates",
      "Expense tracking",
      "Mileage logging",
      "Self-employment tax optimization",
    ],
  },
  {
    id: "audit-shield-pro",
    name: "Audit Shield Pro",
    price: 49,
    priceId: "price_audit_49_yearly",
    interval: "year",
    category: "business",
    description: "Complete audit protection",
    features: [
      "Full audit representation",
      "IRS correspondence handling",
      "Tax professional support",
      "Document preparation",
      "Penalty abatement assistance",
      "Peace of mind guarantee",
    ],
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}

export function getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.priceId === priceId)
}
