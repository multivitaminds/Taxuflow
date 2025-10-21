import Link from "next/link"
import { FileText, Check, ArrowRight, Zap, Clock, DollarSign } from "lucide-react"

export default function InvoicingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Invoicing
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Create Professional Invoices and Get Paid Faster
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Send beautiful, branded invoices in seconds. Track payments, send reminders, and get paid up to 2x faster
            with Taxu's intelligent invoicing system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/invoices"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Create and send invoices in under 60 seconds with smart templates",
            },
            {
              icon: Clock,
              title: "Get Paid Faster",
              desc: "Automated reminders and online payments reduce collection time by 50%",
            },
            {
              icon: DollarSign,
              title: "Track Everything",
              desc: "Real-time payment tracking and automatic reconciliation",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Professional branded templates",
              "Recurring invoices & subscriptions",
              "Multi-currency support",
              "Online payment processing",
              "Automatic payment reminders",
              "Late fee calculations",
              "Partial payment tracking",
              "PDF export & email delivery",
              "Mobile-friendly invoices",
              "Custom fields & line items",
              "Tax calculations",
              "Client portal access",
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
                title: "Customer Management",
                desc: "Track customer relationships and payment history",
                href: "/services/customer-management",
              },
              {
                title: "Expense Tracking",
                desc: "Monitor your costs alongside revenue",
                href: "/services/expense-tracking",
              },
              {
                title: "Financial Reports",
                desc: "See real-time P&L and cash flow",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Paid Faster?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of businesses using Taxu for invoicing</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
