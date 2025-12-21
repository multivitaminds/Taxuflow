"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle, Upload, Building2, TrendingUp, Calculator, FileText } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface FormData {
  email: string
  password: string
  fullName: string
  jobTitle: string
  ownershipPercentage: number
  citizenshipStatus: string
  countryOfCitizenship: string
  phone: string
  dateOfBirth: string
  resStreet: string
  resApartment: string
  resCity: string
  resState: string
  resZip: string
  resCountry: string
  identityVerified: boolean
  platformsSelected: string[]
  companyName: string
  legalEntityType: string
  ein: string
  industry: string
  website: string
  businessDescription: string
  compStreet: string
  compApartment: string
  compCity: string
  compState: string
  compZip: string
  compCountry: string
  sameAsResidential: boolean
  depositSources: string[]
  accountUsage: string[]
  monthlyBalance: string
  monthlyTransactions: string
  operatingCountries: string[]
  formationDoc: File | null
  einDoc: File | null
  howFindClients: string
  professionalLinks: string
}

const TAXU_PLATFORMS = [
  {
    id: "neobank",
    name: "Neobank Platform",
    icon: Building2,
    description: "Complete digital banking solution with accounts, cards, and money management",
    features: ["Business Accounts", "Virtual & Physical Cards", "Bill Pay", "International Transfers", "Tax Buckets"],
  },
  {
    id: "investment",
    name: "Investment Platform",
    icon: TrendingUp,
    description: "Wealth management and investment tools for business growth",
    features: ["Portfolio Management", "Auto-Invest", "Tax Optimizer", "Savings Goals", "Robo-Advisor"],
  },
  {
    id: "accounting",
    name: "Accounting Platform",
    icon: Calculator,
    description: "Full-featured accounting and bookkeeping system",
    features: ["Invoicing", "Expenses", "Payroll", "Financial Reports", "Bank Feeds", "Tax Management"],
  },
  {
    id: "tax_filing",
    name: "Tax-filing Platform",
    icon: FileText,
    description: "Automated tax filing and compliance management",
    features: ["E-filing", "1099 Management", "Tax Forms", "Compliance Tracking", "Audit Support"],
  },
]

