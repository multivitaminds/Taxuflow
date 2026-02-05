import Link from "next/link"
import { Wallet, Check, ArrowRight, Camera, Tag, TrendingDown } from "lucide-react"

export default function ExpenseTrackingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
            <Wallet className="w-4 h-4" />
            Expense Tracking
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Capture Receipts and Categorize Expenses Automatically
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Never lose a receipt again. Snap photos, extract data with AI, and automatically categorize expenses for
            accurate bookkeeping and maximum tax deductions.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/expenses"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Camera,
              title: "Snap & Go",
              desc: "Take a photo of any receipt and AI extracts all the details instantly",
            },
            {
              icon: Tag,
              title: "Auto-Categorize",
              desc: "Machine learning categorizes expenses automatically with 95% accuracy",
            },
            {
              icon: TrendingDown,
              title: "Maximize Deductions",
              desc: "Never miss a tax deduction with comprehensive expense tracking",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Powerful Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Receipt OCR & data extraction",
              "Automatic categorization",
              "Mileage tracking",
              "Credit card sync",
              "Vendor management",
              "Multi-currency expenses",
              "Project expense allocation",
              "Billable expense tracking",
              "Expense approval workflows",
              "Custom expense categories",
              "Tax category mapping",
              "Expense reports & analytics",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
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
                title: "Vendor Management",
                desc: "Track vendor relationships and bills",
                href: "/services/vendor-management",
              },
              {
                title: "Banking",
                desc: "Connect accounts and reconcile automatically",
                href: "/services/banking",
              },
              {
                title: "Financial Reports",
                desc: "See where your money is going",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Track Every Expense?</h2>
          <p className="text-xl text-green-100 mb-8">Start maximizing your tax deductions today</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
