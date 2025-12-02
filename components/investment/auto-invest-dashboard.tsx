"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Calendar, Target, DollarSign, TrendingUp, Shield, Settings, Plus } from "lucide-react"

const activeStrategies = [
  {
    name: "Balanced Growth",
    amount: 500,
    frequency: "Bi-weekly",
    nextDeposit: "Dec 15, 2024",
    ytdInvested: 12000,
    currentValue: 13450,
    allocation: "60% Stocks / 40% Bonds",
    taxOptimized: true,
    status: "Active",
  },
  {
    name: "Tech Focus",
    amount: 200,
    frequency: "Monthly",
    nextDeposit: "Jan 1, 2025",
    ytdInvested: 2400,
    currentValue: 2890,
    allocation: "100% Tech ETFs",
    taxOptimized: true,
    status: "Active",
  },
]

const recommendedStrategies = [
  {
    name: "Dividend Income",
    description: "Focus on high-yield dividend stocks with tax-efficient distributions",
    minInvestment: 100,
    projectedReturn: 8.5,
    riskLevel: "Low",
  },
  {
    name: "ESG Portfolio",
    description: "Environmentally and socially responsible investments",
    minInvestment: 250,
    projectedReturn: 9.2,
    riskLevel: "Medium",
  },
  {
    name: "Aggressive Growth",
    description: "High-growth stocks with tax-loss harvesting optimization",
    minInvestment: 500,
    projectedReturn: 14.8,
    riskLevel: "High",
  },
]

export function AutoInvestDashboard({ user, profile }: { user: any; profile: any }) {
  const totalMonthlyInvestment = activeStrategies.reduce((sum, s) => {
    const multiplier = s.frequency === "Bi-weekly" ? 2 : 1
    return sum + s.amount * multiplier
  }, 0)

  const totalYTDInvested = activeStrategies.reduce((sum, s) => sum + s.ytdInvested, 0)
  const totalCurrentValue = activeStrategies.reduce((sum, s) => sum + s.currentValue, 0)
  const totalGain = totalCurrentValue - totalYTDInvested
  const totalGainPercent = ((totalGain / totalYTDInvested) * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Auto-Invest</h1>
            <p className="text-slate-600 mt-1">Set it and forget it - automated, tax-optimized investing</p>
          </div>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-2">
            <Plus className="h-4 w-4" />
            Create New Strategy
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Monthly Investment</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalMonthlyInvestment}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Automated contributions</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">YTD Invested</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalYTDInvested.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Total contributions in 2024</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Current Value</p>
                <p className="text-2xl font-bold text-green-600 mt-1">${totalCurrentValue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3 font-medium">+{totalGainPercent}% gain</p>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Strategies</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{activeStrategies.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Running automatically</p>
          </Card>
        </div>

        {/* Active Strategies */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Active Strategies</h3>
              <p className="text-sm text-slate-600">Your automated investment plans</p>
            </div>
          </div>
          <div className="space-y-4">
            {activeStrategies.map((strategy) => (
              <div
                key={strategy.name}
                className="p-6 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{strategy.name}</h4>
                        <Badge className="bg-green-100 text-green-700 border-green-300">{strategy.status}</Badge>
                        {strategy.taxOptimized && (
                          <Badge variant="outline" className="border-purple-300 bg-purple-50 text-purple-700">
                            <Shield className="h-3 w-3 mr-1" />
                            Tax Optimized
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{strategy.allocation}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Investment Amount</p>
                    <p className="text-lg font-bold text-slate-900">${strategy.amount}</p>
                    <p className="text-xs text-slate-500 mt-1">{strategy.frequency}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Next Deposit</p>
                    <p className="text-sm font-semibold text-slate-900">{strategy.nextDeposit}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">YTD Invested</p>
                    <p className="text-lg font-bold text-slate-900">${strategy.ytdInvested.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-700 mb-1">Current Value</p>
                    <p className="text-lg font-bold text-green-600">${strategy.currentValue.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      +${(strategy.currentValue - strategy.ytdInvested).toLocaleString()} (
                      {(((strategy.currentValue - strategy.ytdInvested) / strategy.ytdInvested) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Strategies */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recommended Strategies</h3>
            <p className="text-sm text-slate-600">Pre-built portfolios tailored to your goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedStrategies.map((strategy) => (
              <Card
                key={strategy.name}
                className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">{strategy.name}</h4>
                  <Badge
                    variant="outline"
                    className={
                      strategy.riskLevel === "High"
                        ? "border-red-300 bg-red-50 text-red-700"
                        : strategy.riskLevel === "Medium"
                          ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                          : "border-green-300 bg-green-50 text-green-700"
                    }
                  >
                    {strategy.riskLevel} Risk
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-4">{strategy.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Min. Investment</span>
                    <span className="font-semibold text-slate-900">${strategy.minInvestment}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Projected Return</span>
                    <span className="font-semibold text-green-600">{strategy.projectedReturn}% / year</span>
                  </div>
                </div>
                <Button className="w-full bg-indigo-600 text-white">Start Investing</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Setup */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Set Up Your First Auto-Invest Strategy</h3>
              <p className="text-sm text-slate-600 mb-4">
                Start investing automatically with as little as $50 per month. Our AI optimizes your portfolio for tax
                efficiency.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Investment Amount</Label>
                  <Input type="number" placeholder="$100" className="bg-white" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Frequency</Label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-indigo-600 text-white">Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
