import Link from "next/link"
import { CreditCard, Check, ArrowRight, RefreshCw, Shield, Zap } from "lucide-react"

export default function BankingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
            <CreditCard className="w-4 h-4" />
            Banking
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Connect Accounts and Reconcile Transactions
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Securely connect your bank accounts and credit cards. Automatically import transactions and reconcile with
            one click for accurate, up-to-date books.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/banking"
              className="px-8 py-4 bg-white text-cyan-600 border-2 border-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: RefreshCw,
              title: "Auto-Sync",
              desc: "Transactions import automatically every day from all your accounts",
            },
            {
              icon: Shield,
              title: "Bank-Level Security",
              desc: "256-bit encryption and read-only access keeps your data safe",
            },
            {
              icon: Zap,
              title: "One-Click Reconciliation",
              desc: "Match transactions instantly with smart suggestions",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Powerful Banking Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Connect unlimited accounts",
              "Automatic transaction import",
              "Smart categorization",
              "One-click reconciliation",
              "Bank & credit card support",
              "Multi-currency accounts",
              "Transaction matching rules",
              "Duplicate detection",
              "Bank feed history",
              "Manual transaction entry",
              "Bank statement upload",
              "Reconciliation reports",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Works Great With</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Expense Tracking",
                desc: "Automatically categorize bank transactions",
                href: "/services/expense-tracking",
              },
              {
                title: "Vendor Management",
                desc: "Match payments to vendor bills",
                href: "/services/vendor-management",
              },
              {
                title: "Financial Reports",
                desc: "Real-time cash flow reporting",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-cyan-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Banking?</h2>
          <p className="text-xl text-cyan-100 mb-8">Connect your accounts and save hours every month</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-cyan-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
