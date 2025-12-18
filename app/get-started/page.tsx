"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, User, Calendar, Briefcase } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GetStartedPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Let's Get <span className="text-glow">Started</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance">
            Answer a few quick questions and we'll set up your perfect tax filing experience
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= num ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${step > num ? "bg-accent" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to Taxu</h2>
                  <p className="text-muted-foreground">Let's start with the basics</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full glow-neon">
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Filing Status */}
            {step === 2 && (
              <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Filing Status</h2>
                  <p className="text-muted-foreground">How will you be filing?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {filingStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, filingStatus: status })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        formData.filingStatus === status
                          ? "border-accent bg-accent/5 glow-neon"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span className="font-semibold">{status}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 glow-neon" disabled={!formData.filingStatus}>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Income Type */}
            {step === 3 && (
              <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Income Type</h2>
                  <p className="text-muted-foreground">What's your primary source of income?</p>
                </div>

                <div className="space-y-4">
                  {incomeTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, incomeType: type.value })}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                        formData.incomeType === type.value
                          ? "border-accent bg-accent/5 glow-neon"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Briefcase className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-lg mb-1">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 glow-neon-strong" disabled={!formData.incomeType}>
                    Start Filing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">256-bit</div>
              <div className="text-muted-foreground">Bank-level encryption</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">SOC 2</div>
              <div className="text-muted-foreground">Certified secure</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">IRS</div>
              <div className="text-muted-foreground">e-file compliant</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
