"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Check, Loader2, CreditCard, Shield, Zap, FileText, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface PaymentFlowClientProps {
  user: User
  profile: {
    subscription_tier?: string
    subscription_status?: string
  } | null
}

const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with tax filing",
    features: [
      "File up to 2 tax returns per year",
      "Basic document upload",
      "Standard refund estimates",
      "Email support",
      "Basic deduction finder",
    ],
    cta: "Current Plan",
    popular: false,
    priceId: null,
  },
  {
    id: "copilot",
    name: "AI Co-Pilot",
    price: "$5",
    period: "per month",
    description: "Year-round tax advice and planning",
    features: [
      "Everything in Free",
      "Unlimited tax returns",
      "AI-powered tax planning",
      "Real-time tax advice",
      "Quarterly tax reminders",
      "Priority email support",
      "Advanced deduction finder",
      "Audit risk assessment",
    ],
    cta: "Upgrade to Co-Pilot",
    popular: true,
    priceId: "price_copilot_monthly",
  },
  {
    id: "pro",
    name: "Professional",
    price: "$15",
    period: "per month",
    description: "For businesses and power users",
    features: [
      "Everything in AI Co-Pilot",
      "Unlimited business filings",
      "QuickBooks integration",
      "1099 bulk filing",
      "W-2 bulk filing",
      "Form 941 quarterly filing",
      "Dedicated tax strategist",
      "Phone support",
      "Custom tax strategies",
      "Multi-entity support",
    ],
    cta: "Upgrade to Professional",
    popular: false,
    priceId: "price_pro_monthly",
  },
]

export function PaymentFlowClient({ user, profile }: PaymentFlowClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const currentTier = profile?.subscription_tier || "Free"
  const sessionId = searchParams.get("session_id")

  // Show success message if returning from successful checkout
  if (sessionId && !loading) {
    toast({
      title: "Payment Successful!",
      description: "Your subscription has been activated. Welcome to Taxu!",
    })
    // Clear the session_id from URL
    router.replace("/dashboard/payment")
  }

  const handleUpgrade = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      toast({
        title: "Already on this plan",
        description: "You're currently on the Free plan",
      })
      return
    }

    setLoading(priceId)

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      })
      setLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setLoading("portal")

    try {
      const response = await fetch("/api/create-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Failed to create portal session")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      })
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upgrade your tax filing experience with AI-powered insights and year-round support
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <Check className="h-3 w-3 mr-1" />
              Current Plan: {currentTier}
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = plan.name === currentTier
            const isLoading = loading === plan.priceId

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all hover:scale-105 ${
                  plan.popular
                    ? "border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "border-2 border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-orange-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <CardHeader className="space-y-4">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/ {plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.priceId, plan.name)}
                    disabled={isCurrentPlan || isLoading}
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg shadow-purple-500/30"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCurrentPlan ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-background via-background to-purple-500/5">
          <CardHeader>
            <CardTitle className="text-2xl">Why Upgrade?</CardTitle>
            <CardDescription>Unlock powerful features to maximize your tax savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time tax advice and personalized strategies from our AI team
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                <div className="p-3 rounded-full bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Maximize Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced deduction finder identifies every possible tax savings opportunity
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Unlimited Filings</h3>
                <p className="text-sm text-muted-foreground">
                  File as many returns as you need without worrying about limits
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-background/50">
                <div className="p-3 rounded-full bg-orange-500/10">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Audit Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time audit risk assessment and guidance to keep you safe
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manage Subscription */}
        {currentTier !== "Free" && (
          <Card className="border-2 border-border/50">
            <CardHeader>
              <CardTitle>Manage Your Subscription</CardTitle>
              <CardDescription>Update payment method, view invoices, or cancel subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleManageSubscription}
                disabled={loading === "portal"}
                variant="outline"
                className="w-full md:w-auto bg-transparent"
              >
                {loading === "portal" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CreditCard className="mr-2 h-4 w-4" />
                Open Billing Portal
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to Dashboard */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="bg-transparent">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
