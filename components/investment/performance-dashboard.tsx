"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Award, Target, Download, BarChart3 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const performanceData = [
  { month: "Jan", portfolio: 50000, sp500: 50000 },
  { month: "Feb", portfolio: 52500, sp500: 51200 },
  { month: "Mar", portfolio: 51800, sp500: 50800 },
  { month: "Apr", portfolio: 54200, sp500: 52100 },
  { month: "May", portfolio: 56800, sp500: 53800 },
  { month: "Jun", portfolio: 58900, sp500: 55200 },
  { month: "Jul", portfolio: 61200, sp500: 57100 },
  { month: "Aug", portfolio: 63500, sp500: 59400 },
  { month: "Sep", portfolio: 62800, sp500: 58900 },
  { month: "Oct", portfolio: 65400, sp500: 60800 },
  { month: "Nov", portfolio: 67900, sp500: 62500 },
  { month: "Dec", portfolio: 71250, sp500: 64200 },
]

const monthlyReturns = [
  { month: "Jan", return: 5.0 },
  { month: "Feb", return: 2.3 },
  { month: "Mar", return: -1.3 },
  { month: "Apr", return: 4.6 },
  { month: "May", return: 4.8 },
  { month: "Jun", return: 3.7 },
  { month: "Jul", return: 3.9 },
  { month: "Aug", return: 3.8 },
  { month: "Sep", return: -1.1 },
  { month: "Oct", return: 4.1 },
  { month: "Nov", return: 3.8 },
  { month: "Dec", return: 4.9 },
]

const performanceMetrics = [
  { label: "Total Return", value: "42.5%", comparison: "+10.8% vs S&P 500", positive: true },
  { label: "Annualized Return", value: "15.2%", comparison: "+3.4% vs S&P 500", positive: true },
  { label: "Sharpe Ratio", value: "1.85", comparison: "Excellent risk-adjusted returns", positive: true },
  { label: "Max Drawdown", value: "-8.3%", comparison: "Better than market -12.4%", positive: true },
  { label: "Win Rate", value: "83.3%", comparison: "10 of 12 positive months", positive: true },
  { label: "Alpha", value: "+5.4%", comparison: "Outperformed benchmark", positive: true },
]

const topPerformers = [
  { symbol: "NVDA", return: 145.2, contribution: 2890 },
  { symbol: "META", return: 78.4, contribution: 1450 },
  { symbol: "MSFT", return: 52.3, contribution: 1230 },
]

const worstPerformers = [
  { symbol: "TSLA", return: -12.4, contribution: -340 },
  { symbol: "SQ", return: -18.7, contribution: -520 },
  { symbol: "UBER", return: -9.2, contribution: -280 },
]

export function PerformanceDashboard({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
            <p className="text-slate-600 mt-1">Detailed insights into your investment returns</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white gap-2">
              <BarChart3 className="h-4 w-4" />
              Generate Tax Report
            </Button>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Portfolio Value</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">$71,250</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 border-green-300">+$21,250 (42.5%)</Badge>
                <span className="text-xs text-slate-500">All-time</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">YTD Return</p>
                <p className="text-3xl font-bold text-green-600 mt-1">+42.5%</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-7 w-7 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-green-600 font-medium">+10.8% vs S&P 500</p>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Tax Efficiency</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">94.2%</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="h-7 w-7 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-purple-600 font-medium">Saved $3,245 in taxes</p>
            </div>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Portfolio vs Benchmark</h3>
              <p className="text-sm text-slate-600">Your portfolio compared to S&P 500</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-600" />
                <span className="text-sm text-slate-600">Your Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-400" />
                <span className="text-sm text-slate-600">S&P 500</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635bff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSP500" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="#635bff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPortfolio)"
              />
              <Area
                type="monotone"
                dataKey="sp500"
                stroke="#94a3b8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSP500)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Returns */}
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Monthly Returns</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyReturns}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="return" fill="#635bff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Key Metrics</h3>
            <div className="space-y-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.label} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                    <span className="text-xl font-bold text-slate-900">{metric.value}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{metric.comparison}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top & Worst Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-900">Top Performers</h3>
            </div>
            <div className="space-y-4">
              {topPerformers.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{stock.symbol}</p>
                      <p className="text-sm text-green-600 font-medium">+{stock.return}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Contribution</p>
                    <p className="font-semibold text-green-600">+${stock.contribution}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900">Worst Performers</h3>
            </div>
            <div className="space-y-4">
              {worstPerformers.map((stock, index) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{stock.symbol}</p>
                      <p className="text-sm text-red-600 font-medium">{stock.return}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Contribution</p>
                    <p className="font-semibold text-red-600">${stock.contribution}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
