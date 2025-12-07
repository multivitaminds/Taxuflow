"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FolderTree, TrendingUp, TrendingDown, DollarSign, Building2 } from "lucide-react"

const accountTypes = [
  { type: "asset", label: "Assets", icon: DollarSign, color: "text-green-600" },
  { type: "liability", label: "Liabilities", icon: TrendingDown, color: "text-red-600" },
  { type: "equity", label: "Equity", icon: Building2, color: "text-blue-600" },
  { type: "revenue", label: "Revenue", icon: TrendingUp, color: "text-emerald-600" },
  { type: "expense", label: "Expenses", icon: TrendingDown, color: "text-orange-600" },
]

const sampleAccounts = [
  { id: 1, code: "1000", name: "Cash", type: "asset", balance: 45230.5, subAccounts: 3 },
  { id: 2, code: "1200", name: "Accounts Receivable", type: "asset", balance: 12450.0, subAccounts: 0 },
  { id: 3, code: "2000", name: "Accounts Payable", type: "liability", balance: 8920.0, subAccounts: 0 },
  { id: 4, code: "3000", name: "Owner Equity", type: "equity", balance: 50000.0, subAccounts: 2 },
  { id: 5, code: "4000", name: "Sales Revenue", type: "revenue", balance: 125340.0, subAccounts: 5 },
  { id: 6, code: "5000", name: "Operating Expenses", type: "expense", balance: 42180.0, subAccounts: 12 },
]

export default function ChartOfAccountsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredAccounts = sampleAccounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) || account.code.includes(searchQuery)
    const matchesType = !selectedType || account.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {accountTypes.map((type) => {
          const Icon = type.icon
          const count = sampleAccounts.filter((a) => a.type === type.type).length
          return (
            <Card
              key={type.type}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.type ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedType(selectedType === type.type ? null : type.type)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${type.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{type.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderTree className="h-4 w-4 mr-2" />
            Import from QBO
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Accounts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Account Name</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-right p-4 font-medium">Balance</th>
                <th className="text-center p-4 font-medium">Sub-Accounts</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-mono text-sm">{account.code}</td>
                  <td className="p-4 font-medium">
                    <a
                      href={`/accounting/chart-of-accounts/${account.id}`}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {account.name}
                    </a>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="capitalize">
                      {account.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-mono">
                    ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {account.subAccounts > 0 && (
                      <a href={`/accounting/chart-of-accounts/${account.id}/sub-accounts`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {account.subAccounts}
                        </Badge>
                      </a>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
