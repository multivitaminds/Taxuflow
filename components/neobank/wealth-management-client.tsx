"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Target, ArrowUpRight, Sparkles, Shield, LineChart } from "lucide-react"

export function WealthManagementClient() {
  const portfolioValue = 1245680
  const monthlyChange = 8.4
  const yearlyReturn = 22.3

  const assetAllocation = [
    { name: "Stocks", value: 45, amount: 560556, color: "text-blue-600" },
    { name: "Bonds", value: 25, amount: 311420, color: "text-green-600" },
    { name: "Real Estate", value: 15, amount: 186852, color: "text-purple-600" },
    { name: "Crypto", value: 10, amount: 124568, color: "text-orange-600" },
    { name: "Cash", value: 5, amount: 62284, color: "text-slate-600" },
  ]

  const recommendations = [
    {
      title: "Rebalance Portfolio",
      description: "Your stock allocation is above target. Consider moving 3% to bonds.",
      impact: "Medium",
      confidence: 88,
      action: "Rebalance",
    },
    {
      title: "Tax-Loss Harvesting",
      description: "Sell underperforming assets to offset capital gains and reduce tax liability.",
      impact: "High",
      confidence: 92,
      action: "Review",
    },
    {
      title: "Increase Emergency Fund",
      description: "Your cash reserves are below 6 months of expenses. Consider increasing.",
      impact: "High",
      confidence: 85,
      action: "Add Funds",
    },
  ]

  const goalProgress = [
    { name: "Retirement", target: 2000000, current: 845000, progress: 42, targetDate: "2045" },
    { name: "Home Purchase", target: 500000, current: 175000, progress: 35, targetDate: "2026" },
    { name: "College Fund", target: 300000, current: 125000, progress: 42, targetDate: "2030" },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Wealth Management</h1>
        <p className="text-slate-600 mt-1">Comprehensive portfolio insights and advisory services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+${(portfolioValue * (monthlyChange / 100)).toLocaleString()} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
            <LineChart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{yearlyReturn}%</div>
            <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>Outperforming S&P 500 by 4.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Moderate</div>
            <div className="text-sm text-slate-600 mt-1">6.2/10 volatility rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Asset Allocation Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {assetAllocation.map((asset) => (
                  <div key={asset.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{asset.name}</span>
                      <span className={asset.color}>
                        {asset.value}% (${asset.amount.toLocaleString()})
                      </span>
                    </div>
                    <Progress value={asset.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Historical returns and projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">1 Month</span>
                  <span className="text-green-600 font-semibold">+{monthlyChange}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">3 Months</span>
                  <span className="text-green-600 font-semibold">+12.7%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">1 Year</span>
                  <span className="text-green-600 font-semibold">+{yearlyReturn}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium">5 Year (Projected)</span>
                  <span className="text-blue-600 font-semibold">+89.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Asset Allocation</CardTitle>
              <CardDescription>Breakdown by asset class with recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetAllocation.map((asset) => (
                  <Card key={asset.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{asset.name}</h3>
                          <p className="text-sm text-slate-600">${asset.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${asset.color}`}>{asset.value}%</div>
                          <Badge variant="outline" className="mt-1">
                            On Target
                          </Badge>
                        </div>
                      </div>
                      <Progress value={asset.value} className="h-2 mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goalProgress.map((goal) => (
              <Card key={goal.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>
                        Target: ${goal.target.toLocaleString()} by {goal.targetDate}
                      </CardDescription>
                    </div>
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                    <p className="text-sm text-slate-600 mt-2">{goal.progress}% complete</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Adjust Goal
                    </Button>
                    <Button size="sm" className="flex-1">
                      Add Contribution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advisor" className="space-y-4">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </div>
              <CardDescription>Personalized advice based on your portfolio and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{rec.title}</h3>
                        <p className="text-sm text-slate-600">{rec.description}</p>
                      </div>
                      <Badge
                        variant={rec.impact === "High" ? "destructive" : "secondary"}
                        className={
                          rec.impact === "High"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }
                      >
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-slate-600">Confidence: {rec.confidence}%</span>
                      </div>
                      <Button size="sm">{rec.action}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
