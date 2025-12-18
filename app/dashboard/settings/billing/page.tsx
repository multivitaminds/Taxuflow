"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "individual",
    name: "Individual",
    price: 29,
    description: "Perfect for freelancers and sole proprietors",
    features: [
      "Up to 3 tax returns per year",
      "Basic income & expense tracking",
      "1099 form generation",
      "Standard support",
      "Mobile app access",
    ],
    limitations: ["No business entity support", "Limited integrations", "No API access"],
  },
  {
    id: "business",
    name: "Business",
    price: 129,
    description: "Built for growing businesses and companies",
    popular: true,
    features: [
      "Unlimited tax returns",
      "Multi-entity support (LLC, S-Corp, C-Corp)",
      "Advanced expense categorization",
      "Quarterly estimated tax calculations",
      "Team collaboration (up to 10 users)",
      "Priority support",
      "Bank & credit card integrations",
      "Custom reporting",
      "Payroll integration",
    ],
    limitations: ["No API access", "Standard webhook limits"],
  },
  {
    id: "developer",
    name: "Developer",
    price: 249,
    description: "For platforms building tax solutions",
    features: [
      "Everything in Business, plus:",
      "Full REST API access",
      "Unlimited API calls",
      "Custom webhooks",
      "White-label options",
      "Dedicated account manager",
      "99.9% SLA guarantee",
      "Advanced security features",
      "Custom integrations",
    ],
    limitations: [],
  },
]

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const [currentPlan] = useState("business")

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Plan & Billing</h1>
        <p className="text-slate-600 mt-2">Choose the perfect plan for your tax needs</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", billingCycle === "monthly" ? "text-slate-900" : "text-slate-500")}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            billingCycle === "annual" ? "bg-[#635bff]" : "bg-slate-300",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              billingCycle === "annual" ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", billingCycle === "annual" ? "text-slate-900" : "text-slate-500")}>
          Annual
          <span className="ml-1.5 text-xs text-green-600 font-semibold">(Save 20%)</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan
          const price = billingCycle === "annual" ? Math.round(plan.price * 0.8) : plan.price

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all",
                plan.popular && "ring-2 ring-[#635bff] shadow-lg scale-105",
                !plan.popular && "hover:shadow-md",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#635bff] to-[#5246e0]" />
              )}

              <CardContent className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                    {plan.popular && (
                      <Badge className="bg-[#635bff] text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">${price}</span>
                    <span className="text-slate-600">/{billingCycle === "annual" ? "mo" : "month"}</span>
                  </div>
                  {billingCycle === "annual" && (
                    <p className="text-xs text-slate-500 mt-1">Billed ${price * 12} annually</p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full mb-6",
                    plan.popular
                      ? "bg-[#635bff] hover:bg-[#5246e0] text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white",
                  )}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.id === "developer" ? "Contact Sales" : "Upgrade"}
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-start gap-2 opacity-50">
                      <X className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600">{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Usage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Current billing period</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 mb-1">Subscription</div>
              <div className="text-2xl font-bold text-slate-900">$129.00</div>
              <div className="text-xs text-slate-500 mt-1">Business plan</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 mb-1">Usage this month</div>
              <div className="text-2xl font-bold text-slate-900">8 / 10</div>
              <div className="text-xs text-slate-500 mt-1">team members</div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-sm text-slate-600 mb-1">Next billing date</div>
              <div className="text-2xl font-bold text-slate-900">Jan 15</div>
              <div className="text-xs text-slate-500 mt-1">2025</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Payment method</h2>
            <p className="text-sm text-slate-600">Update your billing information</p>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="w-12 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-900">•••• •••• •••• 4242</div>
            <div className="text-sm text-slate-600">Expires 12/2025</div>
          </div>
          <Badge variant="secondary">Default</Badge>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Billing history</h2>
        <div className="space-y-0">
          {[
            { date: "Dec 15, 2024", amount: "$129.00", status: "Paid", invoice: "INV-2024-12" },
            { date: "Nov 15, 2024", amount: "$129.00", status: "Paid", invoice: "INV-2024-11" },
            { date: "Oct 15, 2024", amount: "$129.00", status: "Paid", invoice: "INV-2024-10" },
            { date: "Sep 15, 2024", amount: "$129.00", status: "Paid", invoice: "INV-2024-09" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-6">
                <span className="text-sm text-slate-600 min-w-[100px]">{item.date}</span>
                <span className="text-sm font-semibold text-slate-900 min-w-[80px]">{item.amount}</span>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  {item.status}
                </Badge>
                <span className="text-xs text-slate-500 font-mono">{item.invoice}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5246e0] hover:bg-[#635bff]/5">
                Download
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4 bg-transparent">
          View all invoices
        </Button>
      </div>
    </div>
  )
}
