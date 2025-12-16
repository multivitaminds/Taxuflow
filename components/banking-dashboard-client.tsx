"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Plus, TrendingUp, TrendingDown, Building, RefreshCw } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface BankingDashboardClientProps {
  user: User
}

export function BankingDashboardClient({ user }: BankingDashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    fetchBankingData()
  }, [user.id])

  const fetchBankingData = async () => {
    setLoading(true)
    try {
      const { data: accountsData, error: accountsError } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (accountsError) throw accountsError

      setAccounts(accountsData || [])

      if (accountsData && accountsData.length > 0) {
        const accountIds = accountsData.map((a) => a.id)
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("bank_transactions")
          .select("*")
          .in("account_id", accountIds)
          .order("date", { ascending: false })
          .limit(10)

        if (transactionsError) throw transactionsError

        setTransactions(transactionsData || [])
      }
    } catch (error) {
      console.error("[Banking Dashboard] Error fetching data:", error)
      toast.error("Failed to load banking data")
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  const unreconciled = transactions.filter((t) => !t.reconciled).length
  // </CHANGE>

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Banking</h1>
              <p className="text-muted-foreground">Connect accounts and reconcile transactions</p>
            </div>
            <Button className="bg-neon hover:bg-neon/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Connect Bank Account
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Connected Accounts</span>
            </div>
            <div className="text-3xl font-bold">{accounts.length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Balance</span>
            </div>
            <div className="text-3xl font-bold text-green-500">${totalBalance.toLocaleString()}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <RefreshCw className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Unreconciled</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">{unreconciled}</div>
          </Card>
        </div>

        {loading ? (
          <Card className="p-12 border-neon/20 bg-card/50 backdrop-blur text-center">
            <RefreshCw className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading banking data...</p>
          </Card>
        ) : accounts.length === 0 ? (
          <Card className="p-12 border-neon/20 bg-card/50 backdrop-blur text-center">
            <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Bank Accounts Connected</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your bank accounts to automatically import transactions and reconcile your books
            </p>
            <Button className="bg-neon hover:bg-neon/90 text-background">
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First Account
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4">Connected Accounts</h2>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-cyan-500" />
                      </div>
                      <div>
                        <div className="font-semibold">{account.name || account.institution_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ****{account.mask || account.last_four || account.account_number?.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${account.balance?.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{account.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recent Transactions</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neon/20 bg-transparent"
                  onClick={fetchBankingData}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync
                </Button>
              </div>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-3">
                        {transaction.amount > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{transaction.description || transaction.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${transaction.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/expenses/dashboard")}
            className="border-neon/20"
          >
            View Expenses
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/reports/dashboard")}
            className="border-neon/20"
          >
            View Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/vendors/dashboard")}
            className="border-neon/20"
          >
            View Vendors
          </Button>
        </div>
      </div>
    </div>
  )
}
