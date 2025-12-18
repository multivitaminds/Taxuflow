"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface FrequencyReportsClientProps {
  frequency: string
}

const allReports = [
  {
    id: "payroll",
    title: "Payroll Summary Report",
    frequency: "monthly",
    formats: ["PDF", "Excel", "CSV"],
    lastGenerated: "2024-06-30",
  },
  {
    id: "attendance",
    title: "Attendance & Time Tracking",
    frequency: "weekly",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-06-28",
  },
  {
    id: "demographics",
    title: "Workforce Demographics",
    frequency: "quarterly",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-06-30",
  },
  {
    id: "performance",
    title: "Performance Analytics",
    frequency: "monthly",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-06-30",
  },
  {
    id: "tax-forms",
    title: "Tax Documents (W-2, 1099)",
    frequency: "annual",
    formats: ["PDF"],
    lastGenerated: "2024-01-31",
  },
  {
    id: "benefits",
    title: "Benefits & Compensation",
    frequency: "quarterly",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-06-30",
  },
  {
    id: "turnover",
    title: "Turnover & Retention Analysis",
    frequency: "quarterly",
    formats: ["PDF", "Excel"],
    lastGenerated: "2024-06-30",
  },
  {
    id: "cost-analysis",
    title: "Labor Cost Analysis",
    frequency: "monthly",
    formats: ["PDF", "Excel", "CSV"],
    lastGenerated: "2024-06-30",
  },
]

export function FrequencyReportsClient({ frequency }: FrequencyReportsClientProps) {
  const filteredReports = allReports.filter((report) => report.frequency === frequency)

  const handleGenerate = (reportTitle: string) => {
    toast({
      title: "Generating Report",
      description: `${reportTitle} is being generated.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/accounting/employees/reports">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 capitalize">{frequency} Reports</h1>
              <p className="text-muted-foreground">View all reports generated on a {frequency} basis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
                  <p className="text-2xl font-bold">{filteredReports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                  <p className="text-2xl font-bold capitalize">{frequency}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(filteredReports[0]?.lastGenerated || new Date()).toLocaleDateString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
              <Link href={`/accounting/employees/reports/${report.id}/preview`}>
                <h3 className="font-semibold text-foreground mb-2 hover:text-accent transition-colors">
                  {report.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {report.formats.map((format) => (
                  <Link
                    key={format}
                    href={`/accounting/employees/reports/${report.id}/preview?format=${format.toLowerCase()}`}
                  >
                    <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-all">
                      {format}
                    </Badge>
                  </Link>
                ))}
              </div>
              <Button className="w-full gap-2" onClick={() => handleGenerate(report.title)}>
                <Download className="h-4 w-4" />
                Generate
              </Button>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Found</h3>
            <p className="text-muted-foreground mb-4">No reports are scheduled for {frequency} frequency.</p>
            <Link href="/accounting/employees/reports">
              <Button>View All Reports</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
