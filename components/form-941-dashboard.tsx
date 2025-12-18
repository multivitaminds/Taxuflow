"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, AlertTriangle, CheckCircle2, TrendingUp, FileText, Download, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Form941Filing {
  id: string
  tax_year: number
  quarter: number
  filing_status: string
  wages_tips_compensation: number
  total_taxes_after_adjustments: number
  total_deposits_quarter: number
  balance_due: number
  filed_at: string | null
  validation_passed: boolean
  source: string
}

export default function Form941Dashboard() {
  const { toast } = useToast()
  const [filings, setFilings] = useState<Form941Filing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchFilings()
  }, [selectedYear])

  const fetchFilings = async () => {
    try {
      const response = await fetch(`/api/form-941/list?year=${selectedYear}`)
      const data = await response.json()
      setFilings(data.filings || [])
    } catch (error) {
      console.error("[v0] Error fetching 941 filings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getQuarterDueDate = (year: number, quarter: number) => {
    const dueDates = {
      1: `${year}-04-30`,
      2: `${year}-07-31`,
      3: `${year}-10-31`,
      4: `${year + 1}-01-31`,
    }
    return dueDates[quarter as keyof typeof dueDates]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "submitted":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "draft":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleCorrect941 = async (filingId: string) => {
    toast({
      title: "Creating 941-X",
      description: "Preparing correction form...",
    })
    // Navigate to 941-X correction page
    window.location.href = `/dashboard/file/941x?original=${filingId}`
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wages (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filings.reduce((sum, f) => sum + (f.wages_tips_compensation || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Taxes (YTD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filings.reduce((sum, f) => sum + (f.total_taxes_after_adjustments || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits (YTD)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filings.reduce((sum, f) => sum + (f.total_deposits_quarter || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Due (YTD)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filings.reduce((sum, f) => sum + (f.balance_due || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Filings */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly 941 Filings - {selectedYear}</CardTitle>
          <CardDescription>Track your quarterly payroll tax returns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((quarter) => {
              const filing = filings.find((f) => f.quarter === quarter)
              const dueDate = getQuarterDueDate(selectedYear, quarter)
              const isOverdue = !filing?.filed_at && new Date(dueDate) < new Date()

              return (
                <div
                  key={quarter}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-orange-500/20">
                      <span className="text-lg font-bold">Q{quarter}</span>
                    </div>
                    <div>
                      <div className="font-semibold">
                        Quarter {quarter} - {selectedYear}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Due: {dueDate}
                        {isOverdue && (
                          <Badge variant="destructive" className="ml-2">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {filing ? (
                      <>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ${filing.total_taxes_after_adjustments?.toLocaleString() || "0"}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Taxes</div>
                        </div>
                        <Badge className={getStatusColor(filing.filing_status)}>{filing.filing_status}</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleCorrect941(filing.id)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Correct
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        onClick={() =>
                          (window.location.href = `/dashboard/file/941?year=${selectedYear}&quarter=${quarter}`)
                        }
                        className="bg-gradient-to-r from-purple-600 to-orange-600"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        File Q{quarter}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
