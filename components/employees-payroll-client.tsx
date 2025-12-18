"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  Calendar,
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Search,
} from "lucide-react"
import Link from "next/link"

const payrollData = [
  {
    id: "1",
    name: "Sarah Johnson",
    position: "Senior Software Engineer",
    baseSalary: 125000,
    bonus: 5000,
    deductions: 8750,
    netPay: 121250,
    status: "processed",
    payDate: "2024-06-30",
  },
  {
    id: "2",
    name: "Michael Chen",
    position: "Product Manager",
    baseSalary: 135000,
    bonus: 7000,
    deductions: 9450,
    netPay: 132550,
    status: "processed",
    payDate: "2024-06-30",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    position: "UX Designer",
    baseSalary: 95000,
    bonus: 3000,
    deductions: 6650,
    netPay: 91350,
    status: "pending",
    payDate: "2024-06-30",
  },
  {
    id: "4",
    name: "David Kim",
    position: "Marketing Specialist",
    baseSalary: 75000,
    bonus: 2000,
    deductions: 5250,
    netPay: 71750,
    status: "pending",
    payDate: "2024-06-30",
  },
  {
    id: "5",
    name: "Jessica Taylor",
    position: "HR Manager",
    baseSalary: 105000,
    bonus: 4000,
    deductions: 7350,
    netPay: 101650,
    status: "processed",
    payDate: "2024-06-30",
  },
  {
    id: "6",
    name: "Robert Martinez",
    position: "Sales Representative",
    baseSalary: 85000,
    bonus: 6000,
    deductions: 5950,
    netPay: 85050,
    status: "pending",
    payDate: "2024-06-30",
  },
]

export function EmployeesPayrollClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayroll = payrollData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    totalGross: payrollData.reduce((sum, e) => sum + e.baseSalary + e.bonus, 0),
    totalDeductions: payrollData.reduce((sum, e) => sum + e.deductions, 0),
    totalNet: payrollData.reduce((sum, e) => sum + e.netPay, 0),
    processed: payrollData.filter((e) => e.status === "processed").length,
    pending: payrollData.filter((e) => e.status === "pending").length,
  }

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Payroll Management</h1>
              <p className="text-muted-foreground">Process and manage employee compensation</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/accounting/employees/reports">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </Link>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Process Payroll
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Gross Pay</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalGross.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Deductions</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalDeductions.toLocaleString()}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Net Payroll</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalNet.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-semibold text-foreground">
                    {stats.processed} Processed / {stats.pending} Pending
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Payroll Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Base Salary</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Bonus</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Deductions</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Net Pay</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Pay Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayroll.map((entry) => (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <Link
                            href={`/accounting/employees/${entry.id}`}
                            className="font-medium text-foreground hover:text-accent"
                          >
                            {entry.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{entry.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">${entry.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono text-green-500">+${entry.bonus.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono text-red-500">
                      -${entry.deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-semibold">${entry.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {entry.status === "processed" ? (
                        <Badge className="bg-green-500/10 text-green-500 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-500/10 text-orange-500 gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.payDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/accounting/employees/${entry.id}/payroll`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payment Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-6 border-border">
            <Calendar className="h-10 w-10 text-blue-500 mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Next Payroll</h3>
            <p className="text-2xl font-bold text-foreground mb-2">June 30, 2024</p>
            <p className="text-sm text-muted-foreground">Bi-weekly schedule</p>
          </Card>
          <Link href="/accounting/employees/analytics" className="block">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <DollarSign className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Payroll Analytics</h3>
              <p className="text-sm text-muted-foreground">View detailed payroll reports and trends</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/reports" className="block">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Download className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Tax Documents</h3>
              <p className="text-sm text-muted-foreground">Generate W-2s and tax forms</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
