"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, PieChart, DollarSign, Target, Download } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart as RePieChart,
} from "recharts"

const performanceData = [
  { date: "Jan", value: 50000 },
  { date: "Feb", value: 52500 },
  { date: "Mar", value: 51800 },
  { date: "Apr", value: 54200 },
  { date: "May", value: 56800 },
  { date: "Jun", value: 58900 },
  { date: "Jul", value: 61200 },
  { date: "Aug", value: 63500 },
  { date: "Sep", value: 62800 },
  { date: "Oct", value: 65400 },
  { date: "Nov", value: 67900 },
  { date: "Dec", value: 71250 },
]

const allocationData = [
  { name: "Technology", value: 42.5, color: "#635bff" },
  { name: "Healthcare", value: 18.3, color: "#00d4ff" },
  { name: "Finance", value: 15.7, color: "#7c3aed" },
  { name: "Consumer", value: 12.8, color: "#06b6d4" },
  { name: "Energy", value: 6.2, color: "#f59e0b" },
  { name: "Real Estate", value: 4.5, color: "#10b981" },
]

export function PortfolioDashboard({
  user,
  holdings,
  transactions,
}: {
  user: any
  holdings: any[]
  transactions: any[]
}) {
  const displayHoldings =
    holdings && holdings.length > 0
      ? holdings.map((h) => ({
          symbol: h.symbol,
          name: h.name,
          shares: Number(h.shares),
          avgCost: Number(h.average_cost_basis),
          currentPrice: Number(h.current_price),
          value: Number(h.market_value),
          gain: Number(h.unrealized_gain_loss),
          gainPercent: Number(h.unrealized_gain_loss_percent),
          taxImpact: h.is_long_term_holding ? "Low" : "High",
        }))
      : [
          // Demo data when no holdings exist
          {
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 45,
            avgCost: 145.32,
            currentPrice: 178.45,
            value: 8030.25,
            gain: 1490.85,
            gainPercent: 22.8,
            taxImpact: "Low",
          },
          {
            symbol: "MSFT",
            name: "Microsoft Corp.",
            shares: 30,
            avgCost: 285.67,
            currentPrice: 378.91,
            value: 11367.3,
            gain: 2797.2,
            gainPercent: 32.6,
            taxImpact: "Medium",
          },
        ]

  const totalValue = displayHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalGain = displayHoldings.reduce((sum, h) => sum + h.gain, 0)
  const totalGainPercent = ((totalGain / (totalValue - totalGain)) * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Investment Portfolio</h1>
            <p className="text-slate-600 mt-1">Track and manage your investments with tax insights</p>
            {holdings && holdings.length === 0 && (
              <p className="text-sm text-amber-600 mt-2">
                No holdings found. The demo data is shown below. Add your first investment to get started!
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-2">
              <Target className="h-4 w-4" />
              Rebalance Portfolio
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalValue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+8.2%</span>
              <span className="text-slate-500">this month</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Gain/Loss</p>
                <p className="text-2xl font-bold text-green-600 mt-1">+${totalGain.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <span className="text-green-600 font-semibold">+{totalGainPercent}%</span>
              <span className="text-slate-500">total return</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Tax Savings</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">$3,245</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <span className="text-slate-500">via tax-loss harvesting</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Holdings</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{displayHoldings.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <span className="text-slate-500">across {allocationData.length} sectors</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Performance Chart */}
          <Card className="lg:col-span-2 p-6 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Portfolio Performance</h3>
                <p className="text-sm text-slate-600">Last 12 months</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  1M
                </Button>
                <Button variant="outline" size="sm">
                  3M
                </Button>
                <Button variant="outline" size="sm">
                  6M
                </Button>
                <Button size="sm" className="bg-indigo-600 text-white">
                  1Y
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635bff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
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
                  dataKey="value"
                  stroke="#635bff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Sector Allocation */}
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Sector Allocation</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-6">
              {allocationData.map((sector) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="text-sm text-slate-700">{sector.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{sector.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Current Holdings</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Shares</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Avg Cost</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Current Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Value</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Gain/Loss</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Tax Impact</th>
                </tr>
              </thead>
              <tbody>
                {displayHoldings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900">{holding.symbol}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">{holding.name}</td>
                    <td className="py-4 px-4 text-right text-sm text-slate-900">{holding.shares}</td>
                    <td className="py-4 px-4 text-right text-sm text-slate-600">${holding.avgCost.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-sm text-slate-900">${holding.currentPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-sm font-medium text-slate-900">
                      ${holding.value.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {holding.gain >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={
                            holding.gain >= 0
                              ? "text-green-600 font-medium text-sm"
                              : "text-red-600 font-medium text-sm"
                          }
                        >
                          {holding.gain >= 0 ? "+" : ""}${Math.abs(holding.gain).toFixed(2)} (
                          {holding.gainPercent >= 0 ? "+" : ""}
                          {holding.gainPercent}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge
                        variant="outline"
                        className={
                          holding.taxImpact === "High"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : holding.taxImpact === "Medium"
                              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                              : holding.taxImpact === "Low"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : "border-slate-300 bg-slate-50 text-slate-700"
                        }
                      >
                        {holding.taxImpact}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
