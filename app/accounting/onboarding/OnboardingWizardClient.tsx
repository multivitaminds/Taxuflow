"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { BuildingIcon, DocumentIcon, WelcomeIcon } from "@/components/icons/professional-icons"
import { Check, ChevronRight, ChevronLeft, Landmark, Calculator, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingWizardClientProps {
  user: any
}

export default function OnboardingWizardClient({ user }: OnboardingWizardClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Form state
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    legalName: "",
    industry: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [chartOfAccounts, setChartOfAccounts] = useState({
    preset: "standard",
    customAccounts: [] as string[],
  })

  const [bankSetup, setBankSetup] = useState({
    connectBank: false,
    manualEntry: true,
  })

  const [taxSettings, setTaxSettings] = useState({
    fiscalYearEnd: "12-31",
    taxBasis: "accrual",
    trackSalesTax: true,
    defaultTaxRate: "8.5",
  })

  const steps = [
    {
      number: 1,
      title: "Company Information",
      description: "Basic details about your business",
      icon: BuildingIcon,
    },
    {
      number: 2,
      title: "Chart of Accounts",
      description: "Set up your accounting structure",
      icon: DocumentIcon,
    },
    {
      number: 3,
      title: "Bank Connections",
      description: "Connect your bank accounts",
      icon: Landmark,
    },
    {
      number: 4,
      title: "Tax Settings",
      description: "Configure tax preferences",
      icon: Calculator,
    },
    {
      number: 5,
      title: "Final Setup",
      description: "Review and complete setup",
      icon: Settings,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // In a real implementation, save all the data
    router.push("/accounting")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <WelcomeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Welcome to Taxu Accounting</h1>
          </div>
          <p className="text-muted-foreground text-lg">Let's get your accounting system set up in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-border -z-10">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((step) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(step.number)
              const isCurrent = currentStep === step.number
              const isPast = step.number < currentStep

              return (
                <button
                  key={step.number}
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex flex-col items-center gap-2 bg-background p-2 rounded-lg transition-all ${
                    isCurrent ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted || isPast
                        ? "bg-blue-600 text-white"
                        : isCurrent
                          ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="text-center hidden md:block">
                    <div className={`text-xs font-medium ${isCurrent ? "text-blue-600" : "text-muted-foreground"}`}>
                      {step.title}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8 mb-6">
          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Company Information</h2>
                <p className="text-muted-foreground">
                  Tell us about your business so we can customize your accounting experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    placeholder="Acme Corporation"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input
                    id="legalName"
                    placeholder="Acme Corporation Inc."
                    value={companyInfo.legalName}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, legalName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={companyInfo.industry}
                    onValueChange={(value) => setCompanyInfo({ ...companyInfo, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    placeholder="12-3456789"
                    value={companyInfo.taxId}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@acme.com"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Suite 100"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={companyInfo.city}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={companyInfo.state}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, state: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="94105"
                    value={companyInfo.zip}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, zip: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Chart of Accounts */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Chart of Accounts</h2>
                <p className="text-muted-foreground">Choose a pre-configured chart of accounts or customize your own</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Preset</Label>
                  <Select
                    value={chartOfAccounts.preset}
                    onValueChange={(value) => setChartOfAccounts({ ...chartOfAccounts, preset: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Business</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="services">Professional Services</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                      <SelectItem value="custom">Start from Scratch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <DocumentIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {chartOfAccounts.preset === "standard" && "Standard Business Chart"}
                          {chartOfAccounts.preset === "retail" && "Retail & E-commerce Chart"}
                          {chartOfAccounts.preset === "services" && "Professional Services Chart"}
                          {chartOfAccounts.preset === "nonprofit" && "Non-Profit Organization Chart"}
                          {chartOfAccounts.preset === "custom" && "Custom Chart"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Includes all standard accounts for your business type
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-900">Assets Accounts</p>
                        <p className="text-blue-700">12 accounts</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Liability Accounts</p>
                        <p className="text-blue-700">8 accounts</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Equity Accounts</p>
                        <p className="text-blue-700">5 accounts</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Income Accounts</p>
                        <p className="text-blue-700">10 accounts</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Expense Accounts</p>
                        <p className="text-blue-700">25 accounts</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
                  <Checkbox id="customize" />
                  <label
                    htmlFor="customize"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I want to customize this chart of accounts after setup
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bank Connections */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bank Connections</h2>
                <p className="text-muted-foreground">Connect your bank accounts for automatic transaction imports</p>
              </div>

              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Connect Bank Account</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Securely connect your bank for automatic transaction syncing
                      </p>
                      <Button>
                        <Landmark className="h-4 w-4 mr-2" />
                        Connect Bank Account
                      </Button>
                    </div>
                  </div>
                </Card>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <DocumentIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Manual Entry</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter transactions manually or import from CSV files
                      </p>
                      <Button variant="outline">Set Up Later</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-amber-50 border-amber-200">
                  <p className="text-sm text-amber-900">
                    <span className="font-medium">Note:</span> You can connect multiple bank accounts and credit cards
                    after completing the setup wizard.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Tax Settings */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tax Settings</h2>
                <p className="text-muted-foreground">Configure your tax preferences and accounting method</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Fiscal Year End</Label>
                    <Select
                      value={taxSettings.fiscalYearEnd}
                      onValueChange={(value) => setTaxSettings({ ...taxSettings, fiscalYearEnd: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12-31">December 31</SelectItem>
                        <SelectItem value="03-31">March 31</SelectItem>
                        <SelectItem value="06-30">June 30</SelectItem>
                        <SelectItem value="09-30">September 30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxBasis">Accounting Method</Label>
                    <Select
                      value={taxSettings.taxBasis}
                      onValueChange={(value) => setTaxSettings({ ...taxSettings, taxBasis: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accrual">Accrual</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Track Sales Tax</p>
                      <p className="text-sm text-muted-foreground">Enable sales tax tracking and reporting</p>
                    </div>
                    <Checkbox
                      checked={taxSettings.trackSalesTax}
                      onCheckedChange={(checked) =>
                        setTaxSettings({
                          ...taxSettings,
                          trackSalesTax: checked as boolean,
                        })
                      }
                    />
                  </div>

                  {taxSettings.trackSalesTax && (
                    <div className="space-y-2 ml-4">
                      <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                      <Input
                        id="defaultTaxRate"
                        type="number"
                        step="0.01"
                        placeholder="8.5"
                        value={taxSettings.defaultTaxRate}
                        onChange={(e) =>
                          setTaxSettings({
                            ...taxSettings,
                            defaultTaxRate: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">Tip:</span> You can configure additional tax settings and
                    jurisdictions in Settings after completing setup.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 5: Final Setup */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                <p className="text-muted-foreground">
                  Your accounting system is ready to use. Here's what we've set up for you:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <BuildingIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Company Profile</h3>
                      <p className="text-sm text-muted-foreground">{companyInfo.name || "Not configured"}</p>
                      <p className="text-sm text-muted-foreground">{companyInfo.industry || "Industry not set"}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <DocumentIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Chart of Accounts</h3>
                      <p className="text-sm text-muted-foreground">
                        {chartOfAccounts.preset === "standard" && "Standard Business"}
                        {chartOfAccounts.preset === "retail" && "Retail & E-commerce"}
                        {chartOfAccounts.preset === "services" && "Professional Services"}
                        {chartOfAccounts.preset === "nonprofit" && "Non-Profit"}
                        {chartOfAccounts.preset === "custom" && "Custom"}
                      </p>
                      <p className="text-sm text-muted-foreground">60+ accounts configured</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Bank Connections</h3>
                      <p className="text-sm text-muted-foreground">
                        {bankSetup.connectBank ? "Bank account connected" : "Manual entry enabled"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Tax Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        {taxSettings.taxBasis === "accrual" ? "Accrual" : "Cash"} basis
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {taxSettings.trackSalesTax ? `Sales tax: ${taxSettings.defaultTaxRate}%` : "Sales tax disabled"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    <span>Create your first invoice or expense</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    <span>Add customers and vendors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    <span>Import existing transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-blue-600" />
                    <span>Explore reporting and analytics</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Complete Setup
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
