"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function InvestmentsClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const portfolioStats = [
    { label: "Total Portfolio Value", value: "$284,567.89", change: "+12.4%", trend: "up", icon: DollarSign },
    { label: "Total Gains", value: "+$31,245.67", change: "+12.3%", trend: "up", icon: TrendingUp },
    { label: "Day Change", value: "+$1,234.56", change: "+0.43%", trend: "up", icon: BarChart3 },
    { label: "Asset Allocation", value: "8 Holdings", change: "Diversified", trend: "neutral", icon: PieChart },
  ]

  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 150,
      price: 182.45,
      value: 27367.5,
      change: 2.3,
      allocation: 9.6,
      type: "Stock",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 120,
      price: 378.91,
      value: 45469.2,
      change: 1.8,
      allocation: 16.0,
      type: "Stock",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 200,
      price: 141.8,
      value: 28360.0,
      change: -0.5,
      allocation: 10.0,
      type: "Stock",
    },
    {
      symbol: "VOO",
      name: "Vanguard S&P 500 ETF",
      shares: 300,
      price: 442.15,
      value: 132645.0,
      change: 0.9,
      allocation: 46.6,
      type: "ETF",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      shares: 0.5,
      price: 67234.0,
      value: 33617.0,
      change: 5.2,
      allocation: 11.8,
      type: "Crypto",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      shares: 5,
      price: 3421.78,
      value: 17108.9,
      change: 3.4,
      allocation: 6.0,
      type: "Crypto",
    },
  ]

  const aiRecommendations = [
    {
      type: "opportunity",
      title: "Rebalance Portfolio",
      description: "Your tech stock allocation is 25% above target. Consider rebalancing to reduce concentration risk.",
      impact: "high",
      confidence: 87,
      action: "Review allocation",
    },
    {
      type: "insight",
      title: "Tax Loss Harvesting",
      description: "GOOGL position down 0.5%. Consider harvesting losses for tax optimization before year-end.",
      impact: "medium",
      confidence: 92,
      action: "View details",
    },
    {
      type: "warning",
      title: "High Crypto Exposure",
      description: "Crypto allocation at 17.8% exceeds recommended 10% for your risk profile.",
      impact: "medium",
      confidence: 95,
      action: "Reduce exposure",
    },
  ]

  const performance = [
    { period: "1 Day", value: "+$1,234.56", percent: "+0.43%", trend: "up" },
    { period: "1 Week", value: "+$4,567.89", percent: "+1.63%", trend: "up" },
    { period: "1 Month", value: "+$8,234.12", percent: "+2.98%", trend: "up" },
    { period: "3 Months", value: "+$15,678.90", percent: "+5.83%", trend: "up" },
    { period: "1 Year", value: "+$31,245.67", percent: "+12.33%", trend: "up" },
    { period: "All Time", value: "+$31,245.67", percent: "+12.33%", trend: "up" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Investment Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your investments across stocks, ETFs, and crypto
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Add Investment</Button>
          <Button>Make Trade</Button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {portfolioStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                  {stat.trend === "down" && <ArrowDownRight className="h-4 w-4 text-red-500" />}
                  <span
                    className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Diversification across asset types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stocks (35.6%)</span>
                      <span className="font-medium">$101,196.70</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "35.6%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ETFs (46.6%)</span>
                      <span className="font-medium">$132,645.00</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "46.6%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Crypto (17.8%)</span>
                      <span className="font-medium">$50,725.90</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: "17.8%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers (24h)</CardTitle>
                <CardDescription>Best performing assets today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {holdings
                    .slice(0, 4)
                    .sort((a, b) => b.change - a.change)
                    .map((holding) => (
                      <div
                        key={holding.symbol}
                        className="flex items-center justify-between hover:bg-accent p-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {holding.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium">{holding.symbol}</div>
                            <div className="text-xs text-muted-foreground">{holding.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${holding.price.toFixed(2)}</div>
                          <div
                            className={`text-xs flex items-center gap-1 ${holding.change >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {holding.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {holding.change >= 0 ? "+" : ""}
                            {holding.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Holdings Tab */}
        <TabsContent value="holdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Holdings</CardTitle>
              <CardDescription>Complete portfolio breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {holdings.map((holding) => (
                  <div
                    key={holding.symbol}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{holding.symbol}</span>
                          <Badge variant="outline">{holding.type}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{holding.name}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-8 text-right">
                      <div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                        <div className="font-medium">{holding.shares}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Price</div>
                        <div className="font-medium">${holding.price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Value</div>
                        <div className="font-medium">${holding.value.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">24h Change</div>
                        <div
                          className={`font-medium flex items-center justify-end gap-1 ${holding.change >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {holding.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {holding.change >= 0 ? "+" : ""}
                          {holding.change}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Historical returns across different periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {performance.map((perf) => (
                  <div
                    key={perf.period}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-sm text-muted-foreground mb-2">{perf.period}</div>
                    <div className="text-2xl font-bold">{perf.value}</div>
                    <div
                      className={`text-sm flex items-center gap-1 mt-1 ${perf.trend === "up" ? "text-green-500" : "text-red-500"}`}
                    >
                      {perf.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {perf.percent}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {aiRecommendations.map((rec, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor:
                    rec.type === "opportunity" ? "#10b981" : rec.type === "warning" ? "#f59e0b" : "#3b82f6",
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${rec.type === "opportunity" ? "bg-green-100" : rec.type === "warning" ? "bg-orange-100" : "bg-blue-100"}`}
                      >
                        {rec.type === "opportunity" && <Zap className="h-5 w-5 text-green-600" />}
                        {rec.type === "warning" && <AlertCircle className="h-5 w-5 text-orange-600" />}
                        {rec.type === "insight" && <Target className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <CardDescription className="mt-1">{rec.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          rec.impact === "high" ? "destructive" : rec.impact === "medium" ? "default" : "secondary"
                        }
                      >
                        {rec.impact} impact
                      </Badge>
                      <div className="text-xs text-muted-foreground">{rec.confidence}% confidence</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    {rec.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
