import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, Shield, FileText, DollarSign } from "lucide-react"
import Link from "next/link"

export default function MarketplacesPage() {
  const features = [
    {
      icon: Users,
      title: "Seller Tax Management",
      description: "Issue 1099-K forms to sellers and handle marketplace facilitator obligations across all states.",
    },
    {
      icon: Shield,
      title: "Compliance Monitoring",
      description: "Track seller compliance status, collect W-9 forms, and validate tax IDs automatically.",
    },
    {
      icon: DollarSign,
      title: "Revenue Allocation",
      description:
        "Split transaction reporting between marketplace fees and seller revenue for accurate tax reporting.",
    },
    {
      icon: FileText,
      title: "Bulk Filing Operations",
      description: "File thousands of 1099 forms simultaneously with automated error checking and IRS transmission.",
    },
  ]

  const marketplaceTypes = [
    {
      title: "Online Marketplaces",
      description: "Multi-vendor e-commerce platforms",
      challenges: ["1099-K for sellers", "Marketplace facilitator tax", "State compliance"],
    },
    {
      title: "Service Marketplaces",
      description: "Gig economy and freelance platforms",
      challenges: ["1099-NEC filing", "Contractor classification", "Multi-state operations"],
    },
    {
      title: "B2B Marketplaces",
      description: "Wholesale and business platforms",
      challenges: ["Exemption certificates", "Reseller permits", "Volume reporting"],
    },
  ]

  const stats = [
    { value: "500K+", label: "Sellers Managed" },
    { value: "50 States", label: "Full Compliance" },
    { value: "99.9%", label: "Filing Accuracy" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-32 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold text-white">Solutions for Marketplaces</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Tax Compliance for <span className="text-[#00d4ff]">Marketplace Platforms</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-8">
            Manage seller tax obligations, marketplace facilitator rules, and bulk 1099 filing at scale with complete
            automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/get-started">
              <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-[#635bff] mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Built for Marketplace Scale</h2>
            <p className="text-xl text-slate-600">Handle thousands of sellers with automated tax compliance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
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

      {/* Marketplace Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Marketplace-Specific Solutions</h2>
            <p className="text-xl text-slate-600">Tailored compliance for every marketplace model</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {marketplaceTypes.map((type, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-[#0a2540]">{type.title}</h3>
                <p className="text-slate-600 mb-6">{type.description}</p>
                <div className="space-y-3">
                  {type.challenges.map((challenge, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">How It Works</h2>
            <p className="text-xl text-slate-600">Automated tax compliance in three steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#635bff] text-white flex items-center justify-center text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Onboard Sellers</h3>
              <p className="text-slate-600">Collect W-9 forms and validate tax IDs as sellers join your marketplace.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#635bff] text-white flex items-center justify-center text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Track Transactions</h3>
              <p className="text-slate-600">Automatically track payments to sellers and monitor filing thresholds.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-xl bg-[#635bff] text-white flex items-center justify-center text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0a2540]">File Automatically</h3>
              <p className="text-slate-600">1099 forms generated and filed with the IRS at year-end, automatically.</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Scale Your Marketplace with Confidence</h2>
              <p className="text-xl text-white/80 mb-8">
                Handle tax compliance for unlimited sellers with our enterprise-grade infrastructure
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/get-started">
                  <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Talk to Sales
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
