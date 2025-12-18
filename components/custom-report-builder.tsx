"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Download, Calendar } from "lucide-react"

export default function CustomReportBuilder() {
  const [reportName, setReportName] = useState("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  const availableMetrics = [
    { id: "revenue", name: "Total Revenue", category: "Income" },
    { id: "expenses", name: "Total Expenses", category: "Expenses" },
    { id: "profit", name: "Net Profit", category: "Profitability" },
    { id: "margin", name: "Profit Margin", category: "Profitability" },
    { id: "ar", name: "Accounts Receivable", category: "Assets" },
    { id: "ap", name: "Accounts Payable", category: "Liabilities" },
    { id: "customers", name: "Active Customers", category: "Operations" },
    { id: "invoices", name: "Invoice Count", category: "Operations" },
  ]

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Custom Report Builder</h1>
        <p className="text-muted-foreground mt-1">Create personalized reports with your chosen metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Report Configuration</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="e.g., Monthly Performance Report"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="date" className="flex-1" />
                  <span className="flex items-center px-2">to</span>
                  <Input type="date" className="flex-1" />
                </div>
              </div>

              <div>
                <Label>Group By</Label>
                <select className="w-full mt-1 p-2 border rounded-md">
                  <option>Day</option>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Quarter</option>
                  <option>Year</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMetrics.includes(metric.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{metric.name}</div>
                      <div className="text-sm text-muted-foreground">{metric.category}</div>
                    </div>
                    {selectedMetrics.includes(metric.id) && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Report Preview</h2>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="text-muted-foreground">Report Name:</span>
                <div className="font-medium mt-1">{reportName || "Untitled Report"}</div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Selected Metrics:</span>
                <div className="mt-2 space-y-1">
                  {selectedMetrics.length === 0 ? (
                    <div className="text-muted-foreground italic">No metrics selected</div>
                  ) : (
                    selectedMetrics.map((id) => {
                      const metric = availableMetrics.find((m) => m.id === id)
                      return (
                        <div key={id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{metric?.name}</span>
                          <button
                            onClick={() => toggleMetric(id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <Button className="w-full" disabled={selectedMetrics.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-blue-500/5 border-blue-500/20">
            <h3 className="font-semibold mb-2 text-blue-600">Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Save your custom reports as templates for quick access. Scheduled reports will be automatically generated
              and emailed to you.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
