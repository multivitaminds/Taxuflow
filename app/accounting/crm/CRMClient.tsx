"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, DollarSign, Mail, Phone, Calendar, ArrowRight, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function CRMClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { label: "Total Customers", value: "1,247", change: "+12%", icon: Users, color: "blue" },
    { label: "Active Deals", value: "89", change: "+8%", icon: TrendingUp, color: "green" },
    { label: "Pipeline Value", value: "$2.4M", change: "+23%", icon: DollarSign, color: "purple" },
    { label: "Conv. Rate", value: "34%", change: "+5%", icon: ArrowRight, color: "orange" },
  ]

  const customers = [
    {
      id: 1,
      name: "Acme Corporation",
      contact: "John Smith",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      value: "$125,000",
      status: "Active",
      lastContact: "2 days ago",
    },
    {
      id: 2,
      name: "TechStart Inc",
      contact: "Sarah Johnson",
      email: "sarah@techstart.com",
      phone: "+1 (555) 234-5678",
      value: "$89,500",
      status: "Prospect",
      lastContact: "1 week ago",
    },
    {
      id: 3,
      name: "Global Ventures",
      contact: "Michael Chen",
      email: "michael@global.com",
      phone: "+1 (555) 345-6789",
      value: "$210,000",
      status: "Active",
      lastContact: "Yesterday",
    },
  ]

  const deals = [
    {
      id: 1,
      title: "Enterprise Software License",
      company: "Acme Corporation",
      value: "$125,000",
      stage: "Negotiation",
      probability: 75,
      closeDate: "2024-07-15",
    },
    {
      id: 2,
      title: "Consulting Services Package",
      company: "TechStart Inc",
      value: "$89,500",
      stage: "Proposal",
      probability: 50,
      closeDate: "2024-07-30",
    },
    {
      id: 3,
      title: "Annual Support Contract",
      company: "Global Ventures",
      value: "$45,000",
      stage: "Closed Won",
      probability: 100,
      closeDate: "2024-06-20",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">CRM - Customer Management</h1>
              <p className="text-muted-foreground">Manage relationships and track sales pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="p-6 border-border hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <Badge className={`bg-green-500/10 text-green-500 border-green-500/20`}>{stat.change}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Customers */}
              <Card className="border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Customers</h2>
                  <Link href="/accounting/crm?tab=customers">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {customers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.contact}</p>
                        </div>
                        <Badge
                          className={
                            customer.status === "Active"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{customer.value}</span>
                        <span>•</span>
                        <span>{customer.lastContact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Active Deals */}
              <Card className="border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Active Deals</h2>
                  <Link href="/accounting/crm?tab=deals">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {deals.slice(0, 3).map((deal) => (
                    <div key={deal.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{deal.title}</h3>
                          <p className="text-sm text-muted-foreground">{deal.company}</p>
                        </div>
                        <span className="font-semibold text-foreground">{deal.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{deal.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-10" />
              </div>
            </div>

            <Card className="border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Customer</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Contact</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Value</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Last Contact</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-foreground">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.contact}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-foreground">{customer.value}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              customer.status === "Active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }
                          >
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{customer.lastContact}</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
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

          <TabsContent value="deals" className="space-y-6">
            <Card className="border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Sales Pipeline</h2>
              </div>
              <div className="divide-y divide-border">
                {deals.map((deal) => (
                  <div key={deal.id} className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{deal.title}</h3>
                        <p className="text-muted-foreground">{deal.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">{deal.value}</p>
                        <Badge className="mt-1 bg-purple-500/10 text-purple-500 border-purple-500/20">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Probability</span>
                        <span className="font-semibold text-foreground">{deal.probability}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                        <Calendar className="h-4 w-4" />
                        Expected close: {deal.closeDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="p-6 border-border text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Activity Timeline</h3>
              <p className="text-muted-foreground">Track all customer interactions and touchpoints</p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Log Activity
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
