"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, UserPlus, UserMinus, Briefcase, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const growthData = [
  { month: "Jan", employees: 45, hires: 3, departures: 1 },
  { month: "Feb", employees: 48, hires: 4, departures: 1 },
  { month: "Mar", employees: 52, hires: 5, departures: 1 },
  { month: "Apr", employees: 55, hires: 4, departures: 1 },
  { month: "May", employees: 58, hires: 4, departures: 1 },
  { month: "Jun", employees: 60, hires: 3, departures: 1 },
]

const departmentData = [
  { name: "Engineering", count: 15, budget: 1875000 },
  { name: "Product", count: 8, budget: 1080000 },
  { name: "Design", count: 6, budget: 570000 },
  { name: "Marketing", count: 7, budget: 525000 },
  { name: "Sales", count: 10, budget: 850000 },
  { name: "HR", count: 4, budget: 420000 },
]

export function EmployeesOverviewClient() {
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
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Employees Overview</h1>
              <p className="text-muted-foreground">Comprehensive workforce analytics and insights</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/accounting/employees/active" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">60</p>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">+8.9% from last month</span>
                </div>
              </Card>
            </Link>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">New Hires (30d)</p>
                <UserPlus className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">3</p>
              <p className="text-xs text-muted-foreground">Onboarding in progress</p>
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Departures (30d)</p>
                <UserMinus className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">1</p>
              <p className="text-xs text-muted-foreground">Retention: 98.3%</p>
            </Card>

            <Link href="/accounting/employees/payroll" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Monthly Payroll</p>
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">$620K</p>
                <div className="flex items-center gap-1 text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Next run: Jun 30</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Employee Growth Chart */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Employee Growth</h3>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Link href="/accounting/employees/analytics">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
            <ChartContainer
              config={{
                employees: {
                  label: "Total Employees",
                  color: "hsl(var(--chart-1))",
                },
                hires: {
                  label: "New Hires",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="employees" stroke="var(--color-employees)" strokeWidth={2} />
                  <Line type="monotone" dataKey="hires" stroke="var(--color-hires)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          {/* Department Distribution */}
          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Department Distribution</h3>
                <p className="text-sm text-muted-foreground">Headcount by department</p>
              </div>
              <Link href="/accounting/employees/departments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <ChartContainer
              config={{
                count: {
                  label: "Employees",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>

        {/* Department Details */}
        <Card className="border-border mb-6">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Department Breakdown</h3>
            <p className="text-sm text-muted-foreground">Headcount and budget allocation</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <Link
                  key={dept.name}
                  href={`/accounting/employees/departments/${dept.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.count} employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${(dept.budget / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-muted-foreground">Annual Budget</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/accounting/employees/new">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <UserPlus className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Add New Employee</h3>
              <p className="text-sm text-muted-foreground">Onboard a new team member</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/payroll">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <DollarSign className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Run Payroll</h3>
              <p className="text-sm text-muted-foreground">Process employee compensation</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/reports">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Calendar className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Generate Reports</h3>
              <p className="text-sm text-muted-foreground">Export employee data and analytics</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
