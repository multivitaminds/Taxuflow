"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, User, Users, Clock, Briefcase, Filter, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

const activeEmployees = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "(555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    salary: 125000,
    hireDate: "2022-01-15",
    lastActive: "2 hours ago",
    hoursThisWeek: 38,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "(555) 234-5678",
    position: "Product Manager",
    department: "Product",
    salary: 135000,
    hireDate: "2021-06-20",
    lastActive: "30 minutes ago",
    hoursThisWeek: 40,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "(555) 345-6789",
    position: "UX Designer",
    department: "Design",
    salary: 95000,
    hireDate: "2022-09-10",
    lastActive: "1 hour ago",
    hoursThisWeek: 35,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    phone: "(555) 456-7890",
    position: "Marketing Specialist",
    department: "Marketing",
    salary: 75000,
    hireDate: "2023-03-01",
    lastActive: "4 hours ago",
    hoursThisWeek: 40,
  },
  {
    id: "5",
    name: "Jessica Taylor",
    email: "jessica.taylor@company.com",
    phone: "(555) 567-8901",
    position: "HR Manager",
    department: "Human Resources",
    salary: 105000,
    hireDate: "2020-11-15",
    lastActive: "15 minutes ago",
    hoursThisWeek: 42,
  },
  {
    id: "6",
    name: "Robert Martinez",
    email: "robert.martinez@company.com",
    phone: "(555) 678-9012",
    position: "Sales Representative",
    department: "Sales",
    salary: 85000,
    hireDate: "2022-05-20",
    lastActive: "3 hours ago",
    hoursThisWeek: 37,
  },
]

export function ActiveEmployeesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")

  const filteredEmployees = activeEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || employee.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(activeEmployees.map((e) => e.department)))
  const avgHoursThisWeek = activeEmployees.reduce((sum, e) => sum + e.hoursThisWeek, 0) / activeEmployees.length

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Active Employees</h1>
              <p className="text-muted-foreground">Currently active team members</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export List
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Active</p>
                  <p className="text-2xl font-bold text-green-500">{activeEmployees.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Hours/Week</p>
                  <p className="text-2xl font-bold text-foreground">{avgHoursThisWeek.toFixed(1)}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Departments</p>
                  <p className="text-2xl font-bold text-foreground">{departments.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Link href="/accounting/employees/analytics" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">View Analytics</p>
                    <p className="text-sm font-medium text-accent">Full Report →</p>
                  </div>
                  <Filter className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search active employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-card text-foreground"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Employees Table */}
        <Card className="border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hours/Week</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Last Active</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <Link
                            href={`/accounting/employees/${employee.id}`}
                            className="font-medium text-foreground hover:text-accent"
                          >
                            {employee.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/accounting/employees/departments/${employee.department.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                      >
                        {employee.department}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{employee.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-mono">
                        {employee.hoursThisWeek}h
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{employee.lastActive}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/accounting/employees/${employee.id}/timesheet`}>
                          <Button size="sm" variant="ghost">
                            Timesheet
                          </Button>
                        </Link>
                        <Link href={`/accounting/employees/${employee.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
