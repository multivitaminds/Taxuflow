"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, Eye, Share2, Mail, Printer, FileText, Calendar, User, Building } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface ReportPreviewClientProps {
  reportId: string
  format: string
}

const reportData: Record<string, any> = {
  payroll: {
    title: "Payroll Summary Report",
    description: "Complete payroll breakdown with salaries, bonuses, and deductions",
    generatedDate: new Date().toISOString(),
    reportPeriod: "June 2024",
    totalEmployees: 6,
    totalPayroll: "$620,000",
  },
  attendance: {
    title: "Attendance & Time Tracking",
    description: "Employee hours worked, absences, and time-off reports",
    generatedDate: new Date().toISOString(),
    reportPeriod: "Week of June 24-30, 2024",
    totalEmployees: 6,
    totalHours: "240 hours",
  },
  demographics: {
    title: "Workforce Demographics",
    description: "Age distribution, tenure, department breakdown, and diversity metrics",
    generatedDate: new Date().toISOString(),
    reportPeriod: "Q2 2024",
    totalEmployees: 6,
    departments: "6 departments",
  },
  performance: {
    title: "Performance Analytics",
    description: "Productivity metrics, satisfaction scores, and performance reviews",
    generatedDate: new Date().toISOString(),
    reportPeriod: "June 2024",
    totalEmployees: 6,
    avgScore: "4.2/5.0",
  },
}

export function ReportPreviewClient({ reportId, format }: ReportPreviewClientProps) {
  const report = reportData[reportId] || reportData.payroll

  const handleDownload = () => {
    toast({
      title: "Downloading Report",
      description: `${report.title} is being downloaded in ${format.toUpperCase()} format.`,
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Report",
      description: "Report link copied to clipboard",
    })
  }

  const handleEmail = () => {
    toast({
      title: "Email Report",
      description: "Opening email client...",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/accounting/employees/reports">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{report.title}</h1>
                <Badge variant="outline" className="uppercase">
                  {format}
                </Badge>
              </div>
              <p className="text-muted-foreground">{report.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download {format.toUpperCase()}
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleEmail} className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Report Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Period</p>
                    <p className="text-sm text-muted-foreground">{report.reportPeriod}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Generated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.generatedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Employees</p>
                    <p className="text-sm text-muted-foreground">{report.totalEmployees}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Organization</p>
                    <p className="text-sm text-muted-foreground">Taxu, Inc</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Other Formats</h3>
              <div className="space-y-2">
                <Link href={`/accounting/employees/reports/${reportId}/preview?format=pdf`}>
                  <Button variant={format === "pdf" ? "default" : "outline"} className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </Button>
                </Link>
                <Link href={`/accounting/employees/reports/${reportId}/preview?format=excel`}>
                  <Button variant={format === "excel" ? "default" : "outline"} className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    Excel
                  </Button>
                </Link>
                <Link href={`/accounting/employees/reports/${reportId}/preview?format=csv`}>
                  <Button variant={format === "csv" ? "default" : "outline"} className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    CSV
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            <Card className="p-6 min-h-[800px]">
              <div className="flex items-center justify-center mb-6">
                <Eye className="h-6 w-6 text-muted-foreground mr-2" />
                <h2 className="text-lg font-semibold text-foreground">Report Preview</h2>
              </div>

              {/* Mock Report Content */}
              <div className="space-y-6 border border-border rounded-lg p-8 bg-card">
                <div className="text-center border-b pb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{report.title}</h1>
                  <p className="text-muted-foreground">{report.reportPeriod}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Employees:</span>
                        <span className="font-medium">{report.totalEmployees}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Report Period:</span>
                        <span className="font-medium">{report.reportPeriod}</span>
                      </div>
                      {report.totalPayroll && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Payroll:</span>
                          <span className="font-medium">{report.totalPayroll}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span className="font-medium uppercase">{format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Generated:</span>
                        <span className="font-medium">{new Date(report.generatedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 text-center text-muted-foreground">
                  <p className="text-sm">Full report data will be available after download</p>
                  <Button className="mt-4 gap-2" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    Download Complete Report
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