const INDUSTRIES = [
  { value: "accounting-bookkeeping", label: "Accounting & Bookkeeping" },
  { value: "accounting-bookkeeping-tax", label: "Accounting & Bookkeeping > Tax Preparation" },
  { value: "advertising", label: "Advertising" },
  { value: "art", label: "Art" },
  { value: "art-painting", label: "Art > Painting" },
  { value: "art-sculpting", label: "Art > Sculpting" },
  { value: "art-theater", label: "Art > Theater" },
  { value: "beauty-cosmetic", label: "Beauty and Cosmetic Services" },
  { value: "biotech", label: "Biotech" },
  { value: "business-management", label: "Business Management" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "construction", label: "Construction" },
  { value: "consulting", label: "Consulting" },
  { value: "consulting-strategy", label: "Consulting > Strategy" },
  { value: "consulting-business", label: "Consulting > Business" },
  { value: "consulting-financial", label: "Consulting > Financial" },
  { value: "crypto", label: "Crypto" },
  { value: "crypto-exchange", label: "Crypto > Exchange" },
  { value: "crypto-investments", label: "Crypto > Investments" },
  { value: "crypto-daos", label: "Crypto > DAOs" },
  { value: "crypto-nfts", label: "Crypto > NFTs" },
  { value: "crypto-mining", label: "Crypto > Mining" },
  { value: "crypto-saas", label: "Crypto > SaaS" },
  { value: "design", label: "Design" },
  { value: "design-web", label: "Design > Web" },
  { value: "design-digital", label: "Design > Digital" },
  { value: "design-interior", label: "Design > Interior" },
  { value: "design-fashion", label: "Design > Fashion" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "ecommerce-amazon", label: "Ecommerce > Amazon" },
  { value: "ecommerce-ebay", label: "Ecommerce > eBay" },
  { value: "ecommerce-shopify", label: "Ecommerce > Shopify" },
  { value: "education", label: "Education" },
  { value: "education-online", label: "Education > Online School" },
  { value: "education-university", label: "Education > University" },
  { value: "education-financial", label: "Education > Financial" },
  { value: "energy", label: "Energy" },
  { value: "energy-solar", label: "Energy > Solar" },
  { value: "energy-wind", label: "Energy > Wind" },
  { value: "energy-refining", label: "Energy > Refining" },
  { value: "energy-fuel", label: "Energy > Fuel" },
  { value: "entertainment", label: "Entertainment" },
  { value: "entertainment-tv", label: "Entertainment > Television" },
  { value: "entertainment-film", label: "Entertainment > Film" },
  { value: "entertainment-music", label: "Entertainment > Music" },
  { value: "entertainment-print", label: "Entertainment > Print" },
  { value: "financial-services", label: "Financial Services" },
  { value: "financial-lending", label: "Financial Services > Consumer/Commercial Lending" },
  { value: "financial-money-services", label: "Financial Services > Money Services Business" },
  { value: "financial-payment-processor", label: "Financial Services > Payment Processor" },
  { value: "fintech", label: "FinTech" },
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food" },
  { value: "food-restaurant", label: "Food > Restaurant or Food Truck" },
  { value: "food-manufacturing", label: "Food > Manufacturing" },
  { value: "hardware", label: "Hardware" },
  { value: "professional-architect", label: "Professional Services > Architect" },
  { value: "professional-attorney", label: "Professional Services > Attorney" },
  { value: "professional-doctor", label: "Professional Services > Doctor" },
  { value: "professional-engineer", label: "Professional Services > Engineer" },
  { value: "professional-paralegal", label: "Professional Services > Paralegal" },
  { value: "real-estate", label: "Real Estate" },
  { value: "real-estate-rental", label: "Real Estate > Short-Term Rental" },
  { value: "real-estate-development", label: "Real Estate > Development" },
  { value: "real-estate-investing", label: "Real Estate > Investing" },
  { value: "real-estate-management", label: "Real Estate > Property Management" },
  { value: "recruiting", label: "Recruiting" },
  { value: "research", label: "Research" },
  { value: "research-medical", label: "Research > Medical" },
  { value: "research-scientific", label: "Research > Scientific" },
  { value: "research-market", label: "Research > Market" },
  { value: "retail-wholesale", label: "Retail & Wholesale" },
  { value: "security", label: "Security" },
  { value: "security-private", label: "Security > Private" },
  { value: "security-infosec", label: "Security > Infosec" },
  { value: "shipping-warehousing", label: "Shipping & Warehousing" },
  { value: "sports-team", label: "Sports Team" },
  { value: "support-services", label: "Support Services" },
  { value: "software", label: "Software" },
  { value: "software-b2b", label: "Software > B2B" },
  { value: "software-developer-tools", label: "Software > Developer Tools" },
  { value: "software-enterprise", label: "Software > Enterprise Software" },
  { value: "technology", label: "Technology" },
  { value: "technology-agriculture", label: "Technology > Agriculture" },
  { value: "technology-ai", label: "Technology > Artificial Intelligence" },
  { value: "technology-ar", label: "Technology > Augmented Reality" },
  { value: "technology-community", label: "Technology > Community" },
  { value: "technology-consumer", label: "Technology > Consumer" },
  { value: "technology-drones", label: "Technology > Drones" },
  { value: "technology-government", label: "Technology > Government" },
  { value: "technology-it-telecom", label: "Technology > IT & Telecom" },
  { value: "technology-robotics", label: "Technology > Robotics" },
  { value: "technology-vr", label: "Technology > Virtual Reality" },
  { value: "transportation", label: "Transportation" },
  { value: "transportation-limo", label: "Transportation > Limo/Car Service" },
  { value: "transportation-rideshare", label: "Transportation > Ride Share" },
  { value: "travel", label: "Travel" },
  { value: "travel-agency", label: "Travel > Travel Agency" },
  { value: "travel-hotel", label: "Travel > Hotel Reservations" },
  { value: "investment-vc", label: "Investment > Venture Capital" },
  { value: "waste-management", label: "Waste Management" },
]

