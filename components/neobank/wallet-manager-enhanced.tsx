"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Target,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

const accounts = [
  {
    id: "acc_1",
    type: "checking",
    balance: 85000.0,
    accountNumber: "4291 8821 0034",
    routingNumber: "121000248",
    status: "active",
    nickname: "Business Checking",
    monthlyInflow: 45000,
    monthlyOutflow: 38000,
    trend: "+8.5%",
  },
  {
    id: "acc_2",
    type: "savings",
    balance: 45000.0,
    accountNumber: "4291 8821 0056",
    routingNumber: "121000248",
    status: "active",
    nickname: "Emergency Fund",
    apy: 4.5,
    interestEarned: 168.75,
    trend: "+2.1%",
  },
]

const aiInsights = [
  {
    type: "opportunity",
    title: "High Balance Alert",
    description: "Your checking account balance is higher than usual. Consider moving $30k to your high-yield savings.",
    impact: "high",
    savingsAmount: 112.5,
    confidence: 92,
  },
  {
    type: "warning",
    title: "Unusual Spending Pattern",
    description: "Your outflow increased 15% this month. Review recent transactions for optimization opportunities.",
    impact: "medium",
    confidence: 85,
  },
]

export function WalletManagerEnhanced() {
  const [showBalance, setShowBalance] = useState(true)
  const [showAccountNumbers, setShowAccountNumbers] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")
  const { toast } = useToast()

  const totalBalance = accounts.reduce((sum, acc) => acc.balance, 0)
  const totalMonthlyInflow = accounts.reduce((sum, acc) => acc.monthlyInflow || 0, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {aiInsights.map((insight, idx) => (
          <Card
            key={idx}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 hover:border-[#635bff]/30"
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-3 rounded-lg shrink-0",
                    insight.type === "opportunity" && "bg-gradient-to-br from-green-50 to-emerald-50",
                    insight.type === "warning" && "bg-gradient-to-br from-orange-50 to-amber-50",
                  )}
                >
                  {insight.type === "opportunity" ? (
                    <Sparkles className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-[#0a2540] group-hover:text-[#635bff] transition-colors">
                      {insight.title}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "shrink-0",
                        insight.impact === "high" && "bg-red-100 text-red-700",
                        insight.impact === "medium" && "bg-orange-100 text-orange-700",
                      )}
                    >
                      {insight.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                  {insight.savingsAmount && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">Save ${insight.savingsAmount}/month</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>AI Confidence: {insight.confidence}%</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[#635bff] hover:bg-[#635bff]/10">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-lg h-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white py-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white py-2"
          >
            My Accounts
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white py-2"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="external"
            className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white py-2"
          >
            External Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-[#635bff]/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Total Balance</p>
                  <Building2 className="h-5 w-5 text-[#635bff]/60 group-hover:text-[#635bff] transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0a2540]">${totalBalance.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+4.2% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-[#635bff]/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Monthly Inflow</p>
                  <ArrowDownRight className="h-5 w-5 text-green-600/60 group-hover:text-green-600 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0a2540]">${totalMonthlyInflow.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                  <span>Across all accounts</span>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-[#635bff]/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Savings Rate</p>
                  <Target className="h-5 w-5 text-blue-600/60 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0a2540]">34.5%</p>
                <div className="mt-2">
                  <Progress value={34.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 hover:border-[#635bff]/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Interest Earned</p>
                  <DollarSign className="h-5 w-5 text-emerald-600/60 group-hover:text-emerald-600 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-[#0a2540]">$168.75</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                  <span>This month (4.5% APY)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Account Cards */}
          <div className="space-y-4">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className="group border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01]"
              >
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-[#635bff]/10 to-[#00d4ff]/10 p-3 rounded-lg group-hover:from-[#635bff]/20 group-hover:to-[#00d4ff]/20 transition-all">
                        <Building2 className="h-6 w-6 text-[#635bff]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-[#635bff] transition-colors">
                          {account.nickname}
                        </CardTitle>
                        <p className="text-sm text-slate-500 capitalize">{account.type} Account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 capitalize flex items-center gap-1"
                      >
                        <TrendingUp className="h-3 w-3" /> {account.trend}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 capitalize flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" /> {account.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">{/* ... existing account details ... */}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Monthly inflows and outflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                  <p className="text-slate-500">Cash flow chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Account Growth</CardTitle>
                <CardDescription>Balance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                  <p className="text-slate-500">Growth chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ... existing tabs code ... */}
      </Tabs>
    </div>
  )
}
