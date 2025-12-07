"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, Calendar, CheckCircle } from "lucide-react"

export default function LoansClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const loanStats = [
    { label: "Total Outstanding", value: "$124,567.89", change: "-$2,345.67", trend: "down", icon: DollarSign },
    { label: "Monthly Payment", value: "$3,245.67", change: "Due in 5 days", trend: "neutral", icon: Calendar },
    { label: "Available Credit", value: "$25,432.11", change: "68% utilized", trend: "neutral", icon: CreditCard },
    { label: "On-Time Payments", value: "98.5%", change: "Excellent", trend: "up", icon: CheckCircle },
  ]

  const loans = [
    {
      id: 1,
      type: "Personal Loan",
      lender: "Chase Bank",
      principal: 50000,
      balance: 38456.78,
      rate: 6.5,
      payment: 1245.67,
      dueDate: "2024-12-20",
      term: "60 months",
      status: "current",
    },
    {
      id: 2,
      type: "Auto Loan",
      lender: "Wells Fargo",
      principal: 35000,
      balance: 28934.56,
      rate: 4.9,
      payment: 845.23,
      dueDate: "2024-12-18",
      term: "48 months",
      status: "current",
    },
    {
      id: 3,
      type: "Credit Line",
      lender: "Bank of America",
      principal: 50000,
      balance: 15234.89,
      rate: 8.75,
      payment: 456.78,
      dueDate: "2024-12-15",
      term: "Revolving",
      status: "current",
    },
  ]

  const paymentHistory = [
    { date: "2024-11-15", amount: 3245.67, status: "paid", loans: 3 },
    { date: "2024-10-15", amount: 3245.67, status: "paid", loans: 3 },
    { date: "2024-09-15", amount: 3245.67, status: "paid", loans: 3 },
    { date: "2024-08-15", amount: 3245.67, status: "paid", loans: 3 },
    { date: "2024-07-15", amount: 3245.67, status: "paid", loans: 3 },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Loans & Credit</h1>
          <p className="text-muted-foreground mt-1">Manage your loans, credit lines, and payment schedules</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Apply for Loan</Button>
          <Button>Make Payment</Button>
        </div>
      </div>

      {/* Loan Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {loanStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="loans">All Loans</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upcoming Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments</CardTitle>
                <CardDescription>Next 30 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{loan.type}</div>
                      <div className="text-sm text-muted-foreground">{loan.lender}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${loan.payment.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{loan.dueDate}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Loan Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Payoff Progress</CardTitle>
                <CardDescription>Track your loan reduction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loans.map((loan) => {
                  const progress = ((loan.principal - loan.balance) / loan.principal) * 100
                  return (
                    <div key={loan.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{loan.type}</span>
                        <span className="font-medium">{progress.toFixed(1)}% paid</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>${loan.balance.toLocaleString()} remaining</span>
                        <span>{loan.term}</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* All Loans Tab */}
        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Loans & Credit Lines</CardTitle>
              <CardDescription>Complete loan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loans.map((loan) => (
                  <div key={loan.id} className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{loan.type}</h3>
                          <Badge variant="outline">{loan.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{loan.lender}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Balance</div>
                        <div className="font-medium">${loan.balance.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Rate</div>
                        <div className="font-medium">{loan.rate}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Payment</div>
                        <div className="font-medium">${loan.payment.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Due Date</div>
                        <div className="font-medium">{loan.dueDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Last 12 months of payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentHistory.map((payment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.date}</div>
                        <div className="text-sm text-muted-foreground">{payment.loans} loans paid</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${payment.amount.toLocaleString()}</div>
                      <Badge variant="outline" className="text-green-600">
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
