"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Send, CheckCircle, XCircle, Clock, Copy, Repeat } from "lucide-react"
import Link from "next/link"

export default function EstimatesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const estimates = [
    {
      id: "EST-001",
      customer: "Acme Corporation",
      date: "2024-01-15",
      expiryDate: "2024-02-15",
      amount: 15000,
      status: "sent",
      items: 5,
    },
    {
      id: "EST-002",
      customer: "TechStart Inc",
      date: "2024-01-18",
      expiryDate: "2024-02-18",
      amount: 8500,
      status: "accepted",
      items: 3,
    },
    {
      id: "EST-003",
      customer: "Creative Studio",
      date: "2024-01-20",
      expiryDate: "2024-02-20",
      amount: 12000,
      status: "draft",
      items: 4,
    },
    {
      id: "EST-004",
      customer: "Global Enterprises",
      date: "2024-01-10",
      expiryDate: "2024-02-10",
      amount: 25000,
      status: "declined",
      items: 8,
    },
  ]

  const stats = [
    {
      label: "Total Estimates",
      value: "24",
      icon: FileText,
      color: "text-blue-600",
      link: "/accounting/estimates?status=all",
    },
    { label: "Sent", value: "8", icon: Send, color: "text-purple-600", link: "/accounting/estimates?status=sent" },
    {
      label: "Accepted",
      value: "12",
      icon: CheckCircle,
      color: "text-green-600",
      link: "/accounting/estimates?status=accepted",
    },
    {
      label: "Total Value",
      value: "$125,500",
      icon: Clock,
      color: "text-orange-600",
      link: "/accounting/estimates/analytics",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "sent":
        return "bg-blue-100 text-blue-700"
      case "accepted":
        return "bg-green-100 text-green-700"
      case "declined":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "declined":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estimates & Quotes</h1>
          <p className="text-muted-foreground">Create and manage pricing proposals for customers</p>
        </div>
        <div className="flex gap-2">
          <Link href="/accounting/estimates/templates">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Copy className="h-4 w-4" />
              Templates
            </Button>
          </Link>
          <Link href="/accounting/estimates/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Estimate
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.link}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search estimates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
              All
            </Button>
            <Button variant={statusFilter === "draft" ? "default" : "outline"} onClick={() => setStatusFilter("draft")}>
              Draft
            </Button>
            <Button variant={statusFilter === "sent" ? "default" : "outline"} onClick={() => setStatusFilter("sent")}>
              Sent
            </Button>
            <Button
              variant={statusFilter === "accepted" ? "default" : "outline"}
              onClick={() => setStatusFilter("accepted")}
            >
              Accepted
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/accounting/estimates/templates">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Copy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quote Templates</h3>
                <p className="text-sm text-muted-foreground">Manage reusable templates</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/accounting/estimates/versions">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Repeat className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Version History</h3>
                <p className="text-sm text-muted-foreground">Track quote revisions</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/accounting/estimates/analytics">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Win Rate Analytics</h3>
                <p className="text-sm text-muted-foreground">Track conversion metrics</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Estimates Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Estimate #</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Expiry Date</th>
                <th className="text-left p-4 font-medium">Items</th>
                <th className="text-right p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="border-b hover:bg-muted/50 cursor-pointer">
                  <td className="p-4 font-medium">{estimate.id}</td>
                  <td className="p-4">{estimate.customer}</td>
                  <td className="p-4 text-muted-foreground">{estimate.date}</td>
                  <td className="p-4 text-muted-foreground">{estimate.expiryDate}</td>
                  <td className="p-4 text-muted-foreground">{estimate.items} items</td>
                  <td className="p-4 text-right font-medium">${estimate.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <Badge className={`gap-1 ${getStatusColor(estimate.status)}`}>
                      {getStatusIcon(estimate.status)}
                      {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/accounting/estimates/${estimate.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
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
