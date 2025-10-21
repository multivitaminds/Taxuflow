import Link from "next/link"
import { Users, Check, ArrowRight, Heart, History, Bell } from "lucide-react"

export default function CustomerManagementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-violet-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Customer Management
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Track Customer Relationships and Payment History
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Build stronger customer relationships with comprehensive contact management, payment tracking, and
            communication history all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/customers"
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Heart,
              title: "Build Relationships",
              desc: "Keep detailed notes and communication history for every customer",
            },
            {
              icon: History,
              title: "Payment History",
              desc: "Track all invoices, payments, and outstanding balances in one view",
            },
            {
              icon: Bell,
              title: "Stay Connected",
              desc: "Automated reminders and follow-ups keep customers engaged",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Customer Profiles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Detailed contact information",
              "Payment history & trends",
              "Outstanding balance tracking",
              "Communication logs",
              "Custom fields & tags",
              "Multiple contacts per customer",
              "Billing & shipping addresses",
              "Customer portal access",
              "Payment terms & preferences",
              "Credit limit management",
              "Customer statements",
              "Lifetime value analytics",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
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
                title: "Invoicing",
                desc: "Send invoices directly from customer profiles",
                href: "/services/invoicing",
              },
              {
                title: "Project Tracking",
                desc: "Link projects to customers for better tracking",
                href: "/services/project-tracking",
              },
              {
                title: "Financial Reports",
                desc: "Analyze customer profitability",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Better Customer Relationships?</h2>
          <p className="text-xl text-purple-100 mb-8">Start managing your customers like a pro</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
