"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, AlertCircle, RefreshCw } from "lucide-react"

export default function LookbackPeriodTracker({ currentYear }: { currentYear: number }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [lookback, setLookback] = useState<any>(null)

  useEffect(() => {
    fetchLookback()
  }, [currentYear])

  const fetchLookback = async () => {
    try {
      const response = await fetch(`/api/form-941/lookback/get?lookback_year=${currentYear}`)
      const data = await response.json()
      if (data.lookback) {
        setLookback(data.lookback)
      }
    } catch (error) {
      console.error("[v0] Error fetching lookback period:", error)
    }
  }

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/form-941/lookback/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookback_year: currentYear,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setLookback(result.lookback)
        toast({
          title: "Lookback Period Calculated",
          description: result.status.message,
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

  const getScheduleBadgeColor = (schedule: string) => {
    return schedule === "semi-weekly"
      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle>Lookback Period Tracker</CardTitle>
            </div>
            <CardDescription>
              Determine your deposit schedule (monthly vs semi-weekly) for {currentYear}
            </CardDescription>
          </div>
          <Button onClick={handleCalculate} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Calculate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {lookback ? (
          <>
            {/* Deposit Schedule Status */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Your Deposit Schedule for {currentYear}</div>
                    <div className="text-3xl font-bold mt-1 capitalize">{lookback.deposit_schedule}</div>
                  </div>
                  <Badge
                    className={getScheduleBadgeColor(lookback.deposit_schedule)}
                    style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
                  >
                    {lookback.deposit_schedule === "semi-weekly" ? "Semi-Weekly" : "Monthly"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Lookback Period Details */}
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Lookback Period</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(lookback.lookback_start_date).toLocaleDateString()} -{" "}
                  {new Date(lookback.lookback_end_date).toLocaleDateString()}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Tax Liability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${lookback.total_tax_liability?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lookback.exceeds_threshold ? "Exceeds" : "Below"} $50,000 threshold
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Threshold Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {lookback.exceeds_threshold ? (
                        <span className="text-orange-500">Above</span>
                      ) : (
                        <span className="text-blue-500">Below</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">$50,000 threshold</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quarterly Breakdown */}
              <div>
                <div className="text-sm font-medium mb-2">Quarterly Breakdown</div>
                <div className="grid gap-2 md:grid-cols-4">
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground">Q3 {currentYear - 1}</div>
                    <div className="text-sm font-semibold">${lookback.q3_prior_year?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground">Q4 {currentYear - 1}</div>
                    <div className="text-sm font-semibold">${lookback.q4_prior_year?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground">Q1 {currentYear}</div>
                    <div className="text-sm font-semibold">${lookback.q1_current_year?.toLocaleString() || 0}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-xs text-muted-foreground">Q2 {currentYear}</div>
                    <div className="text-sm font-semibold">${lookback.q2_current_year?.toLocaleString() || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Change Alert */}
            {lookback.schedule_changed && (
              <Card className="border-orange-500/50 bg-orange-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-sm">Schedule Changed!</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Your deposit schedule has changed from{" "}
                    <span className="font-bold capitalize">{lookback.previous_deposit_schedule}</span> to{" "}
                    <span className="font-bold capitalize">{lookback.deposit_schedule}</span> effective{" "}
                    {new Date(lookback.schedule_change_date).toLocaleDateString()}.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Threshold Warning */}
            {lookback.total_tax_liability > 45000 && lookback.total_tax_liability < 50000 && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm">
                      You are approaching the $50,000 threshold. If you exceed it, your deposit schedule will change to
                      semi-weekly next year.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Click "Calculate" to determine your deposit schedule for {currentYear}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
