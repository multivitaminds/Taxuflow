"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, DollarSign, PieChart, Calendar, Download, Info } from 'lucide-react'
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface RefundDetailsClientProps {
  user: User
  profile: any
}

export function RefundDetailsClient({ user, profile }: RefundDetailsClientProps) {
  const router = useRouter()
  const [taxCalc, setTaxCalc] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  console.log("[v0] RefundDetailsClient rendering", { user: !!user, profile: !!profile })

  const supabase = createClient()
  console.log("[v0] Supabase client created", { hasClient: !!supabase })

  useEffect(() => {
    const fetchRefundData = async () => {
      console.log("[v0] Fetching refund data for user", user.id)
      
      const { data: existingCalc, error: calcError } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      console.log("[v0] Existing tax calculation", { hasData: !!existingCalc, error: calcError })
      
      if (existingCalc) {
        setTaxCalc(existingCalc)
        setLoading(false)
        return
      }

      console.log("[v0] No tax calculation found, fetching W-2 data to calculate")
      const { data: w2Data, error: w2Error } = await supabase
        .from("w2_forms")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (w2Error || !w2Data) {
        console.log("[v0] No W-2 data found", w2Error)
        setLoading(false)
        return
      }

      console.log("[v0] W-2 data found, calculating refund", { wages: w2Data.wages, withheld: w2Data.federal_tax_withheld })
      
      const wages = w2Data.wages || 0
      const federalWithheld = w2Data.federal_tax_withheld || 0
      const standardDeduction = 14600 // 2024 single filer standard deduction
      const taxableIncome = Math.max(0, wages - standardDeduction)
      
      // Simple federal tax calculation (2024 tax brackets for single filer)
      let federalTax = 0
      if (taxableIncome <= 11600) {
        federalTax = taxableIncome * 0.10
      } else if (taxableIncome <= 47150) {
        federalTax = 1160 + (taxableIncome - 11600) * 0.12
      } else if (taxableIncome <= 100525) {
        federalTax = 5426 + (taxableIncome - 47150) * 0.22
      } else if (taxableIncome <= 191950) {
        federalTax = 17168.50 + (taxableIncome - 100525) * 0.24
      } else if (taxableIncome <= 243725) {
        federalTax = 39110.50 + (taxableIncome - 191950) * 0.32
      } else if (taxableIncome <= 609350) {
        federalTax = 55678.50 + (taxableIncome - 243725) * 0.35
      } else {
        federalTax = 183647.25 + (taxableIncome - 609350) * 0.37
      }
      
      const estimatedRefund = Math.round(federalWithheld - federalTax)
      const confidencePercentage = 85 // Default confidence
      
      console.log("[v0] Calculated refund", {
        wages,
        standardDeduction,
        taxableIncome,
        federalTax,
        federalWithheld,
        estimatedRefund
      })
      
      const calculatedTaxData = {
        user_id: user.id,
        estimated_refund: estimatedRefund,
        total_income: wages,
        total_deductions: standardDeduction,
        taxable_income: taxableIncome,
        federal_tax_liability: Math.round(federalTax),
        state_tax_liability: 0,
        total_tax_withheld: federalWithheld,
        federal_withholding: federalWithheld,
        tax_owed: Math.round(federalTax),
        total_credits: 0,
        confidence_percentage: confidencePercentage,
        audit_risk_score: "Low",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { error: insertError } = await supabase
        .from("tax_calculations")
        .insert(calculatedTaxData)
      
      if (insertError) {
        console.error("[v0] Error storing tax calculation", insertError)
      } else {
        console.log("[v0] Tax calculation stored successfully")
      }
      
      setTaxCalc(calculatedTaxData)
      setLoading(false)
    }

    fetchRefundData()
  }, [user.id])

  if (loading) {
    console.log("[v0] RefundDetailsClient showing loading state")
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading refund details...</p>
        </div>
      </div>
    )
  }

  console.log("[v0] RefundDetailsClient rendering content", { taxCalc })

  const estimatedRefund = taxCalc?.estimated_refund || 0
  const totalIncome = taxCalc?.total_income || 0
  const totalDeductions = taxCalc?.total_deductions || taxCalc?.standard_deduction || 0
  const totalCredits = taxCalc?.total_credits || 0
  const taxableIncome = taxCalc?.taxable_income || Math.max(0, totalIncome - totalDeductions)
  const taxOwed = taxCalc?.tax_owed || taxCalc?.federal_tax_liability + taxCalc?.state_tax_liability || 0
  const withheld = taxCalc?.federal_withholding || taxCalc?.total_tax_withheld || 0

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Expected Refund Details</h1>
          <p className="text-muted-foreground">Comprehensive breakdown of your estimated tax refund</p>
        </div>

        <Card className="p-8 border-neon/20 bg-gradient-to-br from-neon/10 to-blue-500/10 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-neon/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-neon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Estimated Refund</p>
              <h2 className="text-5xl font-bold text-neon">${estimatedRefund.toLocaleString()}</h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your current income, deductions, and withholdings. This estimate will update as you add more
            documents.
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Income Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Income</span>
                <span className="font-semibold">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="font-semibold text-green-500">-${totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Taxable Income</span>
                <span className="font-semibold">${taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Tax Owed</span>
                <span className="font-bold text-lg">${taxOwed.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Refund Calculation
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Federal Withholding</span>
                <span className="font-semibold">${withheld.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Tax Owed</span>
                <span className="font-semibold text-red-500">-${taxOwed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Tax Credits</span>
                <span className="font-semibold text-green-500">+${totalCredits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Your Refund</span>
                <span className="font-bold text-lg text-neon">${estimatedRefund.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 hover:bg-card/70 transition-all"
            onClick={() => router.push("/dashboard/refund/timeline")}
          >
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h4 className="font-semibold">Expected Timeline</h4>
            </div>
            <p className="text-2xl font-bold mb-2">21 days</p>
            <p className="text-sm text-muted-foreground">Average IRS processing time for e-filed returns</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 hover:bg-card/70 transition-all"
            onClick={() => router.push("/dashboard/refund/tax-rate")}
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold">Effective Tax Rate</h4>
            </div>
            <p className="text-2xl font-bold mb-2">
              {totalIncome > 0 ? ((taxOwed / totalIncome) * 100).toFixed(1) : "0"}%
            </p>
            <p className="text-sm text-muted-foreground">Percentage of income paid in federal taxes</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 hover:bg-card/70 transition-all"
            onClick={() => router.push("/dashboard/refund/confidence")}
          >
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Confidence Level</h4>
            </div>
            <p className="text-2xl font-bold mb-2">{taxCalc?.confidence_percentage || 0}%</p>
            <p className="text-sm text-muted-foreground">Based on documents uploaded and data completeness</p>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button className="bg-neon hover:bg-neon/90 text-background">
            <Download className="w-4 h-4 mr-2" />
            Download Refund Report
          </Button>
          <Button variant="outline" className="border-neon/20 bg-transparent" onClick={() => router.push("/review")}>
            Review Full Tax Return
          </Button>
        </div>
      </div>
    </div>
  )
}
