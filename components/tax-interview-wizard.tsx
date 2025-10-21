"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Home,
  Briefcase,
  Heart,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TaxInterviewData {
  // Personal Info
  filingStatus: string
  dependents: number
  age: number
  blind: boolean
  spouseBlind: boolean

  // Income
  w2Income: number
  selfEmploymentIncome: number
  interestIncome: number
  dividendIncome: number
  capitalGains: number
  rentalIncome: number

  // Deductions
  mortgageInterest: number
  propertyTaxes: number
  charitableDonations: number
  medicalExpenses: number
  studentLoanInterest: number
  stateLocalTaxes: number

  // Credits
  hasChildren: boolean
  childrenUnder17: number
  childCareExpenses: number
  educationExpenses: number
  energyCredits: number

  // Life Events
  boughtHome: boolean
  soldHome: boolean
  gotMarried: boolean
  hadChild: boolean
  startedBusiness: boolean
}

const sections = [
  { id: "personal", title: "About You", icon: User, progress: 0 },
  { id: "income", title: "Income", icon: Briefcase, progress: 20 },
  { id: "deductions", title: "Deductions", icon: Home, progress: 40 },
  { id: "credits", title: "Tax Credits", icon: Heart, progress: 60 },
  { id: "life-events", title: "Life Events", icon: Sparkles, progress: 80 },
  { id: "review", title: "Review", icon: CheckCircle, progress: 100 },
]

