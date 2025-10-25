"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function FormW2() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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

      if (result.success) {
        toast({
          title: "W-2 Submitted Successfully",
          description: `Submission ID: ${result.submissionId}`,
        })
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Form W-2 - Wage and Tax Statement</CardTitle>
          <CardDescription>Report employee wages and tax withholdings for {formData.taxYear}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Employer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Employer Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="employerName">Employer Name *</Label>
                <Input
                  id="employerName"
                  required
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="employerEIN">Employer EIN *</Label>
                <Input
                  id="employerEIN"
                  required
                  placeholder="XX-XXXXXXX"
                  value={formData.employerEIN}
                  onChange={(e) => setFormData({ ...formData, employerEIN: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="employerAddress">Address *</Label>
                <Input
                  id="employerAddress"
                  required
                  value={formData.employerAddress}
                  onChange={(e) => setFormData({ ...formData, employerAddress: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="employerCity">City *</Label>
                <Input
                  id="employerCity"
                  required
                  value={formData.employerCity}
                  onChange={(e) => setFormData({ ...formData, employerCity: e.target.value })}
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
                />
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Employee Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="employeeFirstName">First Name *</Label>
                <Input
                  id="employeeFirstName"
                  required
                  value={formData.employeeFirstName}
                  onChange={(e) => setFormData({ ...formData, employeeFirstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="employeeLastName">Last Name *</Label>
                <Input
                  id="employeeLastName"
                  required
                  value={formData.employeeLastName}
                  onChange={(e) => setFormData({ ...formData, employeeLastName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="employeeSSN">Social Security Number *</Label>
                <Input
                  id="employeeSSN"
                  required
                  placeholder="XXX-XX-XXXX"
                  value={formData.employeeSSN}
                  onChange={(e) => setFormData({ ...formData, employeeSSN: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Wage Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Wage and Tax Information</h3>
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
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit W-2 to TaxBandits
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
