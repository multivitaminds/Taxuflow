"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, CreditCard, Plus, ShieldCheck, Download, TrendingUp, Store, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNeobankAccounts, getAccountBalance } from "@/app/actions/neobank/get-accounts"
import { getNeobankTransactions } from "@/app/actions/neobank/get-transactions"
import { getNeobankCards } from "@/app/actions/neobank/get-cards"
import { createNeobankAccount } from "@/app/actions/neobank/create-account"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

function Building2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}

export function NeobankDashboard() {
  const [accountData, setAccountData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const demoTransactions = [
    {
      id: "demo-1",
      merchant_name: "Tech Solutions Ltd",
      description: "Software subscription",
      transaction_date: new Date().toISOString(),
      amount: -299.0,
      status: "completed",
      category: "software",
    },
    {
      id: "demo-2",
      merchant_name: "Client Payment",
      description: "Invoice #1234 payment",
      transaction_date: new Date(Date.now() - 86400000).toISOString(),
      amount: 5240.0,
      status: "completed",
      category: "income",
    },
    {
      id: "demo-3",
      merchant_name: "Office Supplies Co",
      description: "Office equipment",
      transaction_date: new Date(Date.now() - 172800000).toISOString(),
      amount: -156.5,
      status: "pending",
      category: "office",
    },
    {
      id: "demo-4",
      merchant_name: "Digital Marketing Agency",
      description: "Marketing services",
      transaction_date: new Date(Date.now() - 259200000).toISOString(),
      amount: -1250.0,
      status: "completed",
      category: "marketing",
    },
    {
      id: "demo-5",
      merchant_name: "Client Deposit",
      description: "Project milestone payment",
      transaction_date: new Date(Date.now() - 345600000).toISOString(),
      amount: 8500.0,
      status: "completed",
      category: "income",
    },
  ]

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const [balanceRes, accountsRes, transactionsRes, cardsRes] = await Promise.all([
        getAccountBalance(),
        getNeobankAccounts(),
        getNeobankTransactions(5),
        getNeobankCards(),
      ])

      if (accountsRes.data && accountsRes.data.length === 0) {
        await createNeobankAccount("checking")
        const newAccountsRes = await getNeobankAccounts()
        setAccountData(newAccountsRes.data?.[0])
      } else {
        setAccountData(balanceRes)
      }

      setTransactions(transactionsRes.data && transactionsRes.data.length > 0 ? transactionsRes.data : demoTransactions)
      setCards(cardsRes.data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto"></div>
          <p className="text-slate-500">Loading your banking data...</p>
        </div>
      </div>
    )
  }

  if (!accountData || accountData.totalBalance === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="bg-[#635bff]/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-[#635bff]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Welcome to Taxu Neobank</h3>
            <p className="text-slate-500 mb-6">Create your first account to get started with banking features.</p>
            <Button
              className="bg-[#635bff] hover:bg-[#5851e1] text-white"
              onClick={async () => {
                const result = await createNeobankAccount("checking")
                if (result.data) {
                  toast({
                    title: "Account created",
                    description: "Your checking account has been created successfully.",
                  })
                  window.location.reload()
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Checking Account
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const balance = accountData?.totalBalance || 47850.0

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banking Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your business finances, cards, and tax savings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white text-[#0a2540] border-slate-200 hover:bg-slate-50 h-8 text-xs">
            <Download className="mr-2 h-4 w-4" /> Statements
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm h-8 text-xs">
            <Plus className="mr-2 h-4 w-4" /> Add Money
          </Button>
        </div>
      </div>

      {/* Main Stats & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <Card className="col-span-1 lg:col-span-2 bg-[#0a2540] text-white border-none shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-[#635bff] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-slate-300 text-xs font-medium uppercase tracking-wider">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-xl md:text-2xl font-bold">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-green-400 text-[10px] font-medium flex items-center bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +4.2%
              </span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {accountData.accounts?.map((acc: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase">{acc.account_type}</p>
                  <p className="text-sm font-semibold">${Number(acc.balance || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Virtual Card */}
        <div className="col-span-1 h-full">
          <div className="h-full bg-gradient-to-br from-[#635bff] to-[#5851e1] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
            <div className="absolute right-[-20px] top-[-20px] h-40 w-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base">Taxu</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-sm text-[10px]"
                >
                  {cards.length > 0 ? "Business Card" : "No Card"}
                </Badge>
              </div>
              <CreditCard className="h-6 w-6 opacity-80" />
            </div>

            {cards.length > 0 ? (
              <div className="space-y-4 relative z-10 mt-8">
                <div className="text-lg font-mono tracking-wider opacity-90">
                  •••• •••• •••• {cards[0].card_number_last4}
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] opacity-70 uppercase">Card Holder</p>
                    <p className="font-medium text-xs">{cards[0].cardholder_name || "ACCOUNT HOLDER"}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] opacity-70 uppercase">Expires</p>
                    <p className="font-medium text-xs">{cards[0].expiration_date || "••/••"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 relative z-10 mt-8 text-center">
                <p className="text-xs opacity-80">No virtual card created yet</p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-none h-8 text-xs"
                >
                  Request Card
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-lg h-auto">
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2 text-xs h-8"
            >
              Recent Transactions
            </TabsTrigger>
            <TabsTrigger
              value="tax-buckets"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2 text-xs h-8"
            >
              Smart Tax Buckets
            </TabsTrigger>
            <TabsTrigger
              value="cards"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2 text-xs h-8"
            >
              Cards
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center text-xs text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
            <span>FDIC Insured up to $250,000</span>
          </div>
        </div>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Transaction History</CardTitle>
                <Link href="/neobank/transactions">
                  <Button variant="ghost" size="sm" className="text-[#635bff] hover:bg-[#635bff]/10 h-8 text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {transactions.map((txn) => {
                  const getIcon = () => {
                    if (Number(txn.amount) > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
                    if (txn.category === "software") return <Zap className="h-4 w-4 text-blue-600" />
                    return <Store className="h-4 w-4 text-slate-600" />
                  }

                  return (
                    <div
                      key={txn.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn("p-2 rounded-full", Number(txn.amount) > 0 ? "bg-green-100" : "bg-slate-100")}
                        >
                          {getIcon()}
                        </div>
                        <div>
                          <p className="font-medium text-xs text-[#0a2540]">
                            {txn.merchant_name || txn.description || "Transaction"}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(txn.transaction_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "font-medium text-xs",
                            Number(txn.amount) > 0 ? "text-green-600" : "text-[#0a2540]",
                          )}
                        >
                          {Number(txn.amount) > 0 ? "+" : ""}
                          {Number(txn.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-1.5 py-0 h-5 hover:bg-slate-100",
                            txn.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                          )}
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-buckets" className="space-y-4">
          {/* Tax Buckets Content */}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          {/* Cards Content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