export function TaxInterviewWizard({ onComplete }: { onComplete: (data: TaxInterviewData) => void }) {
  const [currentSection, setCurrentSection] = useState(0)
  const [data, setData] = useState<Partial<TaxInterviewData>>({
    filingStatus: "",
    dependents: 0,
    age: 0,
    blind: false,
    spouseBlind: false,
    w2Income: 0,
    selfEmploymentIncome: 0,
    interestIncome: 0,
    dividendIncome: 0,
    capitalGains: 0,
    rentalIncome: 0,
    mortgageInterest: 0,
    propertyTaxes: 0,
    charitableDonations: 0,
    medicalExpenses: 0,
    studentLoanInterest: 0,
    stateLocalTaxes: 0,
    hasChildren: false,
    childrenUnder17: 0,
    childCareExpenses: 0,
    educationExpenses: 0,
    energyCredits: 0,
    boughtHome: false,
    soldHome: false,
    gotMarried: false,
    hadChild: false,
    startedBusiness: false,
  })

  const [estimatedRefund, setEstimatedRefund] = useState(0)
  const [isLoadingAutoData, setIsLoadingAutoData] = useState(false)
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchAutoPopulateData()
  }, [])

  useEffect(() => {
    calculateRefund()
  }, [data])

  const calculateRefund = () => {
    const totalIncome =
      (data.w2Income || 0) +
      (data.selfEmploymentIncome || 0) +
      (data.interestIncome || 0) +
      (data.dividendIncome || 0) +
      (data.capitalGains || 0) +
      (data.rentalIncome || 0)

    const totalDeductions =
      (data.mortgageInterest || 0) +
      (data.propertyTaxes || 0) +
      (data.charitableDonations || 0) +
      (data.medicalExpenses || 0) +
      (data.studentLoanInterest || 0) +
      (data.stateLocalTaxes || 0)

    const standardDeduction = data.filingStatus === "married" ? 29200 : 14600
    const deduction = Math.max(totalDeductions, standardDeduction)

    const taxableIncome = Math.max(0, totalIncome - deduction)

    let tax = 0
    if (data.filingStatus === "married") {
      if (taxableIncome <= 23200) tax = taxableIncome * 0.1
      else if (taxableIncome <= 94300) tax = 2320 + (taxableIncome - 23200) * 0.12
      else if (taxableIncome <= 201050) tax = 10852 + (taxableIncome - 94300) * 0.22
      else tax = 34337 + (taxableIncome - 201050) * 0.24
    } else {
      if (taxableIncome <= 11600) tax = taxableIncome * 0.1
      else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12
      else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22
      else tax = 17168.5 + (taxableIncome - 100525) * 0.24
    }

    const childTaxCredit = (data.childrenUnder17 || 0) * 2000
    const childCareCredit = Math.min((data.childCareExpenses || 0) * 0.35, 1050)
    const educationCredit = Math.min((data.educationExpenses || 0) * 1.0, 2500)

    const totalCredits = childTaxCredit + childCareCredit + educationCredit + (data.energyCredits || 0)

    const estimatedWithholding = (data.w2Income || 0) * 0.15

    const refund = estimatedWithholding + totalCredits - tax
    setEstimatedRefund(Math.round(refund))
  }

  const updateData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      onComplete(data as TaxInterviewData)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const currentSectionData = sections[currentSection]
  const SectionIcon = currentSectionData.icon

  const fetchAutoPopulateData = async () => {
    setIsLoadingAutoData(true)
    try {
      const response = await fetch("/api/tax-interview/auto-populate")
      const result = await response.json()

      if (result.success && result.data) {
        const autoData = result.data
        const fieldsPopulated: string[] = []

        const updates: Partial<TaxInterviewData> = {}

        if (autoData.filingStatus) {
          updates.filingStatus = autoData.filingStatus
          fieldsPopulated.push("Filing Status")
        }

        if (autoData.w2Income > 0) {
          updates.w2Income = autoData.w2Income
          fieldsPopulated.push("W-2 Income")
        }

        if (autoData.selfEmploymentIncome > 0) {
          updates.selfEmploymentIncome = autoData.selfEmploymentIncome
          fieldsPopulated.push("Self-Employment Income")
        }

        if (autoData.interestIncome > 0) {
          updates.interestIncome = autoData.interestIncome
          fieldsPopulated.push("Interest Income")
        }

        if (autoData.dividendIncome > 0) {
          updates.dividendIncome = autoData.dividendIncome
          fieldsPopulated.push("Dividend Income")
        }

        if (Object.keys(updates).length > 0) {
          setData((prev) => ({ ...prev, ...updates }))
          setAutoPopulatedFields(fieldsPopulated)

          toast({
            title: "✨ AI Auto-Populated Your Tax Data",
            description: `Filled in ${fieldsPopulated.length} fields from your uploaded documents: ${fieldsPopulated.join(", ")}`,
            duration: 8000,
          })

          console.log("[v0] Auto-populated fields:", fieldsPopulated)
          console.log("[v0] Auto-populated data:", updates)
        } else {
          console.log("[v0] No data to auto-populate")
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching auto-populate data:", error)
    } finally {
      setIsLoadingAutoData(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {isLoadingAutoData && (
        <Card className="mb-8 p-6 bg-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <div>
              <p className="font-medium">AI is analyzing your uploaded documents...</p>
              <p className="text-sm text-muted-foreground">Extracting data from W-2s, 1099s, and other tax forms</p>
            </div>
          </div>
        </Card>
      )}

      {autoPopulatedFields.length > 0 && !isLoadingAutoData && (
        <Card className="mb-8 p-6 bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                ✨ AI Auto-Populated {autoPopulatedFields.length} Fields
              </p>
              <p className="text-sm text-muted-foreground">
                We've filled in: <strong>{autoPopulatedFields.join(", ")}</strong> from your uploaded documents. Review
                and adjust as needed.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="mb-8 p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Estimated Refund</p>
            <p className="text-4xl font-bold text-accent">${estimatedRefund.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Updates as you answer questions</p>
          </div>
          <TrendingUp className="w-12 h-12 text-accent opacity-50" />
        </div>
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">
            Section {currentSection + 1} of {sections.length}
          </p>
          <p className="text-sm text-muted-foreground">{currentSectionData.progress}% Complete</p>
        </div>
        <Progress value={currentSectionData.progress} className="h-2" />
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                index === currentSection
                  ? "bg-accent text-accent-foreground"
                  : index < currentSection
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{section.title}</span>
              {index < currentSection && <CheckCircle className="w-4 h-4" />}
            </button>
          )
        })}
      </div>

      <Card className="p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <SectionIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{currentSectionData.title}</h2>
            <p className="text-sm text-muted-foreground">Answer these questions to maximize your refund</p>
          </div>
        </div>

        <div className="space-y-6">
          {currentSection === 0 && (
            <>
              <div>
                <Label className="text-base mb-3 block">What's your filing status?</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {["single", "married", "head-of-household", "married-separate"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateData("filingStatus", status)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.filingStatus === status
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <span className="font-medium capitalize">{status.replace("-", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="age" className="text-base mb-2 block">
                  How old are you?
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age || ""}
                  onChange={(e) => updateData("age", Number.parseInt(e.target.value) || 0)}
                  placeholder="Enter your age"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  If you're 65 or older, you may qualify for additional deductions
                </p>
              </div>

              <div>
                <Label htmlFor="dependents" className="text-base mb-2 block">
                  How many dependents do you have?
                </Label>
                <Input
                  id="dependents"
                  type="number"
                  value={data.dependents || ""}
                  onChange={(e) => updateData("dependents", Number.parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="blind" checked={data.blind} onCheckedChange={(checked) => updateData("blind", checked)} />
                <Label htmlFor="blind" className="cursor-pointer">
                  I am legally blind
                </Label>
              </div>

              {data.filingStatus === "married" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="spouseBlind"
                    checked={data.spouseBlind}
                    onCheckedChange={(checked) => updateData("spouseBlind", checked)}
                  />
                  <Label htmlFor="spouseBlind" className="cursor-pointer">
                    My spouse is legally blind
                  </Label>
                </div>
              )}
            </>
          )}

          {currentSection === 1 && (
            <>
              <div>
                <Label htmlFor="w2Income" className="text-base mb-2 block flex items-center gap-2">
                  W-2 Income (Wages, Salaries, Tips)
                  {autoPopulatedFields.includes("W-2 Income") && (
                    <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✨ Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  id="w2Income"
                  type="number"
                  value={data.w2Income || ""}
                  onChange={(e) => updateData("w2Income", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="selfEmploymentIncome" className="text-base mb-2 block flex items-center gap-2">
                  Self-Employment Income (1099, Freelance)
                  {autoPopulatedFields.includes("Self-Employment Income") && (
                    <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✨ Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  id="selfEmploymentIncome"
                  type="number"
                  value={data.selfEmploymentIncome || ""}
                  onChange={(e) => updateData("selfEmploymentIncome", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="interestIncome" className="text-base mb-2 block flex items-center gap-2">
                  Interest Income (Bank Accounts, Bonds)
                  {autoPopulatedFields.includes("Interest Income") && (
                    <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✨ Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  id="interestIncome"
                  type="number"
                  value={data.interestIncome || ""}
                  onChange={(e) => updateData("interestIncome", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="dividendIncome" className="text-base mb-2 block flex items-center gap-2">
                  Dividend Income (Stocks, Mutual Funds)
                  {autoPopulatedFields.includes("Dividend Income") && (
                    <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✨ Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  id="dividendIncome"
                  type="number"
                  value={data.dividendIncome || ""}
                  onChange={(e) => updateData("dividendIncome", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="capitalGains" className="text-base mb-2 block">
                  Capital Gains (Stock Sales, Crypto)
                </Label>
                <Input
                  id="capitalGains"
                  type="number"
                  value={data.capitalGains || ""}
                  onChange={(e) => updateData("capitalGains", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="rentalIncome" className="text-base mb-2 block">
                  Rental Income (Investment Properties)
                </Label>
                <Input
                  id="rentalIncome"
                  type="number"
                  value={data.rentalIncome || ""}
                  onChange={(e) => updateData("rentalIncome", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>
            </>
          )}

          {currentSection === 2 && (
            <>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm">
                  <strong>Tip:</strong> You'll get the standard deduction ($
                  {data.filingStatus === "married" ? "29,200" : "14,600"}) automatically. Only enter these if your total
                  deductions exceed that amount.
                </p>
              </div>

              <div>
                <Label htmlFor="mortgageInterest" className="text-base mb-2 block">
                  Mortgage Interest Paid
                </Label>
                <Input
                  id="mortgageInterest"
                  type="number"
                  value={data.mortgageInterest || ""}
                  onChange={(e) => updateData("mortgageInterest", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="propertyTaxes" className="text-base mb-2 block">
                  Property Taxes Paid
                </Label>
                <Input
                  id="propertyTaxes"
                  type="number"
                  value={data.propertyTaxes || ""}
                  onChange={(e) => updateData("propertyTaxes", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="charitableDonations" className="text-base mb-2 block">
                  Charitable Donations
                </Label>
                <Input
                  id="charitableDonations"
                  type="number"
                  value={data.charitableDonations || ""}
                  onChange={(e) => updateData("charitableDonations", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="medicalExpenses" className="text-base mb-2 block">
                  Medical & Dental Expenses
                </Label>
                <Input
                  id="medicalExpenses"
                  type="number"
                  value={data.medicalExpenses || ""}
                  onChange={(e) => updateData("medicalExpenses", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Only amounts exceeding 7.5% of your income are deductible
                </p>
              </div>

              <div>
                <Label htmlFor="studentLoanInterest" className="text-base mb-2 block">
                  Student Loan Interest Paid
                </Label>
                <Input
                  id="studentLoanInterest"
                  type="number"
                  value={data.studentLoanInterest || ""}
                  onChange={(e) => updateData("studentLoanInterest", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">Maximum deduction: $2,500</p>
              </div>

              <div>
                <Label htmlFor="stateLocalTaxes" className="text-base mb-2 block">
                  State & Local Taxes Paid
                </Label>
                <Input
                  id="stateLocalTaxes"
                  type="number"
                  value={data.stateLocalTaxes || ""}
                  onChange={(e) => updateData("stateLocalTaxes", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">Maximum deduction: $10,000</p>
              </div>
            </>
          )}

          {currentSection === 3 && (
            <>
              <div>
                <Label className="text-base mb-3 block">Do you have children?</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateData("hasChildren", true)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${
                      data.hasChildren ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateData("hasChildren", false)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all ${
                      data.hasChildren === false ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {data.hasChildren && (
                <>
                  <div>
                    <Label htmlFor="childrenUnder17" className="text-base mb-2 block">
                      How many children under 17?
                    </Label>
                    <Input
                      id="childrenUnder17"
                      type="number"
                      value={data.childrenUnder17 || ""}
                      onChange={(e) => updateData("childrenUnder17", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Child Tax Credit: $2,000 per child</p>
                  </div>

                  <div>
                    <Label htmlFor="childCareExpenses" className="text-base mb-2 block">
                      Child Care Expenses
                    </Label>
                    <Input
                      id="childCareExpenses"
                      type="number"
                      value={data.childCareExpenses || ""}
                      onChange={(e) => updateData("childCareExpenses", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Daycare, after-school programs, summer camps</p>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="educationExpenses" className="text-base mb-2 block">
                  Education Expenses (College Tuition, Books)
                </Label>
                <Input
                  id="educationExpenses"
                  type="number"
                  value={data.educationExpenses || ""}
                  onChange={(e) => updateData("educationExpenses", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">American Opportunity Credit: Up to $2,500</p>
              </div>

              <div>
                <Label htmlFor="energyCredits" className="text-base mb-2 block">
                  Energy-Efficient Home Improvements
                </Label>
                <Input
                  id="energyCredits"
                  type="number"
                  value={data.energyCredits || ""}
                  onChange={(e) => updateData("energyCredits", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">Solar panels, heat pumps, insulation, windows</p>
              </div>
            </>
          )}

          {currentSection === 4 && (
            <>
              <div>
                <Label className="text-base mb-3 block">Did any of these happen this year?</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all">
                    <Checkbox
                      id="boughtHome"
                      checked={data.boughtHome}
                      onCheckedChange={(checked) => updateData("boughtHome", checked)}
                    />
                    <Label htmlFor="boughtHome" className="cursor-pointer flex-1">
                      <div className="font-medium">Bought a home</div>
                      <div className="text-sm text-muted-foreground">May qualify for mortgage interest deduction</div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all">
                    <Checkbox
                      id="soldHome"
                      checked={data.soldHome}
                      onCheckedChange={(checked) => updateData("soldHome", checked)}
                    />
                    <Label htmlFor="soldHome" className="cursor-pointer flex-1">
                      <div className="font-medium">Sold a home</div>
                      <div className="text-sm text-muted-foreground">Capital gains may be excluded</div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all">
                    <Checkbox
                      id="gotMarried"
                      checked={data.gotMarried}
                      onCheckedChange={(checked) => updateData("gotMarried", checked)}
                    />
                    <Label htmlFor="gotMarried" className="cursor-pointer flex-1">
                      <div className="font-medium">Got married</div>
                      <div className="text-sm text-muted-foreground">May change your filing status</div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all">
                    <Checkbox
                      id="hadChild"
                      checked={data.hadChild}
                      onCheckedChange={(checked) => updateData("hadChild", checked)}
                    />
                    <Label htmlFor="hadChild" className="cursor-pointer flex-1">
                      <div className="font-medium">Had or adopted a child</div>
                      <div className="text-sm text-muted-foreground">Qualifies for Child Tax Credit</div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-accent/50 transition-all">
                    <Checkbox
                      id="startedBusiness"
                      checked={data.startedBusiness}
                      onCheckedChange={(checked) => updateData("startedBusiness", checked)}
                    />
                    <Label htmlFor="startedBusiness" className="cursor-pointer flex-1">
                      <div className="font-medium">Started a business</div>
                      <div className="text-sm text-muted-foreground">May have additional deductions</div>
                    </Label>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentSection === 5 && (
            <div className="space-y-6">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">Your Estimated Refund</h3>
                <p className="text-5xl font-bold text-accent mb-2">${estimatedRefund.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Based on the information you provided</p>
              </div>

              <div>
                <h3 className="font-bold mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Filing Status</span>
                    <span className="font-medium capitalize">{data.filingStatus?.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Income</span>
                    <span className="font-medium">
                      $
                      {(
                        (data.w2Income || 0) +
                        (data.selfEmploymentIncome || 0) +
                        (data.interestIncome || 0) +
                        (data.dividendIncome || 0) +
                        (data.capitalGains || 0) +
                        (data.rentalIncome || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Dependents</span>
                    <span className="font-medium">{data.dependents || 0}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Children Under 17</span>
                    <span className="font-medium">{data.childrenUnder17 || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Next Steps:</strong> We'll use this information to prepare your complete tax return. You can
                  review and edit everything before filing.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevSection}
          disabled={currentSection === 0}
          className="bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button type="button" onClick={nextSection} className="glow-neon">
          {currentSection === sections.length - 1 ? "Complete Interview" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
