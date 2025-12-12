"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, Building2, User } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    id: "account-type",
    title: "Account type",
    substeps: ["Individual or Business"],
  },
  {
    id: "business-info",
    title: "Account information",
    substeps: ["Basic details", "Contact information"],
  },
  {
    id: "api-setup",
    title: "API configuration",
    substeps: ["Use case", "Technical setup", "Rate limits"],
  },
  {
    id: "verify",
    title: "Verify your identity",
    substeps: ["Personal details", "Document upload"],
  },
  {
    id: "security",
    title: "Secure your account",
    substeps: ["Two-factor auth", "API keys"],
  },
  {
    id: "review",
    title: "Review and submit",
    substeps: [],
  },
]

export default function DeveloperActivationPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentSubstep, setCurrentSubstep] = useState(0)
  const [accountType, setAccountType] = useState<"individual" | "business" | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    businessWebsite: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phoneNumber: "",
    useCase: "",
    expectedVolume: "",
    technicalContact: "",
  })

  const handleContinue = () => {
    const currentStepData = steps[currentStep]
    if (currentSubstep < currentStepData.substeps.length - 1) {
      setCurrentSubstep(currentSubstep + 1)
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentSubstep(0)
    }
  }

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose your account type</h2>
            <p className="text-slate-600 leading-relaxed">
              Select whether you're registering as an individual developer or on behalf of a business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
                accountType === "individual"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
              onClick={() => setAccountType("individual")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    accountType === "individual" ? "bg-indigo-600" : "bg-slate-100"
                  }`}
                >
                  <User className={`w-8 h-8 ${accountType === "individual" ? "text-white" : "text-slate-400"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Individual</h3>
                  <p className="text-sm text-slate-600">For freelancers, solo developers, and personal projects</p>
                </div>
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
                accountType === "business"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
              onClick={() => setAccountType("business")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    accountType === "business" ? "bg-indigo-600" : "bg-slate-100"
                  }`}
                >
                  <Building2 className={`w-8 h-8 ${accountType === "business" ? "text-white" : "text-slate-400"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Business</h3>
                  <p className="text-sm text-slate-600">For companies, startups, and organizations</p>
                </div>
              </div>
            </Card>
          </div>

          {accountType && (
            <div className="pt-6">
              <Button
                size="lg"
                onClick={handleContinue}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      )
    }

    if (currentStep === 1) {
      return accountType === "individual" ? renderIndividualForm() : renderBusinessForm()
    }

    return null
  }

  const renderIndividualForm = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Tell us about yourself</h2>
        <p className="text-slate-600 leading-relaxed">
          This information helps us verify your identity and comply with regulatory requirements.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="h-11"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="+1 201 555 0123"
            className="h-11"
          />
        </div>

        <div>
          <Label htmlFor="businessWebsite">Personal website (optional)</Label>
          <Input
            id="businessWebsite"
            type="url"
            value={formData.businessWebsite}
            onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
            placeholder="www.example.com"
            className="h-11"
          />
        </div>

        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )

  const renderBusinessForm = () => (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Tell us about your business</h2>
        <p className="text-slate-600 leading-relaxed">
          This information is collected to better serve your business and comply with regulators and financial partners,
          as indicated in the{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="businessName" className="text-sm font-medium text-slate-700 mb-2">
            Business name
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            The public operating name of your company, if it's different from your legal business name.
          </p>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Taxu"
            className="h-11"
          />
        </div>

        <div>
          <Label htmlFor="businessAddress" className="text-sm font-medium text-slate-700 mb-2">
            Business address
            <span className="ml-2 text-xs text-slate-500 font-normal">
              <span className="inline-flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-xs">i</span>
              </span>
            </span>
          </Label>
          <p className="text-sm text-slate-500 mb-3">
            The physical location where you operate your business. This may or may not be the same as your registered
            business address.{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              View support article
            </a>
          </p>

          <div className="space-y-3">
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Street address"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              className="h-11"
            />

            <Input placeholder="Apartment, unit, or other" className="h-11" />

            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="h-11"
            />

            <div className="grid grid-cols-2 gap-3">
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="h-11">
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
                className="h-11"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700 mb-2">
            Business phone number
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            Your phone number is required to be in the country of your account.
          </p>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="+1 201 555 0123"
            className="h-11"
          />
        </div>

        <div>
          <Label htmlFor="businessWebsite" className="text-sm font-medium text-slate-700 mb-2">
            Business website
          </Label>
          <Input
            id="businessWebsite"
            type="url"
            value={formData.businessWebsite}
            onChange={(e) => setFormData({ ...formData, businessWebsite: e.target.value })}
            placeholder="www.example.com"
            className="h-11"
          />

          <Card className="mt-4 p-4 bg-slate-50 border-slate-200">
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-slate-600">i</span>
              </div>
              <div className="flex-1 text-sm text-slate-700">
                <p className="font-medium mb-1">Your website must:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Be viewable and not password-protected</li>
                  <li>Match the business name you provided to Taxu</li>
                </ul>
                <p className="mt-2">
                  If your website doesn't meet these requirements,{" "}
                  <a href="#" className="text-indigo-600 hover:underline">
                    view our support article
                  </a>
                  .
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="mb-8">
          <Link href="/activate" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <X className="w-4 h-4" />
            <span className="text-sm">Close</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Activate your account</h1>
        </div>

        <div className="space-y-6 flex-1">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div key={step.id}>
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isCompleted ? "bg-indigo-600" : isActive ? "bg-indigo-100 border-2 border-indigo-600" : "bg-slate-100"}
                  `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {step.title}
                    </div>
                    {isActive && step.substeps.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {step.substeps.map((substep, subIndex) => (
                          <div
                            key={substep}
                            className={`text-sm pl-4 border-l-2 py-1 ${
                              subIndex === currentSubstep
                                ? "border-indigo-600 text-indigo-600 font-medium"
                                : subIndex < currentSubstep
                                  ? "border-slate-300 text-slate-500"
                                  : "border-slate-200 text-slate-400"
                            }`}
                          >
                            {substep}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 p-12 overflow-auto">
        <div className="max-w-3xl">{renderStepContent()}</div>
      </div>
    </div>
  )
}
