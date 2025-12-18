"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, TrendingUp, AlertCircle, Calculator, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TaxManagementClient() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tax Management</h1>
        <p className="text-muted-foreground">Manage quarterly estimates, filing deadlines, and tax compliance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="outline" className="bg-blue-50">
              Q1 2025
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estimated Tax Due</p>
            <p className="text-3xl font-bold">$12,450</p>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due in 15 days
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <Badge className="bg-green-500">Paid</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">YTD Taxes Paid</p>
            <p className="text-3xl font-bold">$48,920</p>
            <p className="text-xs text-green-600">4 payments made</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="outline">2024</Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Returns Filed</p>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-purple-600">All filings current</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <Badge variant="outline" className="bg-orange-50">
              Projected
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Annual Tax Estimate</p>
            <p className="text-3xl font-bold">$54,200</p>
            <p className="text-xs text-orange-600">Based on Q1-Q4</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("quarterly")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "quarterly"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Quarterly Estimates
          </button>
          <button
            onClick={() => setActiveTab("filings")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "filings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Tax Filings
          </button>
          <button
            onClick={() => setActiveTab("forms")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "forms"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Forms & Documents
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/accounting/tax/quarterly">
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calculator className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Calculate Estimates</h3>
                    <p className="text-sm text-muted-foreground">Quarterly tax estimates</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/accounting/tax/filings">
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">File Returns</h3>
                    <p className="text-sm text-muted-foreground">Submit tax returns</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/accounting/tax/deductions">
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Track Deductions</h3>
                    <p className="text-sm text-muted-foreground">Maximize tax savings</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Upcoming Deadlines */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
              <Link href="/accounting/tax/calendar">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { name: "Q1 2025 Estimated Tax Payment", date: "Apr 15, 2025", amount: "$12,450", status: "due-soon" },
                { name: "Monthly Sales Tax Filing", date: "Apr 30, 2025", amount: "$3,720", status: "upcoming" },
                { name: "Quarterly Payroll Tax", date: "May 1, 2025", amount: "$8,900", status: "upcoming" },
              ].map((deadline, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${deadline.status === "due-soon" ? "bg-orange-100" : "bg-blue-100"}`}
                    >
                      <AlertCircle
                        className={`h-5 w-5 ${deadline.status === "due-soon" ? "text-orange-600" : "text-blue-600"}`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{deadline.name}</p>
                      <p className="text-sm text-muted-foreground">{deadline.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{deadline.amount}</p>
                    <Badge variant={deadline.status === "due-soon" ? "destructive" : "outline"} className="mt-1">
                      {deadline.status === "due-soon" ? "Due Soon" : "Upcoming"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab !== "overview" && (
        <Card className="p-6">
          <p className="text-muted-foreground">Content for {activeTab} tab will be displayed here</p>
        </Card>
      )}
    </div>
  )
}
