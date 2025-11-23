"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TaxInterviewWizard } from "@/components/tax-interview-wizard"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function TaxInterviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Auth error:", error)
      router.push("/login")
    }
  }

  const handleComplete = async (data: any) => {
    try {
      const supabase = createClient()

      // Save interview data to database
      const { error } = await supabase.from("tax_calculations").insert({
        user_id: user.id,
        tax_year: 2024,
        filing_status: data.filingStatus,
        total_income:
          (data.w2Income || 0) +
          (data.selfEmploymentIncome || 0) +
          (data.interestIncome || 0) +
          (data.dividendIncome || 0) +
          (data.capitalGains || 0) +
          (data.rentalIncome || 0),
        deductions:
          (data.mortgageInterest || 0) +
          (data.propertyTaxes || 0) +
          (data.charitableDonations || 0) +
          (data.medicalExpenses || 0) +
          (data.studentLoanInterest || 0) +
          (data.stateLocalTaxes || 0),
        credits:
          (data.childrenUnder17 || 0) * 2000 +
          Math.min((data.childCareExpenses || 0) * 0.35, 1050) +
          Math.min((data.educationExpenses || 0) * 1.0, 2500) +
          (data.energyCredits || 0),
        interview_data: data,
      })

      if (error) throw error

      console.log("[v0] Tax interview completed successfully")

      // Redirect to review page
      router.push("/review")
    } catch (error) {
      console.error("[v0] Error saving interview data:", error)
      alert("There was an error saving your information. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Let's Maximize Your <span className="text-accent">Refund</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Answer a few questions and watch your refund grow in real-time
          </p>
        </div>

        <TaxInterviewWizard onComplete={handleComplete} />
      </div>
    </div>
  )
}
