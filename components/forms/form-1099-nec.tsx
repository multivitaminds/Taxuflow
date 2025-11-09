"use client"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  FileText,
  ArrowLeft,
  ArrowRight,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { parseAddress } from "@/lib/address-parser"
import { parseName } from "@/lib/name-parser"
import { PenaltyAbatementDialog } from "@/components/penalty-abatement-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
}

interface Form1099NECProps {
  userId: string
}

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

export function Form1099NEC({ userId }: Form1099NECProps) {
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
          formType: "1099-NEC",
          formData: { contractors },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setValidationResults(data.validation)
        toast({
          title: "AI Validation Complete",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentFormStep === 1) {
      if (!validationResults) {
        await handleAIValidation()
      }
      setCurrentFormStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (!validationResults) {
      await handleAIValidation()
      return
    }

    if (validationResults.errors.length > 0) {
      toast({
        title: "Please Fix Errors",
        description: "Your form has validation errors that must be fixed before submission",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setShowProgressDialog(true)
    setFilingProgress(1)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(2)

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
          })),
        }),
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFilingProgress(3)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const data = await response.json()

      if (data.isDemoMode) {
        setShowProgressDialog(false)
        toast({
          title: "Demo Mode Restriction",
          description: data.error,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (data.success) {
        setFilingProgress(4)

        await new Promise((resolve) => setTimeout(resolve, 2000))
        setShowProgressDialog(false)

        toast({
          title: "1099-NEC Successfully Submitted to IRS",
          description: `Submission ID: ${data.submissionId}. The IRS will process your filing within 24-48 hours.`,
          duration: 5000,
        })

        setTimeout(() => {
          router.push("/dashboard/filing")
        }, 2000)
      } else {
        throw new Error(data.error || "Failed to submit filing")
      }
    } catch (error) {
      setShowProgressDialog(false)
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

  const reviewSections = contractors.map((contractor, index) => ({
    title: `Contractor ${index + 1}: ${contractor.firstName} ${contractor.lastName}`,
    fields: [
      {
        label: "Full Name",
        value: `${contractor.firstName} ${contractor.middleInitial ? contractor.middleInitial + ". " : ""}${contractor.lastName}`,
      },
      { label: "Social Security Number", value: contractor.ssn, sensitive: true },
      { label: "EIN (if business)", value: contractor.ein, sensitive: true },
      { label: "Email", value: contractor.email || "Not provided" },
      {
        label: "Address",
        value: `${contractor.address}, ${contractor.city}, ${contractor.state} ${contractor.zipCode}`,
      },
      { label: "Nonemployee Compensation", value: `$${Number.parseFloat(contractor.compensation || "0").toFixed(2)}` },
    ],
  }))

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
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-stripe-purple/10 via-stripe-pink/10 to-stripe-orange/10 p-8 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-stripe-purple/5 via-transparent to-stripe-orange/5" />
            <div className="relative">
              <h2 className="bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange bg-clip-text text-3xl font-bold text-transparent">
                1099-NEC Filing
              </h2>
              <p className="mt-2 text-muted-foreground">
                File 1099-NEC forms for contractors paid $600 or more in {taxYear}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>IRS e-file ready • Instant submission • Real-time status updates</span>
              </div>
            </div>
          </div>

          {validationResults && (
            <div className="space-y-3">
              {validationResults.errors.map((error: string, i: number) => (
                <Alert key={i} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
              {validationResults.warnings.map((warning: string, i: number) => (
                <Alert key={i} className="border-orange-500/50 bg-orange-500/10">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <AlertDescription className="text-orange-500">{warning}</AlertDescription>
                </Alert>
              ))}
              {validationResults.suggestions.map((suggestion: string, i: number) => (
                <Alert key={i} className="border-blue-500/50 bg-blue-500/10">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-500">{suggestion}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {contractors.map((contractor, index) => (
            <Card key={contractor.id} className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-stripe-purple to-stripe-pink text-white font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">Contractor {index + 1}</CardTitle>
                      <CardDescription>Enter contractor information</CardDescription>
                    </div>
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
                        <AlertCircle className="h-3 w-3" />
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
                      <AlertCircle className="h-3 w-3" />
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
                        <AlertCircle className="h-3 w-3" />
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
                        <AlertCircle className="h-3 w-3" />
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
                        <AlertCircle className="h-3 w-3" />
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
                      <AlertCircle className="h-3 w-3" />
                      {validationErrors[`${contractor.id}-compensation`]}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Minimum $600 required for 1099-NEC filing</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleAIValidation}
                disabled={isValidating}
                className="border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20"
              >
                {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Sparkles className="mr-2 h-4 w-4" />
                AI Validate Form
              </Button>

              {isPaperFilingRequired && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowPenaltyDialog(true)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Penalty Abatement Letter ($19)
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isValidating}
              className="w-full bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange hover:opacity-90 text-lg py-6"
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
      />

      <PenaltyAbatementDialog
        open={showPenaltyDialog}
        onOpenChange={setShowPenaltyDialog}
        formType="1099-NEC"
        taxYear={taxYear}
        userId={userId}
      />
    </form>
  )
}
