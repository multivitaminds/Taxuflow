"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Mail,
  Phone,
  DollarSign,
  User,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
  Download,
} from "lucide-react"
import Link from "next/link"

// Mock employee data - replace with real data from Supabase
const mockEmployees = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "(555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    salary: 125000,
    hireDate: "2022-01-15",
    status: "active",
    address: "123 Tech St, San Francisco, CA 94102",
    employeeType: "Full-time",
    hoursWorked: 2080,
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
    status: "active",
    address: "456 Innovation Ave, San Francisco, CA 94103",
    employeeType: "Full-time",
    hoursWorked: 2080,
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
    status: "active",
    address: "789 Creative Blvd, Oakland, CA 94607",
    employeeType: "Full-time",
    hoursWorked: 2080,
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
    status: "active",
    address: "321 Brand Lane, Berkeley, CA 94704",
    employeeType: "Full-time",
    hoursWorked: 2080,
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
    status: "active",
    address: "654 People Way, San Jose, CA 95110",
    employeeType: "Full-time",
    hoursWorked: 2080,
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
    status: "active",
    address: "987 Revenue Rd, Palo Alto, CA 94301",
    employeeType: "Full-time",
    hoursWorked: 2080,
  },
]

export function EmployeesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees] = useState(mockEmployees)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    totalPayroll: employees.reduce((sum, e) => sum + e.salary, 0),
    avgSalary: employees.length > 0 ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length : 0,
  }

  const departments = Array.from(new Set(employees.map((e) => e.department)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Employees</h1>
              <p className="text-muted-foreground">Manage your team and payroll</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/accounting/employees/reports">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <Download className="h-5 w-5" />
                  Export Payroll
                </Button>
              </Link>
              <Link href="/accounting/employees/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Employee
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/accounting/employees/overview" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/active" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                  </div>
                  <User className="h-8 w-8 text-green-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/payroll" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Payroll</p>
                    <p className="text-2xl font-bold text-foreground">${stats.totalPayroll.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/analytics" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Salary</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${Math.round(stats.avgSalary).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
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
              placeholder="Search employees by name, email, department, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/accounting/employees/departments">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Briefcase className="h-4 w-4" />
              Departments ({departments.length})
            </Button>
          </Link>
        </div>

        {/* Employees Grid */}
        {filteredEmployees.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first employee</p>
            <Link href="/accounting/employees/new">
              <Button>Add Employee</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <Link
                        href={`/accounting/employees/${employee.id}`}
                        className="font-semibold text-foreground hover:text-accent text-lg"
                      >
                        {employee.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">{employee.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <Link
                    href={`/accounting/employees/departments/${employee.department.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Annual Salary</p>
                      <p className="text-lg font-semibold text-foreground">${employee.salary.toLocaleString()}</p>
                    </div>
                    <Link href={`/accounting/employees/${employee.id}/timesheet`}>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Timesheet
                      </Button>
                    </Link>
                  </div>
                  <Link href={`/accounting/employees/${employee.id}`}>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-6 py-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/accounting/employees/payroll">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <DollarSign className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Run Payroll</h3>
              <p className="text-sm text-muted-foreground">Process payroll and manage compensation</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/performance">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Award className="h-10 w-10 text-orange-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Performance Reviews</h3>
              <p className="text-sm text-muted-foreground">Track and manage employee performance</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/time-tracking">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Clock className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Time Tracking</h3>
              <p className="text-sm text-muted-foreground">Monitor hours worked and attendance</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
