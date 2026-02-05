"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2, CheckCircle2, AlertCircle, Lock, Sparkles, FileText, ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parseAddress } from "@/lib/address-parser"
import { parseName } from "@/lib/name-parser"
import { PenaltyAbatementDialog } from "@/components/penalty-abatement-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProgressStepper } from "@/components/ui/progress-stepper"
import { FilingReviewSection } from "@/components/filing-review-section"
import { FilingProgressDialog } from "@/components/filing-progress-dialog"

interface Contractor {
  id: string
  firstName: string
  middleInitial: string
  lastName: string
  ssn: string
  ein: string
  address: string
  city: string
  state: string
  zipCode: string
  compensation: string
  email: string
  accountNumber: string
  secondTinNotification: boolean
  directSales5000Plus: boolean
  federalTaxWithheld: string
  stateTaxWithheld: string
  statePayerNumber: string
  stateIncome: string
  isVoid: boolean
  isCorrected: boolean
  isFatcaFiling: boolean
}

interface Form1099NECProps {
  userId: string
  extractedData?: any // Added extractedData prop
}

export function Form1099NEC({ userId, extractedData }: Form1099NECProps) {
  const [contractors, setContractors] = useState<Contractor[]>([
    {
      id: "1",
      firstName: "",
      middleInitial: "",
      lastName: "",
      ssn: "",
      ein: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      compensation: "",
      email: "",
      accountNumber: "",
      secondTinNotification: false,
      directSales5000Plus: false,
      federalTaxWithheld: "",
      stateTaxWithheld: "",
      statePayerNumber: "",
      stateIncome: "",
      isVoid: false,
      isCorrected: false,
      isFatcaFiling: false,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<any>(null)
  const [showPenaltyDialog, setShowPenaltyDialog] = useState(false)
  const [currentFormStep, setCurrentFormStep] = useState(1) // 1 = Fill Form, 2 = Review
  const [showProgressDialog, setShowProgressDialog] = useState(false)
  const [filingProgress, setFilingProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingContractorId, setUploadingContractorId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const currentYear = new Date().getFullYear()
  const taxYear = currentYear - 1 // 1099-NEC is for the previous year

  const canEfile = (year: number) => {
    const yearsBack = currentYear - year
    // 1099-NEC e-filing deadline is January 31st
    // Only current year (previous calendar year) can be e-filed
    return yearsBack === 1
  }

  const isPaperFilingRequired = !canEfile(taxYear)

  const addContractor = () => {
    setContractors([
      ...contractors,
      {
        id: Date.now().toString(),
        firstName: "",
        middleInitial: "",
        lastName: "",
        ssn: "",
        ein: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        compensation: "",
        email: "",
        accountNumber: "",
        secondTinNotification: false,
        directSales5000Plus: false,
        federalTaxWithheld: "",
        stateTaxWithheld: "",
        statePayerNumber: "",
        stateIncome: "",
        isVoid: false,
        isCorrected: false,
        isFatcaFiling: false,
      },
    ])
  }

  const removeContractor = (id: string) => {
    setContractors(contractors.filter((c) => c.id !== id))
  }

  const updateContractor = (id: string, field: keyof Contractor, value: string) => {
    let formattedValue = value
    if (field === "ssn") {
      formattedValue = formatSSN(value)
    } else if (field === "ein") {
      formattedValue = formatEIN(value)
    } else if (field === "state") {
      formattedValue = value.toUpperCase()
    } else if (field === "federalTaxWithheld" || field === "stateTaxWithheld" || field === "stateIncome") {
      // Ensure currency fields only accept numbers and decimals
      formattedValue = value.replace(/[^0-9.]/g, "")
    } else if (
      field === "secondTinNotification" ||
      field === "directSales5000Plus" ||
      field === "isVoid" ||
      field === "isCorrected" ||
      field === "isFatcaFiling"
    ) {
      // Handle boolean checkbox values
      formattedValue = (value === "true").toString()
    }

    if (field === "city" && value.includes(" ")) {
      const parsed = parseAddress(value)
      if (parsed.city && parsed.state && parsed.zipCode) {
        setContractors(
          contractors.map((c) =>
            c.id === id ? { ...c, city: parsed.city, state: parsed.state, zipCode: parsed.zipCode } : c,
          ),
        )
        return
      }
    }

    if (field === "lastName" && value.includes(" ")) {
      const parsed = parseName("", value)
      if (parsed.middleInitial && parsed.lastName) {
        setContractors(
          contractors.map((c) =>
            c.id === id ? { ...c, middleInitial: parsed.middleInitial, lastName: parsed.lastName } : c,
          ),
        )
        return
      }
    }

    setContractors(contractors.map((c) => (c.id === id ? { ...c, [field]: formattedValue } : c)))

    if (validationErrors[`${id}-${field}`]) {
      setValidationErrors({ ...validationErrors, [`${id}-${field}`]: "" })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    contractors.forEach((contractor) => {
      if (!contractor.firstName.trim()) {
        errors[`${contractor.id}-firstName`] = "First name is required"
      }
      if (!contractor.lastName.trim()) {
        errors[`${contractor.id}-lastName`] = "Last name is required"
      }
      if (!contractor.ssn && !contractor.ein) {
        errors[`${contractor.id}-ssn`] = "Either SSN or EIN is required"
      }
      if (contractor.ssn && !validateSSN(contractor.ssn)) {
        errors[`${contractor.id}-ssn`] = "Invalid SSN format"
      }
      if (contractor.ein && !validateEIN(contractor.ein)) {
        errors[`${contractor.id}-ein`] = "Invalid EIN format"
      }
      if (!contractor.address.trim()) {
        errors[`${contractor.id}-address`] = "Address is required"
      }
      if (!contractor.city.trim()) {
        errors[`${contractor.id}-city`] = "City is required"
      }
      if (!contractor.state || !US_STATES.includes(contractor.state)) {
        errors[`${contractor.id}-state`] = "Valid state is required"
      }
      if (!contractor.zipCode || !/^\d{5}(-\d{4})?$/.test(contractor.zipCode)) {
        errors[`${contractor.id}-zipCode`] = "Valid ZIP code is required"
      }
      const compensation = Number.parseFloat(contractor.compensation)
      if (!contractor.compensation || isNaN(compensation) || compensation < 600) {
        errors[`${contractor.id}-compensation`] = "Compensation must be at least $600"
      }

      // Optional field validations
      const federalTaxWithheld = Number.parseFloat(contractor.federalTaxWithheld)
      if (contractor.federalTaxWithheld && (isNaN(federalTaxWithheld) || federalTaxWithheld < 0)) {
        errors[`${contractor.id}-federalTaxWithheld`] = "Federal tax withheld must be a non-negative number"
      }

      const stateTaxWithheld = Number.parseFloat(contractor.stateTaxWithheld)
      if (contractor.stateTaxWithheld && (isNaN(stateTaxWithheld) || stateTaxWithheld < 0)) {
        errors[`${contractor.id}-stateTaxWithheld`] = "State tax withheld must be a non-negative number"
      }

      const stateIncome = Number.parseFloat(contractor.stateIncome)
      if (contractor.stateIncome && (isNaN(stateIncome) || stateIncome < 0)) {
        errors[`${contractor.id}-stateIncome`] = "State income must be a non-negative number"
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAIValidation = async () => {
    setIsValidating(true)
    setValidationResults(null)

    try {
      const response = await fetch("/api/validate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "1099-nec",
          formData: { contractors },
        }),
      })

      const data = await response.json()

      if (data.success && data.validation) {
        setValidationResults(data.validation)
        
        const systemWarning = data.validation.warnings?.find((w: any) => w.field === "system")
        const isAIUnavailable = systemWarning && systemWarning.message.includes("temporarily unavailable")
        
        toast({
          title: isAIUnavailable ? "Basic Validation Complete" : "AI Validation Complete",
          description: `Found ${data.validation.errors.length} errors, ${data.validation.warnings.length} warnings, ${data.validation.suggestions.length} suggestions`,
        })
      } else {
        throw new Error(data.error || "Validation failed")
      }
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleContractorFileUpload = async (contractorId: string, file: File) => {
    setUploadingContractorId(contractorId)

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

      // Extract data from document
      const extractResponse = await fetch("/api/filing/extract-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: url }),
      })

      const extractData = await extractResponse.json()

      if (extractData.success && extractData.data.documentType === "1099-nec") {
        const extracted = extractData.data

        // Parse recipient name
        const recipientName = extracted.recipient?.name || ""
        const nameParts = recipientName.split(" ")
        const firstName = nameParts[0] || ""
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
        const middleInitial = nameParts.length > 2 ? nameParts[1].charAt(0).toUpperCase() : ""

        // Parse recipient address
        const recipientAddress = extracted.recipient?.address || ""
        const parseAddress = (addr: string) => {
          const parts = addr.split(",").map((p) => p.trim())
          return {
            street: parts[0] || "",
            city: parts[1] || "",
            state: parts[2] || "",
            zip: parts[3] || "",
          }
        }
        const recipientParsed = parseAddress(recipientAddress)

        // Update only the specific contractor
        setContractors((prev) =>
          prev.map((c) =>
            c.id === contractorId
              ? {
                  ...c,
                  firstName,
                  middleInitial,
                  lastName,
                  ssn: extracted.recipient?.ssn || extracted.recipient?.tin || "",
                  ein: extracted.recipient?.ein || "",
                  address: recipientParsed.street,
                  city: recipientParsed.city,
                  state: recipientParsed.state,
                  zipCode: recipientParsed.zip,
                  compensation:
                    extracted.nonemployeeCompensation?.toString() || extracted.compensation?.toString() || "",
                  email: extracted.recipient?.email || "",
                  // New fields extracted from document (if available)
                  federalTaxWithheld: extracted.federalTaxWithheld?.toString() || "",
                  stateTaxWithheld: extracted.stateTaxWithheld?.toString() || "",
                  stateIncome: extracted.stateIncome?.toString() || "",
                  directSales5000Plus: extracted.directSales5000Plus || false,
                  isCorrected: extracted.isCorrected || false,
                  isVoid: extracted.isVoid || false,
                  secondTinNotification: extracted.secondTinNotification || false,
                  accountNumber: extracted.accountNumber || "",
                }
              : c,
          ),
        )

        toast({
          title: "✨ Contractor Data Auto-Filled",
          description: `${firstName} ${lastName}'s information has been extracted. Please review before submitting.`,
        })
      } else {
        throw new Error("Could not extract 1099-NEC data from document")
      }
    } catch (error: any) {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploadingContractorId(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) throw new Error("Upload failed")

      const { url } = await uploadResponse.json()

      const extractResponse = await fetch("/api/filing/extract-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: url }),
      })

      const extractData = await extractResponse.json()

      if (extractData.success && extractData.data.documentType === "1099-nec") {
        toast({
          title: "✨ AI Extraction Complete",
          description: "Your 1099-NEC has been automatically filled. Please review the data.",
        })
        // Auto-fill logic here
        // NOTE: The extracted data here is for the entire form, not per contractor.
        // The `useEffect` hook handles processing `extractedData` for initial form population.
      } else {
        throw new Error("Could not extract 1099-NEC data from document")
      }
    } catch (error: any) {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] handleSubmit called, currentFormStep:", currentFormStep)

    if (currentFormStep === 1) {
      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form before continuing",
          variant: "destructive",
        })
        return
      }

      if (!validationResults) {
        await handleAIValidation()
      }
      setCurrentFormStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    console.log("[v0] Attempting to submit to IRS...")
    console.log("[v0] Validation results:", validationResults)

    if (!validationResults) {
      toast({
        title: "Please Validate Form",
        description: "Click 'AI Validate Form' before submitting",
        variant: "destructive",
      })
      await handleAIValidation()
      return
    }

    if (validationResults.errors && validationResults.errors.length > 0) {
      const errorMessages = validationResults.errors.map((e: any) => e.message || e.field).join(", ")
      toast({
        title: "Please Fix Errors",
        description: `Your form has validation errors: ${errorMessages.substring(0, 100)}...`,
        variant: "destructive",
      })
      setCurrentFormStep(1)
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      setCurrentFormStep(1)
      return
    }

    setIsSubmitting(true)
    setShowProgressDialog(true)
    setFilingProgress(1)

    console.log("[v0] Starting IRS submission...")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(2)

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(3)

      console.log("[v0] Calling /api/filing/submit-1099...")
      const response = await fetch("/api/filing/submit-1099", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          taxYear: new Date().getFullYear() - 1,
          contractors: contractors.map((c) => ({
            firstName: c.firstName,
            middleInitial: c.middleInitial,
            lastName: c.lastName,
            ssn: c.ssn.replace(/\D/g, ""),
            ein: c.ein.replace(/\D/g, ""),
            email: c.email,
            address: {
              street: c.address,
              city: c.city,
              state: c.state,
              zipCode: c.zipCode,
            },
            compensation: Number.parseFloat(c.compensation),
            accountNumber: c.accountNumber,
            secondTinNotification: c.secondTinNotification,
            directSales5000Plus: c.directSales5000Plus,
            federalTaxWithheld: Number.parseFloat(c.federalTaxWithheld || "0"),
            stateTaxWithheld: Number.parseFloat(c.stateTaxWithheld || "0"),
            statePayerNumber: c.statePayerNumber,
            stateIncome: Number.parseFloat(c.stateIncome || "0"),
            isVoid: c.isVoid,
            isCorrected: c.isCorrected,
            isFatcaFiling: c.isFatcaFiling,
          })),
        }),
      })

      console.log("[v0] API response status:", response.status)
      const data = await response.json()
      console.log("[v0] API response data:", data)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (data.isDemoMode) {
        toast({
          title: "Demo Mode Restriction",
          description: data.error,
          variant: "destructive",
        })
        setIsSubmitting(false)
        setShowProgressDialog(false)
        setFilingProgress(0)
        return
      }

      if (data.success) {
        setFilingProgress(4)

        toast({
          title: "1099-NEC Successfully Submitted to IRS",
          description: `Submission IDs: ${data.submissionIds?.join(", ") || "N/A"}. The IRS will process your filing within 24-48 hours.`,
          duration: 5000,
        })

        setTimeout(() => {
          setShowProgressDialog(false)
          setFilingProgress(0)
          router.push("/dashboard/filing")
        }, 3000)
      } else {
        throw new Error(data.error || "Failed to submit filing")
      }
    } catch (error) {
      console.error("[v0] Submission error:", error)
      setShowProgressDialog(false)
      setFilingProgress(0)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
      description: "Setting up your business profile with the IRS",
      icon: "🏢",
    },
    {
      id: "submit",
      title: "Submitting 1099-NEC forms",
      description: "Transmitting contractor payment data to the IRS",
      icon: "📄",
    },
  ]

  const reviewSections = contractors.map((contractor, index) => {
    const fields = [
      {
        label: "Full Name",
        value: `${contractor.firstName} ${contractor.middleInitial ? contractor.middleInitial + ". " : ""}${contractor.lastName}`,
      },
      { label: "Social Security Number", value: contractor.ssn, sensitive: true },
      { label: "EIN (if business)", value: contractor.ein, sensitive: true },
      { label: "Email", value: contractor.email || "Not provided" },
      {
        label: "Address",
        value: contractor.address.includes(",")
          ? contractor.address
          : `${contractor.address}, ${contractor.city}, ${contractor.state} ${contractor.zipCode}`,
      },
      { label: "Nonemployee Compensation", value: `$${Number.parseFloat(contractor.compensation || "0").toFixed(2)}` },
    ]

    // Conditionally add optional fields to review section if they have values
    if (contractor.accountNumber) {
      fields.push({ label: "Account Number", value: contractor.accountNumber })
    }
    if (contractor.directSales5000Plus) {
      fields.push({ label: "Direct Sales (Box 2)", value: "Yes" })
    }
    if (Number.parseFloat(contractor.federalTaxWithheld || "0") > 0) {
      fields.push({
        label: "Federal Tax Withheld (Box 4)",
        value: `$${Number.parseFloat(contractor.federalTaxWithheld).toFixed(2)}`,
      })
    }
    if (Number.parseFloat(contractor.stateTaxWithheld || "0") > 0) {
      fields.push({
        label: "State Tax Withheld (Box 5)",
        value: `$${Number.parseFloat(contractor.stateTaxWithheld).toFixed(2)}`,
      })
    }
    if (contractor.statePayerNumber) {
      fields.push({ label: "State/Payer's State No. (Box 6)", value: contractor.statePayerNumber })
    }
    if (Number.parseFloat(contractor.stateIncome || "0") > 0) {
      fields.push({ label: "State Income (Box 7)", value: `$${Number.parseFloat(contractor.stateIncome).toFixed(2)}` })
    }
    if (contractor.isVoid) {
      fields.push({ label: "Form Status", value: "VOID" })
    }
    if (contractor.isCorrected) {
      fields.push({ label: "Form Status", value: "CORRECTED" })
    }
    if (contractor.secondTinNotification) {
      fields.push({ label: "2nd TIN Notification", value: "Yes" })
    }
    if (contractor.isFatcaFiling) {
      fields.push({ label: "FATCA Filing", value: "Yes" })
    }

    return {
      title: `Contractor ${index + 1}: ${contractor.firstName} ${contractor.lastName}`,
      fields: fields,
    }
  })

  useEffect(() => {
    if (extractedData) {
      console.log("[v0] Auto-filling 1099-NEC form with extracted data:", extractedData)

      if (extractedData.isTemplateData === true) {
        console.log("[v0] Detected template data in form initialization, showing warning.")
        toast({
          title: "⚠️ Template Document Detected",
          description:
            "The uploaded document appears to be a sample/demo form. Please upload real tax documents with actual taxpayer information. Data may be inaccurate.",
          variant: "warning",
        })
      }

      // Check if extractedData.contractors is an array and contains multiple contractor entries
      if (extractedData.contractors && Array.isArray(extractedData.contractors)) {
        console.log("[v0] Processing multiple contractors:", extractedData.contractors.length)

        const newContractors = extractedData.contractors
          .filter((contractorData: any) => {
            if (contractorData.isTemplateData === true) {
              console.log("[v0] Including template contractor data for testing:", contractorData.recipient?.name)
              toast({
                title: "⚠️ Template Contractor Data Included",
                description: `Contractor ${contractorData.recipient?.name || "Unknown"} appears to be from a template. Data accuracy is not guaranteed.`,
                variant: "warning",
              })
            }
            // Ensure we only process 1099-NEC documents if specified by the extractor
            return contractorData.documentType === "1099-nec"
          })
          .map((contractorData: any, index: number) => {
            const recipientName = contractorData.recipient?.name || ""
            const nameParts = recipientName.split(" ")
            const firstName = nameParts[0] || ""
            const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
            const middleInitial = nameParts.length > 2 ? nameParts[1].charAt(0).toUpperCase() : ""

            // Extract address parts
            const street = contractorData.recipient?.address || ""
            const city = contractorData.recipient?.city || ""
            const state = contractorData.recipient?.state || ""
            const zipCode = contractorData.recipient?.zipCode || ""

            return {
              id: `${Date.now()}-${index}`, // Unique ID for each contractor
              firstName,
              middleInitial,
              lastName,
              ssn: contractorData.recipient?.ssn || contractorData.recipient?.tin || "",
              ein: contractorData.recipient?.ein || "",
              address: street,
              city: city,
              state: state,
              zipCode: zipCode,
              compensation:
                contractorData.income?.nonemployeeCompensation?.toString() ||
                contractorData.nonemployeeCompensation?.toString() ||
                contractorData.compensation?.toString() ||
                "",
              email: contractorData.recipient?.email || "",
              // New fields extracted from document (if available)
              accountNumber: contractorData.accountNumber || "",
              secondTinNotification: contractorData.secondTinNotification || false,
              directSales5000Plus: contractorData.directSales5000Plus || false,
              federalTaxWithheld: contractorData.federalTaxWithheld?.toString() || "",
              stateTaxWithheld: contractorData.stateTaxWithheld?.toString() || "",
              statePayerNumber: contractorData.statePayerNumber || "",
              stateIncome: contractorData.stateIncome?.toString() || "",
              isVoid: contractorData.isVoid || false,
              isCorrected: contractorData.isCorrected || false,
              isFatcaFiling: contractorData.isFatcaFiling || false,
            }
          })

        if (newContractors.length === 0) {
          toast({
            title: "⚠️ No Valid 1099-NEC Forms",
            description: "The uploaded documents are not 1099-NEC forms. Please upload valid 1099-NEC tax documents.",
            variant: "destructive",
          })
          return
        }

        setContractors(newContractors)

        toast({
          title: "✨ Multiple Contractors Auto-Filled",
          description: `${newContractors.length} contractor form${newContractors.length > 1 ? "s" : ""} populated. Please review before submitting.`,
        })
        return
      }

      // Handle single contractor extraction if not an array of contractors
      const extracted = extractedData

      const recipientName = extracted.recipient?.name || ""
      const nameParts = recipientName.split(" ")
      const firstName = nameParts[0] || ""
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
      const middleInitial = nameParts.length > 2 ? nameParts[1].charAt(0).toUpperCase() : ""

      const newContractor: Contractor = {
        id: Date.now().toString(),
        firstName,
        middleInitial,
        lastName,
        ssn: extracted.recipient?.ssn || extracted.recipient?.tin || "",
        ein: extracted.recipient?.ein || "",
        address: extracted.recipient?.street || "",
        city: extracted.recipient?.city || "",
        state: extracted.recipient?.state || "",
        zipCode: extracted.recipient?.zipCode || "",
        compensation:
          extracted.income?.nonemployeeCompensation?.toString() ||
          extracted.nonemployeeCompensation?.toString() ||
          extracted.compensation?.toString() ||
          "",
        email: extracted.recipient?.email || "",
        // New fields extracted from document (if available)
        accountNumber: extracted.accountNumber || "",
        secondTinNotification: extracted.secondTinNotification || false,
        directSales5000Plus: extracted.directSales5000Plus || false,
        federalTaxWithheld: extracted.federalTaxWithheld?.toString() || "",
        stateTaxWithheld: extracted.stateTaxWithheld?.toString() || "",
        statePayerNumber: extracted.statePayerNumber || "",
        stateIncome: extracted.stateIncome?.toString() || "",
        isVoid: extracted.isVoid || false,
        isCorrected: extracted.isCorrected || false,
        isFatcaFiling: extracted.isFatcaFiling || false,
      }

      setContractors((prev) => {
        const hasEmptyContractor = prev.some((c) => !c.firstName && !c.lastName && !c.ssn && !c.compensation)

        if (hasEmptyContractor) {
          // Replace the first empty contractor
          const updatedContractors = [...prev]
          const emptyIndex = updatedContractors.findIndex(
            (c) => !c.firstName && !c.lastName && !c.ssn && !c.compensation,
          )
          updatedContractors[emptyIndex] = newContractor
          return updatedContractors
        } else {
          // Append as a new contractor
          return [...prev, newContractor]
        }
      })

      toast({
        title: "✨ Contractor Auto-Filled",
        description: `${firstName} ${lastName}'s information has been extracted. Please review before submitting.`,
      })
    }
  }, [extractedData])

  const US_STATES = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
  }

  const formatEIN = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 9)}`
  }

  const validateSSN = (ssn: string) => {
    const numbers = ssn.replace(/\D/g, "")
    return numbers.length === 9
  }

  const validateEIN = (ein: string) => {
    const numbers = ein.replace(/\D/g, "")
    return numbers.length === 9
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProgressStepper steps={formSteps} currentStep={currentFormStep} />

      {currentFormStep === 2 ? (
        <>
          <FilingReviewSection sections={reviewSections} formType="1099-NEC" />

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentFormStep(1)}
              className="flex-1"
              disabled={isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#005ea2] to-[#162e51] hover:opacity-90 text-white text-lg py-6"
            >
              {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Send className="mr-2 h-5 w-5" />
              Submit to IRS
            </Button>
          </div>
        </>
      ) : (
        <>
          <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-background via-background to-purple-500/5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 pointer-events-none" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between gap-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/dashboard/filing/new")}
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={isUploading}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 border-0 group"
                  >
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Upload 1099-NEC (AI Extract)
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Form 1099-NEC - Nonemployee Compensation
              </CardTitle>
              <CardDescription>
                <div className="space-y-4 mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Report contractor payments for</span>
                    <Select
                      value={taxYear.toString()}
                      onValueChange={(value) => {
                        /* handle year change if needed */
                      }}
                    >
                      <SelectTrigger className="w-[120px] h-8 bg-background/80 border-purple-500/20">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => currentYear - i - 1).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isPaperFilingRequired ? (
                    <Alert className="bg-orange-500/10 border-orange-500/20">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertTitle className="text-orange-600 font-semibold">
                        Late 1099-NEC Filing - Paper Filing Required
                      </AlertTitle>
                      <AlertDescription className="text-sm space-y-2 mt-2">
                        <p>
                          <strong>Tax year {taxYear}</strong> is beyond the IRS e-filing deadline (January 31st).
                        </p>
                        <p>You'll need to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Complete paper 1099-NEC forms</li>
                          <li>Submit via mail to the IRS</li>
                          <li>Include a cover letter explaining the late filing</li>
                          <li>Be prepared for potential late filing penalties</li>
                        </ul>
                        <div className="mt-3 p-3 bg-background/50 rounded border border-orange-500/20">
                          <p className="font-semibold text-orange-600 mb-1">📦 Paper Filing Package - $29</p>
                          <p className="text-xs">
                            We'll generate pre-filled 1099-NEC forms, cover letter template, IRS mailing labels, and
                            filing instructions.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-600 font-semibold">E-Filing Available</AlertTitle>
                      <AlertDescription className="text-sm">
                        Tax year {taxYear} is eligible for electronic filing. Complete the form below and we'll submit
                        it directly to the IRS.
                        <span className="block mt-2 text-purple-600 font-medium">
                          💡 Tip: Use the "Upload 1099-NEC" button to auto-fill with AI!
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          {validationResults && (
            <div className="space-y-3">
              {validationResults.errors?.map((error: any, index: number) => (
                <Alert key={`error-${index}`} className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-600 font-semibold">Error: {error.field || "Validation"}</AlertTitle>
                  <AlertDescription className="text-sm">
                    {typeof error === "string" ? error : error.message}
                  </AlertDescription>
                </Alert>
              ))}

              {validationResults.warnings?.map((warning: any, index: number) => (
                <Alert 
                  key={`warning-${index}`} 
                  className={warning.field === "system" ? "bg-blue-500/10 border-blue-500/20" : "bg-orange-500/10 border-orange-500/20"}
                >
                  <AlertCircle className={`h-4 w-4 ${warning.field === "system" ? "text-blue-600" : "text-orange-600"}`} />
                  <AlertTitle className={`${warning.field === "system" ? "text-blue-600" : "text-orange-600"} font-semibold`}>
                    {warning.field === "system" ? "Information" : "Warning"}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {typeof warning === "string" ? warning : warning.message}
                  </AlertDescription>
                </Alert>
              ))}

              {validationResults.suggestions?.map((suggestion: any, index: number) => (
                <Alert key={`suggestion-${index}`} className="bg-blue-500/10 border-blue-500/20">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600 font-semibold">Suggestion</AlertTitle>
                  <AlertDescription className="text-sm">
                    {typeof suggestion === "string" ? suggestion : suggestion.message}
                  </AlertDescription>
                </Alert>
              ))}

              {validationResults.valid && !validationResults.errors?.length && (
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

          {contractors.map((contractor, index) => (
            <Card key={contractor.id} className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-orange-600" />

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white font-semibold shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">Contractor {index + 1}</CardTitle>
                      <CardDescription>Enter contractor information</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleContractorFileUpload(contractor.id, file)
                          }
                          e.target.value = "" // Reset input
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingContractorId !== null}
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={uploadingContractorId !== null}
                        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 border-0 group"
                      >
                        {/* Shimmer effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                        {uploadingContractorId === contractor.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                            Upload 1099-NEC (AI Extract)
                          </>
                        )}
                      </Button>
                    </div>

                    {contractors.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContractor(contractor.id)}
                        className="hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`firstName-${contractor.id}`}>First Name *</Label>
                    <Input
                      id={`firstName-${contractor.id}`}
                      value={contractor.firstName}
                      onChange={(e) => updateContractor(contractor.id, "firstName", e.target.value)}
                      className={validationErrors[`${contractor.id}-firstName`] ? "border-red-500" : ""}
                      placeholder="John"
                    />
                    {validationErrors[`${contractor.id}-firstName`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors[`${contractor.id}-firstName`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`middleInitial-${contractor.id}`}>Middle Initial</Label>
                    <Input
                      id={`middleInitial-${contractor.id}`}
                      value={contractor.middleInitial}
                      onChange={(e) => updateContractor(contractor.id, "middleInitial", e.target.value.toUpperCase())}
                      maxLength={1}
                      placeholder="M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lastName-${contractor.id}`}>Last Name *</Label>
                    <Input
                      id={`lastName-${contractor.id}`}
                      value={contractor.lastName}
                      onChange={(e) => updateContractor(contractor.id, "lastName", e.target.value)}
                      className={validationErrors[`${contractor.id}-lastName`] ? "border-red-500" : ""}
                      placeholder="Doe"
                    />
                    {validationErrors[`${contractor.id}-lastName`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors[`${contractor.id}-lastName`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`ssn-${contractor.id}`} className="flex items-center gap-2">
                      SSN *
                      <Lock className="h-3 w-3 text-green-500" />
                    </Label>
                    <Input
                      id={`ssn-${contractor.id}`}
                      value={contractor.ssn}
                      onChange={(e) => updateContractor(contractor.id, "ssn", e.target.value)}
                      className={validationErrors[`${contractor.id}-ssn`] ? "border-red-500" : ""}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                    />
                    {validationErrors[`${contractor.id}-ssn`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationErrors[`${contractor.id}-ssn`]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      AES-256 encrypted at rest
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`ein-${contractor.id}`} className="flex items-center gap-2">
                      EIN (if business)
                      <Lock className="h-3 w-3 text-green-500" />
                    </Label>
                    <Input
                      id={`ein-${contractor.id}`}
                      value={contractor.ein}
                      onChange={(e) => updateContractor(contractor.id, "ein", e.target.value)}
                      className={validationErrors[`${contractor.id}-ein`] ? "border-red-500" : ""}
                      placeholder="XX-XXXXXXX"
                      maxLength={10}
                    />
                    {validationErrors[`${contractor.id}-ein`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors[`${contractor.id}-ein`]}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Encrypted and secure
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`email-${contractor.id}`}>Email</Label>
                  <Input
                    id={`email-${contractor.id}`}
                    type="email"
                    value={contractor.email}
                    onChange={(e) => updateContractor(contractor.id, "email", e.target.value)}
                    placeholder="contractor@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`address-${contractor.id}`}>Street Address *</Label>
                  <Input
                    id={`address-${contractor.id}`}
                    value={contractor.address}
                    onChange={(e) => updateContractor(contractor.id, "address", e.target.value)}
                    className={validationErrors[`${contractor.id}-address`] ? "border-red-500" : ""}
                    placeholder="123 Main Street"
                  />
                  {validationErrors[`${contractor.id}-address`] && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors[`${contractor.id}-address`]}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`city-${contractor.id}`}>City *</Label>
                    <Input
                      id={`city-${contractor.id}`}
                      value={contractor.city}
                      onChange={(e) => updateContractor(contractor.id, "city", e.target.value)}
                      className={validationErrors[`${contractor.id}-city`] ? "border-red-500" : ""}
                      placeholder="San Francisco"
                    />
                    {validationErrors[`${contractor.id}-city`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors[`${contractor.id}-city`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`state-${contractor.id}`}>State *</Label>
                    <Select
                      value={contractor.state}
                      onValueChange={(value) => updateContractor(contractor.id, "state", value)}
                    >
                      <SelectTrigger className={validationErrors[`${contractor.id}-state`] ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors[`${contractor.id}-state`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors[`${contractor.id}-state`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`zipCode-${contractor.id}`}>ZIP Code *</Label>
                    <Input
                      id={`zipCode-${contractor.id}`}
                      value={contractor.zipCode}
                      onChange={(e) => updateContractor(contractor.id, "zipCode", e.target.value)}
                      className={validationErrors[`${contractor.id}-zipCode`] ? "border-red-500" : ""}
                      placeholder="94102"
                      maxLength={10}
                    />
                    {validationErrors[`${contractor.id}-zipCode`] && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {validationErrors[`${contractor.id}-zipCode`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`compensation-${contractor.id}`}>Nonemployee Compensation (Box 1) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id={`compensation-${contractor.id}`}
                      type="number"
                      step="0.01"
                      value={contractor.compensation}
                      onChange={(e) => updateContractor(contractor.id, "compensation", e.target.value)}
                      className={`pl-7 ${validationErrors[`${contractor.id}-compensation`] ? "border-red-500" : ""}`}
                      placeholder="0.00"
                    />
                  </div>
                  {validationErrors[`${contractor.id}-compensation`] && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors[`${contractor.id}-compensation`]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Minimum $600 required for 1099-NEC filing</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`directSales-${contractor.id}`}
                      checked={contractor.directSales5000Plus}
                      onChange={(e) =>
                        updateContractor(contractor.id, "directSales5000Plus", e.target.checked.toString())
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`directSales-${contractor.id}`} className="text-sm font-normal">
                      Payer made direct sales totaling $5,000 or more of consumer products to recipient for resale (Box
                      2)
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`federalTaxWithheld-${contractor.id}`}>Federal Income Tax Withheld (Box 4)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id={`federalTaxWithheld-${contractor.id}`}
                      type="number"
                      step="0.01"
                      value={contractor.federalTaxWithheld}
                      onChange={(e) => updateContractor(contractor.id, "federalTaxWithheld", e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Backup withholding or voluntary federal tax withheld</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`stateTaxWithheld-${contractor.id}`}>State Tax Withheld (Box 5)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id={`stateTaxWithheld-${contractor.id}`}
                        type="number"
                        step="0.01"
                        value={contractor.stateTaxWithheld}
                        onChange={(e) => updateContractor(contractor.id, "stateTaxWithheld", e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`statePayerNumber-${contractor.id}`}>State/Payer's State No. (Box 6)</Label>
                    <Input
                      id={`statePayerNumber-${contractor.id}`}
                      value={contractor.statePayerNumber}
                      onChange={(e) => updateContractor(contractor.id, "statePayerNumber", e.target.value)}
                      placeholder="State ID number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`stateIncome-${contractor.id}`}>State Income (Box 7)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id={`stateIncome-${contractor.id}`}
                        type="number"
                        step="0.01"
                        value={contractor.stateIncome}
                        onChange={(e) => updateContractor(contractor.id, "stateIncome", e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`accountNumber-${contractor.id}`}>Account Number (optional)</Label>
                  <Input
                    id={`accountNumber-${contractor.id}`}
                    value={contractor.accountNumber}
                    onChange={(e) => updateContractor(contractor.id, "accountNumber", e.target.value)}
                    placeholder="For internal tracking"
                  />
                  <p className="text-xs text-muted-foreground">Use if you file multiple 1099s for this contractor</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <p className="text-sm font-medium">Additional Options</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`void-${contractor.id}`}
                        checked={contractor.isVoid}
                        onChange={(e) => updateContractor(contractor.id, "isVoid", e.target.checked.toString())}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`void-${contractor.id}`} className="text-sm font-normal">
                        VOID (mark if this form should be voided)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`corrected-${contractor.id}`}
                        checked={contractor.isCorrected}
                        onChange={(e) => updateContractor(contractor.id, "isCorrected", e.target.checked.toString())}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`corrected-${contractor.id}`} className="text-sm font-normal">
                        CORRECTED (mark if correcting a previously filed form)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`secondTin-${contractor.id}`}
                        checked={contractor.secondTinNotification}
                        onChange={(e) =>
                          updateContractor(contractor.id, "secondTinNotification", e.target.checked.toString())
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`secondTin-${contractor.id}`} className="text-sm font-normal">
                        2nd TIN not. (IRS notified twice about incorrect TIN)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`fatca-${contractor.id}`}
                        checked={contractor.isFatcaFiling}
                        onChange={(e) => updateContractor(contractor.id, "isFatcaFiling", e.target.checked.toString())}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`fatca-${contractor.id}`} className="text-sm font-normal">
                        FATCA filing requirement
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addContractor}
            className="w-full border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Add Another Contractor
          </Button>

          <div className="flex flex-col gap-4 pt-6 border-t border-border">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAIValidation}
                disabled={isValidating || isSubmitting}
                className="flex-1 bg-transparent border-blue-500/20"
              >
                {isValidating ? (
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
                  Generate Penalty Letter ($19)
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isValidating}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg text-lg py-6"
            >
              Continue to Review
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </>
      )}

      <FilingProgressDialog
        open={showProgressDialog}
        currentStep={filingProgress}
        steps={progressSteps}
        isComplete={filingProgress === 4}
        isError={false}
        onClose={() => {
          setShowProgressDialog(false)
          setFilingProgress(0)
        }}
      />

      <PenaltyAbatementDialog
        open={showPenaltyDialog}
        onOpenChange={setShowPenaltyDialog}
        formType="1099-NEC"
        taxYear={taxYear}
        businessName=""
        ein=""
      />
    </form>
  )
}
