"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Save, Send, Lock } from "lucide-react"

export default function FormW2() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)

  const [formData, setFormData] = useState({
    // Employer Information
    employerName: "",
    employerEIN: "",
    employerAddress: "",
    employerCity: "",
    employerState: "",
    employerZip: "",

    // Employee Information
    employeeFirstName: "",
    employeeLastName: "",
    employeeSSN: "",
    employeeAddress: "",
    employeeCity: "",
    employeeState: "",
    employeeZip: "",

    // Wage Information
    wages: "",
    federalWithholding: "",
    socialSecurityWages: "",
    socialSecurityWithholding: "",
    medicareWages: "",
    medicareWithholding: "",
    socialSecurityTips: "",
    allocatedTips: "",
    dependentCareBenefits: "",
    nonqualifiedPlans: "",
    box12Code: "",
    box12Amount: "",

    // State Information
    stateWages: "",
    stateWithholding: "",
    localWages: "",
    localWithholding: "",

    taxYear: new Date().getFullYear().toString(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/filing/submit-w2", {
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
          title: "W-2 Submitted Successfully",
          description: `Submission ID: ${result.submissionId}`,
        })

        // Redirect to filing dashboard after successful submission
        setTimeout(() => {
          router.push("/dashboard/filing")
        }, 2000)
      } else {
        throw new Error(result.error || "Failed to submit W-2")
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
      localStorage.setItem("w2_draft", JSON.stringify(formData))

      toast({
        title: "Draft Saved",
        description: "Your W-2 form has been saved as a draft",
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
            Form W-2 - Wage and Tax Statement
          </CardTitle>
          <CardDescription>Report employee wages and tax withholdings for {formData.taxYear}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 relative">
          {/* Employer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
              Employer Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="employerName">Employer Name *</Label>
                <Input
                  id="employerName"
                  required
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                  placeholder="ABC Company Inc."
                />
              </div>
              <div>
                <Label htmlFor="employerEIN" className="flex items-center gap-2">
                  Employer EIN *
                  <Lock className="h-3 w-3 text-green-500" />
                </Label>
                <Input
                  id="employerEIN"
                  required
                  placeholder="XX-XXXXXXX"
                  value={formData.employerEIN}
                  onChange={(e) => setFormData({ ...formData, employerEIN: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Encrypted and secure
                </p>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="employerAddress">Address *</Label>
                <Input
                  id="employerAddress"
                  required
                  value={formData.employerAddress}
                  onChange={(e) => setFormData({ ...formData, employerAddress: e.target.value })}
                  placeholder="123 Business St"
                />
              </div>
              <div>
                <Label htmlFor="employerCity">City *</Label>
                <Input
                  id="employerCity"
                  required
                  value={formData.employerCity}
                  onChange={(e) => setFormData({ ...formData, employerCity: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="employerState">State *</Label>
                <Input
                  id="employerState"
                  required
                  maxLength={2}
                  placeholder="CA"
                  value={formData.employerState}
                  onChange={(e) => setFormData({ ...formData, employerState: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <Label htmlFor="employerZip">ZIP Code *</Label>
                <Input
                  id="employerZip"
                  required
                  value={formData.employerZip}
                  onChange={(e) => setFormData({ ...formData, employerZip: e.target.value })}
                  placeholder="94102"
                />
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
              Employee Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="employeeFirstName">First Name *</Label>
                <Input
                  id="employeeFirstName"
                  required
                  value={formData.employeeFirstName}
                  onChange={(e) => setFormData({ ...formData, employeeFirstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="employeeLastName">Last Name *</Label>
                <Input
                  id="employeeLastName"
                  required
                  value={formData.employeeLastName}
                  onChange={(e) => setFormData({ ...formData, employeeLastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="employeeSSN" className="flex items-center gap-2">
                  Social Security Number *
                  <Lock className="h-3 w-3 text-green-500" />
                </Label>
                <Input
                  id="employeeSSN"
                  required
                  placeholder="XXX-XX-XXXX"
                  value={formData.employeeSSN}
                  onChange={(e) => setFormData({ ...formData, employeeSSN: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  AES-256 encrypted at rest
                </p>
              </div>
              <div>
                <Label htmlFor="employeeAddress">Address</Label>
                <Input
                  id="employeeAddress"
                  value={formData.employeeAddress}
                  onChange={(e) => setFormData({ ...formData, employeeAddress: e.target.value })}
                  placeholder="456 Employee Ave"
                />
              </div>
              <div>
                <Label htmlFor="employeeCity">City</Label>
                <Input
                  id="employeeCity"
                  value={formData.employeeCity}
                  onChange={(e) => setFormData({ ...formData, employeeCity: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="employeeState">State</Label>
                <Input
                  id="employeeState"
                  maxLength={2}
                  placeholder="CA"
                  value={formData.employeeState}
                  onChange={(e) => setFormData({ ...formData, employeeState: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <Label htmlFor="employeeZip">ZIP Code</Label>
                <Input
                  id="employeeZip"
                  value={formData.employeeZip}
                  onChange={(e) => setFormData({ ...formData, employeeZip: e.target.value })}
                  placeholder="94102"
                />
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
                <Label htmlFor="wages">Box 1: Wages, tips, other compensation *</Label>
                <Input
                  id="wages"
                  type="number"
                  step="0.01"
                  required
                  value={formData.wages}
                  onChange={(e) => setFormData({ ...formData, wages: e.target.value })}
                  placeholder="75000.00"
                />
              </div>
              <div>
                <Label htmlFor="federalWithholding">Box 2: Federal income tax withheld *</Label>
                <Input
                  id="federalWithholding"
                  type="number"
                  step="0.01"
                  required
                  value={formData.federalWithholding}
                  onChange={(e) => setFormData({ ...formData, federalWithholding: e.target.value })}
                  placeholder="12500.00"
                />
              </div>
              <div>
                <Label htmlFor="socialSecurityWages">Box 3: Social security wages *</Label>
                <Input
                  id="socialSecurityWages"
                  type="number"
                  step="0.01"
                  required
                  value={formData.socialSecurityWages}
                  onChange={(e) => setFormData({ ...formData, socialSecurityWages: e.target.value })}
                  placeholder="75000.00"
                />
              </div>
              <div>
                <Label htmlFor="socialSecurityWithholding">Box 4: Social security tax withheld *</Label>
                <Input
                  id="socialSecurityWithholding"
                  type="number"
                  step="0.01"
                  required
                  value={formData.socialSecurityWithholding}
                  onChange={(e) => setFormData({ ...formData, socialSecurityWithholding: e.target.value })}
                  placeholder="4650.00"
                />
              </div>
              <div>
                <Label htmlFor="medicareWages">Box 5: Medicare wages and tips *</Label>
                <Input
                  id="medicareWages"
                  type="number"
                  step="0.01"
                  required
                  value={formData.medicareWages}
                  onChange={(e) => setFormData({ ...formData, medicareWages: e.target.value })}
                  placeholder="75000.00"
                />
              </div>
              <div>
                <Label htmlFor="medicareWithholding">Box 6: Medicare tax withheld *</Label>
                <Input
                  id="medicareWithholding"
                  type="number"
                  step="0.01"
                  required
                  value={formData.medicareWithholding}
                  onChange={(e) => setFormData({ ...formData, medicareWithholding: e.target.value })}
                  placeholder="1087.50"
                />
              </div>
              <div>
                <Label htmlFor="socialSecurityTips">Box 7: Social security tips</Label>
                <Input
                  id="socialSecurityTips"
                  type="number"
                  step="0.01"
                  value={formData.socialSecurityTips}
                  onChange={(e) => setFormData({ ...formData, socialSecurityTips: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="allocatedTips">Box 8: Allocated tips</Label>
                <Input
                  id="allocatedTips"
                  type="number"
                  step="0.01"
                  value={formData.allocatedTips}
                  onChange={(e) => setFormData({ ...formData, allocatedTips: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* State Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-600 to-orange-600 rounded-full" />
              State and Local Information
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="stateWages">State wages, tips, etc.</Label>
                <Input
                  id="stateWages"
                  type="number"
                  step="0.01"
                  value={formData.stateWages}
                  onChange={(e) => setFormData({ ...formData, stateWages: e.target.value })}
                  placeholder="75000.00"
                />
              </div>
              <div>
                <Label htmlFor="stateWithholding">State income tax</Label>
                <Input
                  id="stateWithholding"
                  type="number"
                  step="0.01"
                  value={formData.stateWithholding}
                  onChange={(e) => setFormData({ ...formData, stateWithholding: e.target.value })}
                  placeholder="3750.00"
                />
              </div>
              <div>
                <Label htmlFor="localWages">Local wages, tips, etc.</Label>
                <Input
                  id="localWages"
                  type="number"
                  step="0.01"
                  value={formData.localWages}
                  onChange={(e) => setFormData({ ...formData, localWages: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="localWithholding">Local income tax</Label>
                <Input
                  id="localWithholding"
                  type="number"
                  step="0.01"
                  value={formData.localWithholding}
                  onChange={(e) => setFormData({ ...formData, localWithholding: e.target.value })}
                  placeholder="0.00"
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
              Submit W-2 to IRS
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
