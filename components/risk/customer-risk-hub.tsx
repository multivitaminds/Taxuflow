"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Calendar,
  Target,
  Activity,
  XCircle,
  Mail,
} from "lucide-react"
import { CustomerRiskAnalyzer } from "@/lib/ml/customer-risk-analyzer"

export function CustomerRiskHub() {
  const [customers, setCustomers] = useState<any[]>([])
  const [riskProfiles, setRiskProfiles] = useState<Map<string, any>>(new Map())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<"all" | "low" | "medium" | "high" | "critical">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomerRiskData()
  }, [])

  async function loadCustomerRiskData() {
    try {
      const response = await fetch("/api/accounting/customers")
      const data = await response.json()

      if (data.customers) {
        setCustomers(data.customers)

        // Calculate risk profiles for each customer
        const analyzer = new CustomerRiskAnalyzer()
        const profiles = new Map()

        for (const customer of data.customers) {
          const profile = await analyzer.analyzeCustomerRisk(customer)
          profiles.set(customer.id, profile)
        }

        setRiskProfiles(profiles)
      }
    } catch (error) {
      console.error("Error loading customer risk data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10"
    if (score >= 60) return "text-blue-500 bg-blue-500/10"
    if (score >= 40) return "text-amber-500 bg-amber-500/10"
    return "text-red-500 bg-red-500/10"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "low"
    if (score >= 60) return "medium"
    if (score >= 40) return "high"
    return "critical"
  }

  const filteredCustomers = customers.filter((customer) => {
    const profile = riskProfiles.get(customer.id)
    const matchesSearch =
      customer.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterRisk === "all" || (profile && getRiskLevel(profile.creditScore) === filterRisk)

    return matchesSearch && matchesFilter
  })

  const stats = {
    totalCustomers: customers.length,
    lowRisk: Array.from(riskProfiles.values()).filter((p) => p.creditScore >= 80).length,
    mediumRisk: Array.from(riskProfiles.values()).filter((p) => p.creditScore >= 60 && p.creditScore < 80).length,
    highRisk: Array.from(riskProfiles.values()).filter((p) => p.creditScore >= 40 && p.creditScore < 60).length,
    criticalRisk: Array.from(riskProfiles.values()).filter((p) => p.creditScore < 40).length,
    totalAtRisk: Array.from(riskProfiles.values())
      .filter((p) => p.creditScore < 60)
      .reduce((sum, p) => sum + (p.outstandingBalance || 0), 0),
    avgCreditScore:
      Array.from(riskProfiles.values()).reduce((sum, p) => sum + p.creditScore, 0) / riskProfiles.size || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Predictive Customer Risk
              </h1>
              <p className="text-slate-400">AI-powered credit scoring and collection optimization</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Target className="h-4 w-4 mr-2" />
              Run Risk Analysis
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-500" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {stats.lowRisk} Low Risk
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalCustomers}</p>
              <p className="text-sm text-slate-400">Total Customers</p>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{Math.round(stats.avgCreditScore)}</p>
              <p className="text-sm text-slate-400">Avg Credit Score</p>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                  {stats.highRisk + stats.criticalRisk} At Risk
                </Badge>
              </div>
              <p className="text-3xl font-bold text-white mb-1">${stats.totalAtRisk.toLocaleString()}</p>
              <p className="text-sm text-slate-400">At Risk Amount</p>
            </Card>

            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.criticalRisk}</p>
              <p className="text-sm text-slate-400">Critical Risk</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scoring">Credit Scoring</TabsTrigger>
            <TabsTrigger value="predictions">Payment Predictions</TabsTrigger>
            <TabsTrigger value="collections">Collection Priority</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Search and Filters */}
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterRisk === "all" ? "default" : "outline"}
                    onClick={() => setFilterRisk("all")}
                    size="sm"
                    className={filterRisk === "all" ? "bg-blue-600" : "bg-slate-900/50 border-slate-700"}
                  >
                    All ({stats.totalCustomers})
                  </Button>
                  <Button
                    variant={filterRisk === "low" ? "default" : "outline"}
                    onClick={() => setFilterRisk("low")}
                    size="sm"
                    className={filterRisk === "low" ? "bg-emerald-600" : "bg-slate-900/50 border-slate-700"}
                  >
                    Low ({stats.lowRisk})
                  </Button>
                  <Button
                    variant={filterRisk === "medium" ? "default" : "outline"}
                    onClick={() => setFilterRisk("medium")}
                    size="sm"
                    className={filterRisk === "medium" ? "bg-blue-600" : "bg-slate-900/50 border-slate-700"}
                  >
                    Medium ({stats.mediumRisk})
                  </Button>
                  <Button
                    variant={filterRisk === "high" ? "default" : "outline"}
                    onClick={() => setFilterRisk("high")}
                    size="sm"
                    className={filterRisk === "high" ? "bg-amber-600" : "bg-slate-900/50 border-slate-700"}
                  >
                    High ({stats.highRisk})
                  </Button>
                  <Button
                    variant={filterRisk === "critical" ? "default" : "outline"}
                    onClick={() => setFilterRisk("critical")}
                    size="sm"
                    className={filterRisk === "critical" ? "bg-red-600" : "bg-slate-900/50 border-slate-700"}
                  >
                    Critical ({stats.criticalRisk})
                  </Button>
                </div>
              </div>
            </Card>

            {/* Customer Risk Cards */}
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading customer risk profiles...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCustomers.map((customer) => {
                  const profile = riskProfiles.get(customer.id) || {}
                  const riskLevel = getRiskLevel(profile.creditScore || 0)

                  return (
                    <Card
                      key={customer.id}
                      className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl hover:bg-slate-800/70 transition-all"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {(customer.company_name || customer.contact_name || "?")[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">
                                {customer.company_name || customer.contact_name || "Unknown Customer"}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                {customer.email && (
                                  <>
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{customer.email}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`${getRiskColor(profile.creditScore || 0)} border-0 font-semibold uppercase text-xs`}
                          >
                            {riskLevel}
                          </Badge>
                        </div>

                        {/* Credit Score Gauge */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Credit Score</span>
                            <span className="text-2xl font-bold text-white">{profile.creditScore || 0}</span>
                          </div>
                          <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                profile.creditScore >= 80
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                  : profile.creditScore >= 60
                                    ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                    : profile.creditScore >= 40
                                      ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                      : "bg-gradient-to-r from-red-500 to-red-400"
                              }`}
                              style={{ width: `${profile.creditScore || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Risk Metrics */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Default Risk</p>
                            <p className="text-lg font-semibold text-white">
                              {profile.defaultProbability ? `${Math.round(profile.defaultProbability)}%` : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Collection Priority</p>
                            <p className="text-lg font-semibold text-white">{profile.collectionPriority || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Outstanding</p>
                            <p className="text-lg font-semibold text-white">
                              ${(profile.outstandingBalance || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Avg Days Late</p>
                            <p className="text-lg font-semibold text-white">{profile.avgDaysLate || 0}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-slate-700">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-slate-900/50 border-slate-700 text-white hover:bg-slate-900"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-slate-900/50 border-slate-700 text-white hover:bg-slate-900"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Call
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scoring">
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <p className="text-slate-400">Credit scoring analytics coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <p className="text-slate-400">Payment prediction models coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="collections">
            <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <p className="text-slate-400">Collection priority optimization coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
