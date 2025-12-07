"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"

export default function CreditCardsClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const creditCards = [
    {
      id: "cc1",
      name: "Chase Business Card",
      last4: "4532",
      type: "Visa",
      currentBalance: 8542.32,
      availableCredit: 41457.68,
      creditLimit: 50000,
      paymentDue: "2024-02-15",
      minimumPayment: 285,
      status: "active",
      statementBalance: 8542.32,
      unreconciled: 12,
    },
    {
      id: "cc2",
      name: "Amex Corporate",
      last4: "1008",
      type: "American Express",
      currentBalance: 15230.5,
      availableCredit: 9769.5,
      creditLimit: 25000,
      paymentDue: "2024-02-10",
      minimumPayment: 456,
      status: "active",
      statementBalance: 14890.0,
      unreconciled: 8,
    },
    {
      id: "cc3",
      name: "Capital One Spark",
      last4: "7821",
      type: "Mastercard",
      currentBalance: 3420.0,
      availableCredit: 46580.0,
      creditLimit: 50000,
      paymentDue: "2024-02-20",
      minimumPayment: 114,
      status: "active",
      statementBalance: 3420.0,
      unreconciled: 5,
    },
  ]

  const stats = {
    totalCards: creditCards.length,
    totalBalance: creditCards.reduce((sum, card) => sum + card.currentBalance, 0),
    totalCredit: creditCards.reduce((sum, card) => sum + card.creditLimit, 0),
    totalAvailable: creditCards.reduce((sum, card) => sum + card.availableCredit, 0),
  }

  const utilizationRate = (stats.totalBalance / stats.totalCredit) * 100

  const filteredCards = creditCards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) || card.last4.includes(searchQuery)
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Credit Card Accounts</h1>
              <p className="text-muted-foreground">Manage credit card transactions, payments, and reconciliation</p>
            </div>
            <div className="flex gap-2">
              <Link href="/accounting/credit-cards/statements">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <Calendar className="h-5 w-5" />
                  Statements
                </Button>
              </Link>
              <Link href="/accounting/credit-cards/reconcile">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <LinkIcon className="h-5 w-5" />
                  Reconcile
                </Button>
              </Link>
              <Link href="/accounting/credit-cards/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Card
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Cards</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalCards}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalBalance.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Available Credit</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalAvailable.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer">
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
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search credit cards by name or last 4 digits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              className="p-6 border-border hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-card to-muted/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{card.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {card.type} •••• {card.last4}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-xl font-bold text-red-500">${card.currentBalance.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Available Credit</p>
                    <p className="text-sm font-medium text-green-500">${card.availableCredit.toLocaleString()}</p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (card.currentBalance / card.creditLimit) * 100 > 70
                        ? "bg-red-500"
                        : (card.currentBalance / card.creditLimit) * 100 > 30
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${(card.currentBalance / card.creditLimit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  ${card.currentBalance.toLocaleString()} of ${card.creditLimit.toLocaleString()} limit
                </p>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Payment Due</p>
                    <p className="text-sm font-medium text-foreground">{card.paymentDue}</p>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Minimum Payment</p>
                    <p className="text-sm font-medium text-foreground">${card.minimumPayment.toLocaleString()}</p>
                  </div>
                  {card.unreconciled > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-orange-500">{card.unreconciled} unreconciled transactions</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/accounting/credit-cards/${card.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </Link>
                <Link href={`/accounting/credit-cards/${card.id}/statement`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Statement
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
