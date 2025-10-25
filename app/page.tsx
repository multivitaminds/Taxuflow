import Link from "next/link"
import {
  FileText,
  Wallet,
  Users,
  BarChart3,
  Building2,
  CreditCard,
  Package,
  TrendingUp,
  Zap,
  Brain,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden gradient-mesh">
        <div className="container mx-auto px-4 py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium mb-8 hover-lift">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-gradient">AI-Powered Tax & Accounting Platform</span>
            </div>
            <h1 className="text-7xl font-bold text-foreground mb-8 text-balance leading-tight">
              Financial infrastructure
              <br />
              <span className="text-gradient">to grow your revenue</span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses using Taxu to automate accounting, file taxes, and unlock AI-powered
              financial insights.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold text-lg flex items-center gap-2 hover-lift shadow-lg"
              >
                Start now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/accounting"
                className="px-8 py-4 glass-effect text-foreground rounded-lg hover:bg-secondary transition-all font-semibold text-lg hover-lift"
              >
                View demo
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-chart-4/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            A fully integrated suite of
            <br />
            <span className="text-gradient">financial and tax products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage accounting, file taxes, and grow your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              title: "Invoicing",
              desc: "Create professional invoices and get paid faster",
              href: "/services/invoicing",
            },
            {
              icon: Wallet,
              title: "Expense Tracking",
              desc: "Capture receipts and categorize expenses automatically",
              href: "/services/expense-tracking",
            },
            {
              icon: Users,
              title: "Customer Management",
              desc: "Track customer relationships and payment history",
              href: "/services/customer-management",
            },
            {
              icon: BarChart3,
              title: "Financial Reports",
              desc: "Real-time P&L, balance sheets, and cash flow",
              href: "/services/financial-reports",
            },
            {
              icon: Building2,
              title: "Vendor Management",
              desc: "Manage bills and vendor relationships",
              href: "/services/vendor-management",
            },
            {
              icon: CreditCard,
              title: "Banking",
              desc: "Connect accounts and reconcile transactions",
              href: "/services/banking",
            },
            {
              icon: Package,
              title: "Products & Services",
              desc: "Manage your product catalog and pricing",
              href: "/services/products-services",
            },
            {
              icon: TrendingUp,
              title: "Tax Filing",
              desc: "File W-2, 1099, 941, and more with AI",
              href: "/dashboard/filing",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-8 glass-effect rounded-2xl hover-lift hover:shadow-xl transition-all"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-purple-blue opacity-10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm font-medium mb-6">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-gradient">Powered by AI</span>
              </div>
              <h2 className="text-5xl font-bold text-foreground mb-6">
                Let AI handle the busywork
                <br />
                while you focus on growth
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Smart Categorization",
                  desc: "AI automatically categorizes transactions and expenses with 99% accuracy",
                },
                {
                  icon: Brain,
                  title: "Receipt OCR",
                  desc: "Extract data from receipts instantly with computer vision technology",
                },
                {
                  icon: TrendingUp,
                  title: "Cash Flow Predictions",
                  desc: "Forecast your cash flow with machine learning algorithms",
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center p-8 glass-effect rounded-2xl hover-lift">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-4 gap-12 text-center">
          {[
            { value: "50K+", label: "Active businesses" },
            { value: "$2B+", label: "Transactions processed" },
            { value: "99.9%", label: "Platform uptime" },
            { value: "24/7", label: "Expert support" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-6xl font-bold text-gradient mb-3">{stat.value}</div>
              <div className="text-muted-foreground text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 gradient-purple-orange" />
          <div className="relative p-16 text-center text-white">
            <h2 className="text-5xl font-bold mb-6">Ready to transform your business?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of businesses using Taxu to streamline their finances and file taxes with confidence
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg hover-lift shadow-xl"
              >
                Start free trial
              </Link>
              <Link
                href="/accounting"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all font-semibold text-lg hover-lift"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center border-t border-border">
        <p className="text-muted-foreground">&copy; 2025 Taxu. All rights reserved.</p>
      </footer>
    </main>
  )
}
