"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Building2,
  User,
  CheckCircle2,
  Circle,
  Code2,
  CreditCard,
  TrendingUp,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react"

const steps = [
  {
    id: "account-type",
    title: "Account Type",
    description: "Choose your account type",
  },
  {
    id: "business-info",
    title: "Business Information",
    description: "Tell us about your business",
    substeps: ["Business type", "Business details", "Business representative"],
  },
  {
    id: "platforms",
    title: "Select Platforms",
    description: "Choose which platforms to activate",
  },
  {
    id: "banking",
    title: "Banking Details",
    description: "Add your bank information",
  },
  {
    id: "security",
    title: "Security",
    description: "Secure your account",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Confirm your information",
  },
]

const platforms = [
  {
    id: "developer",
    name: "Developer API",
    icon: Code2,
    color: "text-blue-500",
    description: "Integrate Taxu into your applications",
  },
  {
    id: "neobank",
    name: "Neobank",
    icon: CreditCard,
    color: "text-emerald-500",
    description: "Banking services for your business",
  },
  {
    id: "investment",
    name: "Investment Platform",
    icon: TrendingUp,
    color: "text-violet-500",
    description: "Portfolio and trading management",
  },
  {
    id: "accounting",
    name: "Accounting Suite",
    icon: Calculator,
    color: "text-amber-500",
    description: "Complete tax and accounting tools",
  },
]

