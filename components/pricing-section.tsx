import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, TrendingDown } from "lucide-react"
import Link from "next/link"
import { getIndividualPlans } from "@/lib/subscription-plans"

export function PricingSection() {
  const plans = getIndividualPlans().slice(0, 3)

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
            <TrendingDown className="w-4 h-4 mr-1" />
            20-40% cheaper than TurboTax
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">AI-powered automation at better value</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 ${
                plan.popular ? "border-accent bg-card shadow-xl scale-105" : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}
              {plan.comparePrice && (
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <span className="line-through text-muted-foreground">${plan.comparePrice}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    Save ${plan.comparePrice - plan.price}
                  </span>
                </div>
              )}
              <div className="space-y-4 mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                    ${plan.price}
                  </span>
                  {plan.interval && plan.interval !== "one-time" && (
                    <span className="text-muted-foreground">/ {plan.interval}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/get-started">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View All Plans & Business Options
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
