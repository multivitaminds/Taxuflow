"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Clock,
  BellRing,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Subscription {
  id: string
  name: string
  category: string
  amount: number
  billingCycle: "monthly" | "yearly" | "weekly"
  nextBilling: string
  status: "active" | "cancelled" | "paused" | "trial"
  autoRenew: boolean
  cardLast4: string
  daysUntilRenewal: number
  yearlyTotal: number
  icon: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix Premium",
    category: "Entertainment",
    amount: 19.99,
    billingCycle: "monthly",
    nextBilling: "2025-01-15",
    status: "active",
    autoRenew: true,
    cardLast4: "4242",
    daysUntilRenewal: 10,
    yearlyTotal: 239.88,
    icon: "/images/netflix-logo-on-transparent-background-png.png",
  },
  {
    id: "2",
    name: "Spotify",
    category: "Entertainment",
    amount: 9.99,
    billingCycle: "monthly",
    nextBilling: "2025-01-08",
    status: "active",
    autoRenew: true,
    cardLast4: "4242",
    daysUntilRenewal: 3,
    yearlyTotal: 119.88,
    icon: "/images/spotify-logo-without-text.png",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    category: "Software",
    amount: 54.99,
    billingCycle: "monthly",
    nextBilling: "2025-01-20",
    status: "active",
    autoRenew: true,
    cardLast4: "4242",
    daysUntilRenewal: 15,
    yearlyTotal: 659.88,
    icon: "/images/creative-cloud-cc-logo-png-seeklogo-284477.png",
  },
  {
    id: "4",
    name: "Amazon Prime",
    category: "Shopping",
    amount: 139.0,
    billingCycle: "yearly",
    nextBilling: "2025-03-15",
    status: "active",
    autoRenew: true,
    cardLast4: "4242",
    daysUntilRenewal: 69,
    yearlyTotal: 139.0,
    icon: "/images/prime-amazon-logo-icon-701751694791861yc1d3bmoov.png",
  },
  {
    id: "5",
    name: "LinkedIn Premium",
    category: "Professional",
    amount: 29.99,
    billingCycle: "monthly",
    nextBilling: "2025-01-12",
    status: "trial",
    autoRenew: false,
    cardLast4: "4242",
    daysUntilRenewal: 7,
    yearlyTotal: 0,
    icon: "/images/5-53359-linkedin-logo-png-transparent-png.png",
  },
  {
    id: "6",
    name: "Dropbox Plus",
    category: "Cloud Storage",
    amount: 11.99,
    billingCycle: "monthly",
    nextBilling: "2025-01-18",
    status: "active",
    autoRenew: true,
    cardLast4: "4242",
    daysUntilRenewal: 13,
    yearlyTotal: 143.88,
    icon: "/images/dropbox-2-logo-png-transparent.png",
  },
]

export function SubscriptionManagementClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const totalMonthly = mockSubscriptions
    .filter((s) => s.status === "active" && s.billingCycle === "monthly")
    .reduce((sum, s) => sum + s.amount, 0)

  const totalYearly = mockSubscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.yearlyTotal, 0)

  const activeCount = mockSubscriptions.filter((s) => s.status === "active").length
  const upcomingRenewals = mockSubscriptions.filter((s) => s.daysUntilRenewal <= 7).length

  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "active" && sub.status === "active") ||
      (selectedTab === "trial" && sub.status === "trial") ||
      (selectedTab === "upcoming" && sub.daysUntilRenewal <= 7)
    return matchesSearch && matchesTab
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Subscription Management</h1>
        <p className="text-slate-600 mt-1">Track and manage all your subscriptions in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">{activeCount}</div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2">Total active services</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">${totalMonthly.toFixed(2)}</div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              $12.50 vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Yearly Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">${totalYearly.toFixed(0)}</div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2">Annual spending estimate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-slate-900">{upcomingRenewals}</div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <BellRing className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="all">All ({mockSubscriptions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="trial">
            Trial ({mockSubscriptions.filter((s) => s.status === "trial").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingRenewals})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {/* Subscriptions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSubscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                className="hover:shadow-lg transition-all cursor-pointer group border-l-4"
                style={{
                  borderLeftColor:
                    subscription.status === "active"
                      ? "#10b981"
                      : subscription.status === "trial"
                        ? "#f59e0b"
                        : "#94a3b8",
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative flex-shrink-0 flex items-center justify-center bg-white rounded-lg p-1">
                        <Image
                          src={subscription.icon || "/placeholder.svg"}
                          alt={`${subscription.name} logo`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {subscription.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {subscription.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              subscription.status === "active" && "bg-green-50 text-green-700 border-green-200",
                              subscription.status === "trial" && "bg-orange-50 text-orange-700 border-orange-200",
                            )}
                          >
                            {subscription.status}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">${subscription.amount}</div>
                      <div className="text-xs text-slate-500">/{subscription.billingCycle}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Next Billing */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      Next billing
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {subscription.nextBilling}
                      <span
                        className={cn(
                          "ml-2 text-xs",
                          subscription.daysUntilRenewal <= 7 ? "text-orange-600" : "text-slate-500",
                        )}
                      >
                        ({subscription.daysUntilRenewal} days)
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CreditCard className="h-4 w-4" />
                      Payment method
                    </div>
                    <div className="text-sm font-medium text-slate-900">•••• {subscription.cardLast4}</div>
                  </div>

                  {/* Yearly Total */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <DollarSign className="h-4 w-4" />
                      Yearly total
                    </div>
                    <div className="text-sm font-bold text-slate-900">${subscription.yearlyTotal.toFixed(2)}</div>
                  </div>

                  {/* Auto-Renew Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {subscription.autoRenew ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                      Auto-renew {subscription.autoRenew ? "enabled" : "disabled"}
                    </div>
                    {subscription.daysUntilRenewal <= 7 && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        <Bell className="h-3 w-3 mr-1" />
                        Renews soon
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600 bg-transparent"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-red-50 hover:text-red-600 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSubscriptions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-slate-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No subscriptions found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">Save $149.88/year</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Switch to yearly billing on Netflix and Spotify to save 16% annually
                </p>
                <Badge variant="outline" className="mt-2 text-xs bg-green-50 text-green-700 border-green-200">
                  High Impact
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-orange-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">Trial ending soon</h4>
                <p className="text-sm text-slate-600 mt-1">
                  LinkedIn Premium trial ends in 7 days. Cancel before renewal to avoid charges
                </p>
                <Badge variant="outline" className="mt-2 text-xs bg-orange-50 text-orange-700 border-orange-200">
                  Action Required
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">Similar services detected</h4>
                <p className="text-sm text-slate-600 mt-1">
                  You have 3 cloud storage subscriptions. Consider consolidating to save money
                </p>
                <Badge variant="outline" className="mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Optimization
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
