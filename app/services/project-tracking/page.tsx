import Link from "next/link"
import { TrendingUp, Check, ArrowRight, Clock, Target, Users } from "lucide-react"

export default function ProjectTrackingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Project Tracking
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Track Project Profitability and Time</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Monitor project costs, time, and profitability in real-time. Know exactly which projects are making money
            and which need attention.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/projects"
              className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-600 rounded-lg hover:bg-pink-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Clock,
              title: "Time Tracking",
              desc: "Track billable hours and automatically generate invoices from time entries",
            },
            {
              icon: Target,
              title: "Budget Management",
              desc: "Set project budgets and get alerts when you're approaching limits",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              desc: "Assign tasks, track progress, and collaborate with your team",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Project Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Unlimited projects",
              "Time tracking & timesheets",
              "Expense allocation",
              "Budget tracking",
              "Profitability analysis",
              "Task management",
              "Team member assignment",
              "Billable vs non-billable hours",
              "Project milestones",
              "Client portal access",
              "Project reports & analytics",
              "Invoice from time entries",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
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
                desc: "Link projects to customers for better tracking",
                href: "/services/customer-management",
              },
              {
                title: "Invoicing",
                desc: "Bill clients directly from project time entries",
                href: "/services/invoicing",
              },
              {
                title: "Financial Reports",
                desc: "Analyze project profitability",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-pink-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Track Project Profitability?</h2>
          <p className="text-xl text-pink-100 mb-8">Know which projects are making you money</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
