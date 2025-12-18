"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Shield, Target, Zap, CheckCircle2 } from "lucide-react"

export function RoboAdvisorClient() {
  const riskProfiles = [
    { name: "Conservative", risk: 2, return: "4-6%", description: "Low risk, stable returns" },
    { name: "Moderate", risk: 5, return: "7-10%", description: "Balanced growth and stability" },
    { name: "Aggressive", risk: 8, return: "12-15%", description: "High growth potential" },
  ]

  const recommendations = [
    {
      strategy: "Diversified Growth",
      risk: "Moderate",
      expectedReturn: "9.2%",
      allocation: { stocks: 60, bonds: 30, alternatives: 10 },
      confidence: 94,
      timeHorizon: "5-10 years",
    },
    {
      strategy: "Income Focused",
      risk: "Conservative",
      expectedReturn: "5.8%",
      allocation: { stocks: 30, bonds: 60, alternatives: 10 },
      confidence: 88,
      timeHorizon: "1-5 years",
    },
    {
      strategy: "Max Growth",
      risk: "Aggressive",
      expectedReturn: "14.5%",
      allocation: { stocks: 80, bonds: 10, alternatives: 10 },
      confidence: 82,
      timeHorizon: "10+ years",
    },
  ]

  const features = [
    {
      title: "Automatic Rebalancing",
      description: "Portfolio adjusted monthly to maintain target allocation",
      icon: Zap,
    },
    {
      title: "Tax-Loss Harvesting",
      description: "Minimize taxes by strategically selling underperforming assets",
      icon: Shield,
    },
    { title: "Goal-Based Planning", description: "Investments aligned with your financial objectives", icon: Target },
    {
      title: "AI Optimization",
      description: "Machine learning continuously improves investment strategy",
      icon: Sparkles,
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Robo-Advisor</h1>
        <p className="text-slate-600 mt-1">AI-powered investment advisory and automated portfolio management</p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <feature.icon className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="strategies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategies">Investment Strategies</TabsTrigger>
          <TabsTrigger value="profile">Risk Profile</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <div className="space-y-4">
            {recommendations.map((strategy, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {strategy.strategy}
                        <Badge variant="outline">{strategy.risk} Risk</Badge>
                      </CardTitle>
                      <CardDescription>Expected return: {strategy.expectedReturn} annually</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-purple-600">
                        <Sparkles className="h-4 w-4" />
                        <span>{strategy.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Stocks</span>
                        <span className="font-semibold">{strategy.allocation.stocks}%</span>
                      </div>
                      <Progress value={strategy.allocation.stocks} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Bonds</span>
                        <span className="font-semibold">{strategy.allocation.bonds}%</span>
                      </div>
                      <Progress value={strategy.allocation.bonds} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Alternatives</span>
                        <span className="font-semibold">{strategy.allocation.alternatives}%</span>
                      </div>
                      <Progress value={strategy.allocation.alternatives} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-slate-600">Time Horizon: {strategy.timeHorizon}</span>
                    <Button>Select Strategy</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Risk Profile</CardTitle>
              <CardDescription>
                Select the investment approach that matches your goals and comfort level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskProfiles.map((profile) => (
                <Card key={profile.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-sm text-slate-600">{profile.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">Expected Return</div>
                        <div className="text-xl font-bold text-green-600">{profile.return}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Level</span>
                        <span className="font-semibold">{profile.risk}/10</span>
                      </div>
                      <Progress value={profile.risk * 10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
                <CardDescription>Historical returns vs market benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">YTD Return</span>
                    <span className="text-green-600 font-bold">+18.4%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">vs S&P 500</span>
                    <span className="text-blue-600 font-bold">+5.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Sharpe Ratio</span>
                    <span className="text-purple-600 font-bold">1.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Optimizations</CardTitle>
                <CardDescription>Recent AI-driven adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Portfolio Rebalanced</p>
                      <p className="text-xs text-slate-600">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Tax Loss Harvested</p>
                      <p className="text-xs text-slate-600">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Dividend Reinvested</p>
                      <p className="text-xs text-slate-600">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
