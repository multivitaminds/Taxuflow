"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  DollarSign,
  FileText,
  MoreVertical,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Upload,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { BulkUploadDialog } from "@/components/bulk-upload-dialog" // Added bulk upload dialog

export function VendorsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false) // Added state for bulk upload dialog

  const vendors = [
    {
      id: "1",
      name: "Office Supplies Co.",
      email: "billing@officesupplies.com",
      phone: "(555) 123-4567",
      balance: 2450.0,
      openBills: 3,
      status: "active",
      category: "Office Supplies",
      paymentTerms: "Net 30",
      totalSpent: 24500.0,
    },
    {
      id: "2",
      name: "Tech Solutions Inc.",
      email: "accounts@techsolutions.com",
      phone: "(555) 234-5678",
      balance: 5200.0,
      openBills: 2,
      status: "active",
      category: "IT Services",
      paymentTerms: "Net 15",
      totalSpent: 45600.0,
    },
    {
      id: "3",
      name: "Marketing Agency LLC",
      email: "billing@marketingagency.com",
      phone: "(555) 345-6789",
      balance: 0,
      openBills: 0,
      status: "active",
      category: "Marketing",
      paymentTerms: "Due on Receipt",
      totalSpent: 32100.0,
    },
  ]

  const stats = [
    { label: "Total Vendors", value: "24", icon: Building2, color: "blue", href: "/accounting/vendors/all" },
    { label: "Active Vendors", value: "18", icon: TrendingUp, color: "green", href: "/accounting/vendors/active" },
    {
      label: "Total Payable",
      value: "$12,450",
      icon: DollarSign,
      color: "orange",
      href: "/accounting/vendors/payables",
    },
    { label: "Open Bills", value: "8", icon: FileText, color: "red", href: "/accounting/vendors/bills" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendors</h1>
          <p className="text-slate-600 mt-1">Manage your vendors and supplier relationships</p>
        </div>
        <div className="flex gap-3">
          <Link href="/portal/vendor">
            <Button variant="outline" className="bg-white">
              <Building2 className="h-4 w-4 mr-2" />
              Vendor Portal
            </Button>
          </Link>
          <Button variant="outline" className="bg-white" onClick={() => setShowBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button variant="outline" className="bg-white">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Link href="/accounting/vendors/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Vendor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search vendors by name, email, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <Link key={vendor.id} href={`/accounting/vendors/${vendor.id}`}>
            <Card className="p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group bg-white border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {vendor.name}
                    </h3>
                    <Badge variant="default" className="mt-1">
                      {vendor.category}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Vendor</DropdownMenuItem>
                    <DropdownMenuItem>Create Bill</DropdownMenuItem>
                    <DropdownMenuItem>View Transactions</DropdownMenuItem>
                    <DropdownMenuItem>Payment History</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Terms: {vendor.paymentTerms}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Balance Due</p>
                  <p className="text-lg font-bold text-orange-600">${vendor.balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Open Bills</p>
                  <p className="text-lg font-bold text-slate-900">{vendor.openBills}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Total Spent</span>
                  <span className="font-semibold text-slate-900">${vendor.totalSpent.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  New Bill
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Details
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <BulkUploadDialog
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        onComplete={() => {
          // Reload vendors after successful upload
          window.location.reload()
        }}
      />
    </div>
  )
}
