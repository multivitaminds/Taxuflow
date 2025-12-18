"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Shield,
  Search,
  Filter,
  ChevronRight,
  DollarSign,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Activity,
} from "lucide-react"

export function FraudDetectionHub() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - would come from your fraud detection system
  const alerts = [
    {
      id: "1",
      type: "vendor",
      severity: "critical",
      title: "Duplicate Payment Detected",
      description: "Payment of $5,000 to same vendor twice in 24 hours",
      vendor: "Office Supplies Co.",
      amount: 5000,
      timestamp: "2024-01-15T14:30:00Z",
      status: "pending",
      riskScore: 95,
    },
    {
      id: "2",
      type: "payroll",
      severity: "high",
      title: "Ghost Employee Suspected",
      description: "Employee with no timesheet entries received full salary",
      employee: "John Smith",
      amount: 4500,
      timestamp: "2024-01-15T10:15:00Z",
      status: "investigating",
      riskScore: 88,
    },
    {
      id: "3",
      type: "vendor",
      severity: "medium",
      title: "Unusual Vendor Activity",
      description: "New vendor with immediate high-value payment",
      vendor: "Tech Solutions LLC",
      amount: 15000,
      timestamp: "2024-01-15T09:00:00Z",
      status: "reviewed",
      riskScore: 72,
    },
    {
      id: "4",
      type: "payroll",
      severity: "high",
      title: "Time Theft Pattern",
      description: "Multiple employees clocking in/out simultaneously",
      employee: "Multiple (5 employees)",
      amount: 2200,
      timestamp: "2024-01-14T16:45:00Z",
      status: "investigating",
      riskScore: 84,
    },
  ]

  const stats = {
    totalAlerts: 24,
    criticalAlerts: 3,
    potentialLoss: 127500,
    casesResolved: 18,
    avgResponseTime: "2.5h",
    detectionRate: 98.5,
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500/10 text-red-500 border-red-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-orange-500/10 text-orange-500",
      investigating: "bg-blue-500/10 text-blue-500",
      reviewed: "bg-green-500/10 text-green-500",
      resolved: "bg-emerald-500/10 text-emerald-500",
      dismissed: "bg-slate-500/10 text-slate-500",
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Fraud Detection Center
              </h1>
              <p className="text-white/60 mt-2">Real-time monitoring and risk analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0">
                <Eye className="h-4 w-4 mr-2" />
                Live Monitor
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Total Alerts</p>
                  <p className="text-2xl font-bold">{stats.totalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 bg-red-500/10 border-red-500/20 backdrop-blur-sm hover:bg-red-500/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Critical</p>
                  <p className="text-2xl font-bold text-red-500">{stats.criticalAlerts}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Potential Loss</p>
                  <p className="text-2xl font-bold">${(stats.potentialLoss / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 bg-green-500/10 border-green-500/20 backdrop-blur-sm hover:bg-green-500/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Resolved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.casesResolved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Avg Response</p>
                  <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 font-medium mb-1">Detection Rate</p>
                  <p className="text-2xl font-bold">{stats.detectionRate}%</p>
                </div>
                <Shield className="h-8 w-8 text-emerald-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="vendor" className="data-[state=active]:bg-white/10">
              <Building2 className="h-4 w-4 mr-2" />
              Vendor Fraud
            </TabsTrigger>
            <TabsTrigger value="payroll" className="data-[state=active]:bg-white/10">
              <Users className="h-4 w-4 mr-2" />
              Payroll Fraud
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Search */}
            <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search alerts by vendor, employee, amount, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="p-6 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getSeverityColor(alert.severity)} border font-semibold`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                        {alert.type === "vendor" ? (
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            <Building2 className="h-3 w-3 mr-1" />
                            Vendor
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                            <Users className="h-3 w-3 mr-1" />
                            Payroll
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {alert.title}
                      </h3>
                      <p className="text-white/60 text-sm mb-3">{alert.description}</p>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          {alert.type === "vendor" ? (
                            <Building2 className="h-4 w-4 text-white/40" />
                          ) : (
                            <Users className="h-4 w-4 text-white/40" />
                          )}
                          <span className="text-white/80">
                            {alert.type === "vendor" ? alert.vendor : alert.employee}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-white/40" />
                          <span className="text-white/80">${alert.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-white/40" />
                          <span className="text-white/80">{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-xs text-white/40 mb-1">Risk Score</p>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                alert.riskScore >= 85
                                  ? "bg-red-500"
                                  : alert.riskScore >= 70
                                    ? "bg-orange-500"
                                    : "bg-yellow-500"
                              }`}
                              style={{ width: `${alert.riskScore}%` }}
                            />
                          </div>
                          <span
                            className={`text-xl font-bold ${
                              alert.riskScore >= 85
                                ? "text-red-500"
                                : alert.riskScore >= 70
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }`}
                          >
                            {alert.riskScore}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Investigate
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Vendor Fraud Tab */}
          <TabsContent value="vendor" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Vendor Fraud Detection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-400">Duplicate Payments</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">
                    Detects identical or near-identical payments to the same vendor
                  </p>
                  <div className="text-2xl font-bold text-blue-400">3 detected</div>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <h4 className="font-semibold text-orange-400">Fake Vendors</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Identifies suspicious vendor profiles and patterns</p>
                  <div className="text-2xl font-bold text-orange-400">1 suspected</div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-purple-400" />
                    <h4 className="font-semibold text-purple-400">Unusual Amounts</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Flags payments outside normal vendor patterns</p>
                  <div className="text-2xl font-bold text-purple-400">2 flagged</div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-red-400">Account Changes</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Monitors suspicious vendor payment detail changes</p>
                  <div className="text-2xl font-bold text-red-400">0 detected</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Payroll Fraud Tab */}
          <TabsContent value="payroll" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Payroll Fraud Detection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <h4 className="font-semibold text-red-400">Ghost Employees</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Detects employees receiving pay without activity records</p>
                  <div className="text-2xl font-bold text-red-400">1 suspected</div>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-400" />
                    <h4 className="font-semibold text-orange-400">Time Theft</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Identifies suspicious clock-in/out patterns</p>
                  <div className="text-2xl font-bold text-orange-400">1 pattern</div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <h4 className="font-semibold text-yellow-400">Duplicate Payments</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Multiple payments to same employee in short period</p>
                  <div className="text-2xl font-bold text-yellow-400">0 detected</div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-400">Salary Anomalies</h4>
                  </div>
                  <p className="text-sm text-white/60 mb-3">Sudden or unusual salary changes</p>
                  <div className="text-2xl font-bold text-blue-400">0 flagged</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Detection Trends</h3>
                <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-white/5">
                  <p className="text-white/40">Chart: Fraud alerts over time</p>
                </div>
              </Card>
              <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
                <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-white/5">
                  <p className="text-white/40">Chart: Risk levels by category</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
