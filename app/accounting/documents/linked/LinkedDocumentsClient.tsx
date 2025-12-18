"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Link2, Eye, Download } from "lucide-react"

export default function LinkedDocumentsClient() {
  const linkedDocuments = [
    {
      id: 1,
      document: "Invoice_ABC_Corp.pdf",
      linkedTo: "Invoice #INV-2024-001",
      type: "Invoice",
      amount: "$5,420.00",
      date: "2024-01-20",
      status: "Paid",
    },
    {
      id: 2,
      document: "Receipt_Office_Supplies.jpg",
      linkedTo: "Expense #EXP-2024-045",
      type: "Expense",
      amount: "$245.00",
      date: "2024-01-19",
      status: "Approved",
    },
    {
      id: 3,
      document: "Bill_Utility_Company.pdf",
      linkedTo: "Bill #BILL-2024-023",
      type: "Bill",
      amount: "$1,280.00",
      date: "2024-01-18",
      status: "Pending",
    },
    {
      id: 4,
      document: "Contract_Vendor_XYZ.pdf",
      linkedTo: "Vendor: XYZ Services Inc",
      type: "Vendor",
      amount: "$12,000.00",
      date: "2024-01-15",
      status: "Active",
    },
  ]

  const stats = [
    { label: "Total Linked", value: linkedDocuments.length.toString(), color: "from-blue-500 to-blue-600" },
    { label: "Invoices", value: "1", color: "from-green-500 to-green-600" },
    { label: "Expenses", value: "1", color: "from-orange-500 to-orange-600" },
    { label: "Bills", value: "1", color: "from-purple-500 to-purple-600" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "active":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/accounting/documents"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Linked Documents
            </h1>
            <p className="text-slate-600 mt-1">View documents linked to transactions and records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <Link2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="space-y-3">
            {linkedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{doc.document}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        {doc.linkedTo}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {doc.type}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{doc.amount}</p>
                    <p className="text-xs text-slate-500">{doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
