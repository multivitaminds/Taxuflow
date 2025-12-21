"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff } from "lucide-react"

const TAX_U_LOGO = "/taxu-logo.svg"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Step 1: Create account
    email: "",
    password: "",

    // Step 2: Get started (name)
    firstName: "",
    lastName: "",

    // Step 3: Company name
    companyName: "",

    // Step 4: Callsign
    callsign: "",

    // Step 5: Company restrictions
    restrictionChecks: [] as string[],

    // Step 6: Company info
    legalBusinessName: "",
    country: "United States",
    phoneNumber: "",
    website: "",
    ein: "",

    // Step 7: Company details
    industry: "",
    companyType: "",
    companyDescription: "",
    majorInvestors: "",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setError("")
    // Validation logic per step
    if (step === 1 && (!formData.email || !formData.password)) {
      setError("Please fill in all fields")
      return
    }
    if (step === 2 && (!formData.firstName || !formData.lastName)) {
      setError("Please enter your name")
      return
    }
    if (step === 3 && !formData.companyName) {
      setError("Please enter your company name")
      return
    }
    if (step === 4 && !formData.callsign) {
      setError("Please set your Taxu callsign")
      return
    }
    if (step === 6 && (!formData.legalBusinessName || !formData.phoneNumber || !formData.ein)) {
      setError("Please fill in all required fields")
      return
    }
    if (step === 7 && (!formData.industry || !formData.companyType || !formData.companyDescription)) {
      setError("Please complete all company details")
      return
    }

    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const supabase = createBrowserClient()

      // Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
          },
        },
      })

      if (signUpError) throw signUpError

      // Store additional company info
      if (authData?.user) {
        const { error: insertError } = await supabase.from("organizations").insert({
          user_id: authData.user.id,
          name: formData.companyName,
          legal_name: formData.legalBusinessName,
          callsign: formData.callsign,
          website: formData.website,
          phone: formData.phoneNumber,
          ein: formData.ein,
          industry: formData.industry,
          company_type: formData.companyType,
          description: formData.companyDescription,
          major_investors: formData.majorInvestors,
        })

        if (insertError) {
          console.warn("[v0] Organization insert warning:", insertError)
        }
      }

      // Redirect to dashboard or email confirmation
      router.push("/dashboard")
    } catch (err: any) {
      console.error("[v0] Registration error:", err)
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 7) * 100

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Tax<span className="text-[#635BFF]">u</span>
            </span>
          </div>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Log in →
          </Link>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-[#635BFF] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Step 1: Create your account */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
                <p className="text-sm text-gray-600">You will use this email and password to log in across devices.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="h-11"
                    placeholder="you@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="h-11 pr-10"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Minimum 10 characters</p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button
                  onClick={handleNext}
                  className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white"
                  disabled={loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Get started */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Get started</h1>
                <p className="text-sm text-gray-600">Apply in 10 minutes.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-[#635BFF]">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="h-11"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="h-11"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button onClick={handleNext} className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                  Start Application
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By clicking "Start Application", I agree to Taxu's{" "}
                  <Link href="/terms" className="underline hover:text-gray-700">
                    Terms of Use
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="underline hover:text-gray-700">
                    Privacy Policy
                  </Link>{" "}
                  and to receive electronic communication about my accounts and services per{" "}
                  <Link href="/terms" className="underline hover:text-gray-700">
                    Taxu's Electronic Communications Agreement
                  </Link>
                  , and acknowledge receipt of{" "}
                  <Link href="/terms" className="underline hover:text-gray-700">
                    Taxu's USA PATRIOT Act disclosure
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Company name */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">What is your company's name?</h1>
                <p className="text-sm text-gray-600">
                  This will appear on your Taxu account, but doesn't have to be your legal or trade name (you'll add
                  that later).
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-[#635BFF]">
                    Company name
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    className="h-11"
                    placeholder="e.g. Amazon or Apple"
                  />
                </div>

                <p className="text-xs text-gray-600">
                  By clicking "Next," I acknowledge that I'm legally authorized to enter into this agreement on the
                  company's behalf.
                </p>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button onClick={handleNext} className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Set your Taxu callsign */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Set your Taxu callsign</h1>
                <p className="text-sm text-gray-600">
                  We'll use this to personalize your bill forwarding email address, referral link, and more. It won't
                  appear on statements.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="callsign" className="text-sm font-medium text-[#635BFF]">
                    Callsign
                  </Label>
                  <Input
                    id="callsign"
                    value={formData.callsign}
                    onChange={(e) => updateFormData("callsign", e.target.value)}
                    className="h-11"
                    placeholder="your-company"
                  />
                  <p className="text-xs text-gray-500">Numbers, letters, and dashes only, please.</p>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button onClick={handleNext} className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Company restrictions check */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Is your company any of the following?</h1>
              </div>

              <div className="space-y-3">
                {[
                  "Registered with the SEC",
                  "A publicly-traded company",
                  "Majority owned by a public company",
                  "An internet gambling business",
                  "Dealing with Controlled Substances (THC, other Schedule I drugs)",
                  "Involved in the sale, distribution or manufacturing of firearms or ammunition",
                  "A government organization",
                  "Part of a tax anticipation program",
                  "An adult entertainment business",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={formData.restrictionChecks.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("restrictionChecks", [...formData.restrictionChecks, option])
                        } else {
                          updateFormData(
                            "restrictionChecks",
                            formData.restrictionChecks.filter((c) => c !== option),
                          )
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>

              <Button onClick={handleNext} className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                None of the Above
              </Button>
            </div>
          )}

          {/* Step 6: Company info */}
          {step === 6 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Company info</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-900">About your company</h2>
                  <p className="text-sm text-gray-600">We need some basic details to verify your company</p>

                  <div className="space-y-2">
                    <Label htmlFor="legalBusinessName" className="text-sm font-medium text-gray-700">
                      Legal business name
                    </Label>
                    <Input
                      id="legalBusinessName"
                      value={formData.legalBusinessName}
                      onChange={(e) => updateFormData("legalBusinessName", e.target.value)}
                      className="h-11"
                      placeholder="Company Name"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="dba" />
                    <Label htmlFor="dba" className="text-sm text-gray-700 cursor-pointer">
                      My company has a DBA (Doing Business As) or has had an official name change
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                      Country of incorporation
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone number (with country code)
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-20 h-11 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-sm">
                        🇺🇸 +1
                      </div>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                        className="h-11 flex-1"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                      Company website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      className="h-11"
                      placeholder="https://yourcompany.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ein" className="text-sm font-medium text-gray-700">
                      Employer Identification Number (EIN)
                    </Label>
                    <Input
                      id="ein"
                      value={formData.ein}
                      onChange={(e) => updateFormData("ein", e.target.value)}
                      className="h-11"
                      placeholder="00-0000000"
                    />
                    <Link href="#" className="text-xs text-[#635BFF] hover:underline">
                      Need an EIN?
                    </Link>
                  </div>
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button onClick={handleNext} className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 7: Company details */}
          {step === 7 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Company details</h1>
                <p className="text-sm text-gray-600">
                  We need to understand what your company does and how it operates
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial Technology">Financial Technology</SelectItem>
                      <SelectItem value="Tax Consulting">Tax Consulting</SelectItem>
                      <SelectItem value="Accounting Software">Accounting Software</SelectItem>
                      <SelectItem value="Professional Services">Professional Services</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyType" className="text-sm font-medium text-gray-700">
                    Company type
                  </Label>
                  <Select value={formData.companyType} onValueChange={(value) => updateFormData("companyType", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="C Corporation">C Corporation</SelectItem>
                      <SelectItem value="S Corporation">S Corporation</SelectItem>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDescription" className="text-sm font-medium text-gray-700">
                    Company description
                  </Label>
                  <Textarea
                    id="companyDescription"
                    value={formData.companyDescription}
                    onChange={(e) => updateFormData("companyDescription", e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Example: Taxu is a financial technology company that provides an AI-powered tax preparation, compliance, and filing platform for individuals, freelancers, gig workers, and small businesses."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="majorInvestors" className="text-sm font-medium text-gray-700">
                    Major investors (optional)
                  </Label>
                  <Input
                    id="majorInvestors"
                    value={formData.majorInvestors}
                    onChange={(e) => updateFormData("majorInvestors", e.target.value)}
                    className="h-11"
                    placeholder="For example: Sequoia, a16z, etc."
                  />
                </div>

                {error && <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

                <Button
                  onClick={handleSubmit}
                  className="w-full h-11 bg-[#635BFF] hover:bg-[#5046E5] text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <button className="hover:text-gray-700 transition-colors">Help center</button>
        </div>
      </footer>
    </div>
  )
}
