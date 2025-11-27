import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Layers, Shield, Code, Users } from "lucide-react"
import Link from "next/link"

export default function PlatformsPage() {
  const platformFeatures = [
    {
      icon: Layers,
      title: "Multi-Tenant Architecture",
      description: "Manage tax compliance for thousands of merchants from a single API integration.",
    },
    {
      icon: Shield,
      title: "Compliance as a Service",
      description: "Offer 1099 filing, sales tax calculation, and payroll tax as value-added features.",
    },
    {
      icon: Code,
      title: "Developer-First API",
      description: "RESTful API with webhooks, SDKs, and comprehensive documentation for rapid integration.",
    },
    {
      icon: Users,
      title: "White-Label Dashboard",
      description: "Branded tax dashboard your merchants can access directly within your platform.",
    },
  ]

  const useCases = [
    {
      title: "Payment Platforms",
      description: "Embed tax reporting for merchant payments",
      examples: ["1099-K filing", "Sales tax collection", "Merchant onboarding"],
    },
    {
      title: "Gig Economy Platforms",
      description: "Handle contractor tax compliance at scale",
      examples: ["Bulk 1099-NEC filing", "W-9 collection", "State compliance tracking"],
    },
    {
      title: "B2B Marketplaces",
      description: "Support seller tax obligations",
      examples: ["Multi-state nexus", "Revenue sharing", "Tax document distribution"],
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-32 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold text-white">Solutions for Platforms</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Tax Infrastructure for <span className="text-[#00d4ff]">Platform Businesses</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-8">
            Power your platform with embedded tax compliance — from 1099 filing to sales tax calculation, all via API.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started">
              <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                View API Docs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Built for Scale</h2>
            <p className="text-xl text-slate-600">Enterprise-grade tax infrastructure your platform can rely on</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platformFeatures.map((feature, index) => {
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

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Platform-Specific Solutions</h2>
            <p className="text-xl text-slate-600">Tailored tax compliance for every platform model</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-[#0a2540]">{useCase.title}</h3>
                <p className="text-slate-600 mb-6">{useCase.description}</p>
                <ul className="space-y-3">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a2540] text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold mb-2 text-[#00d4ff]">99.9%</div>
              <div className="text-xl text-white/80">API Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-[#00d4ff]">50M+</div>
              <div className="text-xl text-white/80">Forms Filed</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-[#00d4ff]">&lt;100ms</div>
              <div className="text-xl text-white/80">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#0a2540]">Ready to Integrate Tax Compliance?</h2>
            <p className="text-xl text-slate-600 mb-8">Get API access and start building in minutes</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/docs">
                <Button size="lg" className="bg-[#635bff] hover:bg-[#635bff]/90 text-white font-semibold">
                  Read API Docs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-[#0a2540] hover:bg-slate-50 bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
