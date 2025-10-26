"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function Form941() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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

      if (result.success) {
        toast({
          title: "Form 941 Submitted Successfully",
          description: `Submission ID: ${result.submissionId}`,
        })
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

  return (
    <form onSubmit={handleSubmit}>
      <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-background via-background to-purple-500/5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 pointer-events-none" />

        <CardHeader className="relative">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Form 941 - Employer's Quarterly Federal Tax Return
          </CardTitle>
          <CardDescription>
            Report quarterly payroll taxes for Q{formData.quarter} {formData.taxYear}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ein">Employer Identification Number (EIN) *</Label>
                <Input
                  id="ein"
                  required
                  placeholder="XX-XXXXXXX"
                  value={formData.ein}
                  onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Quarter Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tax Period</h3>
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
            <h3 className="font-semibold text-lg">Wage and Tax Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  required
                  value={formData.numberOfEmployees}
                  onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
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
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Form 941 to TaxBandits
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
