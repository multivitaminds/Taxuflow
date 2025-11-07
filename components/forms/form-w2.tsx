"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  ArrowLeft,
  Save,
  Send,
  Lock,
  Sparkles,
  FileText,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PenaltyAbatementDialog } from "@/components/penalty-abatement-dialog"
import { parseName, parseLastNameWithMiddleInitial } from "@/lib/name-parser"

interface FormW2Props {
  extractedData?: any
}

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

export default function FormW2({ extractedData }: FormW2Props) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [showPenaltyDialog, setShowPenaltyDialog] = useState(false)
  const [overrideValidation, setOverrideValidation] = useState(false)

  const [filingType, setFilingType] = useState<"original" | "corrected">("original")

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
    employeeMiddleInitial: "", // Added middle initial field
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

  const shouldAutoValidate = useRef(false)

  const currentYear = new Date().getFullYear()
  const taxYearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const canEfile = (year: number) => {
    const yearsBack = currentYear - year
    // Original W-2s: current year only (by Jan 31 deadline)
    // Corrected W-2s: current year + 2 prior years (in some cases)
    if (filingType === "original") {
      return yearsBack === 0
    } else {
      return yearsBack <= 2
    }
  }

  useEffect(() => {
    if (shouldAutoValidate.current && formData.employerName && formData.wages) {
      console.log("[v0] Form state updated, running auto-validation with:", {
        employerName: formData.employerName,
        wages: formData.wages,
        employeeFirstName: formData.employeeFirstName,
      })
      shouldAutoValidate.current = false
      handleValidateForm()
    }
  }, [formData])

  const cleanAndParseAddress = (addressString: string) => {
    if (!addressString) return { street: "", city: "", state: "", zip: "" }

    // Remove extra whitespace and normalize
    const normalized = addressString.replace(/\s+/g, " ").trim()

    // Extract ZIP code first (5 digits or 5+4 format)
    const zipMatch = normalized.match(/\b(\d{5}(?:-\d{4})?)\b/)
    const zip = zipMatch ? zipMatch[1] : ""

    // Remove ZIP from string
    let remaining = normalized.replace(/\b\d{5}(?:-\d{4})?\b/, "").trim()

    // Extract state (2 letter code)
    const stateMatch = remaining.match(/\b([A-Z]{2})\b/)
    const state = stateMatch ? stateMatch[1] : ""

    // Remove state from string
    remaining = remaining.replace(/\b[A-Z]{2}\b/, "").trim()

    // Split by comma to get street and city
    const parts = remaining
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)

    let street = ""
    let city = ""

    if (parts.length >= 2) {
      street = parts[0]
      city = parts[1]
    } else if (parts.length === 1) {
      // If only one part, assume it's the street
      street = parts[0]
    }

    // Clean up city (remove apartment numbers)
    city = city.replace(/^(Apt|Apartment|Unit|Suite|#)\s*\d+\w*$/i, "").trim()
    city = city.replace(/^(Apt|Apartment|Unit|Suite|#)\s*\d+\w*,?\s*/i, "").trim()

    console.log("[v0] Parsed address:", { input: addressString, output: { street, city, state, zip } })

    return { street, city, state, zip }
  }

  useEffect(() => {
    if (extractedData) {
      console.log("[v0] Auto-filling form with extracted data:", extractedData)

      const extracted: ExtractedW2Data = extractedData

      if (!extracted.employer?.name || !extracted.income?.wages) {
        console.error("[v0] Critical data missing - need at least employer and wages")
        toast({
          title: "⚠️ Partial Extraction",
          description: "Some required data is missing. Please complete the form manually.",
          variant: "destructive",
        })
        // Don't return - still populate what we have
      }

      const employeeName = extracted.employee?.name || ""
      const parsedName = parseName(employeeName)

      let employeeFirstName = ""
      let employeeMiddleInitial = ""
      let employeeLastName = ""

      if (parsedName) {
        employeeFirstName = parsedName.firstName
        employeeMiddleInitial = parsedName.middleInitial
        employeeLastName = parsedName.lastName
      }

      const employerAddress = extracted.employer?.address || ""
      const employeeAddress = extracted.employee?.address || ""

      const employerParsed = cleanAndParseAddress(employerAddress)
      const employeeParsed = cleanAndParseAddress(employeeAddress)

      console.log("[v0] Parsed addresses:", {
        employer: employerParsed,
        employee: employeeParsed,
      })

      const newFormData = {
        ...formData,
        employerName: extracted.employer?.name || "",
        employerEIN: extracted.employer?.ein || "",
        employerAddress: employerParsed.street,
        employerCity: employerParsed.city,
        employerState: employerParsed.state,
        employerZip: employerParsed.zip,

        employeeFirstName: employeeFirstName || "",
        employeeMiddleInitial: employeeMiddleInitial || "",
        employeeLastName: employeeLastName || "",
        employeeSSN: extracted.employee?.ssn || "",
        employeeAddress: employeeParsed.street,
        employeeCity: employeeParsed.city,
        employeeState: employeeParsed.state,
        employeeZip: employeeParsed.zip,

        wages: extracted.income?.wages?.toString() || "",
        federalWithholding: extracted.income?.federalWithholding?.toString() || "",
        socialSecurityWages: extracted.income?.socialSecurityWages?.toString() || "",
        socialSecurityWithholding: extracted.income?.socialSecurityTax?.toString() || "",
        medicareWages: extracted.income?.medicareWages?.toString() || "",
        medicareWithholding: extracted.income?.medicareTax?.toString() || "",
        stateWages: extracted.income?.stateWages?.toString() || "",
        stateWithholding: extracted.income?.stateTax?.toString() || "",

        taxYear: extracted.taxYear?.toString() || new Date().getFullYear().toString(),
      }

      setFormData(newFormData)
      shouldAutoValidate.current = true

      toast({
        title: "✨ Form Auto-Filled",
        description: "Your W-2 data has been automatically populated. Validating...",
      })
    }
  }, [extractedData])

  useEffect(() => {
    const draft = localStorage.getItem("w2_draft")
    if (draft && !extractedData) {
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

        if (!extracted.employer?.name || !extracted.income?.wages) {
          console.error("[v0] Critical data missing - need at least employer and wages")
          toast({
            title: "⚠️ Partial Extraction",
            description: "Some required data is missing. Please complete the form manually.",
            variant: "destructive",
          })
          // Don't return - still populate what we have
        }

        const employeeName = extracted.employee?.name || ""
        const parsedName = parseName(employeeName)

        let employeeFirstName = ""
        let employeeMiddleInitial = ""
        let employeeLastName = ""

        if (parsedName) {
          employeeFirstName = parsedName.firstName
          employeeMiddleInitial = parsedName.middleInitial
          employeeLastName = parsedName.lastName
        }

        const employerAddress = extracted.employer?.address || ""
        const employeeAddress = extracted.employee?.address || ""

        const employerParsed = cleanAndParseAddress(employerAddress)
        const employeeParsed = cleanAndParseAddress(employeeAddress)

        console.log("[v0] Parsed addresses from upload:", {
          employer: employerParsed,
          employee: employeeParsed,
        })

        setFormData({
          ...formData,
          employerName: extracted.employer?.name || "",
          employerEIN: extracted.employer?.ein || "",
          employerAddress: employerParsed.street,
          employerCity: employerParsed.city,
          employerState: employerParsed.state,
          employerZip: employerParsed.zip,

          employeeFirstName,
          employeeMiddleInitial,
          employeeLastName,
          employeeSSN: extracted.employee?.ssn || "",
          employeeAddress: employeeParsed.street,
          employeeCity: employeeParsed.city,
          employeeState: employeeParsed.state,
          employeeZip: employeeParsed.zip,

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

        shouldAutoValidate.current = true

        toast({
          title: "✨ AI Extraction Complete",
          description: "Your W-2 has been automatically filled. Validating...",
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

  const handleValidateForm = async () => {
    setValidating(true)
    setValidationResult(null)

    try {
      console.log("[v0] Running client-side validation...")

      const errors: any[] = []
      const warnings: any[] = []

      // Check required fields
      if (!formData.employerName) errors.push({ field: "employerName", message: "Employer name is required" })
      if (!formData.employerEIN) errors.push({ field: "employerEIN", message: "Employer EIN is required" })
      if (!formData.employeeFirstName)
        errors.push({ field: "employeeFirstName", message: "Employee first name is required" })
      if (!formData.employeeLastName)
        errors.push({ field: "employeeLastName", message: "Employee last name is required" })
      if (!formData.employeeSSN) errors.push({ field: "employeeSSN", message: "Employee SSN is required" })
      if (!formData.wages) errors.push({ field: "wages", message: "Wages are required" })

      // Basic math validation
      const wages = Number.parseFloat(formData.wages) || 0
      const federalWithholding = Number.parseFloat(formData.federalWithholding) || 0
      const socialSecurityWages = Number.parseFloat(formData.socialSecurityWages) || 0
      const socialSecurityWithholding = Number.parseFloat(formData.socialSecurityWithholding) || 0
      const medicareWages = Number.parseFloat(formData.medicareWages) || 0
      const medicareWithholding = Number.parseFloat(formData.medicareWithholding) || 0

      // Federal withholding should not exceed wages
      if (federalWithholding > wages) {
        errors.push({ field: "federalWithholding", message: "Federal withholding cannot exceed total wages" })
      }

      // Social Security withholding should be approximately 6.2% (allow 0-10% range)
      if (socialSecurityWages > 0) {
        const ssRate = (socialSecurityWithholding / socialSecurityWages) * 100
        if (ssRate > 10) {
          warnings.push({
            field: "socialSecurityWithholding",
            message: `Social Security withholding rate is ${ssRate.toFixed(1)}% (expected ~6.2%)`,
          })
        }
      }

      // Medicare withholding should be approximately 1.45% (allow 0-5% range)
      if (medicareWages > 0) {
        const medicareRate = (medicareWithholding / medicareWages) * 100
        if (medicareRate > 5) {
          warnings.push({
            field: "medicareWithholding",
            message: `Medicare withholding rate is ${medicareRate.toFixed(1)}% (expected ~1.45%)`,
          })
        }
      }

      const result = {
        valid: errors.length === 0,
        errors,
        warnings,
        suggestions: [],
      }

      setValidationResult(result)

      const hasErrors = errors.length > 0
      const hasWarnings = warnings.length > 0

      console.log("[v0] Validation result:", {
        valid: result.valid,
        errors: hasErrors ? errors.length : 0,
        warnings: hasWarnings ? warnings.length : 0,
      })

      if (!hasErrors && !hasWarnings) {
        toast({
          title: "✓ Validation Passed",
          description: "Your form looks great! Click 'Submit to IRS' to file.",
        })
      } else if (hasErrors) {
        toast({
          title: "Validation Issues Found",
          description: `Found ${errors.length} error(s) that need attention`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Validation Complete",
          description: `Found ${warnings.length} warning(s) to review`,
        })
      }
    } catch (error: any) {
      console.error("[v0] Validation error:", error)
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("[v0] ========================================")
    console.log("[v0] SUBMIT BUTTON CLICKED - HANDLER EXECUTING")
    console.log("[v0] ========================================")
    console.log("[v0] Event type:", e.type)
    console.log("[v0] Event target:", e.target)
    console.log("[v0] Current validation result:", validationResult)
    console.log("[v0] Is paper filing required:", isPaperFilingRequired)
    console.log("[v0] Override validation:", overrideValidation)
    console.log("[v0] Loading state:", loading)
    console.log("[v0] Form data summary:", {
      employerName: formData.employerName,
      employeeFirstName: formData.employeeFirstName,
      employeeLastName: formData.employeeLastName,
      wages: formData.wages,
      taxYear: formData.taxYear,
    })

    if (loading) {
      console.log("[v0] Already submitting, ignoring duplicate click")
      return
    }

    if (isPaperFilingRequired) {
      console.log("[v0] Paper filing required, generating PDF package...")
      await handleGeneratePaperPackage()
      return
    }

    if (!validationResult) {
      console.log("[v0] No validation result yet, running validation first...")
      await handleValidateForm()
      toast({
        title: "Validation Complete",
        description: "Review the results and click 'Submit to IRS' again to file.",
      })
      return
    }

    if (validationResult?.errors?.length > 0 && !overrideValidation) {
      console.log("[v0] Validation errors present, asking user to confirm override")
      const errorCount = validationResult.errors.length
      const errorList = validationResult.errors.map((e: any) => `• ${e.field}: ${e.message}`).join("\n")

      const confirmed = window.confirm(
        `Found ${errorCount} validation error(s):\n\n${errorList}\n\nDo you want to submit anyway? The IRS may reject this filing.`,
      )

      if (!confirmed) {
        console.log("[v0] User cancelled submission")
        toast({
          title: "Submission Cancelled",
          description: "Please fix the validation errors and try again",
          variant: "destructive",
        })
        return
      }

      setOverrideValidation(true)
    }

    console.log("[v0] ========================================")
    console.log("[v0] STARTING W-2 SUBMISSION TO IRS")
    console.log("[v0] ========================================")
    console.log("[v0] Form data:", {
      employer: formData.employerName,
      employee: `${formData.employeeFirstName} ${formData.employeeLastName}`,
      wages: formData.wages,
      taxYear: formData.taxYear,
      filingType: filingType,
    })

    setLoading(true)

    try {
      console.log("[v0] Calling /api/filing/submit-w2...")
      console.log("[v0] Request payload:", {
        employerName: formData.employerName,
        employeeFirstName: formData.employeeFirstName,
        employeeLastName: formData.employeeLastName,
        wages: formData.wages,
        taxYear: formData.taxYear,
        filingType: filingType,
      })

      const response = await fetch("/api/filing/submit-w2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          filingType,
          overrideValidation: overrideValidation || validationResult?.errors?.length === 0,
        }),
      })

      console.log("[v0] API response received")
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response status text:", response.statusText)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      const contentType = response.headers.get("content-type")
      console.log("[v0] Content-Type:", contentType)

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] ❌ Non-JSON response from server:", text.substring(0, 500))
        throw new Error("Server returned an invalid response. Please try again.")
      }

      const result = await response.json()
      console.log("[v0] API response data:", result)

      if (result.isDemoMode) {
        console.log("[v0] Demo mode restriction")
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
        console.log("[v0] ========================================")
        console.log("[v0] ✅ W-2 SUBMITTED SUCCESSFULLY TO IRS!")
        console.log("[v0] ========================================")
        console.log("[v0] Submission ID:", result.submissionId)
        console.log("[v0] Filing ID:", result.filingId)
        console.log("[v0] Status:", result.status)

        toast({
          title: "✓ W-2 Submitted to IRS",
          description: `Submission ID: ${result.submissionId}. The IRS will process your filing within 24-48 hours.`,
          duration: 5000,
        })

        localStorage.removeItem("w2_draft")
        setValidationResult(null)
        setOverrideValidation(false)

        console.log("[v0] Redirecting in 2 seconds...")
        setTimeout(() => {
          if (result.filingId) {
            console.log("[v0] Redirecting to filing details:", result.filingId)
            router.push(`/dashboard/filing/${result.filingId}`)
          } else {
            console.log("[v0] Redirecting to filing list")
            router.push("/dashboard/filing")
          }
        }, 2000)
      } else {
        console.error("[v0] ❌ Submission failed:", result.error)
        throw new Error(result.error || "Failed to submit W-2 to IRS")
      }
    } catch (error: any) {
      console.error("[v0] ========================================")
      console.error("[v0] ❌ SUBMISSION ERROR")
      console.error("[v0] ========================================")
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)

      toast({
        title: "IRS Submission Failed",
        description: error.message || "Could not submit to TaxBandits. Please try again.",
        variant: "destructive",
        duration: 7000,
      })
    } finally {
      console.log("[v0] Resetting loading state")
      setLoading(false)
      setOverrideValidation(false)
    }
  }

  const handleGeneratePaperPackage = async () => {
    setLoading(true)

    try {
      console.log("[v0] Generating paper filing package...")

      const response = await fetch("/api/filing/generate-paper-package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "W-2",
          filingType,
          formData,
          taxYear: formData.taxYear,
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log("[v0] Paper package generated:", result.packageUrl)

        // Download the PDF
        const link = document.createElement("a")
        link.href = result.packageUrl
        link.download = `W2-Paper-Filing-Package-${formData.taxYear}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Paper Filing Package Generated",
          description: "Your W-2 forms and instructions have been downloaded. Print and mail to the IRS.",
        })

        // Save to filing history
        localStorage.removeItem("w2_draft")
      } else {
        throw new Error(result.error || "Failed to generate paper package")
      }
    } catch (error: any) {
      console.error("[v0] Paper package generation error:", error)
      toast({
        title: "Generation Failed",
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

  const selectedYear = Number.parseInt(formData.taxYear)
  const isEfileEligible = canEfile(selectedYear)
  const isPaperFilingRequired = !isEfileEligible

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
            <div className="space-y-4 mt-3">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Filing Type:</Label>
                <RadioGroup
                  value={filingType}
                  onValueChange={(value: "original" | "corrected") => setFilingType(value)}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:border-purple-500/30 transition-colors">
                    <RadioGroupItem value="original" id="original" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="original" className="font-medium cursor-pointer block mb-1">
                        Original W-2 (First-Time Filing)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use this if you're filing this W-2 for the first time, even if it's late. For example: filing a
                        2018 W-2 that was never submitted before.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:border-orange-500/30 transition-colors">
                    <RadioGroupItem value="corrected" id="corrected" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="corrected" className="font-medium cursor-pointer block mb-1">
                        Corrected W-2c (Fixing Previous Filing)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Use this only if you already filed this W-2 before and need to correct errors (wrong SSN,
                        incorrect amounts, etc.). Requires showing original vs corrected values.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm">Report employee wages and tax withholdings for</span>
                <Select
                  value={formData.taxYear}
                  onValueChange={(value) => setFormData({ ...formData, taxYear: value })}
                >
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

              {isPaperFilingRequired && filingType === "original" && (
                <Alert className="bg-orange-500/10 border-orange-500/20">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-600 font-semibold">
                    Late Original W-2 Filing - Paper Filing Required
                  </AlertTitle>
                  <AlertDescription className="text-sm space-y-2 mt-2">
                    <p>
                      <strong>Tax year {formData.taxYear}</strong> is beyond the IRS e-filing deadline (January 31st of
                      the following year).
                    </p>
                    <p>Since this is your first time filing this W-2, you'll need to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Complete the original Form W-2 (not W-2c)</li>
                      <li>Submit via paper mail to the IRS</li>
                      <li>Include a cover letter explaining the late filing</li>
                      <li>Be prepared for potential late filing penalties</li>
                    </ul>
                    <div className="mt-3 p-3 bg-background/50 rounded border border-orange-500/20">
                      <p className="font-semibold text-orange-600 mb-1">📦 Paper Filing Package - $29</p>
                      <p className="text-xs">
                        We'll generate pre-filled W-2 forms, cover letter template, IRS mailing labels, and filing
                        instructions. Premium service ($49) includes certified mail with tracking.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isPaperFilingRequired && filingType === "corrected" && (
                <Alert className="bg-orange-500/10 border-orange-500/20">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-600 font-semibold">
                    W-2c Correction - Paper Filing Required
                  </AlertTitle>
                  <AlertDescription className="text-sm space-y-2 mt-2">
                    <p>
                      <strong>Tax year {formData.taxYear}</strong> corrections must be paper filed (beyond e-filing
                      window).
                    </p>
                    <p>Since you're correcting a previously filed W-2, you'll need to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Complete Form W-2c (Corrected Wage and Tax Statement)</li>
                      <li>Show both original amounts (what was filed) and corrected amounts</li>
                      <li>Submit via paper mail to the IRS</li>
                      <li>Include explanation of what's being corrected and why</li>
                    </ul>
                    <div className="mt-3 p-3 bg-background/50 rounded border border-orange-500/20">
                      <p className="font-semibold text-orange-600 mb-1">📦 W-2c Correction Package - $35</p>
                      <p className="text-xs">
                        We'll generate pre-filled W-2c forms with before/after comparison, explanation letter, IRS
                        mailing labels, and instructions. Premium service ($49) includes certified mail with tracking.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isEfileEligible && filingType === "corrected" && (
                <Alert className="bg-blue-500/10 border-blue-500/20">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600 font-semibold">W-2c Correction - E-Filing Available</AlertTitle>
                  <AlertDescription className="text-sm space-y-2 mt-2">
                    <p>
                      You're filing a corrected W-2c for <strong>{formData.taxYear}</strong>. This correction is
                      eligible for e-filing.
                    </p>
                    <div className="mt-2 p-2 bg-blue-500/5 rounded border border-blue-500/10">
                      <p className="text-xs">
                        <strong>Note:</strong> W-2c requires you to provide both the original amounts (what was
                        previously filed) and the corrected amounts for all changed fields. We'll guide you through this
                        process.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isEfileEligible && filingType === "original" && (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600 font-semibold">E-Filing Available</AlertTitle>
                  <AlertDescription className="text-sm">
                    Tax year {formData.taxYear} is eligible for electronic filing. Complete the form below and we'll
                    submit it directly to the IRS.
                    <span className="block mt-2 text-purple-600 font-medium">
                      💡 Tip: Use the "Upload W-2" tab to auto-fill this form with AI!
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
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
                <Label htmlFor="employeeMiddleInitial">Middle Initial</Label>
                <Input
                  id="employeeMiddleInitial"
                  maxLength={1}
                  value={formData.employeeMiddleInitial}
                  onChange={(e) => setFormData({ ...formData, employeeMiddleInitial: e.target.value.toUpperCase() })}
                  placeholder="A"
                  className="uppercase"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="employeeLastName">Last Name *</Label>
                <Input
                  id="employeeLastName"
                  required
                  value={formData.employeeLastName}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsed = parseLastNameWithMiddleInitial(value)
                    if (parsed && parsed.middleInitial && !formData.employeeMiddleInitial) {
                      setFormData({
                        ...formData,
                        employeeLastName: parsed.lastName,
                        employeeMiddleInitial: parsed.middleInitial,
                      })
                    } else {
                      setFormData({ ...formData, employeeLastName: value })
                    }
                  }}
                  placeholder="Doe"
                />
              </div>
              <div className="md:col-span-2">
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
              <div>
                <Label htmlFor="dependentCareBenefits">Box 11: Dependent care benefits</Label>
                <Input
                  id="dependentCareBenefits"
                  type="number"
                  step="0.01"
                  value={formData.dependentCareBenefits}
                  onChange={(e) => setFormData({ ...formData, dependentCareBenefits: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="nonqualifiedPlans">Box 12: Nonqualified plans</Label>
                <Input
                  id="nonqualifiedPlans"
                  type="number"
                  step="0.01"
                  value={formData.nonqualifiedPlans}
                  onChange={(e) => setFormData({ ...formData, nonqualifiedPlans: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="box12Code">Box 12 Code</Label>
                <Input
                  id="box12Code"
                  value={formData.box12Code}
                  onChange={(e) => setFormData({ ...formData, box12Code: e.target.value })}
                  placeholder="Code"
                />
              </div>
              <div>
                <Label htmlFor="box12Amount">Box 12 Amount</Label>
                <Input
                  id="box12Amount"
                  type="number"
                  step="0.01"
                  value={formData.box12Amount}
                  onChange={(e) => setFormData({ ...formData, box12Amount: e.target.value })}
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

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-3">
              {validationResult.errors?.map((error: any, index: number) => (
                <Alert key={`error-${index}`} className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-600 font-semibold">Error: {error.field}</AlertTitle>
                  <AlertDescription className="text-sm">{error.message}</AlertDescription>
                </Alert>
              ))}

              {validationResult.warnings?.map((warning: any, index: number) => (
                <Alert key={`warning-${index}`} className="bg-orange-500/10 border-orange-500/20">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-600 font-semibold">Warning: {warning.field}</AlertTitle>
                  <AlertDescription className="text-sm">{warning.message}</AlertDescription>
                </Alert>
              ))}

              {validationResult.suggestions?.map((suggestion: any, index: number) => (
                <Alert key={`suggestion-${index}`} className="bg-blue-500/10 border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600 font-semibold">Suggestion: {suggestion.field}</AlertTitle>
                  <AlertDescription className="text-sm">{suggestion.message}</AlertDescription>
                </Alert>
              ))}

              {validationResult.valid && !validationResult.errors?.length && !validationResult.warnings?.length && (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600 font-semibold">All Clear!</AlertTitle>
                  <AlertDescription className="text-sm">
                    Your form passed all validation checks. Ready to submit!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-6 border-t border-border">
            <div className="flex gap-4">
              {/* Removed testTaxBanditsAPI button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateForm}
                disabled={validating || loading}
                className="flex-1 bg-transparent border-blue-500/20"
              >
                {validating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Validate Form
                  </>
                )}
              </Button>

              {isPaperFilingRequired && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPenaltyDialog(true)}
                  className="flex-1 bg-transparent border-orange-500/20"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Penalty Letter ($39)
                </Button>
              )}
            </div>

            <div className="flex gap-4">
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
                disabled={loading || savingDraft || validating}
                onClick={(e) => {
                  console.log("[v0] ========================================")
                  console.log("[v0] SUBMIT BUTTON CLICKED (onClick)")
                  console.log("[v0] ========================================")
                  console.log("[v0] Button disabled:", loading || savingDraft || validating)
                  console.log("[v0] Loading:", loading)
                  console.log("[v0] Saving draft:", savingDraft)
                  console.log("[v0] Validating:", validating)

                  if (loading || savingDraft || validating) {
                    console.log("[v0] Button is disabled, preventing submission")
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }

                  console.log("[v0] Button click will trigger form submission")
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg shadow-purple-500/30"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                {isPaperFilingRequired
                  ? "Generate Paper Filing Package"
                  : !validationResult
                    ? "Validate & Submit"
                    : validationResult?.errors?.length > 0
                      ? "Submit to IRS (Override Errors)"
                      : "Submit to IRS"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showPenaltyDialog && (
        <PenaltyAbatementDialog
          businessName={formData.employerName}
          ein={formData.employerEIN}
          taxYear={Number.parseInt(formData.taxYear)}
          formType="W-2"
        />
      )}
    </form>
  )
}
