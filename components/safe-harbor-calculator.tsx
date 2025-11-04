"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertTriangle, CheckCircle2, Calculator } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SafeHarborCalculator({ taxYear, quarter }: { taxYear: number; quarter: number }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [safeHarbor, setSafeHarbor] = useState<any>(null)
  const [totalTaxLiability, setTotalTaxLiability] = useState("")

  useEffect(() => {
    fetchSafeHarbor()
  }, [taxYear, quarter])

  const fetchSafeHarbor = async () => {
    try {
      const response = await fetch(`/api/form-941/safe-harbor/get?tax_year=${taxYear}&quarter=${quarter}`)
      const data = await response.json()
      if (data.safeHarbor) {
        setSafeHarbor(data.safeHarbor)
      }
    } catch (error) {
      console.error("[v0] Error fetching safe harbor:", error)
    }
  }

  const handleCalculate = async () => {
    if (!totalTaxLiability) {
      toast({
        title: "Error",
        description: "Please enter total tax liability",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/form-941/safe-harbor/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tax_year: taxYear,
          quarter,
          total_tax_liability: Number.parseFloat(totalTaxLiability),
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSafeHarbor(result.safeHarbor)
        toast({
          title: "Safe Harbor Calculated",
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

  const depositProgress = safeHarbor ? (safeHarbor.total_deposits / safeHarbor.safe_harbor_100_percent) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <CardTitle>Safe Harbor Calculator</CardTitle>
        </div>
        <CardDescription>
          Calculate safe harbor amounts to avoid penalties for Q{quarter} {taxYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="total_tax_liability">Total Tax Liability for Quarter *</Label>
            <div className="flex gap-2">
              <Input
                id="total_tax_liability"
                type="number"
                step="0.01"
                value={totalTaxLiability}
                onChange={(e) => setTotalTaxLiability(e.target.value)}
                placeholder="50000.00"
              />
              <Button onClick={handleCalculate} disabled={loading}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your total tax liability (federal income tax + Social Security + Medicare)
            </p>
          </div>
        </div>

        {/* Results Section */}
        {safeHarbor && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Deposit Progress</span>
                <span className="font-semibold">{depositProgress.toFixed(1)}%</span>
              </div>
              <Progress value={depositProgress} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>${safeHarbor.total_deposits?.toLocaleString() || 0} deposited</span>
                <span>${safeHarbor.safe_harbor_100_percent?.toLocaleString() || 0} total liability</span>
              </div>
            </div>

            {/* Safe Harbor Status Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className={safeHarbor.meets_100_percent_safe_harbor ? "border-green-500/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">100% Safe Harbor</CardTitle>
                    {safeHarbor.meets_100_percent_safe_harbor ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${safeHarbor.safe_harbor_100_percent?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {safeHarbor.meets_100_percent_safe_harbor
                      ? "You meet 100% safe harbor!"
                      : "Deposit 100% of liability to meet safe harbor"}
                  </p>
                </CardContent>
              </Card>

              <Card className={safeHarbor.meets_90_percent_safe_harbor ? "border-green-500/50" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">90% Safe Harbor</CardTitle>
                    {safeHarbor.meets_90_percent_safe_harbor ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${safeHarbor.safe_harbor_90_percent?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {safeHarbor.meets_90_percent_safe_harbor
                      ? "You meet 90% safe harbor!"
                      : "Deposit 90% of liability to meet safe harbor"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Shortfall Alert */}
            {safeHarbor.shortfall_amount > 0 && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-sm">Shortfall Detected</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    You need to deposit{" "}
                    <span className="font-bold">${safeHarbor.shortfall_amount.toLocaleString()}</span> more to meet 90%
                    safe harbor.
                  </p>
                  {safeHarbor.recommended_catch_up_deposit > 0 && (
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <div>
                        <div className="text-sm font-medium">Recommended Catch-Up Deposit</div>
                        <div className="text-xs text-muted-foreground">
                          Due by {new Date(safeHarbor.catch_up_deposit_due_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        ${safeHarbor.recommended_catch_up_deposit.toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {safeHarbor.meets_90_percent_safe_harbor && (
              <Card className="border-green-500/50 bg-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium">
                      You meet safe harbor requirements! You are protected from penalties even if you underpay slightly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
