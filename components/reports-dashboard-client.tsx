"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, PieChart, BarChart3, Download, Calendar } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ReportsDashboardClientProps {
  user: User
}

export function ReportsDashboardClient({ user }: ReportsDashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    fetchReports()
  }, [user.id])

  const fetchReports = async () => {
    setLoading(false)
    // TODO: Fetch actual reports from database
  }

  const reportTypes = [
    {
      name: "Profit & Loss",
      description: "Income and expenses over time",
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity",
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Cash Flow",
      description: "Money in and money out",
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Tax Summary",
      description: "Tax liability and deductions",
      icon: PieChart,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Financial Reports</h1>
          <p className="text-muted-foreground">Real-time P&L, balance sheets, and cash flow analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-green-500">$0</div>
            <div className="text-xs text-muted-foreground mt-2">This month</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
            <div className="text-3xl font-bold text-red-500">$0</div>
            <div className="text-xs text-muted-foreground mt-2">This month</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
            <div className="text-3xl font-bold text-neon">$0</div>
            <div className="text-xs text-muted-foreground mt-2">This month</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="text-sm text-muted-foreground mb-1">Profit Margin</div>
            <div className="text-3xl font-bold">0%</div>
            <div className="text-xs text-muted-foreground mt-2">This month</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportTypes.map((report) => (
            <Card
              key={report.name}
              className="p-6 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <h3 className="text-xl font-bold mb-2">{report.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" className="w-full border-neon/20 bg-transparent">
                Generate Report
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Reports</h2>
            <Button variant="outline" size="sm" className="border-neon/20 bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Filter by Date
            </Button>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground mb-6">Generate your first financial report to get started</p>
              <Button className="bg-neon hover:bg-neon/90 text-background">
                <PieChart className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <BarChart3 className="w-5 h-5 text-neon" />
                    <div>
                      <div className="font-semibold">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.date}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/invoices/dashboard")}
            className="border-neon/20"
          >
            View Invoices
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/expenses/dashboard")}
            className="border-neon/20"
          >
            View Expenses
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/customers/dashboard")}
            className="border-neon/20"
          >
            View Customers
          </Button>
        </div>
      </div>
    </div>
  )
}
