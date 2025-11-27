import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Globe, DollarSign, Package, FileText } from "lucide-react"
import Link from "next/link"

export default function EcommercePage() {
  const challenges = [
    {
      icon: Globe,
      title: "Multi-State Sales Tax",
      description:
        "Automatically calculate, collect, and remit sales tax across all 50 states with economic nexus monitoring.",
    },
    {
      icon: Package,
      title: "Product Taxability",
      description: "Handle complex product taxability rules — from clothing exemptions to digital goods taxation.",
    },
    {
      icon: DollarSign,
      title: "Revenue Recognition",
      description: "Track revenue by state for proper filing and maintain audit-ready transaction records.",
    },
    {
      icon: FileText,
      title: "Tax Exemption Certificates",
      description: "Manage reseller certificates and B2B exemptions with automatic validation.",
    },
  ]

  const platforms = ["Shopify", "WooCommerce", "BigCommerce", "Magento", "Salesforce Commerce", "Custom"]

  const benefits = [
    "Real-time tax calculation at checkout",
    "Automatic filing in all jurisdictions",
    "Economic nexus monitoring",
    "Product taxability database",
    "Multi-currency support",
    "Exemption certificate management",
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-32 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold text-white">Solutions for E-commerce</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Sales Tax Automation for <span className="text-[#00d4ff]">E-commerce</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-8">
            From checkout to compliance — handle multi-state sales tax, product taxability, and automated filing
            seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started">
              <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Complete E-commerce Tax Solution</h2>
            <p className="text-xl text-slate-600">Everything you need for sales tax compliance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex gap-6 p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#635bff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0a2540]">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Simple Integration</h2>
            <p className="text-xl text-slate-600">Get started in minutes, not weeks</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#635bff] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Connect Your Store</h3>
              <p className="text-slate-600">Link your e-commerce platform with one click or use our API.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#635bff] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Configure Products</h3>
              <p className="text-slate-600">Set product taxability rules or use our intelligent defaults.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#635bff] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Automate Everything</h3>
              <p className="text-slate-600">Sales tax calculated at checkout and filed automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Works With Your Platform</h2>
            <p className="text-xl text-slate-600">Native integrations with leading e-commerce platforms</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:shadow-lg transition-all"
              >
                <span className="text-sm font-bold text-slate-400">{platform}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="text-2xl font-bold mb-6 text-[#0a2540] text-center">What You Get</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-[#0a2540] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#635bff] opacity-20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Simplify Sales Tax?</h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of e-commerce businesses using Taxu for automated compliance
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/get-started">
                  <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
