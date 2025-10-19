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
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Tax Tools for <span className="text-glow">Business Owners</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            From sole proprietors to growing agencies — AI-powered tax planning and filing built for business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/businesses/get-started">
              <Button size="lg" className="glow-neon-strong">
                Start Business Filing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="bg-transparent">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Types Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built for Your Business Structure</h2>
            <p className="text-xl text-muted-foreground">Specialized tools for every entity type</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {businessTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <Link
                  key={index}
                  href={`/businesses/get-started?type=${type.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block"
                >
                  <div className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all cursor-pointer h-full">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                    <p className="text-muted-foreground mb-6">{type.description}</p>
                    <ul className="space-y-3">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-border">
                      <Button variant="outline" className="w-full bg-transparent">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Complete Business Tax Suite</h2>
            <p className="text-xl text-muted-foreground">Everything you need to manage business taxes year-round</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <div key={index} className="flex gap-6 p-8 rounded-2xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Integrates With Your Stack</h2>
            <p className="text-xl text-muted-foreground">Connect your existing tools for seamless tax management</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl border border-border bg-card flex items-center justify-center hover:border-accent/50 transition-colors"
              >
                <div className="text-2xl font-bold text-muted-foreground">{integration.logo}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Plus many more integrations via API</p>
            <Link href="/partners">
              <Button variant="outline" className="bg-transparent">
                View All Integrations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Business Tax Planning</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Starting at $10/month for year-round support and quarterly filing
            </p>
            <ul className="inline-block text-left space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Unlimited tax questions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Quarterly tax estimates</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Expense tracking & categorization</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Annual return filing included</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/businesses/get-started">
                <Button size="lg" className="glow-neon-strong">
                  Start Business Filing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Pricing
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
