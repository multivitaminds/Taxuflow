"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, Loader2, TrendingDown } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export function SubscriptionManager({ currentTier, userId }: { currentTier: string; userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)

    try {
      const response = await fetch("/api/subscriptions/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, userId }),
      })

      if (!response.ok) throw new Error("Failed to change subscription")

      const data = await response.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("[v0] Subscription change error:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDowngrade = async (planId: string) => {
    setLoading(planId)

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downgradeOnly: true, newPlanId: planId, userId }),
      })

      if (!response.ok) throw new Error("Failed to downgrade")

      router.refresh()
    } catch (error) {
      console.error("[v0] Subscription downgrade error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Individual Plans</h2>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            <TrendingDown className="w-3 h-3 mr-1" />
            20-40% cheaper
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.filter((p) => p.category === "individual").map((plan) => {
            const isCurrent = plan.id === currentTier
            const isUpgrade = plan.price > (SUBSCRIPTION_PLANS.find((p) => p.id === currentTier)?.price || 0)

            return (
              <Card
                key={plan.id}
                className={`p-6 ${
                  isCurrent ? "bg-indigo-50 border-indigo-200 border-2" : "bg-white border-slate-200"
                } ${plan.popular ? "ring-2 ring-indigo-500" : ""}`}
              >
                {plan.popular && <Badge className="mb-4 bg-indigo-600 hover:bg-indigo-700">Most Popular</Badge>}
                {plan.comparePrice && (
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="line-through text-slate-400">${plan.comparePrice}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Save ${plan.comparePrice - plan.price}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                  {plan.interval && plan.interval !== "one-time" && (
                    <span className="text-slate-600 ml-2">/{plan.interval}</span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start text-xs">
                      <Check className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-xs text-slate-500 pl-6">+{plan.features.length - 5} more</li>
                  )}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full bg-slate-200 text-slate-500 cursor-not-allowed">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => (isUpgrade ? handleUpgrade(plan.id) : handleDowngrade(plan.id))}
                    disabled={loading === plan.id}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isUpgrade ? "Upgrade" : "Downgrade"} <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Business Plans</h2>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
            Save $250-$3,500 vs CPA
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.filter((p) => p.category === "business").map((plan) => {
            const isCurrent = plan.id === currentTier
            const isUpgrade = plan.price > (SUBSCRIPTION_PLANS.find((p) => p.id === currentTier)?.price || 0)

            return (
              <Card
                key={plan.id}
                className={`p-6 ${
                  isCurrent ? "bg-purple-50 border-purple-200 border-2" : "bg-white border-slate-200"
                } ${plan.popular ? "ring-2 ring-purple-500" : ""}`}
              >
                {plan.popular && <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">Best Value</Badge>}
                {plan.comparePrice && (
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="line-through text-slate-400">${plan.comparePrice}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Save ${plan.comparePrice - plan.price}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                  {plan.interval && plan.interval !== "one-time" && (
                    <span className="text-slate-600 ml-2">/{plan.interval}</span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start text-xs">
                      <Check className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 6 && (
                    <li className="text-xs text-slate-500 pl-6">+{plan.features.length - 6} more</li>
                  )}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full bg-slate-200 text-slate-500 cursor-not-allowed">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => (isUpgrade ? handleUpgrade(plan.id) : handleDowngrade(plan.id))}
                    disabled={loading === plan.id}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {isUpgrade ? "Upgrade" : "Downgrade"} <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
