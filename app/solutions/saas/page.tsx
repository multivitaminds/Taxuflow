import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, DollarSign, Globe, Zap, FileText } from "lucide-react"
import Link from "next/link"

export default function SaaSPage() {
  const challenges = [
    {
      problem: "Multi-state tax nexus",
      solution: "Automatic nexus monitoring and compliance across all 50 states",
    },
    {
      problem: "Sales tax calculation",
      solution: "Real-time SaaS tax rates for software and digital services",
    },
    {
      problem: "Revenue recognition",
      solution: "ASC 606 compliant reporting for subscription revenue",
    },
    {
      problem: "International VAT",
      solution: "EU VAT, GST, and global tax compliance built-in",
    },
  ]

  const features = [
    {
      icon: DollarSign,
      title: "Subscription Tax Engine",
      description: "Calculate sales tax on recurring revenue with automatic updates for rate changes and exemptions.",
    },
    {
      icon: Globe,
      title: "Multi-Jurisdiction Filing",
      description: "File sales tax returns in all active jurisdictions from a single dashboard.",
    },
    {
      icon: Zap,
      title: "Real-Time Nexus Tracking",
      description: "Monitor economic nexus thresholds and get alerts before you trigger obligations.",
    },
    {
      icon: FileText,
      title: "1099 Contractor Management",
      description: "Issue 1099-NEC forms for freelancers and contractors with bulk e-filing.",
    },
  ]

  const integrations = ["Stripe", "Chargebee", "Recurly", "Zuora", "Paddle", "Chargify"]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-32 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold text-white">Solutions for SaaS</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Tax Compliance Built for <span className="text-[#00d4ff]">SaaS Companies</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-8">
            From sales tax automation to contractor management — handle multi-state compliance and international tax
            regulations with confidence.
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
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem/Solution Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">SaaS Tax Challenges, Solved</h2>
            <p className="text-xl text-slate-600">Navigate complex tax scenarios unique to subscription businesses</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 font-bold text-lg">✕</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0a2540] mb-2">{item.problem}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.solution}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-[#00d4ff] flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Everything You Need</h2>
            <p className="text-xl text-slate-600">Comprehensive tax infrastructure for your SaaS business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex gap-6 p-8 rounded-2xl border border-slate-200 bg-white hover:border-[#635bff]/30 transition-all"
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

      {/* Integrations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Works With Your Billing Stack</h2>
            <p className="text-xl text-slate-600">Seamless integrations with leading subscription platforms</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:shadow-lg transition-all"
              >
                <span className="text-lg font-bold text-slate-400">{integration}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/partners">
              <Button variant="outline" className="border-slate-300 text-[#0a2540] hover:bg-slate-50 bg-transparent">
                View All Integrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-[#0a2540] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#635bff] opacity-20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Automate Your Tax Compliance?</h2>
              <p className="text-xl text-white/80 mb-8">
                Join hundreds of SaaS companies using Taxu for hassle-free tax management
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
