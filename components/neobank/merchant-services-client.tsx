"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  ShoppingCart,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  Smartphone,
  Laptop,
  Store,
  Zap,
  Shield,
  BarChart3,
  LinkIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MerchantServicesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  const stats = [
    {
      label: "Today's Sales",
      value: "$12,458",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Transactions",
      value: "248",
      change: "+22.1%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Customers",
      value: "1,847",
      change: "+8.4%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Avg. Transaction",
      value: "$52.30",
      change: "-3.2%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const recentTransactions = [
    {
      id: "TXN-001",
      customer: "Sarah Johnson",
      amount: 145.99,
      method: "Credit Card",
      channel: "POS",
      status: "completed",
      time: "2 min ago",
    },
    {
      id: "TXN-002",
      customer: "Michael Chen",
      amount: 89.5,
      method: "Debit Card",
      channel: "Online",
      status: "completed",
      time: "12 min ago",
    },
    {
      id: "TXN-003",
      customer: "Emma Wilson",
      amount: 234.0,
      method: "Digital Wallet",
      channel: "Mobile App",
      status: "pending",
      time: "18 min ago",
    },
    {
      id: "TXN-004",
      customer: "David Brown",
      amount: 67.25,
      method: "Credit Card",
      channel: "POS",
      status: "completed",
      time: "34 min ago",
    },
    {
      id: "TXN-005",
      customer: "Lisa Anderson",
      amount: 412.8,
      method: "Bank Transfer",
      channel: "Invoice",
      status: "failed",
      time: "1 hour ago",
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      customer: "Acme Corporation",
      amount: 2500.0,
      dueDate: "2024-02-15",
      status: "paid",
      issueDate: "2024-01-15",
    },
    {
      id: "INV-2024-002",
      customer: "TechStart Inc.",
      amount: 1850.0,
      dueDate: "2024-02-20",
      status: "pending",
      issueDate: "2024-01-20",
    },
    {
      id: "INV-2024-003",
      customer: "Global Solutions",
      amount: 3200.0,
      dueDate: "2024-02-10",
      status: "overdue",
      issueDate: "2024-01-10",
    },
    {
      id: "INV-2024-004",
      customer: "Innovation Labs",
      amount: 1200.0,
      dueDate: "2024-02-25",
      status: "draft",
      issueDate: "2024-01-25",
    },
  ]

  const posDevices = [
    {
      id: "POS-001",
      name: "Front Counter Terminal",
      status: "online",
      location: "Main Store",
      transactions: 89,
      lastActive: "2 min ago",
    },
    {
      id: "POS-002",
      name: "Mobile Terminal 1",
      status: "online",
      location: "Main Store",
      transactions: 56,
      lastActive: "8 min ago",
    },
    {
      id: "POS-003",
      name: "Outdoor Kiosk",
      status: "offline",
      location: "Outdoor Area",
      transactions: 23,
      lastActive: "3 hours ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
      case "online":
        return "text-emerald-600 bg-emerald-50"
      case "pending":
      case "draft":
        return "text-amber-600 bg-amber-50"
      case "failed":
      case "overdue":
      case "offline":
        return "text-red-600 bg-red-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
      case "draft":
        return <Clock className="h-4 w-4" />
      case "failed":
      case "overdue":
      case "offline":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "POS":
        return <Store className="h-4 w-4" />
      case "Online":
        return <Laptop className="h-4 w-4" />
      case "Mobile App":
        return <Smartphone className="h-4 w-4" />
      case "Invoice":
        return <FileText className="h-4 w-4" />
      default:
        return <ShoppingCart className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Merchant Services</h1>
          <p className="text-slate-600 mt-1">Manage payments, POS systems, and invoicing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="gap-2 bg-[#635bff] hover:bg-[#5047e5]">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-3xl font-bold text-[#0a2540] mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      stat.trend === "up" ? "text-emerald-600 rotate-0" : "text-red-600 rotate-180"
                    }`}
                  />
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="pos">POS Devices</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Payment Methods */}
          <Card className="p-6 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0a2540]">Payment Methods</h2>
                <p className="text-sm text-slate-600 mt-1">Configure accepted payment options</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add Method
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 hover:border-[#635bff] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a2540]">Credit Cards</p>
                    <p className="text-xs text-slate-600">Visa, Mastercard, Amex</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600">Active</Badge>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 hover:border-[#635bff] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a2540]">Digital Wallets</p>
                    <p className="text-xs text-slate-600">Apple Pay, Google Pay</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600">Active</Badge>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 hover:border-[#635bff] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <DollarSign className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a2540]">Bank Transfer</p>
                    <p className="text-xs text-slate-600">ACH, Wire</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600">Active</Badge>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0a2540]">Recent Transactions</h2>
                <p className="text-sm text-slate-600 mt-1">Latest payment activity</p>
              </div>
              <Button variant="link" className="text-[#635bff]">
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#635bff] transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-50">{getChannelIcon(transaction.channel)}</div>
                    <div>
                      <p className="font-semibold text-[#0a2540]">{transaction.customer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{transaction.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-600">{transaction.method}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-500">{transaction.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-[#0a2540]">${transaction.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(transaction.status)} variant="secondary">
                        <span className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                        <DropdownMenuItem>Refund</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-80"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Button className="gap-2 bg-[#635bff] hover:bg-[#5047e5]">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#635bff] transition-all cursor-pointer hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                      <FileText className="h-5 w-5 text-[#635bff]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a2540]">{invoice.customer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{invoice.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-500">Issued {invoice.issueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Due Date</p>
                      <p className="font-medium text-[#0a2540]">{invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Amount</p>
                      <p className="font-semibold text-[#0a2540]">${invoice.amount.toFixed(2)}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)} variant="secondary">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Invoice</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* POS Devices Tab */}
        <TabsContent value="pos" className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0a2540]">POS Devices</h2>
                <p className="text-sm text-slate-600 mt-1">Manage point-of-sale terminals</p>
              </div>
              <Button className="gap-2 bg-[#635bff] hover:bg-[#5047e5]">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posDevices.map((device) => (
                <Card
                  key={device.id}
                  className="p-6 border-slate-200 hover:border-[#635bff] transition-all cursor-pointer hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                      <Store className="h-6 w-6 text-[#635bff]" />
                    </div>
                    <Badge className={getStatusColor(device.status)} variant="secondary">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(device.status)}
                        {device.status}
                      </span>
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#0a2540] mb-1">{device.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{device.id}</p>
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Location</span>
                      <span className="font-medium text-[#0a2540]">{device.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Transactions</span>
                      <span className="font-medium text-[#0a2540]">{device.transactions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Last Active</span>
                      <span className="font-medium text-slate-500">{device.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Configure
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#0a2540]">Payment Integrations</h2>
                <p className="text-sm text-slate-600 mt-1">Connect third-party payment services</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-slate-200 hover:border-[#635bff] transition-all cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-[#635bff]/10">
                    <CreditCard className="h-6 w-6 text-[#635bff]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0a2540]">Stripe</h3>
                    <p className="text-sm text-slate-600">Payment processing platform</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600">Connected</Badge>
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Transactions Today</span>
                    <span className="font-medium text-[#0a2540]">248</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Volume</span>
                    <span className="font-medium text-[#0a2540]">$12,458</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </Card>

              <Card className="p-6 border-slate-200 border-dashed hover:border-[#635bff] transition-all cursor-pointer">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="p-4 rounded-lg bg-slate-50 mb-4">
                    <LinkIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-[#0a2540] mb-2">Connect More Services</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Integrate with additional payment providers and e-commerce platforms
                  </p>
                  <Button className="gap-2 bg-[#635bff] hover:bg-[#5047e5]">
                    <Plus className="h-4 w-4" />
                    Browse Integrations
                  </Button>
                </div>
              </Card>
            </div>
          </Card>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="p-3 rounded-lg bg-white mb-4 w-fit">
                <Zap className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-[#0a2540] mb-2">Fast Settlements</h3>
              <p className="text-sm text-slate-600">
                Get your funds deposited within 1-2 business days with instant payout options available
              </p>
            </Card>
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="p-3 rounded-lg bg-white mb-4 w-fit">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-[#0a2540] mb-2">Secure & Compliant</h3>
              <p className="text-sm text-slate-600">
                PCI-DSS Level 1 compliant with advanced fraud detection and chargeback protection
              </p>
            </Card>
            <Card className="p-6 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="p-3 rounded-lg bg-white mb-4 w-fit">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[#0a2540] mb-2">Real-Time Analytics</h3>
              <p className="text-sm text-slate-600">
                Track sales, monitor performance, and gain insights with comprehensive reporting tools
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