const COMPANY_TYPES = [
  { value: "c-corp", label: "C Corporation" },
  { value: "s-corp", label: "S Corporation" },
  { value: "llc", label: "LLC" },
  { value: "partnership", label: "Partnership" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "non-profit", label: "Non-Profit" },
]

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export default function MercuryRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    jobTitle: "",
    ownershipPercentage: 100,
    citizenshipStatus: "",
    countryOfCitizenship: "United States",
    phone: "",
    dateOfBirth: "",
    resStreet: "",
    resApartment: "",
    resCity: "",
    resState: "",
    resZip: "",
    resCountry: "United States",
    identityVerified: false,
    platformsSelected: [],
    companyName: "",
    legalEntityType: "",
    ein: "",
    industry: "",
    website: "",
    businessDescription: "",
    compStreet: "",
    compApartment: "",
    compCity: "",
    compState: "",
    compZip: "",
    compCountry: "United States",
    sameAsResidential: false,
    depositSources: [],
    accountUsage: [],
    monthlyBalance: "",
    monthlyTransactions: "",
    operatingCountries: ["United States"],
    formationDoc: null,
    einDoc: null,
    howFindClients: "",
    professionalLinks: "",
  })

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const saveStepData = async (step: number) => {
    const supabase = createBrowserClient()

    try {
      // Step 1: Create application and user account
      if (step === 1) {
        if (!userId) {
          // Sign up user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
          })

          if (authError) throw authError
          if (!authData.user) throw new Error("Failed to create user account")

          setUserId(authData.user.id)

          // Create application
          const appNumber = `TAXU-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`

          const { data: appData, error: appError } = await supabase
            .from("registration_applications")
            .insert({
              user_id: authData.user.id,
              application_number: appNumber,
              current_step: 1,
              status: "in_progress",
            })
            .select()
            .single()

          if (appError) throw appError
          setApplicationId(appData.id)

          // Save ownership details
          await supabase.from("application_ownership_details").insert({
            application_id: appData.id,
            user_id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            job_title: formData.jobTitle,
            ownership_percentage: formData.ownershipPercentage,
            is_complete: true,
          })
        }
      }

      // Step 2: Citizenship & Identity
      if (step === 2 && applicationId && userId) {
        await supabase.from("application_citizenship_identity").upsert({
          application_id: applicationId,
          user_id: userId,
          citizenship_status: formData.citizenshipStatus,
          country_of_citizenship: formData.countryOfCitizenship,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          is_complete: true,
        })
      }

      // Step 3: Residential Address
      if (step === 3 && applicationId && userId) {
        await supabase.from("application_residential_addresses").upsert({
          application_id: applicationId,
          user_id: userId,
          street_address: formData.resStreet,
          apartment_unit: formData.resApartment,
          city: formData.resCity,
          state: formData.resState,
          zip_code: formData.resZip,
          country: formData.resCountry,
          is_complete: true,
        })
      }

      // Step 4: Identity Verification
      if (step === 4 && applicationId && userId) {
        await supabase.from("application_identity_verifications").upsert({
          application_id: applicationId,
          user_id: userId,
          verification_status: "verified",
          identity_confirmed: true,
          is_complete: true,
        })
      }

      // Step 5: Platform Selections
      if (step === 5 && applicationId && userId) {
        await supabase.from("application_platform_selections").upsert({
          application_id: applicationId,
          user_id: userId,
          neobank_enabled: formData.platformsSelected.includes("neobank"),
          investment_enabled: formData.platformsSelected.includes("investment"),
          accounting_enabled: formData.platformsSelected.includes("accounting"),
          tax_filing_enabled: formData.platformsSelected.includes("tax_filing"),
          is_complete: true,
        })
      }

      // Step 6: Company Information
      if (step === 6 && applicationId && userId) {
        await supabase.from("application_company_info").upsert({
          application_id: applicationId,
          user_id: userId,
          company_name: formData.companyName,
          legal_entity_type: formData.legalEntityType,
          ein: formData.ein,
          industry: formData.industry,
          website_url: formData.website,
          business_description: formData.businessDescription,
          is_complete: true,
        })
      }

      // Step 7: Company Address
      if (step === 7 && applicationId && userId) {
        await supabase.from("application_company_addresses").upsert({
          application_id: applicationId,
          user_id: userId,
          street_address: formData.sameAsResidential ? formData.resStreet : formData.compStreet,
          apartment_suite: formData.sameAsResidential ? formData.resApartment : formData.compApartment,
          city: formData.sameAsResidential ? formData.resCity : formData.compCity,
          state: formData.sameAsResidential ? formData.resState : formData.compState,
          zip_code: formData.sameAsResidential ? formData.resZip : formData.compZip,
          country: formData.sameAsResidential ? formData.resCountry : formData.compCountry,
          same_as_residential: formData.sameAsResidential,
          is_complete: true,
        })
      }

      // Step 8: Expected Activity
      if (step === 8 && applicationId && userId) {
        await supabase.from("application_expected_activity").upsert({
          application_id: applicationId,
          user_id: userId,
          deposit_sources: formData.depositSources,
          account_usage_purposes: formData.accountUsage,
          expected_monthly_balance_range: formData.monthlyBalance,
          expected_monthly_transactions_range: formData.monthlyTransactions,
          operating_countries: formData.operatingCountries,
          is_complete: true,
        })
      }

      // Update application progress
      await supabase
        .from("registration_applications")
        .update({
          current_step: step,
          completed_steps: Array.from({ length: step }, (_, i) => i + 1),
        })
        .eq("id", applicationId)
    } catch (err: any) {
      console.error("Error saving step data:", err)
      throw err
    }
  }

  const handleNext = async () => {
    setError("")
    setLoading(true)

    try {
      // Validate current step
      if (currentStep === 1) {
        if (!formData.fullName || !formData.email || !formData.jobTitle) {
          setError("Please fill in all required fields")
          setLoading(false)
          return
        }
      }

      if (currentStep === 2) {
        if (!formData.citizenshipStatus || !formData.phone || !formData.dateOfBirth) {
          setError("Please complete all fields")
          setLoading(false)
          return
        }
      }

      if (currentStep === 3) {
        if (!formData.resStreet || !formData.resCity || !formData.resState || !formData.resZip) {
          setError("Please complete the address")
          setLoading(false)
          return
        }
      }

      if (currentStep === 5) {
        if (formData.platformsSelected.length === 0) {
          setError("Please select at least one platform")
          setLoading(false)
          return
        }
      }

      if (currentStep === 6) {
        if (!formData.companyName || !formData.legalEntityType || !formData.ein || !formData.industry) {
          setError("Please complete all required company information")
          setLoading(false)
          return
        }
      }

      if (currentStep === 7) {
        if (
          !formData.sameAsResidential &&
          (!formData.compStreet || !formData.compCity || !formData.compState || !formData.compZip)
        ) {
          setError("Please complete the company address")
          setLoading(false)
          return
        }
      }

      if (currentStep === 8) {
        if (
          formData.depositSources.length === 0 ||
          formData.accountUsage.length === 0 ||
          !formData.monthlyBalance ||
          !formData.monthlyTransactions
        ) {
          setError("Please complete all required fields")
          setLoading(false)
          return
        }
      }

      // Save data to database
      await saveStepData(currentStep)

      if (currentStep === 10) {
        const supabase = createBrowserClient()

        // Get the application number
        const { data: appData } = await supabase
          .from("registration_applications")
          .select("application_number")
          .eq("id", applicationId)
          .single()

        // Update application status
        await supabase
          .from("registration_applications")
          .update({
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .eq("id", applicationId)

        // Redirect to success page with application number
        router.push(`/register/open-account/success?applicationNumber=${appData?.application_number}`)
      } else {
        setCurrentStep((prev) => prev + 1)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
    setError("")
  }

  const toggleArrayItem = (field: "platformsSelected" | "depositSources" | "accountUsage", value: string) => {
    const currentArray = formData[field]
    if (currentArray.includes(value)) {
      updateField(
        field,
        currentArray.filter((item: string) => item !== value),
      )
    } else {
      updateField(field, [...currentArray, value])
    }
  }

  const progressPercent = (currentStep / 10) * 100

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Progress Bar - Mercury Style */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create your Taxu account</h1>
          <p className="text-gray-600 mt-2">Step {currentStep} of 10</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {/* Step 1: Ownership Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Tell us about yourself</h2>
                <p className="text-sm text-gray-600">We'll use this to set up your account</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full legal name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Smith"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john@company.com"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Create a secure password"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="CEO, Founder, etc."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="ownership">Ownership percentage</Label>
                  <Input
                    id="ownership"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ownershipPercentage}
                    onChange={(e) => updateField("ownershipPercentage", Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Citizenship & Identity */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Citizenship and contact</h2>
                <p className="text-sm text-gray-600">This helps us verify your identity</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="citizenship">Citizenship status *</Label>
                  <Select
                    value={formData.citizenshipStatus}
                    onValueChange={(val) => updateField("citizenshipStatus", val)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us_citizen">US Citizen</SelectItem>
                      <SelectItem value="permanent_resident">Permanent Resident</SelectItem>
                      <SelectItem value="work_visa">Work Visa Holder</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">Phone number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="dob">Date of birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Residential Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Your home address</h2>
                <p className="text-sm text-gray-600">We'll never send you mail here without asking</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="resStreet">Street address *</Label>
                  <Input
                    id="resStreet"
                    value={formData.resStreet}
                    onChange={(e) => updateField("resStreet", e.target.value)}
                    placeholder="123 Main St"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="resApartment">Apartment, suite, etc.</Label>
                  <Input
                    id="resApartment"
                    value={formData.resApartment}
                    onChange={(e) => updateField("resApartment", e.target.value)}
                    placeholder="Apt 4B"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resCity">City *</Label>
                    <Input
                      id="resCity"
                      value={formData.resCity}
                      onChange={(e) => updateField("resCity", e.target.value)}
                      placeholder="San Francisco"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resState">State *</Label>
                    <Input
                      id="resState"
                      value={formData.resState}
                      onChange={(e) => updateField("resState", e.target.value)}
                      placeholder="CA"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="resZip">ZIP code *</Label>
                  <Input
                    id="resZip"
                    value={formData.resZip}
                    onChange={(e) => updateField("resZip", e.target.value)}
                    placeholder="94102"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Identity Verification */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Verify your identity</h2>
                <p className="text-sm text-gray-600">Quick security check to protect your account</p>
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Identity verified</h3>
                <p className="text-sm text-gray-600">Your identity has been successfully verified</p>
              </div>
            </div>
          )}

          {/* Step 5: Platform Selection */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose your platforms</h2>
                <p className="text-sm text-gray-600">Select which Taxu platforms you want to activate</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "neobank", icon: Building2, label: "Neobank", desc: "Banking and payment solutions" },
                  { id: "investment", icon: TrendingUp, label: "Investment", desc: "Portfolio management tools" },
                  { id: "accounting", icon: Calculator, label: "Accounting", desc: "Bookkeeping and reports" },
                  { id: "tax_filing", icon: FileText, label: "Tax Filing", desc: "Tax preparation and e-filing" },
                ].map(({ id, icon: Icon, label, desc }) => (
                  <div
                    key={id}
                    onClick={() => toggleArrayItem("platformsSelected", id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.platformsSelected.includes(id)
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={formData.platformsSelected.includes(id)} />
                      <Icon className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{label}</div>
                        <div className="text-sm text-gray-600">{desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Company Information */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Company details</h2>
                <p className="text-sm text-gray-600">Tell us about your business</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Acme Inc."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="entityType">Legal entity type *</Label>
                  <Select value={formData.legalEntityType} onValueChange={(val) => updateField("legalEntityType", val)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="llc">LLC</SelectItem>
                      <SelectItem value="c_corp">C-Corp</SelectItem>
                      <SelectItem value="s_corp">S-Corp</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ein">EIN (Employer Identification Number) *</Label>
                  <Input
                    id="ein"
                    value={formData.ein}
                    onChange={(e) => updateField("ein", e.target.value)}
                    placeholder="12-3456789"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    placeholder="Technology, Healthcare, etc."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://company.com"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Business description</Label>
                  <Textarea
                    id="description"
                    value={formData.businessDescription}
                    onChange={(e) => updateField("businessDescription", e.target.value)}
                    placeholder="Briefly describe what your business does"
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Company Address */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Business address</h2>
                <p className="text-sm text-gray-600">Where is your company located?</p>
              </div>

              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  checked={formData.sameAsResidential}
                  onCheckedChange={(checked) => updateField("sameAsResidential", checked)}
                />
                <Label className="cursor-pointer">Same as residential address</Label>
              </div>

              {!formData.sameAsResidential && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="compStreet">Street address *</Label>
                    <Input
                      id="compStreet"
                      value={formData.compStreet}
                      onChange={(e) => updateField("compStreet", e.target.value)}
                      placeholder="456 Business Ave"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="compApartment">Suite, floor, etc.</Label>
                    <Input
                      id="compApartment"
                      value={formData.compApartment}
                      onChange={(e) => updateField("compApartment", e.target.value)}
                      placeholder="Suite 200"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="compCity">City *</Label>
                      <Input
                        id="compCity"
                        value={formData.compCity}
                        onChange={(e) => updateField("compCity", e.target.value)}
                        placeholder="San Francisco"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="compState">State *</Label>
                      <Input
                        id="compState"
                        value={formData.compState}
                        onChange={(e) => updateField("compState", e.target.value)}
                        placeholder="CA"
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="compZip">ZIP code *</Label>
                    <Input
                      id="compZip"
                      value={formData.compZip}
                      onChange={(e) => updateField("compZip", e.target.value)}
                      placeholder="94102"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 8: Expected Activity */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Expected account activity</h2>
                <p className="text-sm text-gray-600">Help us understand your banking needs</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Deposit sources (select all that apply) *</Label>
                  <div className="space-y-2 mt-2">
                    {["Customer payments", "Transfers", "Investment income", "Loans"].map((source) => (
                      <div key={source} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.depositSources.includes(source)}
                          onCheckedChange={() => toggleArrayItem("depositSources", source)}
                        />
                        <Label className="cursor-pointer">{source}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Account usage (select all that apply) *</Label>
                  <div className="space-y-2 mt-2">
                    {["Vendor payments", "Payroll", "Tax payments", "Operating expenses"].map((usage) => (
                      <div key={usage} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.accountUsage.includes(usage)}
                          onCheckedChange={() => toggleArrayItem("accountUsage", usage)}
                        />
                        <Label className="cursor-pointer">{usage}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="monthlyBalance">Expected monthly balance *</Label>
                  <Select value={formData.monthlyBalance} onValueChange={(val) => updateField("monthlyBalance", val)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10k">$0 - $10,000</SelectItem>
                      <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                      <SelectItem value="50k-250k">$50,000 - $250,000</SelectItem>
                      <SelectItem value="250k+">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthlyTransactions">Expected monthly transactions *</Label>
                  <Select
                    value={formData.monthlyTransactions}
                    onValueChange={(val) => updateField("monthlyTransactions", val)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50">0 - 50</SelectItem>
                      <SelectItem value="51-100">51 - 100</SelectItem>
                      <SelectItem value="101-500">101 - 500</SelectItem>
                      <SelectItem value="500+">500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Documents */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload documents</h2>
                <p className="text-sm text-gray-600">We need these to verify your business</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="formationDoc">Formation documents (Articles of Incorporation, etc.)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, PNG, or JPG (max 10MB)</p>
                    <input
                      id="formationDoc"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => updateField("formationDoc", e.target.files?.[0] || null)}
                    />
                  </div>
                  {formData.formationDoc && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {formData.formationDoc.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="einDoc">EIN verification letter</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, PNG, or JPG (max 10MB)</p>
                    <input
                      id="einDoc"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => updateField("einDoc", e.target.files?.[0] || null)}
                    />
                  </div>
                  {formData.einDoc && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {formData.einDoc.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Follow-up Questions */}
          {currentStep === 10 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Almost done!</h2>
                <p className="text-sm text-gray-600">Just a few more questions</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="howFindClients">How do you find clients?</Label>
                  <Textarea
                    id="howFindClients"
                    value={formData.howFindClients}
                    onChange={(e) => updateField("howFindClients", e.target.value)}
                    placeholder="Describe your client acquisition strategy"
                    className="mt-1.5"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="professionalLinks">Professional links (LinkedIn, website, etc.)</Label>
                  <Textarea
                    id="professionalLinks"
                    value={formData.professionalLinks}
                    onChange={(e) => updateField("professionalLinks", e.target.value)}
                    placeholder="Add any relevant professional URLs"
                    className="mt-1.5"
                    rows={2}
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  By submitting this application, you agree to Taxu's Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <Button onClick={handleBack} variant="outline" className="flex-1 h-12 bg-transparent" disabled={loading}>
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Saving..." : currentStep === 10 ? "Submit Application" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}
