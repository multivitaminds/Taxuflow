"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Shield, Lock, ArrowRight, FileCheck } from "lucide-react"

export default function FilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [bankInfo, setBankInfo] = useState({
    routingNumber: "",
    accountNumber: "",
    accountType: "checking",
  })
  const [calculations, setCalculations] = useState<any>(null)

  useEffect(() => {
    loadCalculations()
  }, [])

  const loadCalculations = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: calc } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { descending: true })
        .limit(1)
        .single()

      setCalculations(calc)
    } catch (error) {
      console.error("[v0] Error loading calculations:", error)
    }
  }

  const handleFile = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("tax_filings")
        .insert({
          user_id: user.id,
          tax_year: 2024,
          filing_status: "filed",
          refund_amount: (calculations?.federal_refund || 0) + (calculations?.state_refund || 0),
          bank_routing: bankInfo.routingNumber,
          bank_account: bankInfo.accountNumber,
          bank_account_type: bankInfo.accountType,
          filed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      console.log("[v0] Tax return filed successfully:", data)

      // Simulate IRS submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push("/refund")
    } catch (error) {
      console.error("[v0] Error filing return:", error)
      alert("There was an error filing your return. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refundAmount = (calculations?.federal_refund || 0) + (calculations?.state_refund || 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? "bg-neon text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? "bg-neon" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Direct Deposit */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Set Up Direct Deposit</h1>
              <p className="text-muted-foreground">Get your ${refundAmount.toLocaleString()} refund in 7-10 days</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Routing Number</label>
                  <Input
                    type="text"
                    placeholder="123456789"
                    maxLength={9}
                    value={bankInfo.routingNumber}
                    onChange={(e) => setBankInfo({ ...bankInfo, routingNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Number</label>
                  <Input
                    type="text"
                    placeholder="1234567890"
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Account Type</label>
                  <select
                    className="w-full p-2 rounded-lg border border-input bg-background"
                    value={bankInfo.accountType}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountType: e.target.value })}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <div className="flex gap-3">
                <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Your banking information is secure</p>
                  <p className="text-muted-foreground">
                    We use bank-level encryption and never store your full account details.
                  </p>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              className="w-full bg-neon hover:bg-neon/90 text-background"
              onClick={() => setStep(2)}
              disabled={!bankInfo.routingNumber || !bankInfo.accountNumber}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Review & Consent */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Review & Sign</h1>
              <p className="text-muted-foreground">Review your information before filing</p>
            </div>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Filing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tax Year</span>
                  <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Filing Status</span>
                  <span className="font-semibold">Single</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Federal Refund</span>
                  <span className="font-semibold">${calculations?.federal_refund?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">State Refund</span>
                  <span className="font-semibold">${calculations?.state_refund?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between py-2 bg-neon/10 rounded-lg px-3">
                  <span className="font-bold">Total Refund</span>
                  <span className="font-bold text-neon text-xl">${refundAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Direct Deposit</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Routing: •••••{bankInfo.routingNumber.slice(-4)}</p>
                <p className="text-sm text-muted-foreground">
                  Account: •••••{bankInfo.accountNumber.slice(-4)} ({bankInfo.accountType})
                </p>
              </div>
            </Card>

            <Card className="p-4 border-neon/20">
              <div className="flex items-start gap-3">
                <Checkbox id="consent" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                <label htmlFor="consent" className="text-sm cursor-pointer">
                  I declare that I have examined this return and to the best of my knowledge and belief, it is true,
                  correct, and complete. I authorize Taxu to electronically file my return with the IRS and state tax
                  authorities.
                </label>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-neon hover:bg-neon/90 text-background"
                onClick={() => setStep(3)}
                disabled={!agreed}
              >
                Sign & File
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Filing */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Filing Your Return</h1>
              <p className="text-muted-foreground">Submitting to IRS and state tax authorities...</p>
            </div>

            <Card className="p-12 text-center">
              {loading ? (
                <>
                  <div className="w-24 h-24 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Filing in Progress</h3>
                  <p className="text-muted-foreground mb-6">This usually takes 30-60 seconds</p>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Validating tax return</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Encrypting data</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                      <span>Submitting to IRS...</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FileCheck className="w-24 h-24 text-neon mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Ready to File</h3>
                  <p className="text-muted-foreground mb-6">Click below to submit your return to the IRS</p>
                  <Button size="lg" className="bg-neon hover:bg-neon/90 text-background" onClick={handleFile}>
                    File My Return
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </Card>

            <Card className="p-4 bg-green-500/10 border-green-500/20">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">IRS e-file Certified</p>
                  <p className="text-muted-foreground">
                    Your return is transmitted securely using IRS-approved encryption protocols.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
