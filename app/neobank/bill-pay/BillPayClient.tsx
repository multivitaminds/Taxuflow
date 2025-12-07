"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, CheckCircle2, Clock, Plus, History, Building2, Zap } from "lucide-react"

export default function BillPayClient() {
  const [selectedTab, setSelectedTab] = useState("upcoming")

  const stats = {
    upcomingBills: 8,
    totalDue: 2845.5,
    autoPay: 5,
    overdue: 0,
  }

  const upcomingBills = [
    {
      id: 1,
      payee: "Electric Company",
      amount: 125.5,
      dueDate: "2024-02-05",
      category: "Utilities",
      status: "scheduled",
      autoPay: true,
    },
    {
      id: 2,
      payee: "Internet Service",
      amount: 89.99,
      dueDate: "2024-02-10",
      category: "Utilities",
      status: "pending",
      autoPay: true,
    },
    {
      id: 3,
      payee: "Credit Card",
      amount: 1250.0,
      dueDate: "2024-02-15",
      category: "Credit Card",
      status: "pending",
      autoPay: false,
    },
    {
      id: 4,
      payee: "Car Insurance",
      amount: 150.0,
      dueDate: "2024-02-20",
      category: "Insurance",
      status: "scheduled",
      autoPay: true,
    },
  ]

  const recurringPayments = [
    { id: 1, name: "Netflix", amount: 15.99, frequency: "Monthly", nextDate: "2024-02-08", active: true },
    { id: 2, name: "Spotify", amount: 9.99, frequency: "Monthly", nextDate: "2024-02-12", active: true },
    { id: 3, name: "Adobe Creative Cloud", amount: 52.99, frequency: "Monthly", nextDate: "2024-02-18", active: true },
    { id: 4, name: "Gym Membership", amount: 45.0, frequency: "Monthly", nextDate: "2024-02-22", active: true },
  ]

  const paymentHistory = [
    {
      id: 1,
      payee: "Electric Company",
      amount: 118.75,
      date: "2024-01-05",
      status: "completed",
      method: "Auto-Pay",
    },
    {
      id: 2,
      payee: "Internet Service",
      amount: 89.99,
      date: "2024-01-10",
      status: "completed",
      method: "Auto-Pay",
    },
    {
      id: 3,
      payee: "Credit Card",
      amount: 1100.0,
      date: "2024-01-15",
      status: "completed",
      method: "Manual",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Bill Pay</h1>
          <p className="text-slate-600 mt-1">Manage bills and recurring payments</p>
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
              <Calendar className="h-4 w-4 text-[#635bff]" />
              Upcoming Bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.upcomingBills}</div>
            <div className="text-sm text-slate-600 mt-1">Next 30 days</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Total Due
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">${stats.totalDue.toLocaleString()}</div>
            <div className="text-sm text-slate-600 mt-1">This month</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              Auto-Pay Active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.autoPay}</div>
            <div className="text-sm text-slate-600 mt-1">Bills on auto-pay</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Overdue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0a2540]">{stats.overdue}</div>
            <Badge className="bg-green-100 text-green-700 mt-1">All paid</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Payments</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#635bff]" />
                Bills Due Soon
              </CardTitle>
              <CardDescription>Your upcoming bills and scheduled payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-[#635bff] transition-all cursor-pointer bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#635bff]/10 rounded-lg">
                        <Building2 className="h-5 w-5 text-[#635bff]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a2540]">{bill.payee}</h3>
                        <p className="text-sm text-slate-600">{bill.category}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status === "scheduled" ? "Scheduled" : "Pending"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Amount</p>
                      <p className="font-semibold text-[#0a2540]">${bill.amount}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Due Date</p>
                      <p className="font-semibold text-[#0a2540]">{bill.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Payment Method</p>
                      <div className="flex items-center gap-1">
                        {bill.autoPay ? (
                          <>
                            <Zap className="h-3 w-3 text-green-600" />
                            <span className="text-green-600 font-medium">Auto-Pay</span>
                          </>
                        ) : (
                          <span className="text-slate-600">Manual</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!bill.autoPay && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <Button size="sm" className="bg-[#635bff] hover:bg-[#5248e5] text-white">
                        Pay Now
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#635bff]" />
                Recurring Payments
              </CardTitle>
              <CardDescription>Subscriptions and automatic payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recurringPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md hover:border-[#635bff] transition-all bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#635bff] to-[#8f8bf5] flex items-center justify-center text-white font-bold">
                        {payment.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a2540]">{payment.name}</h3>
                        <p className="text-sm text-slate-600">{payment.frequency}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0a2540]">${payment.amount}</p>
                      <p className="text-sm text-slate-600">Next: {payment.nextDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-[#635bff]" />
                Payment History
              </CardTitle>
              <CardDescription>Recent bill payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-all bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-[#0a2540]">{payment.payee}</h3>
                          <p className="text-sm text-slate-600">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0a2540]">${payment.amount}</p>
                        <p className="text-sm text-slate-600">{payment.method}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
