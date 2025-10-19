"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ComplianceReport {
  id: string
  report_type: string
  period_start: string
  period_end: string
  state: string
  total_tax_collected: number
  status: string
  due_date: string | null
}

export function TaxComplianceReports() {
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("tax_compliance_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("period_end", { ascending: false })

    if (data) setReports(data)
    setLoading(false)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "filed":
        return "default"
      case "ready":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div>Loading compliance reports...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Tax Compliance Reports</h3>
          <p className="text-sm text-muted-foreground">Track and file sales tax returns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No compliance reports yet</p>
            <p className="text-sm text-muted-foreground mt-1">Generate reports for tax filing periods</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {report.state} - {report.report_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(report.period_start).toLocaleDateString()} -{" "}
                    {new Date(report.period_end).toLocaleDateString()}
                  </p>
                  {report.due_date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(report.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold">${report.total_tax_collected.toFixed(2)}</p>
                  <Badge variant={getStatusColor(report.status)} className="mt-1">
                    {report.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
