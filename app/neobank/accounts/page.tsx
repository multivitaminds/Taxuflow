"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const accounts = [
  {
    id: "acc_1",
    name: "Business Checking",
    type: "checking",
    balance: 85000.0,
    accountNumber: "****4291",
    routingNumber: "****8821",
    status: "active",
  },
  {
    id: "acc_2",
    name: "Business Savings",
    type: "savings",
    balance: 45000.0,
    accountNumber: "****7832",
    routingNumber: "****8821",
    status: "active",
  },
  {
    id: "acc_3",
    name: "Tax Reserve",
    type: "savings",
    balance: 12500.0,
    accountNumber: "****9104",
    routingNumber: "****8821",
    status: "active",
  },
]

export default function AccountsPage() {
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({})
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  const toggleShowNumber = (id: string) => {
    setShowNumbers((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyAccountNumber = (num: string) => {
    navigator.clipboard.writeText(num)
    toast.success("Account number copied to clipboard")
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-slate-500 mt-1">Manage your bank accounts and balances.</p>
        </div>
        <Button
          className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm"
          onClick={() => toast.info("New account creation coming soon")}
        >
          <Plus className="mr-2 h-4 w-4" /> Open New Account
        </Button>
      </div>

      <Card className="bg-[#0a2540] text-white border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-300 text-sm font-medium uppercase tracking-wider">
            Total Balance Across All Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-4xl font-bold">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#f0f4ff] rounded-full">
                    <Wallet className="h-6 w-6 text-[#635bff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a2540]">{account.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-500">
                        {showNumbers[account.id] ? "1234-5678-9012-4291" : account.accountNumber}
                      </span>
                      <button onClick={() => toggleShowNumber(account.id)} className="text-slate-400 hover:text-slate-600">
                        {showNumbers[account.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                      <button onClick={() => copyAccountNumber(account.accountNumber)} className="text-slate-400 hover:text-slate-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="bg-[#f0f4ff] text-[#635bff] capitalize">
                        {account.type}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-50 text-green-700 capitalize">
                        {account.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Balance</p>
                    <p className="text-2xl font-bold text-[#0a2540]">
                      ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200"
                      onClick={() => toast.info("Transfer feature coming soon")}
                    >
                      <ArrowUpRight className="h-4 w-4 mr-1" /> Send
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#635bff] hover:bg-[#5851e1] text-white"
                      onClick={() => toast.info("Deposit feature coming soon")}
                    >
                      <ArrowDownRight className="h-4 w-4 mr-1" /> Deposit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
