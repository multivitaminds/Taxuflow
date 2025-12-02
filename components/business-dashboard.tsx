"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Wallet, Users, Receipt, TrendingUp, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function BusinessDashboard({ user, profile }: any) {
  const router = useRouter()

  const features = [
    {
      icon: Building2,
      title: "Accounting",
      description: "Full double-entry bookkeeping system",
      href: "/accounting",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Wallet,
      title: "Banking & Wallet",
      description: "Business accounts, cards, and transfers",
      href: "/neobank",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Manage team and payroll",
      href: "/accounting/employees",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Receipt,
      title: "Expense Tracking",
      description: "Track and categorize business expenses",
      href: "/accounting/expenses",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FileText,
      title: "Tax Filing",
      description: "Business tax returns and compliance",
      href: "/1099-filing",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Reports & Analytics",
      description: "Financial insights and forecasting",
      href: "/accounting/reports",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {profile?.full_name || "Business Owner"}
          </h1>
          <p className="text-lg text-slate-600">{profile?.company_name || "Your Business"} · Business Plan</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">$24,680</p>
            <p className="text-xs text-green-600 mt-2">+12.5% from last month</p>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Expenses</p>
            <p className="text-3xl font-bold text-slate-900">$8,430</p>
            <p className="text-xs text-red-600 mt-2">+3.2% from last month</p>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Cash Balance</p>
            <p className="text-3xl font-bold text-slate-900">$45,200</p>
            <p className="text-xs text-slate-600 mt-2">Across 3 accounts</p>
          </Card>
          <Card className="p-6 bg-white border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Tax Savings</p>
            <p className="text-3xl font-bold text-slate-900">$12,800</p>
            <p className="text-xs text-blue-600 mt-2">Q1 2025 estimate</p>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="p-8 bg-white border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <div className="flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                  Access now <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Subscription CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-indigo-600 to-purple-600 border-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Audit Shield Pro</h3>
              <p className="text-indigo-100">Get full audit protection and IRS representation</p>
            </div>
            <Button
              onClick={() => router.push("/pricing")}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8"
            >
              Upgrade Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
