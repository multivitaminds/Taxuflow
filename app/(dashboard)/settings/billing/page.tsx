"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Calendar, Receipt, Users, Building2, User, Laptop } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const currentPlan = "business"

  const plans = [
    {
      id: "individual",
      name: "Individual",
      price: { monthly: 29, annual: 290 },
      description: "Perfect for freelancers and sole proprietors",
      icon: User,
      features: [
        "1 user account",
        "Basic tax filing (1040)",
        "Expense tracking",
        "Receipt scanning",
        "Quarterly tax estimates",
        "Email support",
        "Mobile app access",
      ],
    },
    {
      id: "business",
      name: "Business",
      price: { monthly: 129, annual: 1290 },
      description: "For growing businesses and startups",
      icon: Building2,
      popular: true,
      features: [
        "Up to 10 users",
        "Business tax filing (1120/1065)",
        "Full accounting suite",
        "Neobank integration",
        "Investment tracking",
        "Multi-entity support",
        "Priority support",
        "API access",
        "Custom integrations",
        "Advanced reporting",
      ],
    },
    {
      id: "developer",
      name: "Developer",
      price: { monthly: 249, annual: 2490 },
      description: "For platforms and developers",
      icon: Laptop,
      features: [
        "Unlimited users",
        "Full API access",
        "Webhook notifications",
        "Custom branding",
        "White-label options",
        "Dedicated infrastructure",
        "SLA guarantee",
        "24/7 support",
        "Custom integrations",
        "Advanced analytics",
        "Compliance tools",
      ],
    },
  ]

  const billingHistory = [
    { date: "Dec 14, 2025", amount: "$129.00", status: "Paid", invoice: "#INV-001" },
    { date: "Nov 14, 2025", amount: "$129.00", status: "Paid", invoice: "#INV-002" },
    { date: "Oct 14, 2025", amount: "$129.00", status: "Paid", invoice: "#INV-003" },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">Plan & Billing</h1>
        <p className="text-sm text-muted-foreground">Manage your subscription plan and billing information</p>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Business Plan
              </CardTitle>
              <CardDescription className="text-xs mt-1">For growing businesses and startups</CardDescription>
            </div>
            <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">$129</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Next billing: Jan 14, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>3 of 10 users</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm">
              Change Plan
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-3 py-4">
        <Label className={`text-sm ${billingCycle === "monthly" ? "font-semibold" : "text-muted-foreground"}`}>
          Monthly
        </Label>
        <Switch
          checked={billingCycle === "annual"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
        />
        <Label className={`text-sm ${billingCycle === "annual" ? "font-semibold" : "text-muted-foreground"}`}>
          Annual
          <Badge variant="secondary" className="ml-2 text-[10px]">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.id === currentPlan
          const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.annual

          return (
            <Card
              key={plan.id}
              className={`relative transition-all ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              } ${isCurrentPlan ? "border-primary/50" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[10px]">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-xs leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  {billingCycle === "annual" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ${(price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : "Upgrade to " + plan.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded border border-border bg-muted">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Billing History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">{item.date}</p>
                    <p className="text-xs text-muted-foreground">{item.invoice}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{item.amount}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
