"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  DollarSign,
  Download,
  Eye,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function CustomerPortalClient() {
  const [activeTab, setActiveTab] = useState("invoices")

  const customerInfo = {
    name: "Acme Corporation",
    email: "billing@acme.com",
    accountNumber: "CUST-1001",
    status: "active",
  }

  const invoices = [
    {
      id: "INV-1001",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 1250.0,
      status: "paid",
      paidDate: "2024-02-10",
    },
    {
      id: "INV-1002",
      date: "2024-02-15",
      dueDate: "2024-03-15",
      amount: 2100.0,
      status: "overdue",
      paidDate: null,
    },
    {
      id: "INV-1003",
      date: "2024-03-15",
      dueDate: "2024-04-15",
      amount: 950.0,
      status: "pending",
      paidDate: null,
    },
  ]

  const stats = [
    { label: "Total Outstanding", value: "$3,050", icon: DollarSign, color: "orange" },
    { label: "Overdue Amount", value: "$2,100", icon: AlertCircle, color: "red" },
    { label: "Paid This Year", value: "$15,750", icon: CheckCircle, color: "green" },
    { label: "Total Invoices", value: "12", icon: FileText, color: "blue" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                {customerInfo.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{customerInfo.name}</h2>
                <p className="text-sm text-slate-500">{customerInfo.accountNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
          <p className="text-slate-600">View and manage your invoices, payments, and account details</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="invoices" className="gap-2">
                <FileText className="h-4 w-4" />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Payment History
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices">
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="p-6 border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{invoice.id}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                            <span>Issued: {invoice.date}</span>
                            <span>Due: {invoice.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">${invoice.amount.toFixed(2)}</p>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {invoice.status === "overdue" && <AlertCircle className="h-3 w-3 mr-1" />}
                            {invoice.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div className="text-center py-12 text-slate-500">
                <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>No payment history available</p>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="text-center py-12 text-slate-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                <p>No messages</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
