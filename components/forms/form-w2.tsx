"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Save, Send, Lock, Sparkles } from "lucide-react"

interface ExtractedW2Data {
  employer?: {
    name?: string
    ein?: string
    address?: string
  }
  employee?: {
    name?: string
    ssn?: string
    address?: string
  }
  income?: {
    wages?: number
    federalWithholding?: number
    socialSecurityWages?: number
    socialSecurityTax?: number
    medicareWages?: number
    medicareTax?: number
    stateWages?: number
    stateTax?: number
    state?: string
  }
  taxYear?: number
}

export default function FormW2() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)

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

  const currentYear = new Date().getFullYear()
  const taxYearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

  useEffect(() => {
    const draft = localStorage.getItem("w2_draft")
    if (draft) {
      try {
        setFormData(JSON.parse(draft))
      } catch (e) {
        console.error("Failed to load draft:", e)
      }
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setExtracting(true)

    try {
      // Upload file to blob storage
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) throw new Error("Upload failed")

      const { url } = await uploadResponse.json()

      // Extract data using AI
      const extractResponse = await fetch("/api/filing/extract-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: url }),
      })

      const extractData = await extractResponse.json()

      if (extractData.success && extractData.data.documentType === "w2") {
        const extracted: ExtractedW2Data = extractData.data

        // Auto-fill form with extracted data
        const [employeeFirst, ...employeeLast] = (extracted.employee?.name || "").split(" ")
        const employerAddressParts = (extracted.employer?.address || "").split(",")
        const employeeAddressParts = (extracted.employee?.address || "").split(",")

        setFormData({
          ...formData,
          employerName: extracted.employer?.name || "",
          employerEIN: extracted.employer?.ein || "",
          employerAddress: employerAddressParts[0]?.trim() || "",
          employerCity: employerAddressParts[1]?.trim() || "",
          employerState: extracted.income?.state || "",
          employerZip: employerAddressParts[2]?.match(/\d{5}/)?.[0] || "",

          employeeFirstName: employeeFirst || "",
          employeeLastName: employeeLast.join(" ") || "",
          employeeSSN: extracted.employee?.ssn || "",
          employeeAddress: employeeAddressParts[0]?.trim() || "",
          employeeCity: employeeAddressParts[1]?.trim() || "",
          employeeState: extracted.income?.state || "",
          employeeZip: employeeAddressParts[2]?.match(/\d{5}/)?.[0] || "",

          wages: extracted.income?.wages?.toString() || "",
          federalWithholding: extracted.income?.federalWithholding?.toString() || "",
          socialSecurityWages: extracted.income?.socialSecurityWages?.toString() || "",
          socialSecurityWithholding: extracted.income?.socialSecurityTax?.toString() || "",
          medicareWages: extracted.income?.medicareWages?.toString() || "",
          medicareWithholding: extracted.income?.medicareTax?.toString() || "",
          stateWages: extracted.income?.stateWages?.toString() || "",
          stateWithholding: extracted.income?.stateTax?.toString() || "",

          taxYear: extracted.taxYear?.toString() || new Date().getFullYear().toString(),
        })

        toast({
          title: "✨ AI Extraction Complete",
          description: "Your W-2 has been automatically filled. Please review and submit.",
        })
      } else {
        throw new Error("Could not extract W-2 data from document")
      }
    } catch (error: any) {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setExtracting(false)
    }
  }

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

        // Clear draft
        localStorage.removeItem("w2_draft")

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
          <div className="flex items-center justify-between gap-4 mb-4">
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

            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading || extracting}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading || extracting}
                className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border-purple-500/20"
              >
                {extracting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upload W-2 (AI Extract)
                  </>
                )}
              </Button>
            </div>
          </div>

          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Form W-2 - Wage and Tax Statement
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-3 mt-2">
              <span>Report employee wages and tax withholdings for</span>
              <Select value={formData.taxYear} onValueChange={(value) => setFormData({ ...formData, taxYear: value })}>
                <SelectTrigger className="w-[120px] h-8 bg-background/80 border-purple-500/20">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {taxYearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="block mt-2 text-purple-600 font-medium">
              💡 Tip: Upload your W-2 PDF and AI will auto-fill everything!
            </span>
          </CardDescription>
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
              Review & Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
