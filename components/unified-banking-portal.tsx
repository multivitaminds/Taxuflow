"use client"
import { Card } from "@/components/ui/card"
import {
  Wallet,
  CreditCard,
  ArrowLeftRight,
  PiggyBank,
  TrendingUp,
  Bitcoin,
  Building,
  Receipt,
  Globe,
  BarChartBig as ChartBar,
  Target,
  Calculator,
} from "lucide-react"
import { NeobankDashboard } from "@/components/neobank/neobank-dashboard"
import { FinancialTrendGraph } from "@/components/financial-trend-graph"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function UnifiedBankingPortal() {
  const quickActions = [
    {
      href: "/neobank/accounts",
      icon: Wallet,
      title: "Accounts",
      description: "Manage your accounts",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      count: 3,
    },
    {
      href: "/neobank/cards",
      icon: CreditCard,
      title: "Cards",
      description: "Virtual & physical cards",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      count: 2,
    },
    {
      href: "/neobank/transfers",
      icon: ArrowLeftRight,
      title: "Transfers",
      description: "Move money easily",
      color: "text-green-600",
      bgColor: "bg-green-50",
      badge: "New",
    },
    {
      href: "/neobank/tax-buckets",
      icon: PiggyBank,
      title: "Tax Savings",
      description: "Automated tax buckets",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      count: "$12.4k saved",
    },
    {
      href: "/neobank/spending",
      icon: TrendingUp,
      title: "Spending Analytics",
      description: "Track your expenses",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      href: "/neobank/crypto",
      icon: Bitcoin,
      title: "Crypto",
      description: "Buy & sell crypto",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      badge: "Hot",
    },
    {
      href: "/neobank/atms",
      icon: Building,
      title: "ATM Locator",
      description: "Find nearby ATMs",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      count: "234 nearby",
    },
    {
      href: "/neobank/bill-pay",
      icon: Receipt,
      title: "Bill Pay",
      description: "Automate bill payments",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      count: 5,
    },
    {
      href: "/neobank/international",
      icon: Globe,
      title: "International",
      description: "Global transfers",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      href: "/neobank/reports",
      icon: ChartBar,
      title: "Reports",
      description: "Financial insights",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      href: "/neobank/investments",
      icon: Target,
      title: "Investments",
      description: "Grow your wealth",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      badge: "New",
    },
    {
      href: "/neobank/loans",
      icon: Calculator,
      title: "Loans",
      description: "Business financing",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 pb-6 pt-3.5">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1.5">Banking & Wallet</h1>
              <p className="text-sm text-slate-600">All your financial tools in one place</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Financial Trend Graph with Show/Hide toggle */}
        <div className="mb-6">
          <FinancialTrendGraph
            title="Account Balance Trends"
            metrics={[
              {
                label: "Net change this month",
                value: 2329611.61,
                change: "vs. $912,107.23 last month",
                color: "#22c55e",
              },
              { label: "Money in", value: 2929069.16, color: "#22c55e" },
              { label: "Money out", value: -599457.55, color: "#ef4444" },
            ]}
          />
        </div>

        {/* Quick Actions - Enhanced with interactive states */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.href}>
              <Card className="p-4 bg-white border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group relative overflow-hidden">
                <div
                  className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-5 transition-opacity`}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    {action.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none"
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-0.5">{action.title}</h3>
                  <p className="text-xs text-slate-600">{action.description}</p>
                  {action.count && (
                    <div className="mt-2 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block">
                      {action.count}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Banking Dashboard */}
        <NeobankDashboard />
      </div>
    </div>
  )
}
