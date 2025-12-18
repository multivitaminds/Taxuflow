"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, DollarSign, CheckCircle, Clock, Settings, LogOut, Plus, Download, Eye } from "lucide-react"

export default function VendorPortalClient() {
  const [activeTab, setActiveTab] = useState("bills")

  const vendorInfo = {
    name: "Office Supplies Co.",
    email: "billing@officesupplies.com",
    vendorNumber: "VEND-2001",
    status: "active",
  }

  const bills = [
    {
      id: "BILL-5001",
      date: "2024-01-10",
      amount: 1450.0,
      status: "paid",
      paidDate: "2024-01-25",
      description: "Office supplies - January",
    },
    {
      id: "BILL-5002",
      date: "2024-02-10",
      amount: 980.0,
      status: "pending",
      paidDate: null,
      description: "Office supplies - February",
    },
    {
      id: "BILL-5003",
      date: "2024-03-10",
      amount: 1200.0,
      status: "approved",
      paidDate: null,
      description: "Office supplies - March",
    },
  ]

  const stats = [
    { label: "Pending Bills", value: "2", icon: Clock, color: "yellow" },
    { label: "Paid This Year", value: "$12,450", icon: CheckCircle, color: "green" },
    { label: "Total Submitted", value: "8", icon: FileText, color: "blue" },
    { label: "Average Payment", value: "$1,556", icon: DollarSign, color: "purple" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "approved":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {vendorInfo.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{vendorInfo.name}</h2>
                <p className="text-sm text-slate-500">{vendorInfo.vendorNumber}</p>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Vendor Portal</h1>
            <p className="text-slate-600">Submit bills, track payments, and manage your account</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Submit New Bill
          </Button>
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
              <TabsTrigger value="bills" className="gap-2">
                <FileText className="h-4 w-4" />
                My Bills
              </TabsTrigger>
              <TabsTrigger value="submit" className="gap-2">
                <Upload className="h-4 w-4" />
                Submit Bill
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bills">
              <div className="space-y-4">
                {bills.map((bill) => (
                  <Card key={bill.id} className="p-6 border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{bill.id}</h3>
                          <p className="text-sm text-slate-600 mt-1">{bill.description}</p>
                          <p className="text-xs text-slate-500 mt-1">Submitted: {bill.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">${bill.amount.toFixed(2)}</p>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {bill.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {bill.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </Badge>
                          {bill.paidDate && <p className="text-xs text-green-600 mt-1">Paid: {bill.paidDate}</p>}
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
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="submit">
              <div className="max-w-2xl mx-auto">
                <Card className="p-8 border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="text-center">
                    <Upload className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Submit a New Bill</h3>
                    <p className="text-slate-600 mb-6">Upload your invoice or bill document</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
