"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Building2, Phone, Mail, DollarSign, FileText, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function VendorsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewVendorDialog, setShowNewVendorDialog] = useState(false)

  // Mock data
  const vendors = [
    {
      id: "1",
      name: "Office Supplies Co.",
      email: "billing@officesupplies.com",
      phone: "(555) 123-4567",
      balance: 2450.0,
      openBills: 3,
      status: "active",
    },
    {
      id: "2",
      name: "Tech Solutions Inc.",
      email: "accounts@techsolutions.com",
      phone: "(555) 234-5678",
      balance: 5200.0,
      openBills: 2,
      status: "active",
    },
    {
      id: "3",
      name: "Marketing Agency LLC",
      email: "billing@marketingagency.com",
      phone: "(555) 345-6789",
      balance: 0,
      openBills: 0,
      status: "active",
    },
  ]

  const stats = [
    { label: "Total Vendors", value: "24", icon: Building2 },
    { label: "Active Vendors", value: "18", icon: Building2 },
    { label: "Total Payable", value: "$12,450", icon: DollarSign },
    { label: "Open Bills", value: "8", icon: FileText },
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage your vendors and bills</p>
        </div>
        <Button onClick={() => setShowNewVendorDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Vendor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <Badge variant={vendor.status === "active" ? "default" : "secondary"}>{vendor.status}</Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Vendor</DropdownMenuItem>
                  <DropdownMenuItem>Create Bill</DropdownMenuItem>
                  <DropdownMenuItem>View Transactions</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{vendor.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Balance Due</p>
                <p className="text-lg font-bold">${vendor.balance.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Open Bills</p>
                <p className="text-lg font-bold">{vendor.openBills}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
