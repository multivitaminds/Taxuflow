"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [filingStatus, setFilingStatus] = useState("")
  const [taxYear, setTaxYear] = useState("2024")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from("user_profiles")
          .update({
            full_name: fullName,
            onboarding_completed: true,
          })
          .eq("id", user.id)
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0C0E] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2ACBFF] to-[#0EA5E9] rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Taxu</span>
        </div>

        <div className="bg-[#1F1F1F] border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-[#2ACBFF]" : "bg-white/10"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Taxu!</h1>
                <p className="text-gray-400">Let's get you set up in just a few steps</p>
              </div>

              <div>
                <Label htmlFor="fullName" className="text-white mb-2 block">
                  What's your full name?
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-[#0B0C0E] border-white/10 text-white placeholder:text-gray-500 h-12"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!fullName}
                className="w-full bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12 group"
              >
                Continue
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Filing Status</h1>
                <p className="text-gray-400">How will you be filing your taxes?</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilingStatus(status)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        filingStatus === status
                          ? "border-[#2ACBFF] bg-[#2ACBFF]/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{status}</span>
                        {filingStatus === status && <CheckCircle2 className="w-5 h-5 text-[#2ACBFF]" />}
                      </div>
                    </button>
                  ),
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-12">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!filingStatus}
                  className="flex-1 bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Tax Year</h1>
                <p className="text-gray-400">Which tax year are you filing for?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["2024", "2023", "2022", "2021"].map((year) => (
                  <button
                    key={year}
                    onClick={() => setTaxYear(year)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      taxYear === year ? "border-[#2ACBFF] bg-[#2ACBFF]/10" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{year}</span>
                      {taxYear === year && <CheckCircle2 className="w-5 h-5 text-[#2ACBFF]" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 h-12">
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 bg-[#2ACBFF] hover:bg-[#0EA5E9] text-[#0B0C0E] font-semibold h-12"
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
