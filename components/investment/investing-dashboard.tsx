"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, PieChart, ShoppingCart, Bitcoin, Target, Zap } from "lucide-react"

export function InvestingDashboard({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="p-8 pt-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Investing Overview</h1>
        <p className="text-slate-600">Manage your portfolio with tax-optimized strategies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Total Value</span>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">$0</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            +0% this month
          </p>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Total Gain/Loss</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">$0</p>
          <p className="text-sm text-slate-500 mt-2">0% return</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Est. Tax Impact</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">$0</p>
          <p className="text-sm text-slate-500 mt-2">Capital gains</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Cash Available</span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">$0</p>
          <p className="text-sm text-slate-500 mt-2">Ready to invest</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Buy Stocks & ETFs</h3>
            <p className="text-sm text-slate-600">Invest in individual stocks and funds</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Bitcoin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Buy Crypto</h3>
            <p className="text-sm text-slate-600">Trade Bitcoin, Ethereum, and more</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Explore Markets</h3>
            <p className="text-sm text-slate-600">Discover trending investments</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-100 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Auto-Invest</h3>
            <p className="text-sm text-slate-600">AI-powered portfolio management</p>
          </Card>
        </div>
      </div>

      {/* Tax Integration Section (Unique to Taxu) */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Tax Impact Snapshot</h2>
            <p className="text-slate-600 mb-4">Optimize your investments for tax efficiency</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">Est. Capital Gains</p>
                <p className="text-2xl font-bold text-slate-900">$0</p>
                <p className="text-xs text-slate-500">Short-term: $0 | Long-term: $0</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Dividend Tax</p>
                <p className="text-2xl font-bold text-slate-900">$0</p>
                <p className="text-xs text-slate-500">Estimated quarterly</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Tax-Loss Opportunities</p>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-slate-500">Available to harvest</p>
              </div>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">View Tax Report</Button>
        </div>
      </Card>

      {/* AI Recommendation */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Recommendation</h3>
            <p className="text-sm text-slate-600">Powered by Taxu AI</p>
          </div>
        </div>
        <p className="text-slate-700 mb-4">
          Start investing with tax-optimized portfolios. Based on your income and tax bracket, we recommend starting
          with index funds to minimize capital gains tax.
        </p>
        <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent">
          Learn More
        </Button>
      </Card>
    </div>
  )
}
