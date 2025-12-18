"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Search, Plus, Zap, DollarSign, Edit, Trash2, CheckCircle2, Clock } from "lucide-react"

export default function PayeesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const stats = {
    totalPayees: 12,
    autoPayEnabled: 7,
    recurringPayments: 9,
    active: 12,
  }

  const payees = [
    {
      id: 1,
      name: "Electric Company",
      category: "Utilities",
      accountNumber: "****4567",
      autoPay: true,
      recurring: true,
      lastPayment: "$125.50",
      lastPaymentDate: "2024-01-05",
      nextDue: "2024-02-05",
      status: "active",
    },
    {
      id: 2,
      name: "Internet Service Provider",
      category: "Utilities",
      accountNumber: "****8912",
      autoPay: true,
      recurring: true,
      lastPayment: "$89.99",
      lastPaymentDate: "2024-01-10",
      nextDue: "2024-02-10",
      status: "active",
    },
    {
      id: 3,
      name: "Credit Card - Chase",
      category: "Credit Card",
      accountNumber: "****3456",
      autoPay: false,
      recurring: false,
      lastPayment: "$1,250.00",
      lastPaymentDate: "2024-01-15",
      nextDue: "2024-02-15",
      status: "active",
    },
    {
      id: 4,
      name: "Car Insurance",
      category: "Insurance",
      accountNumber: "****7890",
      autoPay: true,
      recurring: true,
      lastPayment: "$150.00",
      lastPaymentDate: "2024-01-20",
      nextDue: "2024-02-20",
      status: "active",
    },
    {
      id: 5,
      name: "Netflix",
      category: "Entertainment",
      accountNumber: "****2345",
      autoPay: true,
      recurring: true,
      lastPayment: "$15.99",
      lastPaymentDate: "2024-01-08",
      nextDue: "2024-02-08",
      status: "active",
    },
    {
      id: 6,
      name: "Spotify Premium",
      category: "Entertainment",
      accountNumber: "****6789",
      autoPay: true,
      recurring: true,
      lastPayment: "$9.99",
      lastPaymentDate: "2024-01-12",
      nextDue: "2024-02-12",
      status: "active",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Utilities":
        return "bg-blue-100 text-blue-700"
      case "Credit Card":
        return "bg-purple-100 text-purple-700"
      case "Insurance":
        return "bg-orange-100 text-orange-700"
      case "Entertainment":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const filteredPayees = payees.filter((payee) => {
    const matchesSearch = payee.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "autopay" && payee.autoPay) ||
      (selectedTab === "recurring" && payee.recurring)
    return matchesSearch && matchesTab
  })

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Payee Management</h1>
          <p className="text-slate-600 mt-1">Manage your bill payees and payment methods</p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5248e5] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Payee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#635bff] hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#635bff]" />
              Total Payees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.totalPayees}</div>
            <Badge className="bg-green-100 text-green-700 mt-1">{stats.active} Active</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Auto-Pay Enabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.autoPayEnabled}</div>
            <div className="text-sm text-slate-600 mt-1">
              {((stats.autoPayEnabled / stats.totalPayees) * 100).toFixed(0)}% of payees
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Recurring Payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.recurringPayments}</div>
            <div className="text-sm text-slate-600 mt-1">Automated billing</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Avg. Monthly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">$891.47</div>
            <div className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <span>↓</span> 5% vs last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Payees</CardTitle>
              <CardDescription>Manage your bill payment recipients</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search payees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="all">All Payees ({payees.length})</TabsTrigger>
              <TabsTrigger value="autopay">Auto-Pay ({payees.filter((p) => p.autoPay).length})</TabsTrigger>
              <TabsTrigger value="recurring">Recurring ({payees.filter((p) => p.recurring).length})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-3">
              {filteredPayees.length > 0 ? (
                filteredPayees.map((payee) => (
                  <div
                    key={payee.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-[#635bff] transition-all cursor-pointer bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-[#635bff]/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-[#635bff]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#0a2540] text-lg">{payee.name}</h3>
                            {payee.autoPay && (
                              <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                Auto-Pay
                              </Badge>
                            )}
                            {payee.recurring && (
                              <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>Account: {payee.accountNumber}</span>
                            <Badge className={getCategoryColor(payee.category)}>{payee.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Last Payment</p>
                        <p className="font-semibold text-[#0a2540]">{payee.lastPayment}</p>
                        <p className="text-xs text-slate-500">{payee.lastPaymentDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Next Due</p>
                        <p className="font-semibold text-[#0a2540]">{payee.nextDue}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          On schedule
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Status</p>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No payees found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
