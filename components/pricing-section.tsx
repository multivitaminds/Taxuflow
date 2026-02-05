import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free Tier",
    price: "$0",
    description: "Perfect for simple returns",
    features: ["Simple W‑2 return", "Standard deduction", "No dependents", "Federal filing only", "Email support"],
  },
  {
    name: "Premium",
    price: "$29",
    description: "For most filers",
    features: [
      "Everything in Free",
      "Add dependents",
      "Itemized deductions",
      "Tax credits",
      "State returns included",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "AI Co-Pilot",
    price: "$5",
    period: "/mo",
    description: "Year-round tax help",
    features: [
      "Everything in Premium",
      "Year-round chat support",
      "Tax planning advice",
      "Quarterly estimates",
      "Audit assistance",
      "Dedicated tax expert",
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
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
              <div className="space-y-4 mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
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
      </div>
    </section>
  )
}
