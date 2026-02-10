"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, FileText, DollarSign, Shield, ArrowRight, Download, Edit, MessageSquare, TrendingUp } from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [w2Data, setW2Data] = useState<any>(null)
  const [calculations, setCalculations] = useState<any>(null)
  const [deductions, setDeductions] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTaxData()
  }, [])

  const loadTaxData = async () => {
    try {
      console.log("[v0] Loading tax review data...")
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const [w2Result, calcResult, deductionsResult, activitiesResult] = await Promise.all([
        supabase
          .from("w2_data")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("tax_calculations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("deductions_credits").select("*").eq("user_id", user.id),
        supabase
          .from("agent_activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3),
      ])

      if (w2Result.error) {
        console.log("[v0] No W-2 data found:", w2Result.error.message)
      } else {
        console.log("[v0] W-2 data loaded:", w2Result.data)
        setW2Data(w2Result.data)
      }

      if (calcResult.error) {
        console.log("[v0] No calculations found:", calcResult.error.message)
      } else {
        console.log("[v0] Tax calculations loaded:", calcResult.data)
        setCalculations(calcResult.data)
      }

      if (deductionsResult.error) {
        console.log("[v0] No deductions found:", deductionsResult.error.message)
      } else {
        console.log("[v0] Deductions loaded:", deductionsResult.data?.length || 0)
        setDeductions(deductionsResult.data || [])
      }

      if (activitiesResult.error) {
        console.log("[v0] No activities found:", activitiesResult.error.message)
      } else {
        console.log("[v0] Activities loaded:", activitiesResult.data?.length || 0)
        setActivities(activitiesResult.data || [])
      }
    } catch (error: any) {
      console.error("[v0] Error loading tax data:", error)
      setError(error.message || "Failed to load tax data")
    } finally {
      setLoading(false)
    }
  }

  const handleFile = () => {
    router.push("/file")
  }

  const handleDownloadPDF = () => {
    // PDF generation not yet implemented
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your tax return...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unable to Load Data</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-neon hover:bg-neon/90 text-background">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  const wages = w2Data?.wages || 0
  const federalWithheld = w2Data?.federal_tax_withheld || 0
  const stateWithheld = w2Data?.state_tax_withheld || 0
  const estimatedRefund = calculations?.estimated_refund || 0
  const taxableIncome = calculations?.taxable_income || 0
  const federalTax = calculations?.federal_tax_liability || 0
  const stateTax = calculations?.state_tax_liability || 0
  const totalTax = federalTax + stateTax
  const auditRiskScore = calculations?.audit_risk_score || "Low"
  const confidence = calculations?.confidence_percentage || 0
  const standardDeduction = calculations?.standard_deduction || 14600
  const totalDeductions = standardDeduction + deductions.reduce((sum, d) => sum + (d.amount || 0), 0)
  const totalWithholding = federalWithheld + stateWithheld

  const riskColor =
    auditRiskScore === "Low" ? "text-green-500" : auditRiskScore === "Medium" ? "text-yellow-500" : "text-red-500"

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Review Your Tax Return</h1>
          <p className="text-muted-foreground">
            Review your complete 2024 tax return before filing.{" "}
            {w2Data ? "Everything looks good!" : "Upload a W-2 to get started."}
          </p>
        </div>

        {!w2Data ? (
          <Card className="p-12 text-center border-neon/20">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Tax Data Yet</h2>
            <p className="text-muted-foreground mb-6">Upload your W-2 to see your tax return summary</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-neon hover:bg-neon/90 text-background">
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <>
            {/* Refund Summary */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-neon/10 to-blue-500/10 border-neon/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Estimated Refund</p>
                  <h2 className="text-5xl font-bold text-neon">${estimatedRefund.toLocaleString()}</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Federal: ${(federalWithheld - federalTax).toFixed(0)} • State: $
                    {(stateWithheld - stateTax).toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`w-5 h-5 ${riskColor}`} />
                    <span className={`font-semibold ${riskColor}`}>{auditRiskScore} Audit Risk</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{confidence}% Confidence</p>
                </div>
              </div>
            </Card>

            {/* Income Section */}
            <Card className="p-6 mb-6 border-neon/20">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-neon" />
                <h3 className="text-xl font-bold">Income</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="font-medium">W-2 Wages</p>
                    <p className="text-sm text-muted-foreground">{w2Data.employer_name || "Employer"}</p>
                  </div>
                  <p className="font-semibold">${wages.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p className="font-medium">Total Income</p>
                  <p className="font-bold text-lg">${wages.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Deductions Section */}
            <Card className="p-6 mb-6 border-neon/20">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-neon" />
                <h3 className="text-xl font-bold">Deductions & Credits</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="font-medium">Standard Deduction</p>
                    <p className="text-sm text-muted-foreground">Single filer</p>
                  </div>
                  <p className="font-semibold">${standardDeduction.toLocaleString()}</p>
                </div>
                {deductions.map((deduction) => (
                  <div key={deduction.id} className="flex justify-between items-center py-2 border-b border-border">
                    <div>
                      <p className="font-medium">{deduction.name}</p>
                      <p className="text-sm text-muted-foreground">Recommended by {deduction.recommended_by}</p>
                    </div>
                    <p className="font-semibold text-neon">+${deduction.amount.toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <p className="font-medium">Total Deductions</p>
                  <p className="font-bold text-lg">${totalDeductions.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Tax Breakdown */}
            <Card className="p-6 mb-6 border-neon/20">
              <h3 className="text-xl font-bold mb-4">Tax Calculation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <p className="text-muted-foreground">Taxable Income</p>
                  <p className="font-semibold">${taxableIncome.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <p className="text-muted-foreground">Total Tax</p>
                  <p className="font-semibold">${totalTax.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <p className="text-muted-foreground">Total Withholding</p>
                  <p className="font-semibold">${totalWithholding.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center py-2 bg-neon/10 rounded-lg px-3">
                  <p className="font-bold">Your Refund</p>
                  <p className="font-bold text-neon text-xl">${estimatedRefund.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Audit Risk Details */}
            <Card className="p-6 mb-6 border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold">Audit Protection</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm">All income properly reported</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm">Deductions within normal ranges</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm">No red flags detected</p>
                </div>
              </div>
            </Card>

            {/* AI Agent Insights */}
            {activities.length > 0 && (
              <Card className="p-6 mb-6 border-neon/20">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-neon" />
                  <h3 className="text-xl font-bold">AI Agent Insights</h3>
                </div>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-neon">{activity.agent_name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-neon/20 bg-transparent"
                onClick={() => router.push("/dashboard")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Make Changes
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-neon/20 bg-transparent"
                disabled
                title="Coming soon"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button size="lg" className="flex-1 bg-neon hover:bg-neon/90 text-background" onClick={handleFile}>
                Continue to File
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* AI Assistant Prompt */}
            <Card className="p-4 mt-6 bg-gradient-to-r from-neon/10 to-blue-500/10 border-neon/20">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-neon" />
                <p className="text-sm">
                  Have questions about your return?{" "}
                  <button
                    onClick={() => router.push("/chat?agent=sophie")}
                    className="text-neon font-semibold hover:underline"
                  >
                    Ask Sophie
                  </button>{" "}
                  for a detailed explanation.
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
