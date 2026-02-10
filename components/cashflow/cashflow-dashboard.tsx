"use client"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, CreditCard, Plus, PiggyBank, ShieldCheck, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// Mock data simulating database tables
const accountData = {
  balance: 142500.0,
  checking: 85000.0,
  savings: 45000.0,
  taxBuckets: 12500.0,
  accountNumber: "****4291",
  routingNumber: "****8821",
}

const transactions = [
  {
    id: "txn_1",
    merchant: "AWS Web Services",
    amount: -2450.0,
    date: "Today, 2:45 PM",
    type: "purchase",
    status: "pending",
    icon: (
      <div className="bg-orange-100 p-2 rounded-full">
        <CreditCard className="h-4 w-4 text-orange-600" />
      </div>
    ),
  },
  {
    id: "txn_2",
    merchant: "Client Payment - Stripe Payout",
    amount: 12500.0,
    date: "Yesterday",
    type: "deposit",
    status: "completed",
    icon: (
      <div className="bg-green-100 p-2 rounded-full">
        <ArrowDownRight className="h-4 w-4 text-green-600" />
      </div>
    ),
  },
  {
    id: "txn_3",
    merchant: "WeWork Office",
    amount: -4500.0,
    date: "Oct 24",
    type: "purchase",
    status: "completed",
    icon: (
      <div className="bg-blue-100 p-2 rounded-full">
        <Building2 className="h-4 w-4 text-blue-600" />
      </div>
    ),
  },
  {
    id: "txn_4",
    merchant: "Tax Bucket Auto-Transfer",
    amount: -3750.0,
    date: "Oct 24",
    type: "transfer",
    status: "completed",
    icon: (
      <div className="bg-purple-100 p-2 rounded-full">
        <PiggyBank className="h-4 w-4 text-purple-600" />
      </div>
    ),
  },
  {
    id: "txn_5",
    merchant: "Apple Store",
    amount: -2199.0,
    date: "Oct 22",
    type: "purchase",
    status: "completed",
    icon: (
      <div className="bg-gray-100 p-2 rounded-full">
        <CreditCard className="h-4 w-4 text-gray-600" />
      </div>
    ),
  },
]

const taxBuckets = [
  { name: "Federal Tax", balance: 8500.0, goal: 15000.0, color: "bg-[#635bff]" },
  { name: "State Tax", balance: 2500.0, goal: 4000.0, color: "bg-[#00d4ff]" },
  { name: "Sales Tax", balance: 1500.0, goal: 2000.0, color: "bg-[#32d74b]" },
]

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

export function CashflowDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banking Overview</h1>
          <p className="text-slate-500 mt-1">Manage your business finances, cards, and tax savings.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white text-[#0a2540] border-slate-200 hover:bg-slate-50" onClick={() => toast.info("Downloading account statements...")}>
            <Download className="mr-2 h-4 w-4" /> Statements
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm" onClick={() => toast.info("Add Money feature coming soon")}>
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
            <CardTitle className="text-slate-300 text-sm font-medium uppercase tracking-wider">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold">
                ${accountData.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-green-400 text-sm font-medium flex items-center bg-green-400/10 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +4.2%
              </span>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase">Checking</p>
                <p className="text-lg font-semibold">${accountData.checking.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase">Savings</p>
                <p className="text-lg font-semibold">${accountData.savings.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 uppercase">Tax Buckets</p>
                <p className="text-lg font-semibold text-[#00d4ff]">${accountData.taxBuckets.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Virtual Card */}
        <div className="col-span-1 h-full">
          <div className="h-full bg-gradient-to-br from-[#635bff] to-[#5851e1] rounded-xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
            <div className="absolute right-[-20px] top-[-20px] h-40 w-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Taxu</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-sm"
                >
                  Business Debit
                </Badge>
              </div>
              <CreditCard className="h-6 w-6 opacity-80" />
            </div>

            <div className="space-y-4 relative z-10 mt-8">
              <div className="text-2xl font-mono tracking-wider opacity-90">•••• •••• •••• 4291</div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-xs opacity-70 uppercase">Card Holder</p>
                  <p className="font-medium">ALEXANDER SMITH</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs opacity-70 uppercase">Expires</p>
                  <p className="font-medium">12/28</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
              <span className="text-sm opacity-80">Visa Business</span>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-8" onClick={() => toast.info("Opening card management...")}>
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="bg-white p-1 border border-slate-200 shadow-sm rounded-lg h-auto">
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
            >
              Recent Transactions
            </TabsTrigger>
            <TabsTrigger
              value="tax-buckets"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
            >
              Smart Tax Buckets
            </TabsTrigger>
            <TabsTrigger
              value="cards"
              className="data-[state=active]:bg-[#e3e8ee] data-[state=active]:text-[#0a2540] py-2"
            >
              Cards
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
            <span>FDIC Insured up to $250,000</span>
          </div>
        </div>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
                <Button variant="ghost" size="sm" className="text-[#635bff]" onClick={() => toast.info("Navigating to full transaction history...")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {txn.icon}
                      <div>
                        <p className="font-medium text-sm text-[#0a2540]">{txn.merchant}</p>
                        <p className="text-xs text-slate-500">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-medium text-sm", txn.amount > 0 ? "text-green-600" : "text-[#0a2540]")}>
                        {txn.amount > 0 ? "+" : ""}
                        {txn.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-5",
                          txn.status === "pending"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-100",
                        )}
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-buckets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {taxBuckets.map((bucket) => (
              <Card key={bucket.name} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-slate-600">{bucket.name}</CardTitle>
                    <div className={cn("h-2 w-2 rounded-full", bucket.color)}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-2xl font-bold text-[#0a2540]">${bucket.balance.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 ml-2">/ ${bucket.goal.toLocaleString()}</span>
                    </div>
                    <Progress value={(bucket.balance / bucket.goal) * 100} className="h-2" />
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{((bucket.balance / bucket.goal) * 100).toFixed(0)}% Funded</span>
                      <span className="text-[#635bff] font-medium cursor-pointer">Auto-save ON</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-slate-200 border-dashed shadow-none bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 h-full min-h-[180px]">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <Plus className="h-6 w-6 text-[#635bff]" />
              </div>
              <p className="font-medium text-[#0a2540]">Create New Bucket</p>
              <p className="text-xs text-slate-500 mt-1 text-center">Save for equipment, payroll, or custom goals</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
