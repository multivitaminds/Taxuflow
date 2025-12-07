"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Target,
  Zap,
  Eye,
  Plus,
} from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Cell } from "recharts"

const portfolioData = [
  { month: "Jan", value: 125000, returns: 8500 },
  { month: "Feb", value: 132000, returns: 7000 },
  { month: "Mar", value: 145000, returns: 13000 },
  { month: "Apr", value: 142000, returns: -3000 },
  { month: "May", value: 158000, returns: 16000 },
  { month: "Jun", value: 164500, returns: 6500 },
]

const holdings = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    shares: 50,
    avgCost: 150,
    currentPrice: 185.5,
    value: 9275,
    return: 23.67,
    returnAmount: 1775,
    allocation: 5.6,
  },
  {
    id: 2,
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "Stock",
    shares: 30,
    avgCost: 280,
    currentPrice: 378.9,
    value: 11367,
    return: 35.32,
    returnAmount: 2967,
    allocation: 6.9,
  },
  {
    id: 3,
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "ETF",
    shares: 100,
    avgCost: 380,
    currentPrice: 445.2,
    value: 44520,
    return: 17.16,
    returnAmount: 6520,
    allocation: 27.1,
  },
  {
    id: 4,
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    shares: 80,
    avgCost: 210,
    currentPrice: 248.6,
    value: 19888,
    return: 18.38,
    returnAmount: 3088,
    allocation: 12.1,
  },
  {
    id: 5,
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "Stock",
    shares: 25,
    avgCost: 220,
    currentPrice: 248.5,
    value: 6212.5,
    return: 12.95,
    returnAmount: 712.5,
    allocation: 3.8,
  },
  {
    id: 6,
    symbol: "BTC",
    name: "Bitcoin",
    type: "Crypto",
    shares: 0.5,
    avgCost: 42000,
    currentPrice: 65000,
    value: 32500,
    return: 54.76,
    returnAmount: 11500,
    allocation: 19.8,
  },
  {
    id: 7,
    symbol: "ETH",
    name: "Ethereum",
    type: "Crypto",
    shares: 10,
    avgCost: 2200,
    currentPrice: 3500,
    value: 35000,
    return: 59.09,
    returnAmount: 13000,
    allocation: 21.3,
  },
  {
    id: 8,
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    type: "ETF",
    shares: 15,
    avgCost: 340,
    currentPrice: 387.8,
    value: 5817,
    return: 14.06,
    returnAmount: 717,
    allocation: 3.5,
  },
]

const allocationData = [
  { name: "Stocks", value: 27854.5, percentage: 16.9, color: "#635bff" },
  { name: "ETFs", value: 70225, percentage: 42.7, color: "#0a2540" },
  { name: "Crypto", value: 67500, percentage: 41.0, color: "#ff6b35" },
]

const aiRecommendations = [
  {
    id: 1,
    type: "opportunity",
    title: "Rebalance Portfolio",
    description: "Your crypto allocation is above your target. Consider rebalancing to reduce risk.",
    impact: "High",
    confidence: 92,
    action: "Rebalance Now",
  },
  {
    id: 2,
    type: "insight",
    title: "Tax-Loss Harvesting Opportunity",
    description: "TSLA has underperformed. Consider harvesting losses to offset gains.",
    impact: "Medium",
    confidence: 85,
    action: "View Details",
  },
  {
    id: 3,
    type: "warning",
    title: "High Concentration Risk",
    description: "ETFs represent 42.7% of your portfolio. Diversification recommended.",
    impact: "Medium",
    confidence: 78,
    action: "Diversify",
  },
  {
    id: 4,
    type: "opportunity",
    title: "Dollar-Cost Averaging",
    description: "Set up automatic monthly investments to reduce volatility risk.",
    impact: "High",
    confidence: 88,
    action: "Set Up Auto-Invest",
  },
]

