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
import { Loader2, ArrowLeft, Save, Send, Lock } from "lucide-react"

export default function Form941() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

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
    setLoading(true)

    try {
      const response = await fetch("/api/filing/submit-941", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.isDemoMode) {
        toast({
          title: "Demo Mode Restriction",
          description: result.error,
          variant: "destructive",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/signup")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              Create Account
            </Button>
          ),
        })
        setLoading(false)
        return
      }

      if (result.success) {
        toast({
          title: "Form 941 Submitted Successfully",
          description: `Submission ID: ${result.submissionId}`,
        })

        // Redirect to filing dashboard after successful submission
        setTimeout(() => {
          router.push("/dashboard/filing")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to submit Form 941")
      }
    } catch (error: any) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
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
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Submit Form 941 to IRS
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
