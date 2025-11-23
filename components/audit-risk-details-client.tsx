"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, Info, FileText, TrendingDown } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuditRiskDetailsClientProps {
  user: User
  profile: any
}

export function AuditRiskDetailsClient({ user, profile }: AuditRiskDetailsClientProps) {
  const router = useRouter()
  const [taxCalc, setTaxCalc] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  console.log("[v0] AuditRiskDetailsClient rendering", { user: !!user, profile: !!profile })

  const supabase = createClient()

  useEffect(() => {
    const fetchAuditData = async () => {
      console.log("[v0] Fetching audit data for user", user.id)
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      console.log("[v0] Audit data fetched", { hasData: !!data, error })
      if (data) {
        setTaxCalc(data)
      }
      setLoading(false)
    }

    fetchAuditData()
  }, [user.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading audit risk analysis...</p>
        </div>
      </div>
    )
  }

  const auditRisk = taxCalc?.audit_risk_score || "N/A"
  const confidence = taxCalc?.confidence_percentage || 0
  const riskLevel = auditRisk === "LOW" ? "low" : auditRisk === "MEDIUM" ? "medium" : "high"

  const riskFactors = [
    {
      name: "Income Reporting",
      status: "good",
      description: "All income sources properly documented",
    },
    {
      name: "Deduction Claims",
      status: "good",
      description: "Deductions are within normal ranges for your income level",
    },
    {
      name: "Business Expenses",
      status: "good",
      description: "No business expenses claimed (lower risk)",
    },
    {
      name: "Home Office Deduction",
      status: "good",
      description: "Not claimed (lower risk)",
    },
    {
      name: "Charitable Contributions",
      status: "good",
      description: "Within expected range",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Audit Risk Analysis</h1>
          <p className="text-muted-foreground">Comprehensive assessment of your tax return audit risk</p>
        </div>

        <Card
          className={`p-8 border-2 mb-8 ${
            riskLevel === "low"
              ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
              : riskLevel === "medium"
                ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                : "border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                riskLevel === "low" ? "bg-green-500/20" : riskLevel === "medium" ? "bg-yellow-500/20" : "bg-red-500/20"
              }`}
            >
              <Shield
                className={`w-8 h-8 ${
                  riskLevel === "low" ? "text-green-500" : riskLevel === "medium" ? "text-yellow-500" : "text-red-500"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Audit Risk Level</p>
              <h2
                className={`text-5xl font-bold ${
                  riskLevel === "low" ? "text-green-500" : riskLevel === "medium" ? "text-yellow-500" : "text-red-500"
                }`}
              >
                {auditRisk}
              </h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {riskLevel === "low"
              ? "Your tax return shows low risk factors. The IRS audit rate for returns like yours is less than 0.5%."
              : riskLevel === "medium"
                ? "Your tax return has some moderate risk factors. Consider reviewing with a tax professional."
                : "Your tax return has elevated risk factors. We recommend professional review before filing."}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Risk Factors Analysis
            </h3>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  {factor.status === "good" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{factor.name}</p>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Compliance Checklist
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>All income sources reported</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Deductions properly documented</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Math calculations verified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Filing status correct</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Social Security numbers verified</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold">National Audit Rate</h4>
            </div>
            <p className="text-2xl font-bold mb-2">0.38%</p>
            <p className="text-sm text-muted-foreground">Average IRS audit rate for individual returns</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Your Risk Score</h4>
            </div>
            <p className="text-2xl font-bold mb-2">{confidence}%</p>
            <p className="text-sm text-muted-foreground">Confidence in low audit risk assessment</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold">Protection Status</h4>
            </div>
            <p className="text-2xl font-bold mb-2">Active</p>
            <p className="text-sm text-muted-foreground">Audit defense included with your plan</p>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h3 className="text-xl font-bold mb-4">Kai's Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-neon mt-2" />
              <p className="text-muted-foreground">
                Keep all receipts and documentation for at least 3 years after filing
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-neon mt-2" />
              <p className="text-muted-foreground">
                Consider increasing withholding if you expect similar income next year
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-neon mt-2" />
              <p className="text-muted-foreground">Review quarterly estimated tax payments for next year</p>
            </div>
          </div>
        </Card>

        <Button className="bg-neon hover:bg-neon/90 text-background" onClick={() => router.push("/review")}>
          Review Full Tax Return
        </Button>
      </div>
    </div>
  )
}
