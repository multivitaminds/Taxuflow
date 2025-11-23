"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Landmark, CreditCard, ArrowUpRight, ArrowDownRight, RefreshCw, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BankingClient() {
  const [selectedAccount, setSelectedAccount] = useState("checking")

  const accounts = [
    {
      id: "checking",
      name: "Business Checking",
      type: "Checking",
      bank: "Chase Bank",
      accountNumber: "****1234",
      balance: 45230.5,
      lastSync: "2 hours ago",
      status: "connected",
    },
    {
      id: "savings",
      name: "Business Savings",
      type: "Savings",
      bank: "Chase Bank",
      accountNumber: "****5678",
      balance: 125000.0,
      lastSync: "2 hours ago",
      status: "connected",
    },
    {
      id: "credit",
      name: "Business Credit Card",
      type: "Credit Card",
      bank: "American Express",
      accountNumber: "****9012",
      balance: -3450.25,
      lastSync: "1 day ago",
      status: "connected",
    },
  ]

  const transactions = [
    {
      id: "1",
      date: "2025-01-15",
      description: "Payment from Acme Corp",
      category: "Income",
      amount: 5000.0,
      type: "credit",
      status: "cleared",
      matched: true,
    },
    {
      id: "2",
      date: "2025-01-14",
      description: "Office Supplies Co.",
      category: "Office Expenses",
      amount: -245.5,
      type: "debit",
      status: "cleared",
      matched: true,
    },
    {
      id: "3",
      date: "2025-01-14",
      description: "AWS Services",
      category: "Software & Subscriptions",
      amount: -450.0,
      type: "debit",
      status: "pending",
      matched: false,
    },
    {
      id: "4",
      date: "2025-01-13",
      description: "Client Payment - Invoice #1234",
      category: "Income",
      amount: 2500.0,
      type: "credit",
      status: "cleared",
      matched: true,
    },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banking</h1>
          <p className="text-muted-foreground mt-1">Manage bank accounts and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedAccount === account.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedAccount(account.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {account.type === "Credit Card" ? (
                  <CreditCard className="h-8 w-8 text-primary" />
                ) : (
                  <Landmark className="h-8 w-8 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold">{account.name}</h3>
                  <p className="text-sm text-muted-foreground">{account.bank}</p>
                </div>
              </div>
              <Badge variant={account.status === "connected" ? "default" : "secondary"}>{account.status}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
              <p className="text-2xl font-bold">
                ${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">Last synced {account.lastSync}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Transactions */}
      <Card className="p-6">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                Reconcile
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        {transaction.matched && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <Badge variant="outline" className="text-xs">
                              Matched
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge variant={transaction.status === "cleared" ? "default" : "secondary"} className="mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unmatched">
            <p className="text-center text-muted-foreground py-8">No unmatched transactions</p>
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-center text-muted-foreground py-8">No pending transactions</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
