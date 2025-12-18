import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Building2, Users, TrendingUp, FileText, Calculator, Shield } from "lucide-react"
import Link from "next/link"

export default function BusinessesPage() {
  const businessTypes = [
    {
      icon: Users,
      title: "Sole Proprietors",
      description: "Schedule C filing made simple",
      features: [
        "Automatic expense categorization",
        "Home office deduction calculator",
        "Quarterly tax estimates",
        "Self-employment tax optimization",
      ],
    },
    {
      icon: Building2,
      title: "LLCs & S-Corps",
      description: "Entity-specific tax strategies",
      features: [
        "K-1 form support",
        "Reasonable compensation analysis",
        "Pass-through deduction (QBI)",
        "Multi-member allocation",
      ],
    },
    {
      icon: FileText,
      title: "Contractors & Freelancers",
      description: "1099 income management",
      features: [
        "Auto-fill 1099-NEC forms",
        "Client payment tracking",
        "Mileage and expense logging",
        "Estimated tax payment reminders",
      ],
    },
    {
      icon: TrendingUp,
      title: "Growing Agencies",
      description: "Scale your tax operations",
      features: [
        "Multi-entity management",
        "Payroll integration (ADP, Gusto)",
        "R&D tax credit identification",
        "State nexus analysis",
      ],
    },
  ]

  const tools = [
    {
      icon: Calculator,
      title: "Expense Tracking",
      description: "Connect your bank and credit cards. AI automatically categorizes business expenses.",
    },
    {
      icon: FileText,
      title: "1099 Management",
      description: "Generate and e-file 1099s for contractors. Bulk upload and automated distribution.",
    },
    {
      icon: TrendingUp,
      title: "Tax Planning",
      description: "Year-round projections and strategies to minimize your tax burden.",
    },
    {
      icon: Shield,
      title: "Audit Protection",
      description: "Comprehensive audit support with AI-powered risk assessment and documentation.",
    },
  ]

  const integrations = [
    { name: "QuickBooks", logo: "QB" },
    { name: "Stripe", logo: "ST" },
    { name: "Gusto", logo: "GU" },
    { name: "ADP", logo: "AD" },
    { name: "PayPal", logo: "PP" },
    { name: "Square", logo: "SQ" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero pt-32 pb-32 px-4 sm:px-6 lg:px-8 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1] text-white">
            Tax Infrastructure for <span className="text-[#00d4ff]">Business</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance mb-8">
            From sole proprietors to growing agencies — AI-powered tax planning and filing built for the modern economy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/businesses/get-started">
              <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                Start Business Filing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Types Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Built for Your Structure</h2>
            <p className="text-xl text-slate-600">Specialized tools for every entity type</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {businessTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Link
                  key={index}
                  href={`/businesses/get-started?type=${type.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block group"
                >
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl transition-all cursor-pointer h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#635bff] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 rounded-xl bg-[#f6f9fc] flex items-center justify-center mb-6 group-hover:bg-[#635bff] transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[#635bff] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-[#0a2540]">{type.title}</h3>
                    <p className="text-slate-600 mb-6">{type.description}</p>
                    <ul className="space-y-3">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="flex items-center text-[#635bff] font-semibold group-hover:translate-x-1 transition-transform">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Complete Business Suite</h2>
            <p className="text-xl text-slate-600">Everything you need to manage business taxes year-round</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <div
                  key={index}
                  className="flex gap-6 p-8 rounded-2xl border border-slate-200 bg-white hover:border-[#635bff]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f6f9fc] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#0a2540]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0a2540]">{tool.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#0a2540]">Integrates With Your Stack</h2>
            <p className="text-xl text-slate-600">Connect your existing tools for seamless tax management</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-slate-400">{integration.logo}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">Plus many more integrations via API</p>
            <Link href="/partners">
              <Button variant="outline" className="border-slate-300 text-[#0a2540] hover:bg-slate-50 bg-transparent">
                View All Integrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-[#0a2540] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#635bff] opacity-20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business Tax Planning</h2>
              <p className="text-xl text-white/80 mb-6">
                Starting at $10/month for year-round support and quarterly filing
              </p>
              <ul className="inline-block text-left space-y-3 mb-8">
                {[
                  "Unlimited tax questions",
                  "Quarterly tax estimates",
                  "Expense tracking & categorization",
                  "Annual return filing included",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/businesses/get-started">
                  <Button size="lg" className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold">
                    Start Business Filing
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
