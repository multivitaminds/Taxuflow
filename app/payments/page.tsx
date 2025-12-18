import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Shield, CreditCard, Calendar, Receipt, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero clip-diagonal">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-8">
              Pay Your Taxes.
              <br />
              <span className="text-[#00d4ff]">Stress-Free.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              Flexible payment options, automatic calculations, and payment plans that work for you. File now, pay
              later, or set up installments with the IRS.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] px-8 py-6 text-lg font-semibold"
                >
                  Start Filing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white text-white hover:bg-white hover:text-[#0a2540] px-8 py-6 text-lg font-semibold bg-transparent"
                >
                  View Pricing
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-32 bg-white clip-diagonal-top">
        <div className="container mx-auto px-6">
          <div className="mb-20 max-w-3xl mx-auto text-center">
            <h2 className="text-[#635bff] font-semibold mb-6 text-lg">Payment Options</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
              Multiple ways to pay your tax bill
            </h3>
            <p className="text-xl text-[#425466]">
              Choose the payment method that works best for your situation. No surprises, no hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-[#e3e8ee] p-8 hover:border-[#635bff] hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#635bff]/10 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-[#635bff]" />
              </div>
              <h4 className="text-2xl font-bold text-[#0a2540] mb-3">Pay Now</h4>
              <p className="text-[#425466] mb-6 leading-relaxed">
                Pay your full tax bill immediately with credit card, debit card, or bank transfer.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">Instant confirmation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">Bank-level security</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">Receipt provided</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#635bff] to-[#7a73ff] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Payment Plan</h4>
                <p className="mb-6 leading-relaxed opacity-90">
                  Spread your tax payment over 6-12 months with IRS-approved installment plans.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Low monthly payments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Avoid penalties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Easy setup</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <span className="text-xs uppercase tracking-wider opacity-75">Most Popular</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e3e8ee] p-8 hover:border-[#635bff] hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#00d4ff]/10 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-7 h-7 text-[#00d4ff]" />
              </div>
              <h4 className="text-2xl font-bold text-[#0a2540] mb-3">Pay from Refund</h4>
              <p className="text-[#425466] mb-6 leading-relaxed">
                Deduct filing fees directly from your federal refund. No upfront payment required.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">$0 upfront</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">Simple process</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#425466]">Available for refunds</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6">How Tax Payments Work</h2>
            <p className="text-xl text-[#425466] max-w-2xl mx-auto">
              Simple, transparent process from calculation to payment
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Calculate",
                desc: "AI calculates your exact tax liability based on your information",
              },
              {
                step: "2",
                title: "Review",
                desc: "See a detailed breakdown of federal and state taxes owed",
              },
              {
                step: "3",
                title: "Choose",
                desc: "Select your preferred payment method and timing",
              },
              {
                step: "4",
                title: "Confirm",
                desc: "Receive instant confirmation and payment receipt",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-[#635bff] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-[#635bff] font-semibold mb-6 text-lg">Bank-Level Security</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
                Your payments are protected
              </h3>
              <p className="text-xl text-[#425466] mb-8">
                We use the same encryption technology as major financial institutions to keep your payment information
                secure.
              </p>
              <ul className="space-y-4">
                {[
                  "256-bit encryption for all transactions",
                  "PCI DSS Level 1 certified payment processing",
                  "Two-factor authentication available",
                  "Zero-liability fraud protection",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-[#635bff] flex-shrink-0 mt-1" />
                    <span className="text-[#425466]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5 rounded-2xl p-12 border border-[#635bff]/20">
              <Shield className="w-20 h-20 text-[#635bff] mx-auto mb-6" />
              <div className="text-center">
                <div className="text-5xl font-bold text-[#0a2540] mb-2">$0</div>
                <p className="text-[#425466] mb-8">Liability for fraud when you use Taxu</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-[#e3e8ee]">
                    <div className="text-2xl font-bold text-[#0a2540] mb-1">256-bit</div>
                    <p className="text-xs text-[#425466]">Encryption</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-[#e3e8ee]">
                    <div className="text-2xl font-bold text-[#0a2540] mb-1">SOC 2</div>
                    <p className="text-xs text-[#425466]">Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Plans Detail */}
      <section className="py-32 bg-[#0a2540] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">IRS Payment Plan Options</h2>
              <p className="text-xl text-blue-200">
                Can't pay your full tax bill? We can help you set up an IRS-approved payment plan.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <DollarSign className="w-12 h-12 mb-6 text-[#00d4ff]" />
                <h3 className="text-2xl font-bold mb-4">Short-Term Plan</h3>
                <p className="text-blue-200 mb-6">Pay within 180 days with no setup fee</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">For balances under $100,000</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">No setup fees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">Interest and penalties may apply</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
                <Calendar className="w-12 h-12 mb-6 text-[#00d4ff]" />
                <h3 className="text-2xl font-bold mb-4">Long-Term Plan</h3>
                <p className="text-blue-200 mb-6">Pay over 6-72 months with low monthly payments</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">For any balance amount</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">$31 setup fee (online)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00d4ff]" />
                    <span className="text-sm">Interest and penalties may apply</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-blue-200 mb-6">We'll help you apply for the best payment plan for your situation</p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] px-8 py-6 text-lg font-semibold"
                >
                  Set Up Payment Plan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0a2540] mb-12 text-center">Payment FAQs</h2>
            <div className="space-y-6">
              {[
                {
                  q: "When is payment due?",
                  a: "Federal tax payments are typically due on April 15th. State deadlines may vary. With Taxu, you can file early and schedule your payment for the deadline.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept credit cards (Visa, Mastercard, Amex, Discover), debit cards, and bank transfers (ACH). You can also pay directly from your refund.",
                },
                {
                  q: "Are there fees for paying taxes?",
                  a: "Bank transfers are free. Credit card payments have a 2.5% processing fee charged by the payment processor. Our filing fees are separate and clearly disclosed upfront.",
                },
                {
                  q: "Can I split my payment between multiple methods?",
                  a: "Yes! You can make a partial payment now and set up a payment plan for the remaining balance, or split between different payment methods.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#f6f9fc] rounded-xl p-6 border border-[#e3e8ee]">
                  <h4 className="text-lg font-bold text-[#0a2540] mb-3">{item.q}</h4>
                  <p className="text-[#425466]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-[#635bff] to-[#00d4ff] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to file and pay your taxes?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Start your tax return today and choose the payment option that works best for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="rounded-full bg-white text-[#635bff] hover:bg-white/90 px-8 py-6 text-lg font-semibold"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-white text-white hover:bg-white hover:text-[#635bff] px-8 py-6 text-lg font-semibold bg-transparent"
              >
                Talk to an Expert
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
