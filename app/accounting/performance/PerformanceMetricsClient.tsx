"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Target,
  Award,
  Activity,
  BarChart3,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react"

export default function PerformanceMetricsClient() {
  const [selectedIndustry, setSelectedIndustry] = useState("technology")

  // Sample KPI data
  const kpis = [
    {
      id: 1,
      category: "Revenue",
      name: "Monthly Recurring Revenue",
      value: "$2,450,000",
      change: 18.5,
      target: "$2,800,000",
      achieved: 87.5,
      benchmark: 72,
      status: "excellent" as const,
      period: "This Month",
    },
    {
      id: 2,
      category: "Revenue",
      name: "Customer Lifetime Value",
      value: "$24,500",
      change: 12.3,
      target: "$30,000",
      achieved: 81.7,
      benchmark: 68,
      status: "good" as const,
      period: "Current Average",
    },
    {
      id: 3,
      category: "Revenue",
      name: "Average Deal Size",
      value: "$8,750",
      change: -3.2,
      target: "$10,000",
      achieved: 87.5,
      benchmark: 85,
      status: "warning" as const,
      period: "Last 30 Days",
    },
    {
      id: 4,
      category: "Profitability",
      name: "Gross Profit Margin",
      value: "68.5%",
      change: 4.2,
      target: "70%",
      achieved: 97.9,
      benchmark: 62,
      status: "excellent" as const,
      period: "YTD",
    },
    {
      id: 5,
      category: "Profitability",
      name: "Operating Margin",
      value: "24.8%",
      change: 2.1,
      target: "28%",
      achieved: 88.6,
      benchmark: 20,
      status: "good" as const,
      period: "YTD",
    },
    {
      id: 6,
      category: "Profitability",
      name: "EBITDA Margin",
      value: "32.5%",
      change: 5.8,
      target: "35%",
      achieved: 92.9,
      benchmark: 28,
      status: "excellent" as const,
      period: "YTD",
    },
    {
      id: 7,
      category: "Efficiency",
      name: "Operating Expense Ratio",
      value: "43.7%",
      change: -2.4,
      target: "40%",
      achieved: 91.8,
      benchmark: 50,
      status: "good" as const,
      period: "This Quarter",
    },
    {
      id: 8,
      category: "Efficiency",
      name: "Revenue per Employee",
      value: "$185,000",
      change: 15.2,
      target: "$200,000",
      achieved: 92.5,
      benchmark: 150000,
      status: "excellent" as const,
      period: "Annual Run Rate",
    },
    {
      id: 9,
      category: "Efficiency",
      name: "Days Sales Outstanding",
      value: "38 days",
      change: -8.5,
      target: "30 days",
      achieved: 78.9,
      benchmark: 45,
      status: "good" as const,
      period: "Current",
    },
    {
      id: 10,
      category: "Growth",
      name: "Revenue Growth Rate",
      value: "34.2%",
      change: 3.5,
      target: "40%",
      achieved: 85.5,
      benchmark: 25,
      status: "excellent" as const,
      period: "YoY",
    },
    {
      id: 11,
      category: "Growth",
      name: "Customer Acquisition Rate",
      value: "156",
      change: 22.4,
      target: "180",
      achieved: 86.7,
      benchmark: 120,
      status: "good" as const,
      period: "This Month",
    },
    {
      id: 12,
      category: "Growth",
      name: "Customer Retention Rate",
      value: "94.5%",
      change: 1.8,
      target: "95%",
      achieved: 99.5,
      benchmark: 88,
      status: "excellent" as const,
      period: "Last 12 Months",
    },
    {
      id: 13,
      category: "Liquidity",
      name: "Cash Conversion Cycle",
      value: "42 days",
      change: -5.2,
      target: "35 days",
      achieved: 83.3,
      benchmark: 55,
      status: "good" as const,
      period: "Current",
    },
    {
      id: 14,
      category: "Liquidity",
      name: "Working Capital Ratio",
      value: "2.4",
      change: 0.3,
      target: "2.0",
      achieved: 120,
      benchmark: 1.8,
      status: "excellent" as const,
      period: "Current",
    },
    {
      id: 15,
      category: "Liquidity",
      name: "Quick Ratio",
      value: "1.8",
      change: 0.2,
      target: "1.5",
      achieved: 120,
      benchmark: 1.2,
      status: "excellent" as const,
      period: "Current",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle2 className="h-4 w-4" />
      case "good":
        return <CheckCircle2 className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "poor":
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-700 bg-green-100"
      case "good":
        return "text-blue-700 bg-blue-100"
      case "warning":
        return "text-orange-700 bg-orange-100"
      case "poor":
        return "text-red-700 bg-red-100"
      default:
        return "text-slate-700 bg-slate-100"
    }
  }

  const categories = ["All", "Revenue", "Profitability", "Efficiency", "Growth", "Liquidity"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredKPIs = selectedCategory === "All" ? kpis : kpis.filter((kpi) => kpi.category === selectedCategory)

  const excellentCount = kpis.filter((k) => k.status === "excellent").length
  const goodCount = kpis.filter((k) => k.status === "good").length
  const warningCount = kpis.filter((k) => k.status === "warning").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Metrics</h1>
          <p className="text-slate-600 mt-1">Track KPIs and benchmark against industry standards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Set Targets
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs text-green-700 font-semibold bg-green-200 px-3 py-1 rounded-full">
              {excellentCount} KPIs
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-green-700 font-medium">Excellent</p>
            <p className="text-3xl font-bold text-green-900">{excellentCount}</p>
            <p className="text-xs text-green-600">Above target & benchmark</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-blue-700 font-semibold bg-blue-200 px-3 py-1 rounded-full">
              {goodCount} KPIs
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-blue-700 font-medium">Good</p>
            <p className="text-3xl font-bold text-blue-900">{goodCount}</p>
            <p className="text-xs text-blue-600">Meeting expectations</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs text-orange-700 font-semibold bg-orange-200 px-3 py-1 rounded-full">
              {warningCount} KPIs
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-orange-700 font-medium">Needs Attention</p>
            <p className="text-3xl font-bold text-orange-900">{warningCount}</p>
            <p className="text-xs text-orange-600">Below target</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs text-purple-700 font-semibold bg-purple-200 px-3 py-1 rounded-full">
              Technology
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-purple-700 font-medium">Industry</p>
            <p className="text-3xl font-bold text-purple-900">Avg 87%</p>
            <p className="text-xs text-purple-600">Above benchmark</p>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKPIs.map((kpi) => (
          <Card key={kpi.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{kpi.category}</p>
                <h3 className="text-sm font-semibold text-slate-900">{kpi.name}</h3>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(kpi.status)}`}
              >
                {getStatusIcon(kpi.status)}
                {kpi.status}
              </span>
            </div>

            {/* Value */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
                <span
                  className={`flex items-center text-sm font-semibold ${kpi.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {kpi.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{kpi.period}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Progress to Target</span>
                <span className="font-semibold text-slate-900">{kpi.achieved.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    kpi.achieved >= 100 ? "bg-green-500" : kpi.achieved >= 80 ? "bg-blue-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min(kpi.achieved, 100)}%` }}
                />
              </div>
            </div>

            {/* Target & Benchmark */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-500 mb-1">Target</p>
                <p className="text-sm font-semibold text-slate-900">{kpi.target}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Industry Avg</p>
                <p className="text-sm font-semibold text-slate-900">
                  {typeof kpi.benchmark === "number"
                    ? kpi.benchmark >= 1000
                      ? `$${(kpi.benchmark / 1000).toFixed(0)}k`
                      : kpi.benchmark
                    : kpi.benchmark}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Industry Benchmarking Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Industry Benchmarking</h2>
            <p className="text-sm text-slate-500">Compare your performance against industry standards</p>
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="technology">Technology</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="services">Professional Services</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Revenue Growth</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-900">34.2%</p>
              <p className="text-xs text-green-600">vs Industry: 25%</p>
              <p className="text-xs text-green-700 font-semibold">+9.2% above avg</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Gross Margin</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">68.5%</p>
              <p className="text-xs text-blue-600">vs Industry: 62%</p>
              <p className="text-xs text-blue-700 font-semibold">+6.5% above avg</p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Revenue/Employee</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-900">$185k</p>
              <p className="text-xs text-purple-600">vs Industry: $150k</p>
              <p className="text-xs text-purple-700 font-semibold">+23% above avg</p>
            </div>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <p className="text-sm font-medium text-orange-900">DSO</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-900">38 days</p>
              <p className="text-xs text-orange-600">vs Industry: 45 days</p>
              <p className="text-xs text-orange-700 font-semibold">-7 days better</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
