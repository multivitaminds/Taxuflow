"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Building2,
  Wallet,
  Users,
  Receipt,
  TrendingUp,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export function BusinessDashboard({ user, profile }: any) {
  const router = useRouter()

  const features = [
    {
      icon: Building2,
      title: "Accounting",
      description: "Full double-entry bookkeeping system",
      href: "/accounting",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Wallet,
      title: "Banking & Wallet",
      description: "Business accounts, cards, and transfers",
      href: "/neobank",
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
    },
    {
      icon: Users,
      title: "Employee Management",
      description: "Manage team and payroll",
      href: "/accounting/employees",
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
    },
    {
      icon: Receipt,
      title: "Expense Tracking",
      description: "Track and categorize business expenses",
      href: "/accounting/expenses",
      gradient: "from-orange-500 via-orange-600 to-red-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
    },
    {
      icon: FileText,
      title: "Tax Filing",
      description: "Business tax returns and compliance",
      href: "/1099-filing",
      gradient: "from-indigo-500 via-indigo-600 to-purple-600",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
    },
    {
      icon: TrendingUp,
      title: "Reports & Analytics",
      description: "Financial insights and forecasting",
      href: "/accounting/reports",
      gradient: "from-pink-500 via-rose-600 to-red-600",
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back, {profile?.full_name || "Business Owner"}
            </h1>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[10px] font-medium text-white">PRO</span>
            </div>
          </div>
          <p className="text-sm text-slate-600">{profile?.company_name || "Your Business"} · Business Plan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {/* Total Revenue Card */}
          <Card className="relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3.5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Total Revenue</p>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 rounded-md">
                  <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="text-[9px] font-semibold text-emerald-600">12.5%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">$24,680</p>
              {/* Mini sparkline */}
              <div className="flex items-end gap-0.5 h-6 mt-2">
                {[32, 45, 38, 52, 48, 55, 50, 62, 58, 70, 65, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5">vs last month</p>
            </div>
          </Card>

          {/* Expenses Card */}
          <Card className="relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3.5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Expenses</p>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 rounded-md">
                  <ArrowUpRight className="w-2.5 h-2.5 text-rose-600" />
                  <span className="text-[9px] font-semibold text-rose-600">3.2%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">$8,430</p>
              {/* Mini sparkline */}
              <div className="flex items-end gap-0.5 h-6 mt-2">
                {[45, 42, 48, 40, 55, 50, 58, 52, 60, 55, 62, 58].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-rose-500 to-rose-400 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5">vs last month</p>
            </div>
          </Card>

          {/* Cash Balance Card */}
          <Card className="relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3.5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Cash Balance</p>
                <div className="px-1.5 py-0.5 bg-blue-50 rounded-md">
                  <span className="text-[9px] font-semibold text-blue-600">3 accounts</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">$45,200</p>
              {/* Mini balance visualization */}
              <div className="flex gap-1 mt-2">
                <div className="flex-1 h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-md flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-white">60%</span>
                </div>
                <div className="flex-1 h-6 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-md flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-white">25%</span>
                </div>
                <div className="w-1/4 h-6 bg-gradient-to-r from-purple-500 to-purple-400 rounded-md flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-white">15%</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-1.5">Distribution across accounts</p>
            </div>
          </Card>

          {/* Tax Savings Card */}
          <Card className="relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-3.5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Tax Savings</p>
                <div className="px-1.5 py-0.5 bg-indigo-50 rounded-md">
                  <span className="text-[9px] font-semibold text-indigo-600">Q1 2025</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">$12,800</p>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-slate-500">Estimated savings</span>
                  <span className="text-[8px] font-semibold text-indigo-600">64%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[64%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-2">of max deduction limit</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer group h-full">
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity`}
                />

                <div className="relative p-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${feature.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{feature.description}</p>

                  {/* CTA */}
                  <div className="flex items-center text-indigo-600 text-xs font-medium group-hover:translate-x-1 transition-transform">
                    Access now
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </div>
                </div>

                {/* Accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                />
              </Card>
            </Link>
          ))}
        </div>

        <Card className="relative overflow-hidden mt-5 border-0 shadow-xl">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-xl font-bold text-white">Upgrade to Audit Shield Pro</h3>
                  <div className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Limited Offer</span>
                  </div>
                </div>
                <p className="text-sm text-indigo-100">
                  Get full audit protection and IRS representation with priority support
                </p>
              </div>
              <Button
                onClick={() => router.push("/pricing")}
                className="bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg font-semibold px-6 py-2 h-auto text-sm transition-all duration-300"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
