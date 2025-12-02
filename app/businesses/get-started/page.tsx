"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Building2, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatEIN } from "@/lib/format-utils"

export default function BusinessGetStartedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedType = searchParams.get("type")

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessType: preselectedType || "",
    businessName: "",
    ein: "",
    businessStructure: "",
    industry: "",
    annualRevenue: "",
    employeeCount: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const businessTypes = [
    { id: "sole-proprietors", label: "Sole Proprietor", description: "Schedule C filing" },
    { id: "llcs-&-s-corps", label: "LLC / S-Corp", description: "Entity-specific strategies" },
    { id: "contractors-&-freelancers", label: "Contractor / Freelancer", description: "1099 income management" },
    { id: "growing-agencies", label: "Growing Agency", description: "Multi-entity operations" },
  ]

  const businessStructures = [
    "Sole Proprietorship",
    "Single-Member LLC",
    "Multi-Member LLC",
    "S Corporation",
    "C Corporation",
    "Partnership",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "taxu_business_onboarding",
          JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
          }),
        )
      }

      const response = await fetch("/api/business-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit business information")
      }

      const data = await response.json()

      // Redirect to signup with business context
      router.push(`/signup?business=true&orgId=${data.organizationId}`)
    } catch (error) {
      console.error("Error submitting business information:", error)

      // This ensures the flow continues even if API fails
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "taxu_business_onboarding",
          JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
          }),
        )
      }
      router.push(`/signup?business=true`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.businessType && formData.businessName && formData.businessStructure
      case 2:
        return formData.industry && formData.annualRevenue
      case 3:
        return formData.email && formData.phone
      default:
        return false
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/businesses"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Business</span>
            </Link>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span className="font-semibold">Business Tax Filing</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s === step
                      ? "bg-accent text-accent-foreground"
                      : s < step
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${s < step ? "bg-accent" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Step {step} of 3:{" "}
              {step === 1 ? "Business Information" : step === 2 ? "Business Details" : "Contact Information"}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Business Type & Name */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Tell us about your business</h2>
                  <p className="text-muted-foreground">
                    We'll customize your tax filing experience based on your business structure.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Business Type</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {businessTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange("businessType", type.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.businessType === type.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="font-semibold mb-1">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessStructure">Legal Structure *</Label>
                  <select
                    id="businessStructure"
                    value={formData.businessStructure}
                    onChange={(e) => handleInputChange("businessStructure", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="">Select structure</option>
                    {businessStructures.map((structure) => (
                      <option key={structure} value={structure}>
                        {structure}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ein">EIN (Employer Identification Number)</Label>
                  <Input
                    id="ein"
                    value={formData.ein}
                    onChange={(e) => {
                      const formatted = formatEIN(e.target.value)
                      handleInputChange("ein", formatted)
                    }}
                    placeholder="XX-XXXXXXX"
                    maxLength={10}
                  />
                  <p className="text-sm text-muted-foreground">Optional - Leave blank if you don't have one yet</p>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Business details</h2>
                  <p className="text-muted-foreground">Help us understand your business operations.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    placeholder="e.g., Software Development, Consulting, Retail"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Estimated Annual Revenue *</Label>
                  <select
                    id="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="">Select range</option>
                    <option value="0-50k">$0 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <select
                    id="employeeCount"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select range</option>
                    <option value="0">Just me</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-10">6-10 employees</option>
                    <option value="11-25">11-25 employees</option>
                    <option value="26-50">26-50 employees</option>
                    <option value="51+">51+ employees</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Contact information</h2>
                  <p className="text-muted-foreground">We'll use this to create your account and keep you updated.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="State"
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="ZIP"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid()} className="glow-neon">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={!isStepValid() || isSubmitting} className="glow-neon-strong">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
