"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Globe,
  ArrowLeftRight,
  DollarSign,
  Euro,
  PoundSterling,
  Plus,
  Search,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function MultiCurrencyClient() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    {
      label: "Total Balance",
      value: "$127,456.32",
      change: "+5.2%",
      trend: "up",
      icon: Wallet,
      equivalent: "USD Equivalent",
    },
    {
      label: "Active Currencies",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Globe,
      subtext: "Currencies",
    },
    {
      label: "Monthly Exchange Volume",
      value: "$24,890",
      change: "+12.4%",
      trend: "up",
      icon: ArrowLeftRight,
      subtext: "This month",
    },
    {
      label: "Savings on Fees",
      value: "$432",
      change: "vs traditional banks",
      trend: "neutral",
      icon: DollarSign,
      subtext: "Last 30 days",
    },
  ]

  const currencies = [
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      balance: 45230.5,
      icon: DollarSign,
      change: "+2.3%",
      trend: "up",
      flag: "🇺🇸",
      rate: 1.0,
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      balance: 28450.75,
      icon: Euro,
      change: "+1.8%",
      trend: "up",
      flag: "🇪🇺",
      rate: 0.92,
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      balance: 18920.0,
      icon: PoundSterling,
      change: "-0.5%",
      trend: "down",
      flag: "🇬🇧",
      rate: 0.79,
    },
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      balance: 3245600.0,
      icon: DollarSign,
      change: "+3.2%",
      trend: "up",
      flag: "🇯🇵",
      rate: 149.5,
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      balance: 12450.25,
      icon: DollarSign,
      change: "+1.2%",
      trend: "up",
      flag: "🇨🇦",
      rate: 1.35,
    },
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
      balance: 8920.5,
      icon: DollarSign,
      change: "+2.1%",
      trend: "up",
      flag: "🇦🇺",
      rate: 1.52,
    },
    {
      code: "CHF",
      name: "Swiss Franc",
      symbol: "Fr",
      balance: 5430.75,
      icon: DollarSign,
      change: "+0.8%",
      trend: "up",
      flag: "🇨🇭",
      rate: 0.88,
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      symbol: "¥",
      balance: 34560.0,
      icon: DollarSign,
      change: "+1.5%",
      trend: "up",
      flag: "🇨🇳",
      rate: 7.24,
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "exchange",
      from: "USD",
      to: "EUR",
      fromAmount: 5000,
      toAmount: 4600,
      rate: 0.92,
      date: "2024-01-15",
      time: "14:32",
      fee: 12.5,
    },
    {
      id: 2,
      type: "receive",
      from: "GBP",
      amount: 2500,
      date: "2024-01-14",
      time: "09:15",
      sender: "International Client",
    },
    {
      id: 3,
      type: "send",
      to: "JPY",
      amount: 150000,
      date: "2024-01-13",
      time: "16:45",
      recipient: "Tokyo Supplier",
    },
  ]

  const aiInsights = [
    {
      title: "Favorable EUR Exchange Rate",
      description: "EUR/USD rate is 2.3% better than 30-day average. Consider exchanging now.",
      impact: "High",
      confidence: 92,
      action: "Exchange USD to EUR",
      icon: TrendingUp,
      type: "opportunity",
    },
    {
      title: "GBP Rate Declining",
      description: "British Pound showing downward trend. May want to hold off on GBP exchanges.",
      impact: "Medium",
      confidence: 85,
      action: "Monitor GBP rates",
      icon: TrendingDown,
      type: "warning",
    },
    {
      title: "Fee Optimization",
      description: "Consolidating smaller balances could save $45/month in maintenance fees.",
      impact: "Medium",
      confidence: 88,
      action: "Consolidate accounts",
      icon: DollarSign,
      type: "insight",
    },
  ]

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Multi-Currency Accounts</h1>
          <p className="text-slate-600 mt-1">Manage multiple currencies in one place with real-time exchange rates</p>
        </div>
        <Button className="bg-gradient-to-r from-[#635bff] to-[#4f46e5] hover:from-[#5349e6] hover:to-[#4338ca]">
          <Plus className="h-4 w-4 mr-2" />
          Add Currency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-lg", "bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10")}>
                <stat.icon className="h-6 w-6 text-[#635bff]" />
              </div>
              {stat.trend !== "neutral" && (
                <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {stat.change}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
              {stat.equivalent && <p className="text-xs text-slate-400">{stat.equivalent}</p>}
              {stat.subtext && <p className="text-xs text-slate-400">{stat.subtext}</p>}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["overview", "exchange", "transactions", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors capitalize",
              activeTab === tab ? "text-[#635bff] border-b-2 border-[#635bff]" : "text-slate-600 hover:text-slate-900",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search currencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCurrencies.map((currency) => (
              <Card
                key={currency.code}
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{currency.flag}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{currency.code}</p>
                        <Badge
                          variant={currency.trend === "up" ? "default" : "destructive"}
                          className="text-xs bg-slate-100 text-slate-900 group-hover:bg-slate-200"
                        >
                          {currency.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{currency.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-600">{currency.symbol}</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {currency.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    ≈ $
                    {(currency.balance / currency.rate).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </div>
                  <div className="text-xs text-slate-400">Rate: {currency.rate} USD</div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                    <ArrowLeftRight className="h-3 w-3 mr-1" />
                    Exchange
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "exchange" && (
        <Card className="p-6 border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Currency Exchange</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">From</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Amount</label>
                <Input type="number" placeholder="0.00" className="text-lg" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">To</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff]">
                  <option>EUR - Euro</option>
                  <option>USD - US Dollar</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">You will receive</label>
                <div className="px-4 py-3 bg-slate-50 rounded-lg text-lg font-semibold text-slate-900">0.00</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Exchange Rate Information</p>
                <p className="text-sm text-blue-700 mt-1">Current rate: 1 USD = 0.92 EUR</p>
                <p className="text-xs text-blue-600 mt-2">Fee: $12.50 | Rate locked for 30 minutes</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-gradient-to-r from-[#635bff] to-[#4f46e5] hover:from-[#5349e6] hover:to-[#4338ca]">
            Exchange Currency
          </Button>
        </Card>
      )}

      {activeTab === "transactions" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-100">
                    <ArrowLeftRight className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{transaction.type}</p>
                    {transaction.type === "exchange" && (
                      <p className="text-sm text-slate-600">
                        {transaction.from} → {transaction.to}
                      </p>
                    )}
                    {transaction.type === "receive" && (
                      <p className="text-sm text-slate-600">From {transaction.sender}</p>
                    )}
                    {transaction.type === "send" && (
                      <p className="text-sm text-slate-600">To {transaction.recipient}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {transaction.type === "exchange" &&
                      `${transaction.fromAmount.toLocaleString()} ${transaction.from}`}
                    {transaction.type === "receive" && `+${transaction.amount?.toLocaleString()}`}
                    {transaction.type === "send" && `-${transaction.amount?.toLocaleString()}`}
                  </p>
                  <p className="text-sm text-slate-500">
                    {transaction.date} at {transaction.time}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#635bff]" />
            <h3 className="text-lg font-semibold text-slate-900">AI-Powered Currency Insights</h3>
          </div>

          <div className="grid gap-4">
            {aiInsights.map((insight, index) => (
              <Card
                key={index}
                className={cn(
                  "p-6 border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer",
                  insight.type === "opportunity" && "border-l-green-500 bg-green-50/50",
                  insight.type === "warning" && "border-l-amber-500 bg-amber-50/50",
                  insight.type === "insight" && "border-l-blue-500 bg-blue-50/50",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      insight.type === "opportunity" && "bg-green-100",
                      insight.type === "warning" && "bg-amber-100",
                      insight.type === "insight" && "bg-blue-100",
                    )}
                  >
                    <insight.icon
                      className={cn(
                        "h-6 w-6",
                        insight.type === "opportunity" && "text-green-600",
                        insight.type === "warning" && "text-amber-600",
                        insight.type === "insight" && "text-blue-600",
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs",
                            insight.impact === "High" && "bg-red-100 text-red-700",
                            insight.impact === "Medium" && "bg-amber-100 text-amber-700",
                            insight.impact === "Low" && "bg-green-100 text-green-700",
                          )}
                        >
                          {insight.impact} Impact
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{insight.description}</p>

                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "text-xs",
                        insight.type === "opportunity" && "border-green-200 text-green-700 hover:bg-green-50",
                        insight.type === "warning" && "border-amber-200 text-amber-700 hover:bg-amber-50",
                        insight.type === "insight" && "border-blue-200 text-blue-700 hover:bg-blue-50",
                      )}
                    >
                      {insight.action}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
