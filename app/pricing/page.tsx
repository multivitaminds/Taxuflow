import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { SubscriptionCheckoutButton } from "@/components/subscription-checkout-button"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      priceId: null, // Free plan doesn't need Stripe
      description: "Perfect for simple W-2 returns",
      features: [
        "W-2 income filing",
        "Standard deduction",
        "Federal e-file included",
        "AI chat support",
        "Refund tracking",
        "Basic audit protection",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Premium",
      price: "$29",
      priceId: "price_premium_29", // Replace with actual Stripe price ID
      description: "For complex returns with deductions",
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
      cta: "Get Premium",
      popular: true,
    },
    {
      name: "AI Co-Pilot",
      price: "$5",
      period: "/month",
      priceId: "price_copilot_5_monthly", // Replace with actual Stripe price ID
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
      cta: "Start Co-Pilot",
      popular: false,
    },
  ]

  const businessPlans = [
    {
      name: "Business Filing",
      price: "$10",
      period: "/month",
      description: "For freelancers and sole proprietors",
      features: [
        "Schedule C filing",
        "1099 management",
        "Quarterly estimates",
        "Expense tracking",
        "Mileage logging",
        "Self-employment tax optimization",
      ],
      cta: "Start Business",
    },
    {
      name: "Audit Shield Pro",
      price: "$49",
      period: "/year",
      description: "Complete audit protection",
      features: [
        "Full audit representation",
        "IRS correspondence handling",
        "Tax professional support",
        "Document preparation",
        "Penalty abatement assistance",
        "Peace of mind guarantee",
      ],
      cta: "Get Protection",
    },
  ]

  const addOns = [
    {
      name: "State Filing",
      price: "$15",
      description: "Additional state return",
    },
    {
      name: "Prior Year Filing",
      price: "$49",
      description: "File previous tax years",
    },
    {
      name: "Amended Return",
      price: "Free",
      description: "Unlimited corrections",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Simple, <span className="text-glow">Transparent</span> Pricing
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            No hidden fees. No surprises. Pay only for what you need.
          </p>
        </div>
      </section>

      {/* Individual Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Individual Plans</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your tax situation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-8 relative ${
                  plan.popular
                    ? "border-accent bg-card glow-neon scale-105"
                    : "border-border bg-card hover:border-accent/30"
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                {plan.priceId ? (
                  <SubscriptionCheckoutButton
                    planId={plan.name.toLowerCase().replace(" ", "-")}
                    className={`w-full mb-6 ${plan.popular ? "glow-neon-strong" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </SubscriptionCheckoutButton>
                ) : (
                  <Link href="/get-started">
                    <Button
                      className={`w-full mb-6 ${plan.popular ? "glow-neon-strong" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Business Plans</h2>
            <p className="text-xl text-muted-foreground">Professional tools for business owners</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {businessPlans.map((plan, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <SubscriptionCheckoutButton
                  planId={plan.name.toLowerCase().replace(" ", "-")}
                  className="w-full mb-6"
                  variant="outline"
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </SubscriptionCheckoutButton>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Add-Ons</h2>
            <p className="text-xl text-muted-foreground">Optional extras for specific needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card text-center">
                <h3 className="text-xl font-bold mb-2">{addon.name}</h3>
                <div className="text-3xl font-bold text-accent mb-2">{addon.price}</div>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Compare Plans</h2>
            <p className="text-xl text-muted-foreground">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Free</th>
                  <th className="text-center p-4 font-semibold">Premium</th>
                  <th className="text-center p-4 font-semibold">AI Co-Pilot</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Federal e-file", true, true, true],
                  ["State filing", false, true, true],
                  ["AI chat support", true, true, true],
                  ["Itemized deductions", false, true, true],
                  ["Investment income", false, true, true],
                  ["Year-round assistant", false, false, true],
                  ["Receipt scanning", false, false, true],
                  ["Quarterly estimates", false, false, true],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-4">{row[0]}</td>
                    <td className="text-center p-4">
                      {row[1] ? <Check className="w-5 h-5 text-accent mx-auto" /> : "—"}
                    </td>
                    <td className="text-center p-4">
                      {row[2] ? <Check className="w-5 h-5 text-accent mx-auto" /> : "—"}
                    </td>
                    <td className="text-center p-4">
                      {row[3] ? <Check className="w-5 h-5 text-accent mx-auto" /> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Pricing FAQ</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "When do I pay?",
                a: "You only pay when you're ready to file. Review your entire return for free, then pay to submit.",
              },
              {
                q: "Can I upgrade later?",
                a: "Yes! Upgrade anytime during filing. You'll only pay the difference.",
              },
              {
                q: "What if I need to amend?",
                a: "Amendments are free and unlimited for all plans.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes. 100% money-back guarantee if you're not satisfied before filing.",
              },
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">Start filing for free. Upgrade only if you need to.</p>
          <Link href="/get-started">
            <Button size="lg" className="glow-neon-strong">
              Start Your Free Return
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
