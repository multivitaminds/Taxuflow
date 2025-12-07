"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Mail, Settings, Play, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function CustomReportBuilder() {
  const router = useRouter()
  const [reportName, setReportName] = useState("")
  const [dateRange, setDateRange] = useState("last30")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [schedule, setSchedule] = useState("manual")

  const metricCategories = [
    {
      name: "Revenue Metrics",
      metrics: [
        { id: "total_revenue", label: "Total Revenue", recommended: true },
        { id: "recurring_revenue", label: "Recurring Revenue", recommended: true },
        { id: "revenue_growth", label: "Revenue Growth Rate", recommended: false },
        { id: "avg_transaction", label: "Average Transaction Value", recommended: false },
      ],
    },
    {
      name: "Expense Metrics",
      metrics: [
        { id: "total_expenses", label: "Total Expenses", recommended: true },
        { id: "operating_expenses", label: "Operating Expenses", recommended: true },
        { id: "expense_ratio", label: "Expense to Revenue Ratio", recommended: false },
        { id: "cost_per_customer", label: "Cost Per Customer", recommended: false },
      ],
    },
    {
      name: "Cash Flow Metrics",
      metrics: [
        { id: "cash_balance", label: "Cash Balance", recommended: true },
        { id: "net_cash_flow", label: "Net Cash Flow", recommended: true },
        { id: "burn_rate", label: "Burn Rate", recommended: false },
        { id: "runway", label: "Cash Runway", recommended: false },
      ],
    },
    {
      name: "Performance Metrics",
      metrics: [
        { id: "profit_margin", label: "Profit Margin", recommended: true },
        { id: "transaction_volume", label: "Transaction Volume", recommended: false },
        { id: "customer_count", label: "Active Customers", recommended: false },
        { id: "payment_success", label: "Payment Success Rate", recommended: false },
      ],
    },
  ]

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  const selectRecommended = () => {
    const recommended = metricCategories.flatMap((cat) => cat.metrics.filter((m) => m.recommended).map((m) => m.id))
    setSelectedMetrics(recommended)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Custom Report Builder</h1>
            <p className="text-lg text-slate-600">Design reports tailored to your business needs</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Play className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Settings */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    placeholder="e.g., Monthly Financial Summary"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="dateRange" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last7">Last 7 Days</SelectItem>
                        <SelectItem value="last30">Last 30 Days</SelectItem>
                        <SelectItem value="last90">Last 90 Days</SelectItem>
                        <SelectItem value="ytd">Year to Date</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Select value={schedule} onValueChange={setSchedule}>
                      <SelectTrigger id="schedule" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {schedule !== "manual" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Automated Delivery</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Reports will be emailed to your registered address on a {schedule} basis
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metrics Selection */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Select Metrics
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectRecommended}
                    className="text-indigo-600 bg-transparent"
                  >
                    Select Recommended
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {metricCategories.map((category) => (
                  <div key={category.name} className="space-y-3">
                    <h3 className="font-semibold text-slate-900 text-sm">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.metrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
                          onClick={() => toggleMetric(metric.id)}
                        >
                          <Checkbox
                            checked={selectedMetrics.includes(metric.id)}
                            onCheckedChange={() => toggleMetric(metric.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                              {metric.recommended && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 h-4 bg-indigo-100 text-indigo-700"
                                >
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Report Summary */}
            <Card className="border-slate-200 bg-white shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Report Name</span>
                    <span className="font-medium text-slate-900">{reportName || "Untitled Report"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Date Range</span>
                    <span className="font-medium text-slate-900 capitalize">{dateRange.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Metrics Selected</span>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      {selectedMetrics.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Schedule</span>
                    <span className="font-medium text-slate-900 capitalize">{schedule}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <p className="text-xs font-semibold text-slate-700 uppercase">Export Options</p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-3 w-3" />
                      Export as PDF
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-3 w-3" />
                      Export as Excel
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <Download className="mr-2 h-3 w-3" />
                      Export as CSV
                    </Button>
                  </div>
                </div>

                {selectedMetrics.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Play className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Templates */}
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">Saved Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "Monthly Summary", metrics: 8, schedule: "monthly" },
                  { name: "Weekly Performance", metrics: 6, schedule: "weekly" },
                  { name: "Cash Flow Analysis", metrics: 5, schedule: "manual" },
                ].map((template, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {template.metrics} metrics · {template.schedule}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
