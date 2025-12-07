"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Plus,
  Landmark,
  CreditCard,
  Search,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
} from "lucide-react"

const bankAccounts = [
  {
    id: "1",
    name: "Business Checking",
    bank: "Chase Bank",
    accountNumber: "****1234",
    type: "Checking",
    balance: 45230.5,
    currency: "USD",
    status: "active",
    lastSync: "2 hours ago",
    openingBalance: 50000.0,
    ytdActivity: -4769.5,
  },
  {
    id: "2",
    name: "Business Savings",
    bank: "Chase Bank",
    accountNumber: "****5678",
    type: "Savings",
    balance: 125000.0,
    currency: "USD",
    status: "active",
    lastSync: "2 hours ago",
    openingBalance: 100000.0,
    ytdActivity: 25000.0,
  },
  {
    id: "3",
    name: "Payroll Account",
    bank: "Wells Fargo",
    accountNumber: "****9012",
    type: "Checking",
    balance: 15000.0,
    currency: "USD",
    status: "active",
    lastSync: "1 day ago",
    openingBalance: 20000.0,
    ytdActivity: -5000.0,
  },
  {
    id: "4",
    name: "Reserve Account",
    bank: "Bank of America",
    accountNumber: "****3456",
    type: "Money Market",
    balance: 250000.0,
    currency: "USD",
    status: "active",
    lastSync: "6 hours ago",
    openingBalance: 200000.0,
    ytdActivity: 50000.0,
  },
]

export default function BankAccountsClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalAccounts = bankAccounts.length
  const activeAccounts = bankAccounts.filter((acc) => acc.status === "active").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Accounts</p>
              <p className="text-2xl font-bold">{totalAccounts}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeAccounts}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Landmark className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Link href="/accounting/banking/transfers/new">
          <Card className="p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transfer Funds</p>
                <p className="text-lg font-semibold text-cyan-600">New Transfer</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <ArrowLeftRight className="h-5 w-5 text-cyan-600" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Link href="/accounting/banking/transfers">
            <Button variant="outline">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              View Transfers
            </Button>
          </Link>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Bank Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bankAccounts
          .filter(
            (acc) =>
              acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              acc.bank.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .map((account) => (
            <Link key={account.id} href={`/accounting/banking/accounts/${account.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {account.type === "Checking" ? (
                        <Landmark className="h-6 w-6 text-primary" />
                      ) : account.type === "Savings" ? (
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      ) : (
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">{account.bank}</p>
                    </div>
                  </div>
                  <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Number</span>
                    <span className="font-mono text-sm">{account.accountNumber}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline">{account.type}</Badge>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Current Balance</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      {account.ytdActivity >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-muted-foreground">YTD Activity</span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${account.ytdActivity >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {account.ytdActivity >= 0 ? "+" : ""}$
                      {Math.abs(account.ytdActivity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2">Last synced {account.lastSync}</div>
                </div>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  )
}
