"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Building2,
  Shield,
  Lock,
  Zap,
  Phone,
  Mail,
  Banknote,
  X,
} from "lucide-react"
import { usePlaidLink } from "react-plaid-link"

const STEPS = [
  { id: "account-type", title: "Account Type" },
  { id: "personal-info", title: "Personal Information" },
  { id: "verify-phone", title: "Verify Phone" },
  { id: "connect-bank", title: "Connect Bank" },
  { id: "funding", title: "Initial Funding" },
  { id: "review", title: "Review & Submit" },
]

export default function MercuryRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    accountType: "" as "individual" | "business" | "",
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    phoneNumber: "",
    verificationCode: "",
    plaidConnected: false,
    plaidAccounts: [] as any[],
    fundingMethod: "" as "transfer" | "wire" | "skip" | "",
  })

  // Get Plaid link token
  useEffect(() => {
    if (currentStep === 3 && !linkToken) {
      fetchLinkToken()
    }
  }, [currentStep])

  const fetchLinkToken = async () => {
    try {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      })
      const data = await response.json()
      setLinkToken(data.linkToken)
    } catch (error) {
      console.error("[v0] Error fetching link token:", error)
    }
  }

  // Plaid Link configuration
  const { open: openPlaid, ready: plaidReady } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        setLoading(true)
        // Exchange public token for access token
        const response = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicToken,
            providerName: metadata.institution?.name || "Bank",
          }),
        })

        if (response.ok) {
          setFormData({
            ...formData,
            plaidConnected: true,
            plaidAccounts: metadata.accounts || [],
          })
          setCurrentStep(4) // Move to funding step
        }
      } catch (error) {
        console.error("[v0] Plaid token exchange error:", error)
      } finally {
        setLoading(false)
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error("[v0] Plaid error:", err)
      }
    },
  })

  const handleSignup = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Create auth account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/neobank/dashboard`,
          data: {
            full_name: formData.fullName,
            account_type: formData.accountType,
            business_name: formData.businessName || null,
            phone_number: formData.phoneNumber,
          },
        },
      })

      if (signUpError) throw signUpError

      // Create neobank account
      if (authData.user) {
        const { error: accountError } = await supabase.from("neobank_accounts").insert([
          {
            user_id: authData.user.id,
            account_type: "checking",
            account_number: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
            routing_number: "121000248",
            balance: 0,
            currency: "USD",
            status: "active",
          },
        ])

        if (accountError) throw accountError

        // Redirect to dashboard
        router.push("/neobank/dashboard")
      }
    } catch (error: any) {
      console.error("[v0] Signup error:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const sendVerificationCode = async () => {
    // Simulate sending verification code
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    alert(`Verification code sent to ${formData.phoneNumber}`)
  }

  const verifyPhoneNumber = () => {
    // Simulate verification
    if (formData.verificationCode === "735096" || formData.verificationCode.length === 6) {
      setCurrentStep(3) // Move to bank connection
    } else {
      alert("Invalid verification code")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Progress */}
      <div className="w-80 bg-white border-r border-slate-200 p-8 hidden lg:flex flex-col">
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">Close</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#635BFF] to-[#7C66FF] rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Taxu</h1>
          </div>
          <p className="text-sm text-slate-500 mt-2">Banking for your business</p>
        </div>

        <div className="space-y-6 flex-1">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div key={step.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                    isCompleted
                      ? "bg-[#635BFF] text-white"
                      : isActive
                        ? "bg-[#635BFF]/10 border-2 border-[#635BFF] text-[#635BFF]"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-[#635BFF]" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className={cn("font-semibold text-sm", isActive ? "text-slate-900" : "text-slate-600")}>
                    {step.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Shield className="w-4 h-4 text-[#635BFF]" />
            <span>256-bit encryption</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="w-4 h-4 text-[#635BFF]" />
            <span>FDIC insured</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-12 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Step 0: Account Type */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose your account type</h2>
                <p className="text-slate-600 leading-relaxed">
                  Select whether you're registering as an individual or on behalf of a business.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={cn(
                    "p-6 cursor-pointer border-2 transition-all hover:shadow-lg",
                    formData.accountType === "individual"
                      ? "border-[#635BFF] bg-[#635BFF]/5"
                      : "border-slate-200 hover:border-[#635BFF]/30",
                  )}
                  onClick={() => setFormData({ ...formData, accountType: "individual" })}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                        formData.accountType === "individual" ? "bg-[#635BFF]" : "bg-slate-100",
                      )}
                    >
                      <User
                        className={cn(
                          "w-8 h-8",
                          formData.accountType === "individual" ? "text-white" : "text-slate-400",
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Individual</h3>
                      <p className="text-sm text-slate-600">For personal accounts and individual use</p>
                    </div>
                  </div>
                </Card>

                <Card
                  className={cn(
                    "p-6 cursor-pointer border-2 transition-all hover:shadow-lg",
                    formData.accountType === "business"
                      ? "border-[#635BFF] bg-[#635BFF]/5"
                      : "border-slate-200 hover:border-[#635BFF]/30",
                  )}
                  onClick={() => setFormData({ ...formData, accountType: "business" })}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                        formData.accountType === "business" ? "bg-[#635BFF]" : "bg-slate-100",
                      )}
                    >
                      <Building2
                        className={cn("w-8 h-8", formData.accountType === "business" ? "text-white" : "text-slate-400")}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Business</h3>
                      <p className="text-sm text-slate-600">For companies and organizations</p>
                    </div>
                  </div>
                </Card>
              </div>

              {formData.accountType && (
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(1)}
                  className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  {formData.accountType === "individual" ? "Tell us about yourself" : "Tell us about your business"}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This information helps us verify your{" "}
                  {formData.accountType === "individual" ? "identity" : "business"} and comply with regulatory
                  requirements.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 pl-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 pl-12"
                    />
                  </div>
                </div>

                {formData.accountType === "individual" ? (
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="h-12 pl-12"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="businessName">Business name</Label>
                    <div className="relative mt-2">
                      <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <Input
                        id="businessName"
                        placeholder="Acme Inc."
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="h-12 pl-12"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+1 (609) 933-0233"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="h-12 pl-12"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Use your phone number to log in or sign up with Plaid to go faster next time.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(0)} className="flex-1 h-12">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.email || !formData.password || !(formData.fullName || formData.businessName)}
                    className="flex-[2] bg-[#635BFF] hover:bg-[#5046E5] text-white h-12"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <p className="text-xs text-center text-slate-500">
                  By continuing, you agree to Plaid's{" "}
                  <a href="#" className="underline hover:text-slate-700">
                    Terms
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Verify Phone */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#635BFF]/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#635BFF]" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Verify your phone number</h2>
                <p className="text-slate-600 leading-relaxed">
                  Enter the code sent to <span className="font-semibold">{formData.phoneNumber}</span> to access your
                  saved accounts.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="verificationCode">Code</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="735096"
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                    className="h-12 text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                </div>

                <Button
                  onClick={verifyPhoneNumber}
                  disabled={formData.verificationCode.length !== 6 || loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12"
                >
                  {loading ? "Verifying..." : "Continue"}
                </Button>

                <button
                  onClick={sendVerificationCode}
                  className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Resend code
                </button>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="inline w-4 h-4 mr-1" />
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Connect Bank with Plaid */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Taxu uses Plaid to connect your account</h2>
              </div>

              <Card className="p-6 bg-white border border-slate-200">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2 h-fit rounded-lg bg-emerald-500/10">
                      <Zap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Connect in seconds</h3>
                      <p className="text-sm text-slate-600">
                        Thousands of apps trust Plaid to quickly connect to financial institutions
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-2 h-fit rounded-lg bg-blue-500/10">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Keep your data safe</h3>
                      <p className="text-sm text-slate-600">
                        Plaid uses best-in-class encryption to help protect your data
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="p-2 h-fit rounded-lg bg-violet-500/10">
                      <Lock className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Protect your accounts</h3>
                      <p className="text-sm text-slate-600">
                        Plaid helps minimize fraud and risk by using account info, transaction history, and connection
                        history
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={() => plaidReady && openPlaid()}
                  disabled={!plaidReady || loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12"
                >
                  {loading ? "Connecting..." : "Continue"}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  By continuing, you agree to Plaid's{" "}
                  <a href="#" className="underline hover:text-slate-700">
                    Privacy Policy
                  </a>{" "}
                  and to receiving updates on plaid.com
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Initial Funding */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Bank Connected
                </Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Set up your first deposit</h2>
                <p className="text-slate-600 leading-relaxed">
                  Connect your US bank to schedule a transfer or make a wire transfer after approval.
                </p>
              </div>

              <Card className="p-6 border-2 border-[#635BFF] bg-[#635BFF]/5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">{formData.plaidAccounts[0]?.name || "Bank Account"}</div>
                        <div className="text-sm text-slate-600">••••{formData.plaidAccounts[0]?.mask || "0000"}</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Priority review for applications with scheduled transfers
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Instant access to cards and payments post-approval
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Securely connect with all major banks via Plaid
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Wise", logo: "/images/wise-logo.png" },
                  { name: "Chase", logo: "/images/chase-logo.png" },
                  { name: "Capital One", logo: "/images/capital-one-logo.png" },
                  { name: "Chime", logo: "/images/chime-logo.png" },
                  { name: "Ally", logo: "/images/ally-logo.png" },
                ].map((bank) => (
                  <div
                    key={bank.name}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-slate-600">{bank.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setCurrentStep(5)}
                  className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white h-12"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-sm text-center text-slate-500">
                  Moving large amounts? Don't have a US bank account?{" "}
                  <button onClick={() => setCurrentStep(5)} className="text-[#635BFF] hover:underline">
                    Skip this step
                  </button>{" "}
                  and make a wire transfer after approval.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">You're nearly there!</h2>
                <p className="text-slate-600 leading-relaxed">Review your information and complete your application.</p>
              </div>

              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Account Type</span>
                      <span className="font-medium capitalize">{formData.accountType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {formData.accountType === "individual" ? "Name" : "Business Name"}
                      </span>
                      <span className="font-medium">{formData.fullName || formData.businessName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Phone</span>
                      <span className="font-medium">{formData.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {formData.plaidConnected && (
                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Connected Bank</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{formData.plaidAccounts[0]?.name || "Bank Account"}</div>
                        <div className="text-sm text-slate-600">••••{formData.plaidAccounts[0]?.mask || "0000"}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">Application Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#635BFF]"></div>
                      <div>
                        <div className="font-medium text-sm">Apply</div>
                        <div className="text-xs text-slate-500">Received Dec 12</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div>
                        <div className="font-medium text-sm text-slate-600">In review</div>
                        <div className="text-xs text-slate-500">Approx. 1 day</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div>
                        <div className="font-medium text-sm text-slate-600">Account ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white h-12"
                >
                  {loading ? "Creating Account..." : "Submit Application"}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  By submitting, you agree to Taxu's Terms of Service and Privacy Policy
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-sm mb-2">Questions?</h4>
                <p className="text-sm text-slate-600">
                  Our support team can help:{" "}
                  <a href="mailto:help@taxu.com" className="text-[#635BFF] hover:underline">
                    help@taxu.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
