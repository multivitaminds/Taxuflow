"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download } from "lucide-react"

export default function ScheduleBGenerator({ taxYear, quarter }: { taxYear: number; quarter: number }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<any[]>([])

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/form-941/schedule-b/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tax_year: taxYear,
          quarter,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setEntries(result.entries)
        toast({
          title: "Schedule B Generated",
          description: result.message,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deposited":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <CardTitle>Schedule B Generator</CardTitle>
            </div>
            <CardDescription>
              Auto-generate Schedule B for semi-weekly depositors - Q{quarter} {taxYear}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-orange-600"
            >
              {loading ? "Generating..." : "Generate Schedule B"}
            </Button>
            {entries.length > 0 && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${entries.reduce((sum, e) => sum + (e.tax_liability || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{entries.filter((e) => e.is_overdue).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Entry List */}
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">
                          Payroll Date: {new Date(entry.payroll_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(entry.deposit_due_date).toLocaleDateString()}
                          {entry.is_overdue && (
                            <span className="text-red-500 ml-2">• {entry.days_overdue} days overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">${entry.tax_liability?.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Tax Liability</div>
                    </div>
                    <Badge className={getStatusColor(entry.deposit_status)}>{entry.deposit_status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No Schedule B entries generated yet. Click "Generate Schedule B" to create entries from your payroll data.
            </p>
            <p className="text-sm text-muted-foreground">
              Schedule B is required for semi-weekly depositors (businesses with &gt;$50,000 annual tax liability).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
