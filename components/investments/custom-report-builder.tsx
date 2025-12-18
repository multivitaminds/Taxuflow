"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DownloadIcon, CalendarIcon, FileTextIcon, BarChart3Icon } from "lucide-react"

export function CustomReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["total_value", "returns", "allocation"])
  const [reportTab, setReportTab] = useState("summary")

  const metrics = [
    { id: "total_value", label: "Total Portfolio Value" },
    { id: "returns", label: "Returns (Daily/Monthly/YTD)" },
    { id: "allocation", label: "Asset Allocation" },
    { id: "holdings", label: "Individual Holdings" },
    { id: "dividends", label: "Dividend Income" },
    { id: "transactions", label: "Transaction History" },
    { id: "tax", label: "Tax Impact Analysis" },
    { id: "risk", label: "Risk Metrics" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Build, schedule, and export custom investment reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Report Name</Label>
                <Input placeholder="Q4 2024 Portfolio Review" />
              </div>

              <div>
                <Label>Date Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="1m">Last Month</SelectItem>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="6m">Last 6 Months</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Export Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Select Metrics to Include</Label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {metrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMetrics([...selectedMetrics, metric.id])
                        } else {
                          setSelectedMetrics(selectedMetrics.filter((m) => m !== metric.id))
                        }
                      }}
                    />
                    <Label htmlFor={metric.id} className="font-normal cursor-pointer">
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Scheduling */}
          <div className="p-4 bg-accent/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <Label>Schedule Report Generation</Label>
              </div>
              <Checkbox />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <FileTextIcon className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview with Tabs */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Interactive report view with multiple perspectives</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={reportTab} onValueChange={setReportTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="chart">Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <ReportSummaryView />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4">
              <ReportDetailedView />
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <ReportCompareView />
            </TabsContent>

            <TabsContent value="chart" className="space-y-4">
              <ReportChartView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportSummaryView() {
  return (
    <div className="space-y-4 p-6 bg-accent/10 rounded-lg">
      <h3 className="text-lg font-semibold">Executive Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
          <p className="text-2xl font-bold">$1,247,582</p>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <p className="text-sm text-muted-foreground">YTD Return</p>
          <p className="text-2xl font-bold text-emerald-600">+12.94%</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Your portfolio has shown strong performance this quarter, outpacing the market by 4.2%. Key drivers include
        technology sector gains and successful rebalancing strategy.
      </p>
    </div>
  )
}

function ReportDetailedView() {
  return (
    <div className="space-y-4">
      <div className="p-6 bg-accent/10 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Holdings Breakdown</h3>
        <div className="space-y-3">
          {[
            { symbol: "AAPL", name: "Apple Inc.", value: "$125,430", allocation: "10.05%", return: "+24.5%" },
            { symbol: "MSFT", name: "Microsoft Corp.", value: "$98,762", allocation: "7.92%", return: "+18.3%" },
            { symbol: "GOOGL", name: "Alphabet Inc.", value: "$87,215", allocation: "6.99%", return: "+12.1%" },
          ].map((holding) => (
            <div key={holding.symbol} className="flex items-center justify-between p-3 bg-card rounded border">
              <div>
                <p className="font-semibold">{holding.symbol}</p>
                <p className="text-sm text-muted-foreground">{holding.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{holding.value}</p>
                <p className="text-sm text-emerald-600">{holding.return}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReportCompareView() {
  return (
    <div className="p-6 bg-accent/10 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
      <div className="space-y-3">
        {[
          { label: "Your Portfolio", value: "+12.94%", color: "text-primary" },
          { label: "S&P 500", value: "+8.75%", color: "text-muted-foreground" },
          { label: "NASDAQ", value: "+10.20%", color: "text-muted-foreground" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <span className={`font-semibold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportChartView() {
  return (
    <div className="p-6 bg-accent/10 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Visual Analytics</h3>
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
        <div className="text-center">
          <BarChart3Icon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Chart visualization will appear here</p>
        </div>
      </div>
    </div>
  )
}
