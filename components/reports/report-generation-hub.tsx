"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  Calendar,
  Mail,
  Settings,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  FilePen as FilePdf,
  Send,
} from "lucide-react"
import Link from "next/link"

export default function ReportGenerationHub() {
  const [searchQuery, setSearchQuery] = useState("")

  const reportTemplates = [
    {
      id: 1,
      name: "Profit & Loss Statement",
      category: "Financial",
      description: "Comprehensive income and expense analysis",
      frequency: "Monthly",
      lastGenerated: "2024-03-01",
      nextScheduled: "2024-04-01",
      recipients: 3,
      formats: ["PDF", "Excel"],
      icon: TrendingUp,
      color: "blue",
    },
    {
      id: 2,
      name: "Balance Sheet",
      category: "Financial",
      description: "Assets, liabilities, and equity overview",
      frequency: "Quarterly",
      lastGenerated: "2024-01-01",
      nextScheduled: "2024-04-01",
      recipients: 5,
      formats: ["PDF", "Excel"],
      icon: BarChart3,
      color: "green",
    },
    {
      id: 3,
      name: "Cash Flow Analysis",
      category: "Financial",
      description: "Detailed cash inflows and outflows",
      frequency: "Monthly",
      lastGenerated: "2024-03-01",
      nextScheduled: "2024-04-01",
      recipients: 2,
      formats: ["PDF", "Excel", "CSV"],
      icon: TrendingUp,
      color: "purple",
    },
    {
      id: 4,
      name: "Sales by Customer",
      category: "Sales",
      description: "Revenue breakdown by customer",
      frequency: "Weekly",
      lastGenerated: "2024-03-15",
      nextScheduled: "2024-03-22",
      recipients: 4,
      formats: ["PDF", "Excel", "CSV"],
      icon: FileText,
      color: "orange",
    },
  ]

  const scheduledReports = [
    {
      id: 1,
      name: "Monthly P&L Report",
      schedule: "1st of every month at 9:00 AM",
      recipients: ["john@example.com", "sarah@example.com"],
      status: "active",
      nextRun: "2024-04-01 09:00 AM",
    },
    {
      id: 2,
      name: "Weekly Sales Summary",
      schedule: "Every Monday at 8:00 AM",
      recipients: ["sales@example.com"],
      status: "active",
      nextRun: "2024-03-25 08:00 AM",
    },
    {
      id: 3,
      name: "Quarterly Balance Sheet",
      schedule: "1st day of Jan, Apr, Jul, Oct at 10:00 AM",
      recipients: ["cfo@example.com", "board@example.com"],
      status: "active",
      nextRun: "2024-04-01 10:00 AM",
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Profit & Loss - March 2024",
      generatedAt: "2024-03-15 10:32 AM",
      format: "PDF",
      size: "2.4 MB",
      status: "completed",
      sentTo: 3,
    },
    {
      id: 2,
      name: "Sales Report - Week 11",
      generatedAt: "2024-03-18 08:15 AM",
      format: "Excel",
      size: "1.8 MB",
      status: "completed",
      sentTo: 4,
    },
    {
      id: 3,
      name: "Cash Flow Analysis - Q1",
      generatedAt: "2024-03-14 09:45 AM",
      format: "PDF",
      size: "3.1 MB",
      status: "completed",
      sentTo: 2,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Report Generation</h1>
            <p className="text-slate-600">Automate, schedule, and deliver financial reports</p>
          </div>
          <div className="flex gap-2">
            <Link href="/reports/templates/new">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Report Templates</p>
                <p className="text-3xl font-bold mt-1">24</p>
                <p className="text-xs text-blue-100 mt-1">8 active schedules</p>
              </div>
              <FileText className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Reports Generated</p>
                <p className="text-3xl font-bold mt-1">1,247</p>
                <p className="text-xs text-green-100 mt-1">This month</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Emails Sent</p>
                <p className="text-3xl font-bold mt-1">3,842</p>
                <p className="text-xs text-purple-100 mt-1">Last 30 days</p>
              </div>
              <Mail className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Next Scheduled</p>
                <p className="text-3xl font-bold mt-1">5</p>
                <p className="text-xs text-orange-100 mt-1">In next 24 hours</p>
              </div>
              <Clock className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="history">Generation History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            {/* Search and Filter */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search report templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </Card>

            {/* Report Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4"
                    style={{ borderLeftColor: `var(--${template.color}-500)` }}
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-3 bg-${template.color}-100 rounded-lg`}>
                            <Icon className={`h-6 w-6 text-${template.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600">{template.description}</p>

                      {/* Stats */}
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {template.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {template.recipients} recipients
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {template.formats.map((format) => (
                            <Badge key={format} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-slate-500">
                          <div>Last: {template.lastGenerated}</div>
                          <div>Next: {template.nextScheduled}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Play className="h-4 w-4 mr-2" />
                          Generate Now
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled" className="space-y-4">
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{report.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{report.schedule}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Next run: {report.nextRun}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {report.recipients.length} recipients
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {report.recipients.map((email, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Add New Schedule</h3>
              <p className="text-sm text-slate-600 mb-4">
                Automate report generation and delivery with custom schedules
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              {recentReports.map((report) => (
                <Card key={report.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-green-100 rounded-lg">
                        {report.format === "PDF" ? (
                          <FilePdf className="h-6 w-6 text-red-600" />
                        ) : (
                          <FileSpreadsheet className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{report.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{report.generatedAt}</span>
                          <span>{report.format}</span>
                          <span>{report.size}</span>
                          <span className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            Sent to {report.sentTo} recipients
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input id="from-email" type="email" defaultValue="reports@taxu.io" />
                  <p className="text-xs text-slate-500">Email address that will appear as the sender</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input id="reply-to" type="email" defaultValue="support@taxu.io" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Default Email Subject</Label>
                  <Input id="email-subject" defaultValue="Your {report_name} Report - {date}" />
                  <p className="text-xs text-slate-500">
                    Available variables: {"{report_name}"}, {"{date}"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Export Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>PDF Quality</Label>
                    <p className="text-xs text-slate-500">Higher quality = larger file size</p>
                  </div>
                  <select className="border rounded-md px-3 py-2">
                    <option>Standard</option>
                    <option>High</option>
                    <option>Maximum</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Excel Format</Label>
                    <p className="text-xs text-slate-500">File format for Excel exports</p>
                  </div>
                  <select className="border rounded-md px-3 py-2">
                    <option>.xlsx (Excel 2007+)</option>
                    <option>.xls (Excel 97-2003)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>CSV Delimiter</Label>
                    <p className="text-xs text-slate-500">Character used to separate values</p>
                  </div>
                  <select className="border rounded-md px-3 py-2">
                    <option>Comma (,)</option>
                    <option>Semicolon (;)</option>
                    <option>Tab</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Retention Policy</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention-days">Keep generated reports for</Label>
                  <div className="flex items-center gap-2">
                    <Input id="retention-days" type="number" defaultValue="90" className="w-24" />
                    <span className="text-sm text-slate-600">days</span>
                  </div>
                  <p className="text-xs text-slate-500">Reports older than this will be automatically deleted</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
