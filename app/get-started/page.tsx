"use client"

import type React from "react"

import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, User, Calendar, Briefcase, CheckCircle, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"

export default function GetStartedPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    filingStatus: "",
    incomeType: "",
  })

  const filingStatuses = ["Single", "Married Filing Jointly", "Married Filing Separately", "Head of Household"]

  const incomeTypes = [
    { value: "w2", label: "W-2 Employee", description: "Salaried or hourly job" },
    { value: "1099", label: "Freelancer/Contractor", description: "1099 income" },
    { value: "business", label: "Business Owner", description: "LLC, S-Corp, or Sole Proprietor" },
    { value: "mixed", label: "Multiple Sources", description: "W-2 + side income" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsSubmitting(true)
      setError("")

      try {
        // Save to localStorage
        localStorage.setItem("taxu_onboarding_data", JSON.stringify(formData))

        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          console.warn("Onboarding API warning:", await response.text())
        }

        // Redirect to signup
        router.push("/signup")
      } catch (err) {
        console.warn("Onboarding API error (continuing anyway):", err)
        router.push("/signup")
      }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-32 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Let's Get <span className="text-[#00D4FF]">Started</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 text-balance max-w-2xl mx-auto">
            Answer a few quick questions and we'll set up your perfect tax filing experience
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl px-4 -mt-16 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      step >= num
                        ? "bg-[#635BFF] text-white shadow-lg shadow-[#635BFF]/30"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${step > num ? "bg-[#635BFF]" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Taxu</h2>
                    <p className="text-slate-600">Let's start with the basics so we can personalize your experience.</p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name" className="text-slate-700 font-semibold mb-2 block">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g. John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="h-12 pl-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#635BFF] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-700 font-semibold mb-2 block">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="h-12 pl-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#635BFF] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white font-semibold h-12 rounded-xl shadow-lg shadow-[#635BFF]/20 transition-all hover:-translate-y-0.5"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}

              {/* Step 2: Filing Status */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Filing Status</h2>
                    <p className="text-slate-600">How will you be filing your tax return this year?</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {filingStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, filingStatus: status })}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                          formData.filingStatus === status
                            ? "border-[#635BFF] bg-[#635BFF]/5 shadow-md"
                            : "border-slate-200 hover:border-[#635BFF]/50 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Calendar
                            className={`w-6 h-6 ${formData.filingStatus === status ? "text-[#635BFF]" : "text-slate-400"}`}
                          />
                          {formData.filingStatus === status && <CheckCircle className="w-5 h-5 text-[#635BFF]" />}
                        </div>
                        <span
                          className={`font-semibold ${formData.filingStatus === status ? "text-[#635BFF]" : "text-slate-700"}`}
                        >
                          {status}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-[2] bg-[#635BFF] hover:bg-[#5046E5] text-white font-semibold h-12 rounded-xl shadow-lg shadow-[#635BFF]/20"
                      disabled={!formData.filingStatus}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Income Type */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Income Sources</h2>
                    <p className="text-slate-600">What best describes your primary source of income?</p>
                  </div>

                  <div className="space-y-3">
                    {incomeTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, incomeType: type.value })
                        }}
                        className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 group ${
                          formData.incomeType === type.value
                            ? "border-[#635BFF] bg-[#635BFF]/5 shadow-md"
                            : "border-slate-200 hover:border-[#635BFF]/50 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              formData.incomeType === type.value
                                ? "bg-[#635BFF] text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-[#635BFF]/10 group-hover:text-[#635BFF]"
                            }`}
                          >
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-bold text-lg ${formData.incomeType === type.value ? "text-[#635BFF]" : "text-slate-900"}`}
                            >
                              {type.label}
                            </div>
                            <div className="text-sm text-slate-500">{type.description}</div>
                          </div>
                          {formData.incomeType === type.value && <CheckCircle className="w-6 h-6 text-[#635BFF]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-[2] bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a2540] font-bold h-12 rounded-xl shadow-lg shadow-[#00D4FF]/20"
                      disabled={!formData.incomeType || isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Start Filing"}
                      {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="py-16 px-6 border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-bold text-[#635BFF] mb-2">256-bit</div>
              <div className="text-slate-600 font-medium">Bank-level encryption</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-bold text-[#635BFF] mb-2">SOC 2</div>
              <div className="text-slate-600 font-medium">Compliance In Progress</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-bold text-[#635BFF] mb-2">IRS</div>
              <div className="text-slate-600 font-medium">e-file certified</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
