"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Check, X, Building2, User } from "lucide-react"
import Link from "next/link"

interface Step {
  id: string
  title: string
  substeps: string[]
}

interface ActivationWizardProps {
  platform: string
  platformName: string
  steps: Step[]
  color: "emerald" | "violet" | "amber" | "blue"
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-600",
    bgLight: "bg-emerald-100",
    border: "border-emerald-600",
    text: "text-emerald-600",
  },
  violet: {
    bg: "bg-violet-600",
    bgLight: "bg-violet-100",
    border: "border-violet-600",
    text: "text-violet-600",
  },
  amber: {
    bg: "bg-amber-600",
    bgLight: "bg-amber-100",
    border: "border-amber-600",
    text: "text-amber-600",
  },
  blue: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-100",
    border: "border-blue-600",
    text: "text-blue-600",
  },
}

export function ActivationWizard({ platform, platformName, steps, color }: ActivationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentSubstep, setCurrentSubstep] = useState(0)
  const [accountType, setAccountType] = useState<"individual" | "business" | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    phoneNumber: "",
    email: "",
  })
  const colors = colorMap[color]

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
              Select whether you're registering as an individual or on behalf of a business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
                accountType === "individual" ? `${colors.border} ${colors.bgLight}` : "border-slate-200"
              }`}
              onClick={() => setAccountType("individual")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    accountType === "individual" ? colors.bg : "bg-slate-100"
                  }`}
                >
                  <User className={`w-8 h-8 ${accountType === "individual" ? "text-white" : "text-slate-400"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Individual</h3>
                  <p className="text-sm text-slate-600">For personal accounts and individual use</p>
                </div>
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer border-2 transition-all hover:shadow-lg ${
                accountType === "business" ? `${colors.border} ${colors.bgLight}` : "border-slate-200"
              }`}
              onClick={() => setAccountType("business")}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    accountType === "business" ? colors.bg : "bg-slate-100"
                  }`}
                >
                  <Building2 className={`w-8 h-8 ${accountType === "business" ? "text-white" : "text-slate-400"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Business</h3>
                  <p className="text-sm text-slate-600">For companies and organizations</p>
                </div>
              </div>
            </Card>
          </div>

          {accountType && (
            <div className="pt-6">
              <Button
                size="lg"
                onClick={handleContinue}
                className={`w-full ${colors.bg} hover:opacity-90 text-white h-12`}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      )
    }

    if (currentStep === 1 && accountType) {
      return (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {accountType === "individual" ? "Tell us about yourself" : "Tell us about your business"}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This information helps us verify your {accountType === "individual" ? "identity" : "business"} and comply
              with regulatory requirements.
            </p>
          </div>

          <div className="space-y-6">
            {accountType === "individual" ? (
              <>
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
              </>
            ) : (
              <div>
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="h-11"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-11"
              />
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

            <div className="pt-6">
              <Button
                size="lg"
                onClick={handleContinue}
                className={`w-full ${colors.bg} hover:opacity-90 text-white h-12`}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{steps[currentStep]?.title || "Loading..."}</h2>
        <p className="text-slate-600 mb-8">This step is being finalized.</p>
        <Button onClick={handleContinue} className={colors.bg}>
          Continue to Next Step
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="mb-8">
          <Link href="/activate" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <X className="w-4 h-4" />
            <span className="text-sm">Close</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Activate your account</h1>
          <p className="text-sm text-slate-500 mt-2">{platformName}</p>
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
                    ${isCompleted ? colors.bg : isActive ? `${colors.bgLight} border-2 ${colors.border}` : "bg-slate-100"}
                  `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
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
                                ? `${colors.border} ${colors.text} font-medium`
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

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-auto">
        <div className="max-w-3xl">{renderStepContent()}</div>
      </div>
    </div>
  )
}
