"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Save, Send, Lock, ArrowRight } from "lucide-react"
import { ProgressStepper } from "@/components/ui/progress-stepper"
import { FilingReviewSection } from "@/components/filing-review-section"
import { FilingProgressDialog } from "@/components/filing-progress-dialog"
import { formatEIN } from "@/lib/format-utils"

export default function Form941() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  const [currentFormStep, setCurrentFormStep] = useState(1) // 1 = Fill Form, 2 = Review
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [filingProgress, setFilingProgress] = useState(0)

  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    ein: "",
    address: "",
    city: "",
    state: "",
    zip: "",

    // Quarter Information
    taxYear: new Date().getFullYear().toString(),
    quarter: "1",

    // Employee and Wage Information
    numberOfEmployees: "",
    wagesAndTips: "",
    federalIncomeTax: "",
    taxableSSWages: "",
    taxableMedicareWages: "",

    // Tax Calculations
    socialSecurityTax: "",
    medicareTax: "",
    totalTaxes: "",
    totalDeposits: "",
    balanceDue: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentFormStep === 1) {
      // Move to review step
      setCurrentFormStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setLoading(true)
    setShowProgressDialog(true)
    setFilingProgress(1)

    try {
      // Step 1: Authenticating
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(2)

      const response = await fetch("/api/filing/submit-941", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      // Step 2: Verifying business
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(3)

      // Step 3: Submitting
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = await response.json()

      if (result.isDemoMode) {
        setShowProgressDialog(false)
        toast({
          title: "Demo Mode Restriction",
          description: result.error,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (result.success) {
        setFilingProgress(4) // Complete

        await new Promise((resolve) => setTimeout(resolve, 2000))
        setShowProgressDialog(false)

        toast({
          title: "Form 941 Successfully Submitted to IRS",
          description: `Submission ID: ${result.submissionId}. The IRS will process your filing within 24-48 hours.`,
          duration: 5000,
        })

        setTimeout(() => {
          router.push("/dashboard/filing")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to submit Form 941")
      }
    } catch (error: any) {
      setShowProgressDialog(false)
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setSavingDraft(true)

    try {
      // Save to localStorage for now
      localStorage.setItem("form_941_draft", JSON.stringify(formData))

      toast({
        title: "Draft Saved",
        description: "Your Form 941 has been saved as a draft",
      })
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSavingDraft(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard/filing/new")
  }

  const formSteps = [
    { id: "fill", label: "Fill Form", sublabel: "Enter Information" },
    { id: "review", label: "Review & Submit", sublabel: "Verify Details" },
  ]

  const progressSteps = [
    {
      id: "auth",
      title: "Authenticating",
      description: "Securely connecting to IRS e-filing system",
      icon: "🔐",
    },
    {
      id: "business",
      title: "Verifying business entity",
      description: "Setting up your employer profile with the IRS",
      icon: "🏢",
    },
    {
      id: "submit",
      title: "Submitting Form 941",
      description: "Transmitting quarterly payroll tax data to the IRS",
      icon: "📄",
    },
  ]

  const reviewSections = [
    {
      title: "Business Information",
      fields: [
        { label: "Business Name", value: formData.businessName },
        { label: "Employer Identification Number", value: formData.ein, sensitive: true },
        {
          label: "Address",
          value: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        },
      ],
    },
    {
      title: "Tax Period",
      fields: [
        { label: "Tax Year", value: formData.taxYear },
        { label: "Quarter", value: `Q${formData.quarter}` },
      ],
    },
    {
      title: "Wage and Tax Information",
      fields: [
        { label: "Number of Employees", value: formData.numberOfEmployees },
        {
          label: "Wages, tips, and other compensation",
          value: `$${Number.parseFloat(formData.wagesAndTips || "0").toFixed(2)}`,
        },
        {
          label: "Federal income tax withheld",
          value: `$${Number.parseFloat(formData.federalIncomeTax || "0").toFixed(2)}`,
        },
        {
          label: "Taxable social security wages",
          value: `$${Number.parseFloat(formData.taxableSSWages || "0").toFixed(2)}`,
        },
        {
          label: "Taxable Medicare wages",
          value: `$${Number.parseFloat(formData.taxableMedicareWages || "0").toFixed(2)}`,
        },
      ],
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProgressStepper steps={formSteps} currentStep={currentFormStep} />

      {currentFormStep === 2 ? (
        <>
          <FilingReviewSection sections={reviewSections} formType="Form 941" />

          {/* Action Buttons for Review Step */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentFormStep(1)}
              className="flex-1"
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#005ea2] to-[#162e51] hover:opacity-90 text-white text-lg py-6"
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Send className="mr-2 h-5 w-5" />
              Submit to IRS
            </Button>
          </div>
        </>
      ) : (
        /* Original form fields - step 1 */
        <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-background via-background to-purple-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 pointer-events-none" />

          <CardHeader className="relative">
            <div className="flex items-center gap-4 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="hover:scale-105 transition-transform bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Form 941 - Employer's Quarterly Federal Tax Return
            </CardTitle>
            <CardDescription>
              Report quarterly payroll taxes for Q{formData.quarter} {formData.taxYear}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 relative">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
                Business Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="ABC Company Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="ein" className="flex items-center gap-2">
                    Employer Identification Number (EIN) *
                    <Lock className="h-3 w-3 text-green-500" />
                  </Label>
                  <Input
                    id="ein"
                    required
                    placeholder="XX-XXXXXXX"
                    value={formData.ein}
                    onChange={(e) => {
                      const formatted = formatEIN(e.target.value)
                      setFormData({ ...formData, ein: formatted })
                    }}
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    AES-256 encrypted at rest
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Business St"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    maxLength={2}
                    placeholder="CA"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input
                    id="zip"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="94102"
                  />
                </div>
              </div>
            </div>

            {/* Quarter Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
                Tax Period
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="taxYear">Tax Year *</Label>
                  <Input
                    id="taxYear"
                    required
                    value={formData.taxYear}
                    onChange={(e) => setFormData({ ...formData, taxYear: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quarter">Quarter *</Label>
                  <Select
                    value={formData.quarter}
                    onValueChange={(value) => setFormData({ ...formData, quarter: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                      <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                      <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Wage Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
                Wage and Tax Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                  <Input
                    id="numberOfEmployees"
                    type="number"
                    required
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="wagesAndTips">Wages, tips, and other compensation *</Label>
                  <Input
                    id="wagesAndTips"
                    type="number"
                    step="0.01"
                    required
                    value={formData.wagesAndTips}
                    onChange={(e) => setFormData({ ...formData, wagesAndTips: e.target.value })}
                    placeholder="150000.00"
                  />
                </div>
                <div>
                  <Label htmlFor="federalIncomeTax">Federal income tax withheld *</Label>
                  <Input
                    id="federalIncomeTax"
                    type="number"
                    step="0.01"
                    required
                    value={formData.federalIncomeTax}
                    onChange={(e) => setFormData({ ...formData, federalIncomeTax: e.target.value })}
                    placeholder="25000.00"
                  />
                </div>
                <div>
                  <Label htmlFor="taxableSSWages">Taxable social security wages *</Label>
                  <Input
                    id="taxableSSWages"
                    type="number"
                    step="0.01"
                    required
                    value={formData.taxableSSWages}
                    onChange={(e) => setFormData({ ...formData, taxableSSWages: e.target.value })}
                    placeholder="150000.00"
                  />
                </div>
                <div>
                  <Label htmlFor="taxableMedicareWages">Taxable Medicare wages *</Label>
                  <Input
                    id="taxableMedicareWages"
                    type="number"
                    step="0.01"
                    required
                    value={formData.taxableMedicareWages}
                    onChange={(e) => setFormData({ ...formData, taxableMedicareWages: e.target.value })}
                    placeholder="150000.00"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={savingDraft || loading}
                className="flex-1 bg-transparent"
              >
                {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                type="submit"
                disabled={loading || savingDraft}
                className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg shadow-purple-500/30"
              >
                Continue to Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <FilingProgressDialog
        open={showProgressDialog}
        currentStep={filingProgress}
        steps={progressSteps}
        isComplete={filingProgress === 4}
        isError={false}
      />
    </form>
  )
}
