"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, ArrowLeft, Download, Target } from "lucide-react"
import Link from "next/link"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { month: "Jan", productivity: 85, satisfaction: 78, retention: 95 },
  { month: "Feb", productivity: 88, satisfaction: 82, retention: 96 },
  { month: "Mar", productivity: 90, satisfaction: 85, retention: 97 },
  { month: "Apr", productivity: 87, satisfaction: 83, retention: 96 },
  { month: "May", productivity: 92, satisfaction: 87, retention: 98 },
  { month: "Jun", productivity: 94, satisfaction: 90, retention: 98 },
]

const costData = [
  { month: "Jan", salaries: 580000, benefits: 87000, taxes: 116000 },
  { month: "Feb", salaries: 590000, benefits: 88500, taxes: 118000 },
  { month: "Mar", salaries: 605000, benefits: 90750, taxes: 121000 },
  { month: "Apr", salaries: 610000, benefits: 91500, taxes: 122000 },
  { month: "May", salaries: 615000, benefits: 92250, taxes: 123000 },
  { month: "Jun", salaries: 620000, benefits: 93000, taxes: 124000 },
]

const ageDistribution = [
  { name: "18-25", value: 8, color: "#3b82f6" },
  { name: "26-35", value: 25, color: "#8b5cf6" },
  { name: "36-45", value: 18, color: "#ec4899" },
  { name: "46-55", value: 7, color: "#f59e0b" },
  { name: "55+", value: 2, color: "#10b981" },
]

const tenureDistribution = [
  { name: "0-1 year", value: 12 },
  { name: "1-3 years", value: 22 },
  { name: "3-5 years", value: 15 },
  { name: "5+ years", value: 11 },
]

export function EmployeesAnalyticsClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/accounting/employees">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Employee Analytics</h1>
              <p className="text-muted-foreground">Comprehensive workforce insights and trends</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Productivity Score</p>
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">94%</p>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">+8% from last month</span>
              </div>
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">90%</p>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">+5% from last month</span>
              </div>
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">98%</p>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Industry leading</span>
              </div>
            </Card>

            <Link href="/accounting/employees/payroll" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg Cost/Employee</p>
                  <DollarSign className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">$13.9K</p>
                <p className="text-xs text-muted-foreground">Per month (incl. benefits)</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Performance Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 border-border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">6-month trend analysis</p>
            </div>
            <ChartContainer
              config={{
                productivity: {
                  label: "Productivity",
                  color: "hsl(var(--chart-1))",
                },
                satisfaction: {
                  label: "Satisfaction",
                  color: "hsl(var(--chart-2))",
                },
                retention: {
                  label: "Retention",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="productivity" stroke="var(--color-productivity)" strokeWidth={2} />
                  <Line type="monotone" dataKey="satisfaction" stroke="var(--color-satisfaction)" strokeWidth={2} />
                  <Line type="monotone" dataKey="retention" stroke="var(--color-retention)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          <Card className="p-6 border-border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Cost Breakdown</h3>
              <p className="text-sm text-muted-foreground">Monthly expenses by category</p>
            </div>
            <ChartContainer
              config={{
                salaries: {
                  label: "Salaries",
                  color: "hsl(var(--chart-1))",
                },
                benefits: {
                  label: "Benefits",
                  color: "hsl(var(--chart-2))",
                },
                taxes: {
                  label: "Taxes",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="salaries" fill="var(--color-salaries)" />
                  <Bar dataKey="benefits" fill="var(--color-benefits)" />
                  <Bar dataKey="taxes" fill="var(--color-taxes)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 border-border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Age Distribution</h3>
              <p className="text-sm text-muted-foreground">Workforce demographics</p>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Tenure Distribution</h3>
              <p className="text-sm text-muted-foreground">Years at company</p>
            </div>
            <ChartContainer
              config={{
                value: {
                  label: "Employees",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tenureDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/accounting/employees/overview">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Users className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">View Overview</h3>
              <p className="text-sm text-muted-foreground">See complete employee overview</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/payroll">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <DollarSign className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Payroll Details</h3>
              <p className="text-sm text-muted-foreground">View compensation breakdown</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/reports">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Download className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Export Reports</h3>
              <p className="text-sm text-muted-foreground">Generate custom analytics reports</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
