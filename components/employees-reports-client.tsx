"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  Calendar,
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  FilePieChart,
  Filter,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const reportTemplates = [
  {
    id: "payroll",
    title: "Payroll Summary Report",
    description: "Complete payroll breakdown with salaries, bonuses, and deductions",
    icon: DollarSign,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    formats: ["PDF", "Excel", "CSV"],
    frequency: "Monthly",
    detailUrl: "/accounting/employees/reports/payroll",
  },
  {
    id: "attendance",
    title: "Attendance & Time Tracking",
    description: "Employee hours worked, absences, and time-off reports",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    formats: ["PDF", "Excel"],
    frequency: "Weekly",
    detailUrl: "/accounting/employees/reports/attendance",
  },
  {
    id: "demographics",
    title: "Workforce Demographics",
    description: "Age distribution, tenure, department breakdown, and diversity metrics",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    formats: ["PDF", "Excel"],
    frequency: "Quarterly",
    detailUrl: "/accounting/employees/reports/demographics",
  },
  {
    id: "performance",
    title: "Performance Analytics",
    description: "Productivity metrics, satisfaction scores, and performance reviews",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    formats: ["PDF", "Excel"],
    frequency: "Monthly",
    detailUrl: "/accounting/employees/reports/performance",
  },
  {
    id: "tax-forms",
    title: "Tax Documents (W-2, 1099)",
    description: "Annual tax forms and related documentation for all employees",
    icon: FileText,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    formats: ["PDF"],
    frequency: "Annual",
    detailUrl: "/accounting/employees/reports/tax-forms",
  },
  {
    id: "benefits",
    title: "Benefits & Compensation",
    description: "Health insurance, retirement plans, and benefit enrollment reports",
    icon: FileSpreadsheet,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    formats: ["PDF", "Excel"],
    frequency: "Quarterly",
    detailUrl: "/accounting/employees/reports/benefits",
  },
  {
    id: "turnover",
    title: "Turnover & Retention Analysis",
    description: "Hiring, departure rates, and retention metrics over time",
    icon: FilePieChart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    formats: ["PDF", "Excel"],
    frequency: "Quarterly",
    detailUrl: "/accounting/employees/reports/turnover",
  },
  {
    id: "cost-analysis",
    title: "Labor Cost Analysis",
    description: "Total compensation costs, budget forecasts, and cost-per-employee metrics",
    icon: DollarSign,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    formats: ["PDF", "Excel", "CSV"],
    frequency: "Monthly",
    detailUrl: "/accounting/employees/reports/cost-analysis",
  },
]

const recentReports = [
  {
    id: "1",
    name: "June 2024 Payroll Report",
    type: "Payroll Summary",
    generatedDate: "2024-06-30",
    size: "2.4 MB",
    format: "PDF",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "Q2 2024 Performance Analytics",
    type: "Performance Analytics",
    generatedDate: "2024-06-28",
    size: "1.8 MB",
    format: "Excel",
    downloadUrl: "#",
  },
  {
    id: "3",
    name: "May 2024 Attendance Report",
    type: "Attendance & Time Tracking",
    generatedDate: "2024-06-01",
    size: "945 KB",
    format: "PDF",
    downloadUrl: "#",
  },
]

export function EmployeesReportsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const handleGenerateReport = (reportId: string, reportTitle: string) => {
    toast({
      title: "Generating Report",
      description: `${reportTitle} is being generated. You'll receive a notification when it's ready.`,
    })
  }

  const handleFormatDownload = (reportId: string, format: string, reportTitle: string) => {
    toast({
      title: `Generating ${format}`,
      description: `${reportTitle} is being generated in ${format} format.`,
    })
    // Navigate to format-specific preview page
    window.location.href = `/accounting/employees/reports/${reportId}/preview?format=${format.toLowerCase()}`
  }

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Downloading",
      description: `${reportName} is being downloaded.`,
    })
  }

  const filteredReports = reportTemplates.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || report.id === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/accounting/employees">
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Employee Reports</h1>
              <p className="text-muted-foreground">Generate and export comprehensive employee reports</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/accounting/employees/reports/all" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                    <p className="text-2xl font-bold text-foreground">{reportTemplates.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/reports/monthly" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Generated This Month</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/reports/downloads" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recent Downloads</p>
                    <p className="text-2xl font-bold text-foreground">{recentReports.length}</p>
                  </div>
                  <Download className="h-8 w-8 text-purple-500" />
                </div>
              </Card>
            </Link>
            <Link href="/accounting/employees/analytics" className="block">
              <Card className="p-4 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">View Analytics</p>
                    <p className="text-sm font-medium text-accent">Full Dashboard →</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="tax-forms">Tax Forms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id} className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02]">
                  <Link href={report.detailUrl} className="block">
                    <div className={`h-12 w-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${report.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 hover:text-accent transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  </Link>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {report.formats.map((format) => (
                      <Link
                        key={format}
                        href={`/accounting/employees/reports/${report.id}/preview?format=${format.toLowerCase()}`}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-accent hover:scale-105 transition-all"
                        >
                          {format}
                        </Badge>
                      </Link>
                    ))}
                    <Link
                      href={`/accounting/employees/reports/frequency/${report.frequency.toLowerCase()}`}
                      className="ml-auto"
                    >
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {report.frequency}
                      </Badge>
                    </Link>
                  </div>

                  <Button className="w-full gap-2" onClick={() => handleGenerateReport(report.id, report.title)}>
                    <Download className="h-4 w-4" />
                    Generate Report
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Reports</h2>
          <Card className="border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Report Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Generated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Format</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium text-foreground hover:text-accent">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.generatedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.size}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{report.format}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 bg-transparent hover:bg-accent"
                          onClick={() => handleDownloadReport(report.name)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link href="/accounting/employees/payroll">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <DollarSign className="h-10 w-10 text-purple-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">View Payroll</h3>
              <p className="text-sm text-muted-foreground">Process and manage employee compensation</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/analytics">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <TrendingUp className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed workforce insights and trends</p>
            </Card>
          </Link>
          <Link href="/accounting/employees/overview">
            <Card className="p-6 border-border hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
              <Users className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Employee Overview</h3>
              <p className="text-sm text-muted-foreground">Complete workforce summary</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
