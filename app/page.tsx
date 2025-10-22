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
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            AI-Powered Business Operating System
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 text-balance">
            Complete Accounting & Bookkeeping for Modern Businesses
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Taxu combines cutting-edge AI with professional accounting tools to automate your finances, save time, and
            give you real-time insights into your business performance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/accounting"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Run Your Business</h2>
          <p className="text-xl text-gray-600">Comprehensive tools that work together seamlessly</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              title: "Invoicing",
              desc: "Create professional invoices and get paid faster",
              href: "/services/invoicing",
              color: "blue",
            },
            {
              icon: Wallet,
              title: "Expense Tracking",
              desc: "Capture receipts and categorize expenses automatically",
              href: "/services/expense-tracking",
              color: "green",
            },
            {
              icon: Users,
              title: "Customer Management",
              desc: "Track customer relationships and payment history",
              href: "/services/customer-management",
              color: "purple",
            },
            {
              icon: BarChart3,
              title: "Financial Reports",
              desc: "Real-time P&L, balance sheets, and cash flow",
              href: "/services/financial-reports",
              color: "orange",
            },
            {
              icon: Building2,
              title: "Vendor Management",
              desc: "Manage bills and vendor relationships",
              href: "/services/vendor-management",
              color: "red",
            },
            {
              icon: CreditCard,
              title: "Banking",
              desc: "Connect accounts and reconcile transactions",
              href: "/services/banking",
              color: "cyan",
            },
            {
              icon: Package,
              title: "Products & Services",
              desc: "Manage your product catalog and pricing",
              href: "/services/products-services",
              color: "yellow",
            },
            {
              icon: TrendingUp,
              title: "Project Tracking",
              desc: "Track project profitability and time",
              href: "/services/project-tracking",
              color: "pink",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <feature.icon
                className={`w-12 h-12 text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Powered by Artificial Intelligence</h2>
            <p className="text-xl text-blue-100">Let AI handle the busywork while you focus on growing your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Smart Categorization",
                desc: "AI automatically categorizes transactions and expenses",
              },
              { icon: Brain, title: "Receipt OCR", desc: "Extract data from receipts instantly with computer vision" },
              {
                icon: TrendingUp,
                title: "Cash Flow Predictions",
                desc: "Forecast your cash flow with machine learning",
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50K+", label: "Active Users" },
            { value: "$2B+", label: "Transactions Processed" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses using Taxu to streamline their finances
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2025 Taxu. All rights reserved.</p>
      </footer>
    </main>
  )
}
