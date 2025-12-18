"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Smartphone,
  CheckCircle2,
  Loader2,
  X,
  ArrowLeft,
  CreditCard,
  UserPlus,
} from "lucide-react"
import { usePlaidLink } from "react-plaid-link"

const STEPS = [
  { id: 1, name: "Fund your account", completed: false },
  { id: 2, name: "Set up Taxu IO credit card", completed: false },
  { id: 3, name: "Invite team members", completed: false },
  { id: 4, name: "Enable two-factor authentication", completed: false, required: true },
  { id: 5, name: "Get mobile updates", completed: false },
]

export function MercuryStyleOnboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro
  const [loading, setLoading] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connectedBank, setConnectedBank] = useState<any>(null)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferQueued, setTransferQueued] = useState(false)
  const [physicalCard, setPhysicalCard] = useState(true)
  const [companyName, setCompanyName] = useState("Taxu Inc.")
  const [companyAddress, setCompanyAddress] = useState("1767 Tearose Lane, Cherry Hill Township, NJ 08003")
  const [teamMembers, setTeamMembers] = useState<any[]>([{ name: "Sam Lightson", email: "sam@taxu.io", role: "Admin" }])
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [phoneForUpdates, setPhoneForUpdates] = useState("")
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Fetch Plaid link token
  useEffect(() => {
    if (currentStep > 0 && !linkToken) {
      fetchLinkToken()
    }
  }, [currentStep])

  const fetchLinkToken = async () => {
    try {
      const response = await fetch("/api/plaid/create-link-token", { method: "POST" })
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
        const response = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicToken,
            providerName: metadata.institution?.name || "Bank",
          }),
        })

        if (response.ok) {
          setConnectedBank({
            name: metadata.accounts[0]?.name || "Bank Account",
            mask: metadata.accounts[0]?.mask || "0000",
            institution: metadata.institution?.name || "Bank",
            accounts: metadata.accounts || [],
          })
          setSelectedAccount(metadata.accounts[0])
          setShowVerification(false)
        }
      } catch (error) {
        console.error("[v0] Plaid token exchange error:", error)
      } finally {
        setLoading(false)
      }
    },
    onExit: (err) => {
      if (err) console.error("[v0] Plaid error:", err)
    },
  })

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep) && currentStep > 0) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    setCurrentStep(currentStep + 1)
  }

  const handleSkip = () => {
    if (currentStep === 4) return // Can't skip 2FA
    setCurrentStep(currentStep + 1)
  }

  const sendVerificationCode = () => {
    setShowVerification(true)
    // Simulate sending code
    console.log(`[v0] Verification code sent to ${phoneNumber}`)
  }

  const verifyCode = () => {
    if (verificationCode.length === 6) {
      setShowVerification(false)
      if (plaidReady) {
        openPlaid()
      }
    }
  }

  // Intro Screen - Plaid Connection
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border border-slate-200 shadow-xl relative">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => router.push("/neobank")}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">
            Taxu uses Plaid to connect your account
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Connect in seconds</div>
                <div className="text-sm text-slate-600">
                  Thousands of apps trust Plaid to quickly connect to financial institutions
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Keep your data safe</div>
                <div className="text-sm text-slate-600">
                  Plaid uses best-in-class encryption to help protect your data
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">Protect your accounts</div>
                <div className="text-sm text-slate-600">
                  Plaid helps minimize fraud and risk by using account info, transaction history, and connection history
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNextStep}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
          >
            Continue
          </Button>

          <p className="text-xs text-center text-slate-500 mt-4">
            By continuing, you agree to Plaid's{" "}
            <a href="#" className="underline hover:text-slate-700">
              Privacy Policy
            </a>{" "}
            and to receiving updates on plaid.com
          </p>
        </Card>
      </div>
    )
  }

  // Phone Number Entry
  if (currentStep === 1 && !connectedBank) {
    if (showVerification) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 border border-slate-200 shadow-xl relative">
            {/* Plaid Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                  <div className="w-2 h-2 bg-white rounded-sm" />
                  <div className="w-2 h-2 bg-white rounded-sm" />
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1 bg-slate-200 rounded-full">
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-2/3 transition-all" />
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setShowVerification(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => router.push("/neobank")}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Phone Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-cyan-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">Verify your phone number</h2>
            <p className="text-center text-slate-600 mb-8">
              Enter the code sent to <span className="font-semibold">(•••) ••• {phoneNumber.slice(-4)}</span> to access
              your saved accounts.
            </p>

            <div className="mb-6">
              <Label>Code</Label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setVerificationCode(value)
                  if (value.length === 6) {
                    setTimeout(() => verifyCode(), 500)
                  }
                }}
                placeholder="735096"
                maxLength={6}
                className="h-14 text-center text-2xl tracking-widest font-mono mt-2"
              />
            </div>

            <Button
              onClick={verifyCode}
              disabled={verificationCode.length !== 6 || loading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
            </Button>

            <button className="w-full text-center text-slate-600 hover:text-slate-900 mt-4 font-medium">
              Resend code
            </button>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border border-slate-200 shadow-xl relative">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-1/3 transition-all" />
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => setCurrentStep(0)}
            className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Close Button */}
          <button
            onClick={() => router.push("/neobank")}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Phone Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-cyan-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-3">Enter your phone number</h2>
          <p className="text-center text-slate-600 mb-8">
            Use your phone number to log in or sign up with Plaid to go faster next time.
          </p>

          <div className="mb-6">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg bg-white">
                <span className="text-xl">🇺🇸</span>
                <span className="text-slate-700 font-medium">+1</span>
              </div>
              <Input
                type="tel"
                placeholder="(609) 933-0233"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 h-12 border border-slate-300"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              By continuing, you agree to Plaid's{" "}
              <a href="#" className="underline hover:text-slate-700">
                Terms
              </a>
            </p>
          </div>

          <Button
            onClick={sendVerificationCode}
            disabled={!phoneNumber.trim() || loading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
          </Button>

          <button className="w-full text-center text-slate-600 hover:text-slate-900 mt-4 font-medium">
            Continue as guest
          </button>
        </Card>
      </div>
    )
  }

  // Select Account Screen
  if (currentStep === 1 && connectedBank && !selectedAccount) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border border-slate-200 shadow-xl relative">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full w-full transition-all" />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => router.push("/neobank")}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Select an account</h2>
          <p className="text-center text-slate-600 mb-8">Plaid will only share data from the selected account.</p>

          <div className="space-y-3 mb-8">
            {connectedBank.accounts.map((account: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedAccount(account)}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all"
              >
                <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                  {connectedBank.institution.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-900">{account.name || "TD Bank"}</div>
                  <div className="text-sm text-slate-600">••••{account.mask}</div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNextStep}
            disabled={!selectedAccount}
            className="w-full h-12 bg-slate-500 hover:bg-slate-600 text-white font-semibold disabled:bg-slate-300"
          >
            Confirm
          </Button>

          <button className="w-full text-center text-cyan-600 hover:text-cyan-700 mt-4 font-medium flex items-center justify-center gap-1">
            <span>+</span>
            <span>Add new account</span>
          </button>
        </Card>
      </div>
    )
  }

  // Mercury-style Main Onboarding Steps
  return (
    <div className="min-h-screen bg-[#0f1729] text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-[#0a0f1e]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#635BFF] to-[#5046E5] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold">TAXU</span>
          </div>
          <button className="text-sm text-slate-300 hover:text-white flex items-center gap-2 transition-colors">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              SL
            </div>
            Sam Lightson
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div>
              <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">TAXU, INC.</div>
              <h1 className="text-4xl font-bold mb-3">You're nearly there!</h1>
              <p className="text-slate-300 text-lg">
                {currentStep === 4
                  ? "Complete the required setup step to start using Taxu."
                  : "Complete the required setup step to start using Taxu."}
              </p>
            </div>

            {/* Step Content */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Step 2: Fund Account */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <h2 className="text-2xl font-bold">Fund your account</h2>
                  </div>

                  <Card className="p-8 bg-[#1a2332] border-slate-700">
                    {transferQueued ? (
                      <div className="space-y-6">
                        <div className="text-4xl font-bold text-white">${transferAmount}</div>

                        <div className="flex items-center justify-between p-5 bg-[#0f1729] rounded-lg border border-slate-700">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                              {connectedBank?.institution.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-lg">
                                {selectedAccount?.name?.toUpperCase()} ...{selectedAccount?.mask} ••
                                {selectedAccount?.mask}
                              </div>
                              <div className="text-sm text-slate-400">
                                Business Checking – {connectedBank?.institution}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#0f1729] rounded-lg border border-slate-700">
                          <div className="text-slate-300">Your transfer is queued.</div>
                        </div>

                        <Button
                          onClick={handleNextStep}
                          className="w-full bg-[#635BFF] hover:bg-[#5046E5] h-12 text-lg font-semibold"
                        >
                          Next
                        </Button>

                        <div className="text-center">
                          <button className="text-slate-400 hover:text-slate-300 text-sm">
                            Moving large amounts? Don't have a US bank account?{" "}
                            <span className="underline">Skip this step</span> and make a wire transfer after approval.
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-slate-300 text-base mb-3 block">From</Label>
                          <div className="flex items-center justify-between p-5 bg-[#0f1729] rounded-lg border border-slate-700">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                                {connectedBank?.institution.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-white text-lg">
                                  {selectedAccount?.name?.toUpperCase()} ...{selectedAccount?.mask} ••
                                  {selectedAccount?.mask}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Business Checking – {connectedBank?.institution}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-slate-300 text-base mb-3 block">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-5 top-4 text-slate-300 text-xl">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              placeholder="0.00"
                              className="pl-10 bg-[#0f1729] border-slate-700 text-white h-14 text-xl"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => setTransferQueued(true)}
                          disabled={!transferAmount || Number.parseFloat(transferAmount) <= 0}
                          className="w-full bg-[#635BFF] hover:bg-[#5046E5] h-12 text-lg font-semibold disabled:bg-slate-700"
                        >
                          Schedule Transfer
                        </Button>

                        <div className="text-center">
                          <button
                            onClick={handleSkip}
                            className="text-slate-400 hover:text-slate-300 text-sm inline-flex items-center gap-1"
                          >
                            Moving large amounts? <span className="underline">Skip this</span> and make a wire transfer
                            after approval.
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* Step 3: Set up Credit Card */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h2 className="text-2xl font-bold">Set up Taxu IO credit card</h2>
                  </div>

                  <Card className="p-8 bg-[#1a2332] border-slate-700">
                    <div className="mb-8">
                      {/* Credit Card Preview */}
                      <div className="relative w-full h-52 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl mb-6">
                        <div className="absolute top-6 right-6">
                          <div className="flex gap-1">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur" />
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur -ml-4" />
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="text-white font-semibold mb-2">{companyName}</div>
                          <div className="text-white/60 text-xs">mastercard</div>
                        </div>
                      </div>

                      {/* Benefits List */}
                      <div className="space-y-4 mb-8">
                        <div className="flex gap-3">
                          <CreditCard className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-white">1.5% cashback on all purchases</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Shield className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-white">Variable limit based on balance</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Zap className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-white">No interest or annual fees</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Lock className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-white">No impact on personal credit score</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-slate-300 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-white">Balance automatically paid daily</div>
                          </div>
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <Label className="text-slate-300 text-sm mb-2 block">Company name on card</Label>
                          <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="bg-[#0f1729] border-slate-700 text-white"
                            maxLength={23}
                          />
                          <p className="text-xs text-slate-400 mt-1">Printed on all cards (9 of 23 characters)</p>
                        </div>

                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="physical-card"
                            checked={physicalCard}
                            onCheckedChange={(checked) => setPhysicalCard(checked as boolean)}
                            className="mt-1 border-slate-600"
                          />
                          <div className="flex-1">
                            <Label htmlFor="physical-card" className="text-white font-semibold cursor-pointer">
                              Send me a physical card
                            </Label>
                            <p className="text-sm text-slate-400">
                              Arrives 2-4 days after first deposit but you can start spending with virtual cards.
                            </p>
                            {physicalCard && (
                              <div className="mt-3 p-4 bg-[#0f1729] rounded-lg border border-slate-700">
                                <div className="text-sm text-slate-300">{companyAddress}</div>
                                <button className="text-sm text-[#635BFF] hover:text-[#5046E5] mt-2 flex items-center gap-1">
                                  Update company address <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Skip for now
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="flex-1 bg-[#635BFF] hover:bg-[#5046E5] h-12 font-semibold"
                      >
                        Next
                      </Button>
                    </div>

                    <div className="mt-6 text-center">
                      <button className="text-sm text-slate-400 hover:text-slate-300">
                        By clicking "Next," I agree to Mercury's{" "}
                        <a href="#" className="underline">
                          Cardholder Agreement
                        </a>
                      </button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 4: Invite Team Members */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <h2 className="text-2xl font-bold">Invite team members</h2>
                  </div>

                  <Card className="p-8 bg-[#1a2332] border-slate-700">
                    <div className="space-y-4 mb-8">
                      {teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-[#0f1729] rounded-lg border border-slate-700"
                        >
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{member.name}</div>
                            <div className="text-sm text-slate-400">{member.email}</div>
                          </div>
                          <Badge className="bg-[#635BFF] text-white">{member.role}</Badge>
                        </div>
                      ))}

                      <button className="flex items-center gap-2 text-[#635BFF] hover:text-[#5046E5] font-semibold w-full justify-center py-4 border-2 border-dashed border-slate-700 rounded-lg hover:border-[#635BFF] transition-colors">
                        <UserPlus className="w-5 h-5" />
                        Add a team member
                      </button>
                    </div>

                    <div className="p-4 bg-[#0f1729]/50 rounded-lg border border-slate-700/50 mb-6">
                      <div className="flex gap-2 text-sm text-slate-300">
                        <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>Team members will be invited after you're approved</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      className="w-full bg-[#635BFF] hover:bg-[#5046E5] h-12 font-semibold"
                    >
                      Next
                    </Button>
                  </Card>
                </div>
              )}

              {/* Step 5: Enable Two-Factor Authentication */}
              {currentStep === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">Enable two-factor authentication</h2>
                      <Badge className="mt-2 bg-red-600 text-white">Required</Badge>
                    </div>
                  </div>

                  <Card className="p-8 bg-[#1a2332] border-slate-700">
                    <p className="text-slate-300 mb-6">
                      Each time you log in, you'll need to enter a unique code generated by an app for added security.
                      Not sure which app to use? Check out our guide{" "}
                      <a href="#" className="text-[#635BFF] hover:underline">
                        here
                      </a>
                      .
                    </p>

                    {/* Tab Selection */}
                    <div className="flex gap-2 mb-6 bg-[#0f1729] p-1 rounded-lg">
                      <button className="flex-1 py-2 px-4 bg-slate-700 text-white rounded-lg font-semibold">
                        Taxu app
                      </button>
                      <button className="flex-1 py-2 px-4 text-slate-400 hover:text-white rounded-lg">
                        Other authentication app
                      </button>
                    </div>

                    {/* Step 1: Open App */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <h3 className="font-semibold text-white">Open the Taxu app on your phone</h3>
                      </div>
                      <div className="flex gap-4 ml-8">
                        <div className="flex-1 p-6 bg-[#0f1729] rounded-lg border border-slate-700">
                          <img
                            src="/placeholder.svg?height=200&width=100"
                            alt="Phone screenshot 1"
                            className="mx-auto rounded-lg mb-2"
                          />
                          <p className="text-xs text-slate-400 text-center">
                            If logged out, tap the 2FA Codes button or the QR Code icon.
                          </p>
                        </div>
                        <div className="flex-1 p-6 bg-[#0f1729] rounded-lg border border-slate-700">
                          <img
                            src="/placeholder.svg?height=200&width=100"
                            alt="Phone screenshot 2"
                            className="mx-auto rounded-lg mb-2"
                          />
                          <p className="text-xs text-slate-400 text-center">
                            If logged in, go to Settings {">"} Two-Factor Authentication → "•"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Scan QR Code */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <h3 className="font-semibold text-white">Scan this QR code using the camera in the Taxu app</h3>
                      </div>
                      <div className="ml-8 p-6 bg-white inline-block rounded-lg">
                        <img src="/placeholder.svg?height=200&width=200" alt="QR Code" className="w-48 h-48" />
                      </div>
                    </div>

                    {/* Step 3: Enter Code */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <h3 className="font-semibold text-white">Enter the code generated by the app</h3>
                      </div>
                      <div className="ml-8">
                        <Input
                          type="text"
                          value={twoFactorCode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                            setTwoFactorCode(value)
                          }}
                          placeholder="000 – 000"
                          maxLength={6}
                          className="w-64 h-14 text-center text-2xl tracking-widest font-mono bg-[#0f1729] border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleNextStep}
                      disabled={twoFactorCode.length !== 6}
                      className="w-full bg-[#635BFF] hover:bg-[#5046E5] h-12 font-semibold disabled:bg-slate-700"
                    >
                      Enable 2FA
                    </Button>
                  </Card>
                </div>
              )}

              {/* Step 6: Get Mobile Updates */}
              {currentStep === 6 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold">
                      5
                    </div>
                    <h2 className="text-2xl font-bold">Get mobile updates</h2>
                  </div>

                  <Card className="p-8 bg-[#1a2332] border-slate-700">
                    <p className="text-slate-300 mb-6">
                      Get notified about important account activity via SMS. Standard messaging rates apply.
                    </p>

                    <div className="mb-6">
                      <Label className="text-slate-300 text-base mb-3 block">Mobile phone number</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-4 py-3 border border-slate-700 rounded-lg bg-[#0f1729]">
                          <span className="text-xl">🇺🇸</span>
                          <span className="text-slate-300">+1</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phoneForUpdates}
                          onChange={(e) => setPhoneForUpdates(e.target.value)}
                          className="flex-1 h-12 bg-[#0f1729] border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => router.push("/neobank")}
                        variant="outline"
                        className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800"
                      >
                        Skip for now
                      </Button>
                      <Button
                        onClick={() => router.push("/neobank")}
                        disabled={!phoneForUpdates.trim()}
                        className="flex-1 bg-[#635BFF] hover:bg-[#5046E5] h-12 font-semibold disabled:bg-slate-700"
                      >
                        Finish Setup
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="hidden lg:block">
            <Card className="p-6 bg-[#1a2332] border-slate-700 sticky top-6">
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-2">Application timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#635BFF]" />
                      <div className="w-0.5 h-full bg-slate-700 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-semibold text-white">Apply</div>
                      <div className="text-sm text-slate-400">Received Dec 12</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#635BFF]" />
                      <div className="w-0.5 h-full bg-slate-700 mt-1" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-semibold text-white">In review</div>
                      <div className="text-sm text-slate-400">Approx. 1 day</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-slate-700" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-400">Account ready</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <h3 className="font-semibold text-white mb-2">Questions?</h3>
                <p className="text-sm text-slate-400 mb-2">Our support team can help:</p>
                <a href="mailto:help@taxu.com" className="text-sm text-[#635BFF] hover:underline">
                  help@taxu.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
