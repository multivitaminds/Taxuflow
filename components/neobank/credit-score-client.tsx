"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Target,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react"

export function CreditScoreClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const creditScore = {
    score: 742,
    previousScore: 718,
    change: 24,
    percentile: 78,
    rating: "Good",
    lastUpdated: "2024-01-15",
    nextUpdate: "2024-02-15",
  }

  const scoreFactors = [
    {
      factor: "Payment History",
      impact: "High",
      status: "Excellent",
      percentage: 98,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "On-time payments for 36 consecutive months",
    },
    {
      factor: "Credit Utilization",
      impact: "High",
      status: "Good",
      percentage: 32,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Using 32% of available credit",
    },
    {
      factor: "Credit Age",
      impact: "Medium",
      status: "Fair",
      percentage: 4.2,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Average age: 4.2 years",
    },
    {
      factor: "Credit Mix",
      impact: "Low",
      status: "Good",
      percentage: 7,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "7 types of credit accounts",
    },
    {
      factor: "Recent Inquiries",
      impact: "Low",
      status: "Excellent",
      percentage: 1,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Only 1 inquiry in past 12 months",
    },
  ]

  const improvementTips = [
    {
      title: "Lower Credit Utilization",
      description: "Pay down $2,500 on your Capital One card to reduce utilization to 25%",
      impact: "+15-20 points",
      timeframe: "1-2 months",
      priority: "high",
      confidence: 92,
      icon: Target,
    },
    {
      title: "Become an Authorized User",
      description: "Ask a family member with excellent credit to add you as an authorized user",
      impact: "+10-15 points",
      timeframe: "2-3 months",
      priority: "medium",
      confidence: 85,
      icon: Shield,
    },
    {
      title: "Increase Credit Limit",
      description: "Request a credit limit increase on your oldest card to improve utilization ratio",
      impact: "+8-12 points",
      timeframe: "Immediate",
      priority: "medium",
      confidence: 78,
      icon: TrendingUp,
    },
    {
      title: "Diversify Credit Mix",
      description: "Consider adding a small personal loan to diversify your credit portfolio",
      impact: "+5-8 points",
      timeframe: "3-6 months",
      priority: "low",
      confidence: 65,
      icon: Sparkles,
    },
  ]

  const creditAccounts = [
    {
      type: "Credit Card",
      name: "Chase Sapphire Reserve",
      balance: 3200,
      limit: 15000,
      utilization: 21,
      status: "Good Standing",
      openDate: "2018-03-15",
      payment: "On Time",
    },
    {
      type: "Credit Card",
      name: "Capital One Quicksilver",
      balance: 4800,
      limit: 10000,
      utilization: 48,
      status: "Good Standing",
      openDate: "2019-07-22",
      payment: "On Time",
    },
    {
      type: "Auto Loan",
      name: "Honda Finance",
      balance: 12500,
      limit: 28000,
      utilization: 45,
      status: "Good Standing",
      openDate: "2020-11-10",
      payment: "On Time",
    },
    {
      type: "Student Loan",
      name: "Federal Direct Loan",
      balance: 18200,
      limit: 25000,
      utilization: 73,
      status: "Good Standing",
      openDate: "2016-09-01",
      payment: "On Time",
    },
  ]

  const scoreHistory = [
    { month: "Jul", score: 695 },
    { month: "Aug", score: 702 },
    { month: "Sep", score: 708 },
    { month: "Oct", score: 715 },
    { month: "Nov", score: 718 },
    { month: "Dec", score: 725 },
    { month: "Jan", score: 742 },
  ]

  const alerts = [
    {
      type: "positive",
      title: "Credit Score Increased",
      description: "Your score went up 24 points this month",
      date: "2024-01-15",
    },
    {
      type: "warning",
      title: "High Utilization Alert",
      description: "Capital One card is at 48% utilization",
      date: "2024-01-12",
    },
    {
      type: "info",
      title: "Credit Report Updated",
      description: "Your credit report has been refreshed",
      date: "2024-01-15",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Credit Score Monitoring</h1>
          <p className="text-slate-600 mt-1">Track your credit health and get personalized improvement tips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-[#635bff] to-[#5b4cdb] text-white hover:from-[#5b4cdb] hover:to-[#4e3fc9]">
            <RefreshCw className="h-4 w-4" />
            Refresh Score
          </Button>
        </div>
      </div>

      {/* Credit Score Overview */}
      <Card className="p-6 bg-gradient-to-br from-[#635bff] to-[#5b4cdb] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Your Credit Score</p>
            <div className="flex items-end gap-4">
              <h2 className="text-6xl font-bold">{creditScore.score}</h2>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  <TrendingUp className="h-3 w-3 mr-1" />+{creditScore.change} points
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30">{creditScore.rating}</Badge>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-3">Better than {creditScore.percentile}% of consumers</p>
          </div>

          <div className="text-right space-y-2">
            <div className="text-white/80 text-sm">Score Range</div>
            <div className="relative w-48 h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-white rounded-full transition-all"
                style={{ width: `${((creditScore.score - 300) / 550) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>300</span>
              <span>850</span>
            </div>
            <div className="text-white/80 text-sm mt-4">
              Last updated: {new Date(creditScore.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-white/60 text-xs">
              Next update: {new Date(creditScore.nextUpdate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Accounts</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{creditAccounts.length}</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                All in good standing
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Credit</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">$78,000</p>
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +$5,000 this year
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">32%</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Below 30% target
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Payment History</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">100%</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                36 months on-time
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="factors">Score Factors</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="tips">Improvement Tips</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score History Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Score History</h3>
                <Button variant="outline" size="sm">
                  Last 6 Months
                </Button>
              </div>
              <div className="space-y-4">
                {scoreHistory.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-slate-600">{item.month}</div>
                    <div className="flex-1">
                      <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-[#635bff] to-[#5b4cdb] rounded-full transition-all"
                          style={{ width: `${((item.score - 300) / 550) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-right font-semibold text-slate-900">{item.score}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Alerts */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {alert.type === "positive" && (
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                    )}
                    {alert.type === "warning" && (
                      <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    )}
                    {alert.type === "info" && (
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">What Affects Your Score</h3>
            <div className="space-y-4">
              {scoreFactors.map((factor, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${factor.bgColor} flex items-center justify-center`}>
                        <BarChart3 className={`h-5 w-5 ${factor.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{factor.factor}</h4>
                        <p className="text-sm text-slate-600">{factor.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={factor.bgColor}>{factor.status}</Badge>
                      <p className="text-xs text-slate-500 mt-1">{factor.impact} Impact</p>
                    </div>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full ${factor.color.replace("text", "bg")}`}
                      style={{ width: `${Math.min(factor.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Credit Accounts</h3>
            <div className="space-y-4">
              {creditAccounts.map((account, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{account.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {account.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        Opened: {new Date(account.openDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-emerald-50 text-emerald-700">{account.status}</Badge>
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 justify-end">
                        <CheckCircle2 className="h-3 w-3" />
                        {account.payment}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Balance</span>
                      <span className="font-semibold text-slate-900">${account.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Limit</span>
                      <span className="font-semibold text-slate-900">${account.limit.toLocaleString()}</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full ${
                          account.utilization > 50
                            ? "bg-red-500"
                            : account.utilization > 30
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${account.utilization}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Utilization: {account.utilization}%</span>
                      <span>{account.utilization > 30 ? "High utilization may impact score" : "Good utilization"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Personalized Improvement Tips</h3>
                <p className="text-sm text-slate-600 mt-1">AI-powered recommendations to boost your credit score</p>
              </div>
              <Badge className="bg-gradient-to-r from-[#635bff] to-[#5b4cdb] text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Insights
              </Badge>
            </div>
            <div className="grid gap-4">
              {improvementTips.map((tip, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 hover:shadow-lg transition-all cursor-pointer ${
                    tip.priority === "high"
                      ? "border-[#635bff] bg-gradient-to-br from-[#635bff]/5 to-[#5b4cdb]/5"
                      : tip.priority === "medium"
                        ? "border-amber-200 bg-amber-50/30"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tip.priority === "high"
                          ? "bg-[#635bff] text-white"
                          : tip.priority === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <tip.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">{tip.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            tip.priority === "high"
                              ? "border-[#635bff] text-[#635bff]"
                              : tip.priority === "medium"
                                ? "border-amber-500 text-amber-700"
                                : "border-slate-400 text-slate-700"
                          }
                        >
                          {tip.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{tip.description}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-600">{tip.impact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{tip.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#635bff]" />
                          <span className="text-sm text-slate-600">{tip.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={
                        tip.priority === "high"
                          ? "bg-gradient-to-r from-[#635bff] to-[#5b4cdb] text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }
                    >
                      Take Action
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Credit Monitoring Alerts</h3>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {alert.type === "positive" && (
                      <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                    )}
                    {alert.type === "warning" && (
                      <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    )}
                    {alert.type === "info" && (
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(alert.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
