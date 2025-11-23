import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Calculator, FileText, Clock } from "lucide-react"
import Link from "next/link"

export default function SmallBusinessPage() {
  const features = [
    {
      icon: Calculator,
      title: "Automated Bookkeeping",
      description: "Connect your bank accounts and let AI categorize every transaction automatically.",
    },
    {
      icon: FileText,
      title: "Quarterly Tax Filing",
      description: "Never miss a deadline with automated quarterly estimates and filing reminders.",
    },
    {
      icon: TrendingUp,
      title: "Tax Planning",
      description: "Year-round strategies to minimize your tax burden and maximize deductions.",
    },
    {
      icon: Shield,
      title: "Audit Protection",
      description: "Full audit support with AI-powered risk assessment and documentation.",
    },
    {
      icon: Users,
      title: "1099 Management",
      description: "Generate, file, and distribute 1099s to contractors with one click.",
    },
    {
      icon: Clock,
      title: "Time Savings",
      description: "Save 20+ hours per month on tax and bookkeeping tasks.",
    },
  ]

  const benefits = [
    "Automatic expense categorization",
    "Home office deduction calculator",
    "Mileage tracking and logging",
    "Receipt capture and storage",
    "Multi-state tax support",
    "Payroll integration",
    "Inventory management",
    "Sales tax calculation",
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Tax Tools for <span className="text-glow">Small Business</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            From sole proprietors to growing teams — AI-powered tax planning and filing built for small business owners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/businesses/get-started">
              <Button size="lg" className="glow-neon-strong">
                Start Free Trial
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
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything Your Small Business Needs</h2>
            <p className="text-xl text-muted-foreground">Comprehensive tax and accounting tools in one platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-8 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Built for Small Business Owners</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Stop spending hours on taxes and bookkeeping. Taxu automates the busy work so you can focus on growing
                your business.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 glow-neon">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <img
                  src="/small-business-dashboard.jpg"
                  alt="Small business dashboard"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Small Business Plan</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Starting at $49/month for complete tax and accounting automation
            </p>
            <ul className="inline-block text-left space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Unlimited transactions and receipts</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Quarterly tax estimates and filing</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>1099 generation and e-filing</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Annual return filing included</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>Audit protection and support</span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/businesses/get-started">
                <Button size="lg" className="glow-neon-strong">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Compare Plans
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
