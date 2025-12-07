"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react"
import { useState } from "react"

export default function ComparativeReportsClient() {
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [comparisonType, setComparisonType] = useState("yoy")

  // Sample data for Year-over-Year comparison
  const yoyData = [
    { period: "Q1 2024", current: 524892, previous: 478320, change: 9.7 },
    { period: "Q2 2024", current: 567234, previous: 498765, change: 13.7 },
    { period: "Q3 2024", current: 612890, previous: 534212, change: 14.7 },
    { period: "Q4 2024", current: 658432, previous: 587654, change: 12.0 },
  ]

  // Sample data for Quarter-over-Quarter comparison
  const qoqData = [
    { period: "Q1 2024", current: 524892, previous: 498320, change: 5.3 },
    { period: "Q2 2024", current: 567234, previous: 524892, change: 8.1 },
    { period: "Q3 2024", current: 612890, previous: 567234, change: 8.0 },
    { period: "Q4 2024", current: 658432, previous: 612890, change: 7.4 },
  ]

  const metrics = {
    revenue: { label: "Revenue", color: "blue", data: yoyData },
    expenses: { label: "Expenses", color: "red", data: yoyData },
    profit: { label: "Net Profit", color: "green", data: yoyData },
    margin: { label: "Profit Margin", color: "purple", data: yoyData },
  }

  const currentData = comparisonType === "yoy" ? yoyData : qoqData

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparative Reports</h1>
          <p className="text-muted-foreground mt-1">Year-over-Year and Quarter-over-Quarter analysis</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Revenue Growth</span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">+12.5%</p>
          <p className="text-xs text-muted-foreground mt-1">YoY Average</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Profit Growth</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">+15.3%</p>
          <p className="text-xs text-muted-foreground mt-1">YoY Average</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Expense Growth</span>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold">+8.7%</p>
          <p className="text-xs text-muted-foreground mt-1">YoY Average</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Margin Change</span>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">+2.1%</p>
          <p className="text-xs text-muted-foreground mt-1">YoY Average</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Comparison Type:</span>
          </div>
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yoy">Year-over-Year</SelectItem>
              <SelectItem value="qoq">Quarter-over-Quarter</SelectItem>
              <SelectItem value="mom">Month-over-Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-4">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Metric:</span>
          </div>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
              <SelectItem value="profit">Net Profit</SelectItem>
              <SelectItem value="margin">Profit Margin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs for different analysis views */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="charts">Chart View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {comparisonType === "yoy" ? "Year-over-Year Comparison" : "Quarter-over-Quarter Comparison"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Period</th>
                      <th className="text-right py-3 px-4 font-semibold">Current</th>
                      <th className="text-right py-3 px-4 font-semibold">Previous</th>
                      <th className="text-right py-3 px-4 font-semibold">Change ($)</th>
                      <th className="text-right py-3 px-4 font-semibold">Change (%)</th>
                      <th className="text-center py-3 px-4 font-semibold">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, index) => {
                      const changeAmount = row.current - row.previous
                      const isPositive = row.change > 0

                      return (
                        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium">{row.period}</td>
                          <td className="text-right py-3 px-4">${row.current.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            ${row.previous.toLocaleString()}
                          </td>
                          <td
                            className={`text-right py-3 px-4 font-medium ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isPositive ? "+" : ""}${changeAmount.toLocaleString()}
                          </td>
                          <td
                            className={`text-right py-3 px-4 font-medium ${
                              isPositive ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {row.change.toFixed(1)}%
                          </td>
                          <td className="text-center py-3 px-4">
                            {isPositive ? (
                              <ArrowUpRight className="h-5 w-5 text-green-600 inline" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-red-600 inline" />
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="border-t-2">
                    <tr className="bg-muted/30">
                      <td className="py-3 px-4 font-bold">Average</td>
                      <td className="text-right py-3 px-4 font-bold">
                        $
                        {Math.round(
                          currentData.reduce((sum, row) => sum + row.current, 0) / currentData.length,
                        ).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-bold text-muted-foreground">
                        $
                        {Math.round(
                          currentData.reduce((sum, row) => sum + row.previous, 0) / currentData.length,
                        ).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4"></td>
                      <td className="text-right py-3 px-4 font-bold text-green-600">
                        +{(currentData.reduce((sum, row) => sum + row.change, 0) / currentData.length).toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-4"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Trend Analysis
              </h3>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Line chart visualization</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Period Comparison
              </h3>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Bar chart visualization</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Growth Distribution
              </h3>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Pie chart visualization</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth Rate
              </h3>
              <div className="h-64 flex items-center justify-center border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">Growth rate visualization</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {currentData.map((row, index) => {
              const changeAmount = row.current - row.previous
              const isPositive = row.change > 0

              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{row.period}</h3>
                      <p className="text-sm text-muted-foreground">
                        {comparisonType === "yoy"
                          ? "Compared to same period last year"
                          : "Compared to previous quarter"}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-semibold">
                        {isPositive ? "+" : ""}
                        {row.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Period</p>
                      <p className="text-2xl font-bold">${row.current.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Previous Period</p>
                      <p className="text-2xl font-bold text-muted-foreground">${row.previous.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Change</p>
                      <p className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? "+" : ""}${changeAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Performance</span>
                      <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                        {isPositive ? "Above" : "Below"} Target
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { ComparativeReportsClient }
