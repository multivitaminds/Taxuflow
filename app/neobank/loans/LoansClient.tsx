"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Sparkles,
  FileText,
  Calculator,
  PiggyBank,
  Percent,
} from "lucide-react"
import Link from "next/link"

export default function LoansClient() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType)
    console.log("[v0] Clicked loan card:", cardType)
  }

  const loansSummary = {
    totalDebt: 145250.0,
    monthlyPayment: 2845.0,
    totalInterest: 28340.0,
    debtToIncomeRatio: 28,
    trend: -5.2,
  }

  const loans = [
    {
      id: 1,
      type: "Personal Loan",
      lender: "Taxu Bank",
      balance: 15000,
      originalAmount: 20000,
      interestRate: 6.99,
      monthlyPayment: 285,
      nextPayment: "2024-02-01",
      remainingMonths: 48,
      status: "current",
    },
    {
      id: 2,
      type: "Auto Loan",
      lender: "Auto Finance Co",
      balance: 28500,
      originalAmount: 35000,
      interestRate: 4.5,
      monthlyPayment: 650,
      nextPayment: "2024-02-05",
      remainingMonths: 42,
      status: "current",
    },
    {
      id: 3,
      type: "Mortgage",
      lender: "Home Mortgage Corp",
      balance: 285000,
      originalAmount: 300000,
      interestRate: 3.25,
      monthlyPayment: 1850,
      nextPayment: "2024-02-01",
      remainingMonths: 348,
      status: "current",
    },
  ]

  const creditLines = [
    {
      id: 1,
      name: "Business Credit Line",
      limit: 50000,
      used: 12500,
      available: 37500,
      interestRate: 8.5,
      monthlyPayment: 250,
      status: "active",
    },
    {
      id: 2,
      name: "Personal Line of Credit",
      limit: 25000,
      used: 5000,
      available: 20000,
      interestRate: 9.99,
      monthlyPayment: 125,
      status: "active",
    },
  ]

  const aiInsights = [
    {
      type: "opportunity",
      title: "Refinance Your Auto Loan",
      description: "You could save $3,240 over the life of your loan by refinancing at 3.8% APR.",
      impact: "high",
      confidence: 92,
    },
    {
      type: "warning",
      title: "Credit Utilization Alert",
      description:
        "Your business credit line is at 25% utilization. Consider paying down to below 10% to improve your credit score.",
      impact: "medium",
      confidence: 88,
    },
    {
      type: "success",
      title: "Excellent Payment History",
      description:
        "You've made 24 consecutive on-time payments. Keep it up to maintain your excellent credit standing.",
      impact: "low",
      confidence: 100,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-700"
      case "due-soon":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Loans & Credit</h1>
          <p className="text-slate-600 mt-1">Manage your loans, credit lines, and debt optimization</p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5248e5] text-white">
          <Calculator className="h-4 w-4 mr-2" />
          Loan Calculator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="border-l-4 border-l-[#635bff] hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick("total-debt")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#635bff]" />
              Total Debt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">${loansSummary.totalDebt.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{Math.abs(loansSummary.trend)}% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick("monthly-payment")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              Monthly Payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">${loansSummary.monthlyPayment.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-1">Across all loans</div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick("total-interest")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Total Interest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">${loansSummary.totalInterest.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-1">Remaining to pay</div>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick("debt-ratio")}
        >
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-600" />
              Debt-to-Income Ratio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{loansSummary.debtToIncomeRatio}%</div>
            <Badge className="bg-green-100 text-green-700 mt-1">Excellent</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="credit-lines">Credit Lines</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#635bff]" />
                Active Loans
              </CardTitle>
              <CardDescription>Your current loan portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loans.map((loan) => {
                const percentPaid = ((loan.originalAmount - loan.balance) / loan.originalAmount) * 100
                return (
                  <Link key={loan.id} href={`/neobank/loans/${loan.id}`}>
                    <div className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-[#635bff] transition-all cursor-pointer bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0a2540]">{loan.type}</h3>
                          <p className="text-sm text-slate-600">{loan.lender}</p>
                        </div>
                        <Badge className={getStatusColor(loan.status)}>
                          {loan.status === "current" ? "Current" : loan.status}
                        </Badge>
                      </div>
                      <Progress value={percentPaid} className="h-2 mb-3" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Balance</p>
                          <p className="font-semibold text-[#0a2540]">${loan.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Interest Rate</p>
                          <p className="font-semibold text-[#0a2540]">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Monthly Payment</p>
                          <p className="font-semibold text-[#0a2540]">${loan.monthlyPayment}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Next Payment</p>
                          <p className="font-semibold text-[#0a2540]">{loan.nextPayment}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-sm text-slate-600">{percentPaid.toFixed(1)}% paid off</span>
                        <ArrowRight className="h-4 w-4 text-[#635bff]" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {loans.map((loan) => (
              <Link key={loan.id} href={`/neobank/loans/${loan.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#635bff]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[#0a2540]">{loan.type}</CardTitle>
                        <CardDescription>{loan.lender}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(loan.status)}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                        <p className="text-lg font-bold text-[#0a2540]">${loan.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Original Amount</p>
                        <p className="text-lg font-bold text-slate-700">${loan.originalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Interest Rate</p>
                        <p className="text-lg font-bold text-[#0a2540]">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Monthly Payment</p>
                        <p className="text-lg font-bold text-[#0a2540]">${loan.monthlyPayment}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-sm text-slate-600">{loan.remainingMonths} months remaining</span>
                      <span className="text-sm font-medium text-[#635bff]">View Details →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="credit-lines" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {creditLines.map((line) => {
              const utilizationPercent = (line.used / line.limit) * 100
              return (
                <Card
                  key={line.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-[#0a2540]">{line.name}</CardTitle>
                        <CardDescription>Credit limit: ${line.limit.toLocaleString()}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CreditCard className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Credit Utilization</span>
                        <span className="text-sm font-semibold text-[#0a2540]">{utilizationPercent.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilizationPercent} className="h-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Used</p>
                        <p className="text-lg font-bold text-[#0a2540]">${line.used.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Available</p>
                        <p className="text-lg font-bold text-green-600">${line.available.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Interest Rate</p>
                        <p className="text-lg font-bold text-[#0a2540]">{line.interestRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#635bff]" />
                AI-Powered Debt Optimization
              </CardTitle>
              <CardDescription>Personalized recommendations to optimize your debt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-[#635bff] transition-all bg-gradient-to-br from-white to-slate-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.type === "opportunity" && <PiggyBank className="h-5 w-5 text-green-600" />}
                      {insight.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                      {insight.type === "success" && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                      <h3 className="font-semibold text-[#0a2540]">{insight.title}</h3>
                    </div>
                    <Badge className={`${getImpactColor(insight.impact)} bg-opacity-10`}>{insight.impact} impact</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Confidence: {insight.confidence}%</span>
                    <Button size="sm" variant="outline" className="text-[#635bff] border-[#635bff] bg-transparent">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
