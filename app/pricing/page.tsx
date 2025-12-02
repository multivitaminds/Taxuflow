import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, TrendingDown } from "lucide-react"
import Link from "next/link"
import { SubscriptionCheckoutButton } from "@/components/subscription-checkout-button"
import { AddOnCheckoutButton } from "@/components/addon-checkout-button"
import { getIndividualPlans, getBusinessPlans, ADD_ONS } from "@/lib/subscription-plans"

export default function PricingPage() {
  const individualPlans = getIndividualPlans()
  const businessPlans = getBusinessPlans()
  const addOns = ADD_ONS

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-20 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-100 text-sm font-medium mb-6">
            <TrendingDown className="w-4 h-4" />
            20-40% cheaper than TurboTax
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Premium Tax Filing at <span className="text-[#00d4ff]">Better Value</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance">
            AI-powered automation. Professional accuracy. Transparent pricing.
          </p>
        </div>
      </section>

      {/* Individual Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Individual Tax Filers</h2>
            <p className="text-xl text-slate-600">From simple W-2s to complex self-employed returns</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {individualPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 relative transition-all duration-300 ${
                  plan.popular
                    ? "bg-white shadow-2xl scale-105 z-10 border-t-4 border-[#635bff]"
                    : "bg-white border border-slate-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#635bff] text-white text-sm font-semibold shadow-md">
                    Most Popular
                  </div>
                )}
                {plan.comparePrice && (
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="line-through text-slate-400">${plan.comparePrice}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Save ${plan.comparePrice - plan.price}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 text-[#0a2540]">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-[#0a2540]">${plan.price}</span>
                    {plan.interval && plan.interval !== "one-time" && (
                      <span className="text-slate-500">/{plan.interval}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{plan.description}</p>
                  {plan.savings && <p className="text-xs text-green-600 font-medium">{plan.savings}</p>}
                </div>
                <SubscriptionCheckoutButton
                  planId={plan.id}
                  className={`w-full mb-6 ${plan.popular ? "bg-[#635bff] hover:bg-[#0a2540] text-white" : "bg-white border border-slate-200 text-[#0a2540] hover:border-[#635bff] hover:text-[#635bff]"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </SubscriptionCheckoutButton>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Business Filers</h2>
            <p className="text-xl text-slate-600">From solo LLCs to multi-state corporations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 relative transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#0a2540] text-white shadow-2xl scale-105 z-10"
                    : "bg-white border border-slate-200 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00d4ff] text-[#0a2540] text-sm font-semibold shadow-md">
                    Best Value
                  </div>
                )}
                {plan.comparePrice && (
                  <div className={`flex items-center gap-2 mb-4 text-xs ${plan.popular ? "text-white" : ""}`}>
                    <span className={`line-through ${plan.popular ? "text-white/60" : "text-slate-400"}`}>
                      ${plan.comparePrice}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${plan.popular ? "bg-[#00d4ff] text-[#0a2540]" : "bg-green-100 text-green-700"}`}
                    >
                      Save ${plan.comparePrice - plan.price}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-[#0a2540]"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-[#0a2540]"}`}>
                      ${plan.price}
                    </span>
                    {plan.interval && plan.interval !== "one-time" && (
                      <span className={plan.popular ? "text-white/60" : "text-slate-500"}>/{plan.interval}</span>
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${plan.popular ? "text-white/80" : "text-slate-600"}`}>
                    {plan.description}
                  </p>
                  {plan.savings && (
                    <p className={`text-xs font-medium ${plan.popular ? "text-[#00d4ff]" : "text-green-600"}`}>
                      {plan.savings}
                    </p>
                  )}
                </div>
                <SubscriptionCheckoutButton
                  planId={plan.id}
                  className={`w-full mb-6 ${plan.popular ? "bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold" : "bg-white border border-slate-200 text-[#0a2540] hover:border-[#635bff] hover:text-[#635bff]"}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </SubscriptionCheckoutButton>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? "text-[#00d4ff]" : "text-[#635bff]"}`}
                      />
                      <span className={`text-sm ${plan.popular ? "text-white/90" : "text-slate-700"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Add-Ons</h2>
            <p className="text-xl text-slate-600">Optional extras at better prices than TurboTax</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {addOns.map((addon, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-200 bg-white text-center hover:shadow-lg hover:border-[#635bff] transition-all duration-200 group"
              >
                {addon.turbotaxPrice && (
                  <div className="text-xs text-slate-400 line-through mb-1">${addon.turbotaxPrice}</div>
                )}
                <h3 className="text-lg font-bold mb-2 text-[#0a2540] group-hover:text-[#635bff] transition-colors">
                  {addon.name}
                </h3>
                <div className="text-3xl font-bold text-[#635bff] mb-2">${addon.price}</div>
                <p className="text-xs text-slate-600 mb-4">{addon.description}</p>
                {addon.turbotaxPrice && (
                  <p className="text-xs text-green-600 font-medium mb-4">Save ${addon.turbotaxPrice - addon.price}</p>
                )}
                <AddOnCheckoutButton
                  addOnId={addon.id}
                  className="w-full bg-[#635bff] hover:bg-[#0a2540] text-white text-sm"
                  size="sm"
                >
                  Add to Cart
                </AddOnCheckoutButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Compare Plans</h2>
            <p className="text-xl text-slate-600">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-[#0a2540]">Feature</th>
                  <th className="text-center p-4 font-semibold text-[#0a2540]">Free</th>
                  <th className="text-center p-4 font-semibold text-[#0a2540]">Premium</th>
                  <th className="text-center p-4 font-semibold text-[#0a2540]">AI Co-Pilot</th>
                  <th className="text-center p-4 font-semibold text-[#0a2540]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Federal e-file", true, true, true, true],
                  ["State filing", false, true, true, true],
                  ["AI chat support", true, true, true, true],
                  ["Itemized deductions", false, true, true, true],
                  ["Investment income", false, true, true, true],
                  ["Year-round assistant", false, false, true, true],
                  ["Receipt scanning", false, false, true, true],
                  ["Quarterly estimates", false, false, true, true],
                  ["Unlimited bulk uploads", false, false, false, true],
                  ["API access", false, false, false, true],
                  ["White-label options", false, false, false, true],
                  ["Dedicated account manager", false, false, false, true],
                  ["Custom integrations", false, false, false, true],
                  ["SLA guarantees", false, false, false, true],
                  ["Priority phone support", false, false, false, true],
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-[#f6f9fc] transition-colors">
                    <td className="p-4 text-slate-700">{row[0]}</td>
                    <td className="text-center p-4">
                      {row[1] ? (
                        <Check className="w-5 h-5 text-[#00d4ff] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row[2] ? (
                        <Check className="w-5 h-5 text-[#00d4ff] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row[3] ? (
                        <Check className="w-5 h-5 text-[#00d4ff] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      {row[4] ? (
                        <Check className="w-5 h-5 text-[#00d4ff] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Pricing FAQ</h2>
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
              <div key={index} className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-[#0a2540]">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a2540] clip-diagonal-top">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">Start filing for free. Upgrade only if you need to.</p>
          <Link href="/get-started">
            <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold text-lg px-8">
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
