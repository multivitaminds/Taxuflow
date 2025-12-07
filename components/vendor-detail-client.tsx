"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Download,
  Edit,
  Plus,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts"

interface VendorDetailClientProps {
  vendorId: string
}

export function VendorDetailClient({ vendorId }: VendorDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock vendor data
  const vendor = {
    id: vendorId,
    name: "Office Supplies Co.",
    email: "billing@officesupplies.com",
    phone: "(555) 123-4567",
    address: "123 Business St, Suite 100",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    category: "Office Supplies",
    paymentTerms: "Net 30",
    taxId: "12-3456789",
    website: "www.officesupplies.com",
    since: "2022-03-15",
    balance: 2450.0,
    openBills: 3,
    totalSpent: 24500.0,
    avgMonthlySpend: 2041.67,
    status: "active",
  }

  const bills = [
    { id: "1", number: "BILL-001", date: "2025-01-15", dueDate: "2025-02-14", amount: 1200.0, status: "open" },
    { id: "2", number: "BILL-002", date: "2025-01-10", dueDate: "2025-02-09", amount: 850.0, status: "open" },
    { id: "3", number: "BILL-003", date: "2025-01-05", dueDate: "2025-02-04", amount: 400.0, status: "open" },
    { id: "4", number: "BILL-004", date: "2024-12-20", dueDate: "2025-01-19", amount: 1500.0, status: "paid" },
  ]

  const spendingData = [
    { month: "Jul", amount: 2100 },
    { month: "Aug", amount: 1800 },
    { month: "Sep", amount: 2400 },
    { month: "Oct", amount: 1950 },
    { month: "Nov", amount: 2200 },
    { month: "Dec", amount: 2450 },
  ]

  const categoryBreakdown = [
    { category: "Office Supplies", amount: 12500 },
    { category: "Furniture", amount: 7800 },
    { category: "Equipment", amount: 4200 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/vendors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            {vendor.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{vendor.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default">{vendor.category}</Badge>
              <Badge variant="outline">{vendor.status}</Badge>
              <span className="text-sm text-slate-500">
                Customer since {new Date(vendor.since).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="bg-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Bill
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Balance Due</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">${vendor.balance.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Open Bills</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{vendor.openBills}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">${vendor.totalSpent.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Avg Monthly</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">${vendor.avgMonthlySpend.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 shadow-sm">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Trend */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">6-Month Spending Trend</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Breakdown */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending by Category</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Bills */}
          <Card className="bg-white shadow-md">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Recent Bills</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600">Bill #</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600">Date</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600">Due Date</th>
                    <th className="p-4 text-right text-sm font-semibold text-slate-600">Amount</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
                    <th className="p-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{bill.number}</td>
                      <td className="p-4 text-slate-600">{new Date(bill.date).toLocaleDateString()}</td>
                      <td className="p-4 text-slate-600">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="p-4 text-right font-semibold text-slate-900">${bill.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant={bill.status === "paid" ? "default" : "outline"}>{bill.status}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card className="p-6 bg-white shadow-md">
            <p className="text-slate-600">Bills and payment history will be displayed here...</p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6 bg-white shadow-md">
            <p className="text-slate-600">Detailed analytics and insights will be displayed here...</p>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-900">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">{vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">{vendor.address}</p>
                    <p className="font-medium text-slate-900">
                      {vendor.city}, {vendor.state} {vendor.zip}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Payment Terms</p>
                  <p className="font-medium text-slate-900">{vendor.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tax ID</p>
                  <p className="font-medium text-slate-900">{vendor.taxId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Website</p>
                  <a href={`https://${vendor.website}`} className="font-medium text-blue-600 hover:underline">
                    {vendor.website}
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