export default function ActivateAllPlatformsPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentSubstep, setCurrentSubstep] = useState(0)
  const [accountType, setAccountType] = useState<"individual" | "business" | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "developer",
    "neobank",
    "investment",
    "accounting",
  ])

  const [formData, setFormData] = useState({
    // Business info
    businessName: "",
    businessType: "",
    country: "US",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    website: "",
    // Individual info
    firstName: "",
    lastName: "",
    email: "",
    // Representative
    repFirstName: "",
    repLastName: "",
    repTitle: "",
    repEmail: "",
  })

  const handleNext = () => {
    const step = steps[currentStep]
    if (step.substeps && currentSubstep < step.substeps.length - 1) {
      setCurrentSubstep(currentSubstep + 1)
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentSubstep(0)
    }
  }

  const handleBack = () => {
    if (currentSubstep > 0) {
      setCurrentSubstep(currentSubstep - 1)
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      const prevStep = steps[currentStep - 1]
      setCurrentSubstep(prevStep.substeps ? prevStep.substeps.length - 1 : 0)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    // Account Type Step
    if (step.id === "account-type") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Choose your account type</h2>
            <p className="text-slate-600">Select whether you're activating as an individual or business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card
              className={`p-8 cursor-pointer border-2 transition-all ${
                accountType === "individual"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setAccountType("individual")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Individual</h3>
                  <p className="text-sm text-slate-600">For personal accounts, freelancers, and solo developers</p>
                </div>
              </div>
            </Card>

            <Card
              className={`p-8 cursor-pointer border-2 transition-all ${
                accountType === "business"
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setAccountType("business")}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Business</h3>
                  <p className="text-sm text-slate-600">For companies and organizations of any size</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    }

    // Business Information Step
    if (step.id === "business-info") {
      if (currentSubstep === 0) {
        // Business Type
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {accountType === "business" ? "Business type" : "Personal information"}
              </h2>
              <p className="text-slate-600">
                This information is collected to better serve your {accountType === "business" ? "business" : "account"}{" "}
                and comply with regulators and financial partners
              </p>
            </div>

            {accountType === "business" ? (
              <div className="space-y-4 mt-8">
                <div>
                  <Label htmlFor="businessType">Business type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                      <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        )
      } else if (currentSubstep === 1) {
        // Business Details
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Tell us about your {accountType === "business" ? "business" : "details"}
              </h2>
              <p className="text-slate-600">
                This information is collected to better serve your {accountType === "business" ? "business" : "account"}{" "}
                and comply with regulators and financial partners, as indicated in the Terms of Service.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {accountType === "business" && (
                <div>
                  <Label htmlFor="businessName">Business name</Label>
                  <p className="text-sm text-slate-500 mb-2">
                    The public operating name of your company, if it's different from your legal business name.
                  </p>
                  <Input
                    id="businessName"
                    placeholder="Taxu"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="address">
                  {accountType === "business" ? "Business" : "Home"} address{" "}
                  <Info className="inline w-4 h-4 text-slate-400" />
                </Label>
                <p className="text-sm text-slate-500 mb-2">
                  The physical location where you operate your {accountType === "business" ? "business" : "residence"}.
                  This may or may not be the same as your registered business address. View support article
                </p>
                <div className="space-y-3">
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Street address"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  />
                  <Input
                    placeholder="Apartment, unit, or other"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  />
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Zip code"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">{accountType === "business" ? "Business" : "Personal"} phone number</Label>
                <p className="text-sm text-slate-500 mb-2">
                  Your phone number is required to be in the country of your account.
                </p>
                <Input
                  id="phoneNumber"
                  placeholder="+1 201 555 0123"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              {accountType === "business" && (
                <div>
                  <Label htmlFor="website">Business website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="www.example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-slate-600">
                        <p className="font-medium mb-1">Your website must:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Be viewable and not password-protected</li>
                          <li>Match the business name you provided to Taxu</li>
                        </ul>
                        <p className="mt-2">
                          If your website doesn't meet these requirements, view our support article.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      } else if (currentSubstep === 2 && accountType === "business") {
        // Business Representative
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Business representative</h2>
              <p className="text-slate-600">The person with significant responsibility for managing the legal entity</p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="repFirstName">First name</Label>
                  <Input
                    id="repFirstName"
                    value={formData.repFirstName}
                    onChange={(e) => setFormData({ ...formData, repFirstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="repLastName">Last name</Label>
                  <Input
                    id="repLastName"
                    value={formData.repLastName}
                    onChange={(e) => setFormData({ ...formData, repLastName: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="repTitle">Title</Label>
                <Input
                  id="repTitle"
                  placeholder="CEO, CFO, Owner, etc."
                  value={formData.repTitle}
                  onChange={(e) => setFormData({ ...formData, repTitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="repEmail">Email</Label>
                <Input
                  id="repEmail"
                  type="email"
                  value={formData.repEmail}
                  onChange={(e) => setFormData({ ...formData, repEmail: e.target.value })}
                />
              </div>
            </div>
          </div>
        )
      }
    }

    // Platform Selection Step
    if (step.id === "platforms") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Select platforms to activate</h2>
            <p className="text-slate-600">Choose which Taxu services you want to enable for your account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {platforms.map((platform) => {
              const Icon = platform.icon
              const isSelected = selectedPlatforms.includes(platform.id)
              return (
                <Card
                  key={platform.id}
                  className={`p-6 cursor-pointer border-2 transition-all ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${platform.color}`} />
                        <h3 className="text-lg font-bold">{platform.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">{platform.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )
    }

    // Banking Details Step
    if (step.id === "banking") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Add your bank</h2>
            <p className="text-slate-600">Connect your bank account to receive payouts and make transfers</p>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600">Bank connection interface would go here</p>
            <p className="text-sm text-slate-500 mt-2">Integration with Plaid or similar service</p>
          </div>
        </div>
      )
    }

    // Security Step
    if (step.id === "security") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Secure your account</h2>
            <p className="text-slate-600">Enable two-factor authentication and set up security preferences</p>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <p className="text-slate-600">Security setup interface would go here</p>
            <p className="text-sm text-slate-500 mt-2">2FA setup, security questions, etc.</p>
          </div>
        </div>
      )
    }

    // Review Step
    if (step.id === "review") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Review and submit</h2>
            <p className="text-slate-600">Confirm your information before activating your account</p>
          </div>

          <Card className="p-6 mt-8">
            <h3 className="font-bold mb-4">Account Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Account Type:</span>
                <span className="font-medium capitalize">{accountType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Selected Platforms:</span>
                <span className="font-medium">{selectedPlatforms.length} platforms</span>
              </div>
              {accountType === "business" && formData.businessName && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Business Name:</span>
                  <span className="font-medium">{formData.businessName}</span>
                </div>
              )}
            </div>
          </Card>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white h-12 text-lg">
            Submit Application
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Progress Steps */}
      <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="mb-8">
          <button className="text-slate-600 hover:text-slate-900 mb-6">← Back</button>
          <h1 className="text-xl font-bold">Activate all platforms</h1>
        </div>

        <div className="space-y-6 flex-1">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isUpcoming = index > currentStep

            return (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? "text-blue-600" : isCompleted ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    {step.substeps && isCurrent && (
                      <div className="mt-2 ml-4 space-y-2">
                        {step.substeps.map((substep, subIndex) => (
                          <p
                            key={substep}
                            className={`text-xs ${
                              subIndex === currentSubstep
                                ? "text-blue-600 font-medium"
                                : subIndex < currentSubstep
                                  ? "text-slate-600"
                                  : "text-slate-400"
                            }`}
                          >
                            {substep}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {index < steps.length - 1 && <div className="absolute left-3 top-8 w-0.5 h-6 bg-slate-200" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-12">
        <div className="max-w-3xl mx-auto">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {currentStep > 0 || currentSubstep > 0 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {!(steps[currentStep].id === "review") && (
              <Button
                onClick={handleNext}
                disabled={steps[currentStep].id === "account-type" && !accountType}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