export default function InvestmentsClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCost, 0)
  const totalReturn = totalValue - totalCost
  const returnPercentage = ((totalReturn / totalCost) * 100).toFixed(2)
  const todayChange = 2450.5
  const todayChangePercent = 1.49

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Investment Portfolio</h1>
          <p className="text-slate-600 mt-2">Track stocks, ETFs, crypto, and performance analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Eye className="h-4 w-4 mr-2" />
            Watch List
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#4f46e5]">
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#0a2540] to-[#1e3a5f] text-white border-none hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Total Portfolio Value</p>
                <h2 className="text-3xl font-bold mt-2">${totalValue.toLocaleString()}</h2>
                <div className="flex items-center mt-2 text-emerald-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+{returnPercentage}% All-Time</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Today's Change</p>
                <h2 className="text-2xl font-bold mt-2 text-[#0a2540]">${todayChange.toLocaleString()}</h2>
                <div className="flex items-center mt-2 text-emerald-600 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+{todayChangePercent}%</span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Return</p>
                <h2 className="text-2xl font-bold mt-2 text-[#0a2540]">${totalReturn.toLocaleString()}</h2>
                <div className="flex items-center mt-2 text-emerald-600 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+{returnPercentage}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Holdings</p>
                <h2 className="text-2xl font-bold mt-2 text-[#0a2540]">{holdings.length}</h2>
                <div className="flex items-center mt-2 text-slate-500 text-sm">
                  <PieChart className="h-4 w-4 mr-1" />
                  <span>3 Asset Classes</span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <PieChart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>6-month value and returns trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={portfolioData}>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                        itemStyle={{ color: "#0a2540" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#635bff"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#635bff" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {allocationData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#0a2540]">{item.name}</span>
                      <span className="text-sm text-slate-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">${item.value.toLocaleString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Top Holdings</CardTitle>
              <CardDescription>Your best performing investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings
                  .sort((a, b) => b.return - a.return)
                  .slice(0, 5)
                  .map((holding) => (
                    <div
                      key={holding.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#635bff]/30 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#635bff] to-[#8f8bf5] flex items-center justify-center text-white font-bold">
                          {holding.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0a2540]">{holding.symbol}</h4>
                          <p className="text-sm text-slate-500">{holding.name}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {holding.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0a2540]">${holding.value.toLocaleString()}</p>
                        <div
                          className={`flex items-center text-sm ${holding.return >= 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {holding.return >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          )}
                          <span>
                            {holding.return >= 0 ? "+" : ""}
                            {holding.return.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Holdings</CardTitle>
                  <CardDescription>Complete list of your investments</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Filter by Type
                  </Button>
                  <Button variant="outline" size="sm">
                    Sort by Return
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Symbol</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Shares</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Avg Cost</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Current Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Value</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Return</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Allocation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => (
                      <tr
                        key={holding.id}
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0a2540]">{holding.symbol}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{holding.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{holding.type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right text-sm">{holding.shares}</td>
                        <td className="py-3 px-4 text-right text-sm">${holding.avgCost.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-sm">${holding.currentPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#0a2540]">
                          ${holding.value.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div
                            className={`flex items-center justify-end text-sm font-medium ${holding.return >= 0 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {holding.return >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            <span>
                              {holding.return >= 0 ? "+" : ""}
                              {holding.return.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600">{holding.allocation}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
                <CardDescription>6-month performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioData}>
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      />
                      <Bar dataKey="returns" radius={[8, 8, 0, 0]}>
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.returns >= 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key investment statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Invested</span>
                  <span className="text-lg font-bold text-[#0a2540]">${totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Current Value</span>
                  <span className="text-lg font-bold text-[#0a2540]">${totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-600">Total Gain/Loss</span>
                  <span className="text-lg font-bold text-emerald-600">${totalReturn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Return on Investment</span>
                  <span className="text-lg font-bold text-emerald-600">+{returnPercentage}%</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Best Performer</span>
                  <span className="text-sm font-medium text-[#0a2540]">ETH (+59.09%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Worst Performer</span>
                  <span className="text-sm font-medium text-[#0a2540]">TSLA (+12.95%)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Avg. Annual Return</p>
                    <p className="text-2xl font-bold text-[#0a2540]">18.4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Volatility (Std Dev)</p>
                    <p className="text-2xl font-bold text-[#0a2540]">12.3%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Sharpe Ratio</p>
                    <p className="text-2xl font-bold text-[#0a2540]">1.52</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Class Breakdown</CardTitle>
                <CardDescription>Portfolio distribution by asset type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {allocationData.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-[#0a2540]">{item.name}</span>
                      </div>
                      <span className="text-sm text-slate-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Value: ${item.value.toLocaleString()}</span>
                      <span className="text-slate-500">
                        {
                          holdings.filter((h) => {
                            if (item.name === "Stocks") return h.type === "Stock"
                            if (item.name === "ETFs") return h.type === "ETF"
                            if (item.name === "Crypto") return h.type === "Crypto"
                            return false
                          }).length
                        }{" "}
                        holdings
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diversification Score</CardTitle>
                <CardDescription>Portfolio risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                    <span className="text-4xl font-bold">B+</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-4">Good diversification with moderate risk</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-[#0a2540]">Multiple Asset Classes</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Good
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-[#0a2540]">Crypto Concentration</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      Watch
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-[#0a2540]">Sector Distribution</span>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Good
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Holdings by Allocation</CardTitle>
              <CardDescription>Ranked by portfolio weight</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {holdings
                  .sort((a, b) => b.allocation - a.allocation)
                  .map((holding) => (
                    <div
                      key={holding.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#0a2540]">{holding.symbol}</span>
                        <Badge variant="secondary" className="text-xs">
                          {holding.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-[#635bff]"
                              style={{ width: `${(holding.allocation / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[#0a2540] w-16 text-right">
                          {holding.allocation}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6">
          <Card className="bg-gradient-to-br from-[#635bff] to-[#8f8bf5] text-white border-none">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6" />
                <h3 className="text-xl font-bold">AI-Powered Investment Insights</h3>
              </div>
              <p className="text-white/90">
                Our AI analyzes your portfolio in real-time to provide personalized recommendations based on market
                trends, risk tolerance, and financial goals.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {aiRecommendations.map((rec) => (
              <Card
                key={rec.id}
                className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                  rec.type === "opportunity"
                    ? "border-l-emerald-500"
                    : rec.type === "warning"
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {rec.type === "opportunity" && (
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <Zap className="h-5 w-5 text-emerald-600" />
                        </div>
                      )}
                      {rec.type === "warning" && (
                        <div className="p-2 bg-yellow-50 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                      {rec.type === "insight" && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{rec.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={
                              rec.impact === "High"
                                ? "bg-red-100 text-red-700"
                                : rec.impact === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }
                          >
                            {rec.impact} Impact
                          </Badge>
                          <span className="text-xs text-slate-500">Confidence: {rec.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{rec.description}</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {rec.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Health Score</CardTitle>
              <CardDescription>AI-driven assessment of your investment strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 mb-3">
                    <span className="text-3xl font-bold">85</span>
                  </div>
                  <p className="font-medium text-[#0a2540]">Overall Score</p>
                  <p className="text-sm text-slate-500 mt-1">Strong portfolio health</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Diversification</span>
                      <span className="font-medium text-[#0a2540]">82/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "82%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Risk Management</span>
                      <span className="font-medium text-[#0a2540]">88/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "88%" }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Performance</span>
                      <span className="font-medium text-[#0a2540]">90/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: "90%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Tax Efficiency</span>
                      <span className="font-medium text-[#0a2540]">78/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
