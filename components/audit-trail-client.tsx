"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Clock, Filter, Download, Search } from "lucide-react"

export default function AuditTrailClient() {
  const [filter, setFilter] = useState("all")

  const auditLogs = [
    {
      id: 1,
      action: "Created Invoice",
      entity: "Invoice #INV-2024-001",
      user: "Sarah Johnson",
      timestamp: "2024-01-15 10:30 AM",
      details: "Created invoice for $15,000",
      type: "create",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      action: "Updated Expense",
      entity: "Expense #EXP-2024-042",
      user: "Mike Chen",
      timestamp: "2024-01-15 09:45 AM",
      details: "Changed amount from $500 to $550",
      type: "update",
      ip: "192.168.1.105",
    },
    {
      id: 3,
      action: "Deleted Bill",
      entity: "Bill #BILL-2024-018",
      user: "Admin User",
      timestamp: "2024-01-15 09:15 AM",
      details: "Deleted duplicate bill entry",
      type: "delete",
      ip: "192.168.1.101",
    },
    {
      id: 4,
      action: "Approved Payment",
      entity: "Payment #PAY-2024-089",
      user: "John Smith",
      timestamp: "2024-01-15 08:30 AM",
      details: "Approved payment of $8,500",
      type: "approve",
      ip: "192.168.1.102",
    },
    {
      id: 5,
      action: "Updated Settings",
      entity: "Tax Settings",
      user: "Admin User",
      timestamp: "2024-01-14 04:20 PM",
      details: "Changed default tax rate to 8.5%",
      type: "update",
      ip: "192.168.1.101",
    },
  ]

  const stats = [
    { label: "Total Events", value: "1,248", color: "text-blue-600" },
    { label: "Today", value: "47", color: "text-emerald-600" },
    { label: "This Week", value: "312", color: "text-purple-600" },
    { label: "Active Users", value: "18", color: "text-amber-600" },
  ]

  const getActionColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-emerald-100 text-emerald-700"
      case "update":
        return "bg-blue-100 text-blue-700"
      case "delete":
        return "bg-red-100 text-red-700"
      case "approve":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-slate-600 mt-1">Complete activity log for compliance and security</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Actions</option>
            <option>Create</option>
            <option>Update</option>
            <option>Delete</option>
            <option>Approve</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Users</option>
            <option>Sarah Johnson</option>
            <option>Mike Chen</option>
            <option>John Smith</option>
            <option>Admin User</option>
          </select>
        </div>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <Card key={log.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-lg bg-slate-50">
                  <FileText className="h-5 w-5 text-slate-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{log.action}</h3>
                    <Badge className={getActionColor(log.type)}>{log.type}</Badge>
                  </div>

                  <p className="text-slate-700 mb-2">{log.entity}</p>
                  <p className="text-sm text-slate-600 mb-3">{log.details}</p>

                  <div className="flex gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{log.timestamp}</span>
                    </div>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
