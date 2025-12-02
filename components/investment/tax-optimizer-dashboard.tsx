"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, TrendingDown, Sparkles, AlertCircle, CheckCircle2, DollarSign, Target, Calendar } from "lucide-react"

const harvestingOpportunities = [
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    shares: 25,
    currentLoss: 180.5,
    taxSavings: 54.15,
    washSaleRisk: "Low",
    recommendation: "Harvest Now",
  },
  {
    symbol: "SQ",
    name: "Block Inc.",
    shares: 60,
    currentLoss: 420.8,
    taxSavings: 126.24,
    washSaleRisk: "None",
    recommendation: "Harvest Now",
  },
  {
    symbol: "UBER",
    name: "Uber Technologies",
    shares: 80,
    currentLoss: 245.6,
    taxSavings: 73.68,
    washSaleRisk: "Medium",
    recommendation: "Wait 5 Days",
  },
]

const capitalGainsBreakdown = [
  { type: "Short-term Gains", amount: 8450, taxRate: 32, taxOwed: 2704 },
  { type: "Long-term Gains", amount: 12680, taxRate: 15, taxOwed: 1902 },
  { type: "Harvested Losses", amount: -846.9, taxRate: 32, taxSaved: 271 },
]

const optimizationTips = [
  {
    title: "Hold AAPL for 2 More Weeks",
    description: "Qualify for long-term capital gains (15% vs 32% tax rate)",
    potentialSavings: 612.5,
    priority: "High",
  },
  {
    title: "Rebalance in Your IRA",
    description: "Move high-growth assets to tax-advantaged accounts",
    potentialSavings: 450.0,
    priority: "Medium",
  },
  {
    title: "Max Out Your 401(k)",
    description: "Reduce taxable income by $7,500 before year-end",
    potentialSavings: 2400.0,
    priority: "High",
  },
]

export function TaxOptimizerDashboard({ user, profile }: { user: any; profile: any }) {
  const totalPotentialSavings = harvestingOpportunities.reduce((sum, opp) => sum + opp.taxSavings, 0) + 271
  const totalOpportunities = harvestingOpportunities.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tax Optimizer</h1>
            <p className="text-slate-600 mt-1">AI-powered tax loss harvesting and optimization strategies</p>
          </div>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white gap-2">
            <Sparkles className="h-4 w-4" />
            Run AI Analysis
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Potential Savings</p>
                <p className="text-2xl font-bold text-green-600 mt-1">${totalPotentialSavings.toFixed(2)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Available for tax-loss harvesting</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Opportunities</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalOpportunities}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Active harvesting positions</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">YTD Tax Saved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">$3,245</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Through optimization strategies</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Days to Year-End</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Time left to optimize</p>
          </Card>
        </div>

        {/* Tax-Loss Harvesting Opportunities */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Tax-Loss Harvesting Opportunities</h3>
              <p className="text-sm text-slate-600">Positions with unrealized losses you can harvest</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300">
              ${totalPotentialSavings.toFixed(2)} Available
            </Badge>
          </div>
          <div className="space-y-4">
            {harvestingOpportunities.map((opp) => (
              <div
                key={opp.symbol}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{opp.symbol}</span>
                      <span className="text-sm text-slate-600">• {opp.name}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-600">{opp.shares} shares</span>
                      <span className="text-sm text-red-600 font-medium">-${opp.currentLoss.toFixed(2)}</span>
                      <Badge
                        variant="outline"
                        className={
                          opp.washSaleRisk === "None"
                            ? "border-green-300 bg-green-50 text-green-700 text-xs"
                            : opp.washSaleRisk === "Low"
                              ? "border-yellow-300 bg-yellow-50 text-yellow-700 text-xs"
                              : "border-orange-300 bg-orange-50 text-orange-700 text-xs"
                        }
                      >
                        {opp.washSaleRisk} Wash Sale Risk
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Tax Savings</p>
                    <p className="text-xl font-bold text-green-600">${opp.taxSavings.toFixed(2)}</p>
                  </div>
                  <Button
                    className={
                      opp.recommendation === "Harvest Now" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                    }
                  >
                    {opp.recommendation}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capital Gains Breakdown */}
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">2024 Capital Gains Breakdown</h3>
            <div className="space-y-4">
              {capitalGainsBreakdown.map((item) => (
                <div key={item.type} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{item.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.taxRate}% Tax Rate
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${item.amount < 0 ? "text-red-600" : "text-slate-900"}`}>
                      {item.amount < 0 ? "-" : ""}${Math.abs(item.amount).toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-semibold ${item.type.includes("Losses") ? "text-green-600" : "text-slate-600"}`}
                    >
                      {item.type.includes("Losses") ? "Saved: " : "Owed: "}$
                      {item.type.includes("Losses") ? item.taxSaved.toFixed(2) : item.taxOwed.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Net Tax Impact</span>
                <span className="text-xl font-bold text-slate-900">${(2704 + 1902 - 271).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Optimization Tips */}
          <Card className="p-6 bg-white border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">AI Optimization Tips</h3>
            </div>
            <div className="space-y-4">
              {optimizationTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {tip.priority === "High" ? (
                        <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-slate-900">{tip.title}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        tip.priority === "High"
                          ? "border-orange-300 bg-orange-50 text-orange-700 text-xs"
                          : "border-blue-300 bg-blue-50 text-blue-700 text-xs"
                      }
                    >
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 ml-7">{tip.description}</p>
                  <div className="flex items-center justify-between ml-7">
                    <span className="text-sm text-green-600 font-semibold">
                      Potential Savings: ${tip.potentialSavings.toLocaleString()}
                    </span>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
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
