"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"

export default function CreditCardDetailClient({ cardId }: { cardId: string }) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const cardData = {
    id: cardId,
    name: "Chase Business Card",
    last4: "4532",
    type: "Visa",
    currentBalance: 8542.32,
    availableCredit: 41457.68,
    creditLimit: 50000,
    paymentDue: "2024-02-15",
    minimumPayment: 285,
    statementBalance: 8542.32,
    lastPayment: { amount: 3200, date: "2024-01-15" },
    apr: 18.99,
    rewardsRate: 2.0,
    accountOpened: "2022-03-15",
  }

  const transactions = [
    {
      id: "1",
      date: "2024-02-01",
      merchant: "Amazon Business",
      category: "Office Supplies",
      amount: 245.67,
      status: "posted",
      reconciled: true,
    },
    {
      id: "2",
      date: "2024-01-31",
      merchant: "Delta Airlines",
      category: "Travel",
      amount: 1850.0,
      status: "posted",
      reconciled: false,
    },
    {
      id: "3",
      date: "2024-01-30",
      merchant: "Hilton Hotels",
      category: "Lodging",
      amount: 425.5,
      status: "posted",
      reconciled: false,
    },
    {
      id: "4",
      date: "2024-01-29",
      merchant: "Shell Gas Station",
      category: "Fuel",
      amount: 85.32,
      status: "pending",
      reconciled: false,
    },
  ]

  const statements = [
    { month: "January 2024", closingDate: "2024-01-31", balance: 8542.32, payment: 3200, status: "current" },
    { month: "December 2023", closingDate: "2023-12-31", balance: 7230.5, payment: 7230.5, status: "paid" },
    { month: "November 2023", closingDate: "2023-11-30", balance: 5890.0, payment: 5890.0, status: "paid" },
  ]

  const utilizationRate = (cardData.currentBalance / cardData.creditLimit) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/accounting/credit-cards">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{cardData.name}</h1>
              <p className="text-muted-foreground">
                {cardData.type} •••• {cardData.last4}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/accounting/credit-cards/${cardId}/payment`}>
                <Button size="lg" className="gap-2">
                  <DollarSign className="h-5 w-5" />
                  Make Payment
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Download className="h-5 w-5" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-red-500">${cardData.currentBalance.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Available Credit</p>
                  <p className="text-2xl font-bold text-green-500">${cardData.availableCredit.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Due</p>
                  <p className="text-xl font-bold text-foreground">{cardData.paymentDue}</p>
                  <p className="text-sm text-muted-foreground">${cardData.minimumPayment} min</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Utilization</p>
                  <p className={`text-2xl font-bold ${utilizationRate > 30 ? "text-orange-500" : "text-green-500"}`}>
                    {utilizationRate.toFixed(1)}%
                  </p>
                </div>
                <AlertCircle className={`h-8 w-8 ${utilizationRate > 30 ? "text-orange-500" : "text-green-500"}`} />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="details">Card Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground">{transaction.merchant}</p>
                            {transaction.status === "pending" ? (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            ) : transaction.reconciled ? (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Reconciled
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-500 text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unreconciled
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.category}</span>
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-red-500">${transaction.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/accounting/credit-cards/${cardId}?tab=transactions`}>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Transactions
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Credit Utilization</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Current Usage</p>
                        <p className="text-sm font-medium text-foreground">
                          ${cardData.currentBalance.toLocaleString()} / ${cardData.creditLimit.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            utilizationRate > 70
                              ? "bg-red-500"
                              : utilizationRate > 30
                                ? "bg-orange-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${utilizationRate}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {utilizationRate > 30 ? "High utilization may impact credit score" : "Good utilization rate"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-border bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Account Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <p className="text-sm text-muted-foreground">Statement Balance</p>
                      <p className="font-medium text-foreground">${cardData.statementBalance.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <p className="text-sm text-muted-foreground">Minimum Payment</p>
                      <p className="font-medium text-foreground">${cardData.minimumPayment.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <p className="text-sm text-muted-foreground">Payment Due Date</p>
                      <p className="font-medium text-foreground">{cardData.paymentDue}</p>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <p className="text-sm text-muted-foreground">Last Payment</p>
                      <p className="font-medium text-green-500">${cardData.lastPayment.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <p className="text-sm text-muted-foreground">APR</p>
                      <p className="font-medium text-foreground">{cardData.apr}%</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href={`/accounting/credit-cards/${cardId}/payment`}>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <DollarSign className="h-4 w-4" />
                        Make Payment
                      </Button>
                    </Link>
                    <Link href={`/accounting/credit-cards/${cardId}/statement`}>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        View Statement
                      </Button>
                    </Link>
                    <Link href={`/accounting/credit-cards/reconcile?card=${cardId}`}>
                      <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                        <LinkIcon className="h-4 w-4" />
                        Reconcile Transactions
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Export Transactions
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">All Transactions</h3>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Merchant</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-muted-foreground">{transaction.date}</td>
                        <td className="p-4 font-medium text-foreground">{transaction.merchant}</td>
                        <td className="p-4 text-muted-foreground">{transaction.category}</td>
                        <td className="p-4">
                          {transaction.status === "pending" ? (
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          ) : transaction.reconciled ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reconciled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-500">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unreconciled
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right font-semibold text-red-500">
                          ${transaction.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="statements">
            <Card className="border-border">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Billing Statements</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {statements.map((statement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{statement.month}</p>
                          <p className="text-sm text-muted-foreground">Closing Date: {statement.closingDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="font-semibold text-foreground">${statement.balance.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Payment</p>
                          <p className="font-semibold text-green-500">${statement.payment.toLocaleString()}</p>
                        </div>
                        <Badge
                          className={
                            statement.status === "paid"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          }
                        >
                          {statement.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card className="p-6 border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">Card Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Card Name</p>
                    <p className="font-medium text-foreground">{cardData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Card Number</p>
                    <p className="font-medium text-foreground">
                      {cardData.type} •••• {cardData.last4}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Credit Limit</p>
                    <p className="font-medium text-foreground">${cardData.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Opened</p>
                    <p className="font-medium text-foreground">{cardData.accountOpened}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Annual Percentage Rate</p>
                    <p className="font-medium text-foreground">{cardData.apr}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rewards Rate</p>
                    <p className="font-medium text-foreground">{cardData.rewardsRate}% Cash Back</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Due Date</p>
                    <p className="font-medium text-foreground">{cardData.paymentDue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Payment</p>
                    <p className="font-medium text-green-500">
                      ${cardData.lastPayment.amount.toLocaleString()} on {cardData.lastPayment.date}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
