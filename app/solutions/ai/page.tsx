import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Zap, DollarSign, TrendingUp, Users, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "AI Solutions | Taxu",
  description: "Powering the next generation of AI startups with flexible billing and payments.",
}

export default function AISolutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f9fc] to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center text-[#635bff] hover:text-[#0a2540] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#635bff] to-[#0a2540] flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0a2540]">AI Solutions</h1>
          </div>

          <p className="text-2xl text-[#425466] max-w-3xl leading-relaxed">
            Powering the next generation of AI startups with flexible billing, usage-based pricing, and automated tax
            compliance.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a2540] mb-12">Built for AI businesses</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Usage-Based Billing",
                description: "Bill customers based on API calls, tokens, or compute time with flexible metering.",
              },
              {
                icon: TrendingUp,
                title: "Revenue Recognition",
                description: "Automatically handle complex revenue recognition for AI services and subscriptions.",
              },
              {
                icon: Users,
                title: "Scalable Infrastructure",
                description: "Process millions of transactions with enterprise-grade reliability and security.",
              },
              {
                icon: CheckCircle2,
                title: "Tax Automation",
                description: "Automated sales tax, VAT, and GST calculations for global AI services.",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all">
                <feature.icon className="w-12 h-12 text-[#635bff] mb-4" />
                <h3 className="text-xl font-bold text-[#0a2540] mb-3">{feature.title}</h3>
                <p className="text-[#425466] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-[#635bff] to-[#0a2540] rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to power your AI startup?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of AI companies automating their billing and taxes.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/signup"
                className="px-8 py-4 bg-white text-[#635bff] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
