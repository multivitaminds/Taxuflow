"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Landmark,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  Settings,
  Download,
  ArrowLeftRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function BankAccountDetailClient({ accountId }: { accountId: string }) {
  const router = useRouter()

  const account = {
    id: accountId,
    name: "Business Checking",
    bank: "Chase Bank",
    accountNumber: "****1234",
    fullAccountNumber: "123456789",
    routingNumber: "021000021",
    type: "Checking",
    balance: 45230.5,
    availableBalance: 45230.5,
    currency: "USD",
    status: "active",
    lastSync: "2 hours ago",
    openingBalance: 50000.0,
    ytdActivity: -4769.5,
    openedDate: "2024-01-15",
  }

  const transactions = [
    {
      id: "1",
      date: "2025-01-15",
      description: "Payment from Acme Corp",
      category: "Income",
      amount: 5000.0,
      type: "credit",
      status: "cleared",
      balance: 45230.5,
    },
    {
      id: "2",
      date: "2025-01-14",
      description: "Office Supplies Co.",
      category: "Office Expenses",
      amount: -245.5,
      type: "debit",
      status: "cleared",
      balance: 40230.5,
    },
    {
      id: "3",
      date: "2025-01-14",
      description: "AWS Services",
      category: "Software & Subscriptions",
      amount: -450.0,
      type: "debit",
      status: "pending",
      balance: 40476.0,
    },
    {
      id: "4",
      date: "2025-01-13",
      description: "Client Payment - Invoice #1234",
      category: "Income",
      amount: 2500.0,
      type: "credit",
      status: "cleared",
      balance: 40926.0,
    },
  ]

  const transfers = [
    {
      id: "1",
      date: "2025-01-10",
      fromAccount: "Business Checking",
      toAccount: "Payroll Account",
      amount: 5000.0,
      status: "completed",
      note: "Monthly payroll transfer",
    },
    {
      id: "2",
      date: "2025-01-05",
      fromAccount: "Business Savings",
      toAccount: "Business Checking",
      amount: 10000.0,
      status: "completed",
      note: "Operating funds transfer",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push("/accounting/banking/accounts")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Accounts
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-lg bg-primary/10">
              <Landmark className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{account.name}</h1>
              <p className="text-muted-foreground">
                {account.bank} • {account.accountNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
            <Link href={`/accounting/banking/transfers/new?from=${accountId}`}>
              <Button variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            </Link>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">Current Balance</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-muted-foreground">Available Balance</span>
          </div>
          <div className="text-3xl font-bold">
            ${account.availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm text-muted-foreground">Opening Balance</span>
          </div>
          <div className="text-3xl font-bold">
            ${account.openingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${account.ytdActivity >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
              {account.ytdActivity >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">YTD Activity</span>
          </div>
          <div className={`text-3xl font-bold ${account.ytdActivity >= 0 ? "text-green-600" : "text-red-600"}`}>
            {account.ytdActivity >= 0 ? "+" : ""}$
            {Math.abs(account.ytdActivity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="details">Account Details</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {txn.type === "credit" ? (
                          <ArrowDownRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{txn.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">{txn.date}</p>
                          <span className="text-muted-foreground">•</span>
                          <Badge variant="outline" className="text-xs">
                            {txn.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {txn.type === "credit" ? "+" : "-"}${Math.abs(txn.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Balance: ${txn.balance.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Inter-Account Transfers</h2>
              <Link href={`/accounting/banking/transfers/new?from=${accountId}`}>
                <Button>
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10">
                        <ArrowLeftRight className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transfer.fromAccount} → {transfer.toAccount}
                        </p>
                        <p className="text-sm text-muted-foreground">{transfer.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${transfer.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <Badge variant={transfer.status === "completed" ? "default" : "secondary"}>
                        {transfer.status}
                      </Badge>
                    </div>
                  </div>
                  {transfer.note && <p className="text-sm text-muted-foreground mt-2 pl-11">{transfer.note}</p>}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Account Name</label>
                  <p className="text-lg font-medium">{account.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Bank</label>
                  <p className="text-lg font-medium">{account.bank}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Account Type</label>
                  <Badge variant="outline">{account.type}</Badge>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Account Number</label>
                  <p className="text-lg font-mono">{account.accountNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Routing Number</label>
                  <p className="text-lg font-mono">{account.routingNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Currency</label>
                  <p className="text-lg font-medium">{account.currency}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Opened Date</label>
                  <p className="text-lg font-medium">{account.openedDate}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
