"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, User, Clock, CheckCircle, XCircle, Plus, Eye } from "lucide-react"

export default function ReimbursementsClient() {
  const [reimbursements, setReimbursements] = useState([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      date: "2024-01-15",
      amount: 245.67,
      status: "pending",
      items: 3,
      category: "Travel",
    },
    {
      id: 2,
      employeeName: "Michael Chen",
      date: "2024-01-14",
      amount: 89.5,
      status: "approved",
      items: 2,
      category: "Meals",
    },
    {
      id: 3,
      employeeName: "Emily Rodriguez",
      date: "2024-01-13",
      amount: 1250.0,
      status: "paid",
      items: 5,
      category: "Equipment",
    },
    {
      id: 4,
      employeeName: "David Kim",
      date: "2024-01-12",
      amount: 45.0,
      status: "rejected",
      items: 1,
      category: "Office Supplies",
    },
  ])

  const stats = {
    pending: reimbursements.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
    approved: reimbursements.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0),
    paid: reimbursements.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0),
    total: reimbursements.length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Employee Reimbursements</h1>
              <p className="text-muted-foreground">Manage and approve employee expense reimbursements</p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Submit Reimbursement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-foreground">${stats.pending.toFixed(2)}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-2xl font-bold text-foreground">${stats.approved.toFixed(2)}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Paid</p>
                  <p className="text-2xl font-bold text-foreground">${stats.paid.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Card className="border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Reimbursement Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reimbursements.map((reimbursement) => (
                  <tr key={reimbursement.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(reimbursement.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-foreground">{reimbursement.employeeName}</td>
                    <td className="p-4">
                      <Badge variant="outline">{reimbursement.category}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{reimbursement.items} items</td>
                    <td className="p-4 font-medium text-foreground">${reimbursement.amount.toFixed(2)}</td>
                    <td className="p-4">{getStatusBadge(reimbursement.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reimbursement.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
                              Approve
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
