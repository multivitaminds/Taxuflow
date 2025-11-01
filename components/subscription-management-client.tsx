"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Loader2 } from "lucide-react"
import { SUBSCRIPTION_PLANS, getPlanById } from "@/lib/subscription-plans"
import { useRouter } from "next/navigation"
import { SubscriptionCheckoutButton } from "@/components/subscription-checkout-button"

interface SubscriptionManagementClientProps {
  profile: {
    id: string
    email: string
    full_name: string
    subscription_tier: string
    subscription_status: string
    stripe_subscription_id?: string
  } | null
}

export function SubscriptionManagementClient({ profile }: SubscriptionManagementClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentPlanId = profile?.subscription_tier?.toLowerCase() || "free"
  const currentPlan = getPlanById(currentPlanId)

  const handleSubscribe = async (priceId: string, planId: string) => {
    setLoading(planId)
    setError(null)

    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create subscription")
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  const handleChangePlan = async (newPriceId: string, newPlanId: string) => {
    if (!confirm("Are you sure you want to change your subscription plan?")) {
      return
    }

    setLoading(newPlanId)
    setError(null)

    try {
      const response = await fetch("/api/subscriptions/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPriceId, newPlanId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to change subscription")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.",
      )
    ) {
      return
    }

    setLoading("cancel")
    setError(null)

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  const individualPlans = SUBSCRIPTION_PLANS.filter((p) => p.category === "individual")
  const businessPlans = SUBSCRIPTION_PLANS.filter((p) => p.category === "business")

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Subscription</h1>
          <p className="text-muted-foreground">Upgrade, downgrade, or cancel your subscription</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
            {error}
          </div>
        )}

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentPlan?.name || "Free"}</h3>
                <p className="text-muted-foreground">{currentPlan?.description}</p>
                {currentPlan && currentPlan.price > 0 && (
                  <p className="text-lg font-semibold mt-2">
                    ${currentPlan.price}
                    {currentPlan.interval && `/${currentPlan.interval}`}
                  </p>
                )}
              </div>
              <Badge variant={profile?.subscription_status === "active" ? "default" : "secondary"}>
                {profile?.subscription_status || "active"}
              </Badge>
            </div>
            {profile?.stripe_subscription_id && (
              <Button
                variant="destructive"
                className="mt-4"
                onClick={handleCancelSubscription}
                disabled={loading === "cancel"}
              >
                {loading === "cancel" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Canceling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Individual Plans */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Individual Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {individualPlans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlanId
              const canUpgrade = !isCurrentPlan && plan.price > (currentPlan?.price || 0)
              const canDowngrade = !isCurrentPlan && plan.price < (currentPlan?.price || 0)

              return (
                <Card
                  key={plan.id}
                  className={`relative ${plan.popular ? "border-accent shadow-lg" : ""} ${
                    isCurrentPlan ? "bg-accent/5" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.interval && <span className="text-muted-foreground">/{plan.interval}</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <Button className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : plan.priceId ? (
                      <SubscriptionCheckoutButton
                        planId={plan.id}
                        className="w-full"
                        variant={canUpgrade ? "default" : "outline"}
                      >
                        {canUpgrade ? "Upgrade" : canDowngrade ? "Downgrade" : "Subscribe"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </SubscriptionCheckoutButton>
                    ) : (
                      <Button className="w-full bg-transparent" variant="outline" disabled>
                        Free Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Business Plans */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Business Plans</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {businessPlans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlanId

              return (
                <Card key={plan.id} className={isCurrentPlan ? "bg-accent/5" : ""}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.interval && <span className="text-muted-foreground">/{plan.interval}</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <Button className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <SubscriptionCheckoutButton planId={plan.id} className="w-full">
                        Subscribe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </SubscriptionCheckoutButton>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
