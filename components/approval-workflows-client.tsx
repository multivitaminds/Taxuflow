"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Users, Plus } from "lucide-react"

export default function ApprovalWorkflowsClient() {
  const [activeTab, setActiveTab] = useState("pending")

  const approvalRequests = [
    {
      id: 1,
      type: "Expense",
      title: "Office Supplies Purchase",
      amount: 2500,
      submittedBy: "Sarah Johnson",
      date: "2024-01-15",
      status: "pending",
      approvers: ["John Smith", "Mary Wilson"],
      currentApprover: "John Smith",
    },
    {
      id: 2,
      type: "Invoice",
      title: "Invoice #INV-2024-001",
      amount: 15000,
      submittedBy: "Mike Chen",
      date: "2024-01-14",
      status: "pending",
      approvers: ["John Smith"],
      currentApprover: "John Smith",
    },
    {
      id: 3,
      type: "Bill",
      title: "Vendor Payment - Tech Services",
      amount: 8500,
      submittedBy: "Emily Davis",
      date: "2024-01-13",
      status: "approved",
      approvers: ["John Smith", "Mary Wilson"],
      approvedBy: "John Smith",
      approvedDate: "2024-01-14",
    },
    {
      id: 4,
      type: "Expense",
      title: "Travel Reimbursement",
      amount: 1200,
      submittedBy: "Tom Anderson",
      date: "2024-01-12",
      status: "rejected",
      approvers: ["Mary Wilson"],
      rejectedBy: "Mary Wilson",
      rejectedDate: "2024-01-13",
      reason: "Missing receipts",
    },
  ]

  const workflows = [
    {
      id: 1,
      name: "Expense Approval - Under $5,000",
      type: "Expense",
      threshold: 5000,
      approvers: ["Manager"],
      active: true,
    },
    {
      id: 2,
      name: "Expense Approval - Over $5,000",
      type: "Expense",
      threshold: null,
      approvers: ["Manager", "Finance Director"],
      active: true,
    },
    {
      id: 3,
      name: "Invoice Approval",
      type: "Invoice",
      threshold: 10000,
      approvers: ["Finance Director"],
      active: true,
    },
    {
      id: 4,
      name: "Bill Payment Approval",
      type: "Bill",
      threshold: 3000,
      approvers: ["Manager", "Finance Director"],
      active: true,
    },
  ]

  const stats = [
    { label: "Pending Approval", value: "8", icon: Clock, color: "text-amber-600" },
    { label: "Approved Today", value: "12", icon: CheckCircle, color: "text-emerald-600" },
    { label: "Rejected", value: "2", icon: XCircle, color: "text-red-600" },
    { label: "Active Workflows", value: "6", icon: Users, color: "text-blue-600" },
  ]

  const filteredRequests = approvalRequests.filter((req) => {
    if (activeTab === "all") return true
    return req.status === activeTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700"
      case "approved":
        return "bg-emerald-100 text-emerald-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Workflows</h1>
          <p className="text-slate-600 mt-1">Manage approval processes for expenses, invoices, and bills</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Approval Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Approval Requests</h2>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{request.type}</Badge>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">${request.amount.toLocaleString()}</p>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2">{request.title}</h3>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                  <div>
                    <span className="font-medium">Submitted by:</span> {request.submittedBy}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {request.date}
                  </div>
                  {request.currentApprover && (
                    <div className="col-span-2">
                      <span className="font-medium">Awaiting:</span> {request.currentApprover}
                    </div>
                  )}
                  {request.reason && (
                    <div className="col-span-2 text-red-600">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </div>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50 bg-transparent">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Workflows Sidebar */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Workflows</h2>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline">{workflow.type}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{workflow.name}</h3>
                <div className="text-sm text-slate-600">
                  <p className="mb-1">Approvers: {workflow.approvers.join(", ")}</p>
                  {workflow.threshold && <p>Threshold: ${workflow.threshold.toLocaleString()}</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
