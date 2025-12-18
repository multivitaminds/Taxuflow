import Link from "next/link"
import { BarChart3, Check, ArrowRight, PieChart, LineChart, Activity } from "lucide-react"

export default function FinancialReportsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            Financial Reports
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Real-Time P&L, Balance Sheets, and Cash Flow
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Get instant insights into your business performance with comprehensive financial reports that update in
            real-time. Make data-driven decisions with confidence.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/reports"
              className="px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Activity,
              title: "Real-Time Updates",
              desc: "Reports update automatically as transactions are recorded",
            },
            {
              icon: PieChart,
              title: "Visual Insights",
              desc: "Beautiful charts and graphs make data easy to understand",
            },
            {
              icon: LineChart,
              title: "Trend Analysis",
              desc: "Compare periods and identify trends to forecast future performance",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comprehensive Reporting</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Profit & Loss statements",
              "Balance sheets",
              "Cash flow statements",
              "Accounts receivable aging",
              "Accounts payable aging",
              "Sales by customer reports",
              "Expense by category reports",
              "Budget vs actual analysis",
              "Custom date ranges",
              "Multi-period comparisons",
              "Export to Excel/PDF",
              "Scheduled report delivery",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
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
                title: "Banking",
                desc: "Reconcile accounts for accurate reporting",
                href: "/services/banking",
              },
              {
                title: "Invoicing",
                desc: "Track revenue and outstanding payments",
                href: "/services/invoicing",
              },
              {
                title: "Expense Tracking",
                desc: "Monitor costs and profitability",
                href: "/services/expense-tracking",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-orange-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Real-Time Financial Insights?</h2>
          <p className="text-xl text-orange-100 mb-8">Make better decisions with comprehensive reporting</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
