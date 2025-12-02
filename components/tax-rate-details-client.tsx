"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, BarChart3, Info } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface TaxRateDetailsClientProps {
  user: User
  profile: any
}

export function TaxRateDetailsClient({ user, profile }: TaxRateDetailsClientProps) {
  const router = useRouter()
  const [w2Filings, setW2Filings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("w2_filings")
        .select("*")
        .eq("user_id", user.id)
        .eq("irs_status", "Accepted")

      if (data) setW2Filings(data)
      setLoading(false)
    }

    fetchData()
  }, [user.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading tax rate details...</p>
        </div>
      </div>
    )
  }

  const totalIncome = w2Filings.reduce((sum, filing) => sum + (filing.wages || 0), 0)
  const federalWithholding = w2Filings.reduce((sum, filing) => sum + (filing.federal_tax_withheld || 0), 0)
  const socialSecurityTax = w2Filings.reduce((sum, filing) => sum + (filing.social_security_tax || 0), 0)
  const medicareTax = w2Filings.reduce((sum, filing) => sum + (filing.medicare_tax || 0), 0)

  const standardDeduction = 14600 // 2025 standard deduction for single filer
  const totalDeductions = standardDeduction
  const taxableIncome = Math.max(0, totalIncome - totalDeductions)

  let taxOwed = 0
  if (taxableIncome > 0) {
    if (taxableIncome <= 11925) {
      taxOwed = taxableIncome * 0.1
    } else if (taxableIncome <= 48475) {
      taxOwed = 1192.5 + (taxableIncome - 11925) * 0.12
    } else if (taxableIncome <= 103350) {
      taxOwed = 5578.5 + (taxableIncome - 48475) * 0.22
    } else if (taxableIncome <= 197300) {
      taxOwed = 17651 + (taxableIncome - 103350) * 0.24
    } else if (taxableIncome <= 250525) {
      taxOwed = 40179 + (taxableIncome - 197300) * 0.32
    } else if (taxableIncome <= 626350) {
      taxOwed = 57231 + (taxableIncome - 250525) * 0.35
    } else {
      taxOwed = 188769.75 + (taxableIncome - 626350) * 0.37
    }
  }

  const effectiveRate = totalIncome > 0 ? (taxOwed / totalIncome) * 100 : 0

  const taxBrackets = [
    { rate: 10, min: 0, max: 11925 },
    { rate: 12, min: 11925, max: 48475 },
    { rate: 22, min: 48475, max: 103350 },
    { rate: 24, min: 103350, max: 197300 },
    { rate: 32, min: 197300, max: 250525 },
    { rate: 35, min: 250525, max: 626350 },
    { rate: 37, min: 626350, max: Number.POSITIVE_INFINITY },
  ]

  const marginalRate =
    taxBrackets.find((bracket) => taxableIncome >= bracket.min && taxableIncome < bracket.max)?.rate || 10

  const nationalAverage = 13.3

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard/refund")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Refund Details
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Effective Tax Rate Analysis</h1>
          <p className="text-muted-foreground">Understanding how much of your income goes to federal taxes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 border-neon/20 bg-gradient-to-br from-green-500/10 to-green-500/5 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard/refund")}
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Your Effective Rate</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{effectiveRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Of your total income paid in federal taxes</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard/filing")}
          >
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Marginal Tax Bracket</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{marginalRate}%</p>
            <p className="text-sm text-muted-foreground">Your highest tax bracket rate</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex items-center gap-3 mb-3">
              <PieChart className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold">vs National Average</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {effectiveRate < nationalAverage ? (
                <span className="text-green-500">{(nationalAverage - effectiveRate).toFixed(1)}% lower</span>
              ) : (
                <span className="text-orange-500">{(effectiveRate - nationalAverage).toFixed(1)}% higher</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">National average is {nationalAverage}%</p>
          </Card>
        </div>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-6">Tax Rate Breakdown</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Total Income</span>
                <span className="font-semibold text-lg">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Total Deductions</span>
                <span className="font-semibold text-lg text-green-500">-${totalDeductions.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${totalIncome > 0 ? (totalDeductions / totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Taxable Income</span>
                <span className="font-semibold text-lg">${taxableIncome.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${totalIncome > 0 ? (taxableIncome / totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Tax Owed</span>
                <span className="font-semibold text-lg text-red-500">
                  ${taxOwed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${totalIncome > 0 ? (taxOwed / totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Understanding Tax Rates
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Effective Tax Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Your effective tax rate ({effectiveRate.toFixed(1)}%) is the percentage of your total income that you
                  actually pay in taxes. This is calculated by dividing your total tax owed (${taxOwed.toLocaleString()}
                  ) by your total income (${totalIncome.toLocaleString()}).
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Marginal Tax Rate</h4>
                <p className="text-sm text-muted-foreground">
                  Your marginal tax rate ({marginalRate}%) is the rate you pay on your last dollar of income. This is
                  your tax bracket, but not all your income is taxed at this rate due to the progressive tax system.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-xl font-bold mb-4">2025 Tax Brackets (Single)</h2>
            <div className="space-y-3">
              {taxBrackets.map((bracket, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    taxableIncome >= bracket.min && taxableIncome < bracket.max
                      ? "bg-neon/10 border border-neon/20"
                      : "bg-muted/50"
                  }`}
                >
                  <span className="font-semibold">{bracket.rate}%</span>
                  <span className="text-sm text-muted-foreground">
                    ${bracket.min.toLocaleString()} -{" "}
                    {bracket.max === Number.POSITIVE_INFINITY ? "∞" : `$${bracket.max.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Ways to Lower Your Tax Rate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Maximize Deductions</h4>
                <p className="text-sm text-muted-foreground">
                  Itemize deductions if they exceed the standard deduction to reduce taxable income
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Retirement Contributions</h4>
                <p className="text-sm text-muted-foreground">
                  401(k) and traditional IRA contributions reduce your taxable income
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Tax Credits</h4>
                <p className="text-sm text-muted-foreground">
                  Credits directly reduce tax owed and are more valuable than deductions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">HSA Contributions</h4>
                <p className="text-sm text-muted-foreground">
                  Health Savings Account contributions are tax-deductible and grow tax-free
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
