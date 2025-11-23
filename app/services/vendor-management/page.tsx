import Link from "next/link"
import { Building2, Check, ArrowRight, FileCheck, Calendar, CreditCard } from "lucide-react"

export default function VendorManagementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Vendor Management
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Manage Bills and Vendor Relationships</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Keep track of all your vendors, bills, and payment schedules in one place. Never miss a payment deadline and
            maintain strong supplier relationships.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/vendors"
              className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: FileCheck,
              title: "Bill Management",
              desc: "Track all bills from receipt to payment with automated workflows",
            },
            {
              icon: Calendar,
              title: "Payment Scheduling",
              desc: "Schedule payments and get reminders before due dates",
            },
            {
              icon: CreditCard,
              title: "Payment History",
              desc: "Complete payment history and 1099 tracking for tax time",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Vendor Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Vendor contact database",
              "Bill tracking & approval",
              "Payment scheduling",
              "1099 contractor tracking",
              "Purchase order management",
              "Vendor performance metrics",
              "Payment terms tracking",
              "Multi-currency support",
              "Recurring bill automation",
              "Vendor statements",
              "Payment history reports",
              "Tax document generation",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
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
                desc: "Link expenses to vendors automatically",
                href: "/services/expense-tracking",
              },
              {
                title: "Banking",
                desc: "Pay bills directly from your bank accounts",
                href: "/services/banking",
              },
              {
                title: "Financial Reports",
                desc: "Analyze spending by vendor",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Vendor Management?</h2>
          <p className="text-xl text-red-100 mb-8">Never miss a payment deadline again</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
