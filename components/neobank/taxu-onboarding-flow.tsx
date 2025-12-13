"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Shield, Zap, Lock, CreditCard, UserPlus, Loader2, Smartphone, Building2 } from "lucide-react"
import { usePlaidLink } from "react-plaid-link"

const STEPS = [
  { id: 1, name: "Fund your account", completed: false },
  { id: 2, name: "Set up Taxu IO credit card", completed: false },
  { id: 3, name: "Invite team members", completed: false },
  { id: 4, name: "Enable two-factor authentication", completed: false, required: true },
  { id: 5, name: "Get mobile updates", completed: false },
]

export function TaxuOnboardingFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0) // 0 = intro
  const [loading, setLoading] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connectedBank, setConnectedBank] = useState<any>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [transferQueued, setTransferQueued] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [physicalCard, setPhysicalCard] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Fetch Plaid link token
  useEffect(() => {
    if (currentStep === 1 && !linkToken) {
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

  const handleContinue = () => {
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }
    setCurrentStep(currentStep + 1)
  }

  const handleSkip = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleFinish = () => {
    router.push("/neobank")
  }

  // Intro Screen - Plaid Connection
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-2 border-slate-200 shadow-lg">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
            onClick={handleContinue}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
          >
            Continue
          </Button>

          <p className="text-xs text-center text-slate-500 mt-4">
            By continuing, you agree to Plaid's{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>{" "}
            and to receiving updates on plaid.com
          </p>
        </Card>
      </div>
    )
  }

  // Phone Number Entry
  if (currentStep === 1 && !showVerification && !connectedBank) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-2 border-slate-200 shadow-lg relative">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-1/3"></div>
            </div>
          </div>

          {/* Close Button */}
          <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              <div className="flex items-center gap-2 px-3 py-3 border-2 border-slate-300 rounded-lg bg-white">
                <span className="text-2xl">🇺🇸</span>
                <span className="text-slate-700">+1</span>
              </div>
              <Input
                type="tel"
                placeholder="Phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 h-12 border-2 border-slate-300"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              By continuing, you agree to Plaid's{" "}
              <a href="#" className="underline">
                Terms
              </a>
            </p>
          </div>

          <Button
            onClick={() => plaidReady && openPlaid()}
            disabled={!phoneNumber.trim() || !plaidReady || loading}
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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 border-2 border-slate-200 shadow-lg relative">
          {/* Plaid Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-2/3"></div>
            </div>
          </div>

          {/* Close Button */}
          <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Select an account</h2>
          <p className="text-center text-slate-600 mb-8">Plaid will only share data from the selected account.</p>

          <div className="space-y-3 mb-8">
            {connectedBank.accounts.map((account: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedAccount(account)}
                className="w-full flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-cyan-500 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold">
                  {connectedBank.institution.charAt(0)}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-900">{account.name}</div>
                  <div className="text-sm text-slate-600">••••{account.mask}</div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNextStep}
            disabled={!selectedAccount}
            className="w-full h-12 bg-slate-400 hover:bg-slate-500 text-white font-semibold disabled:bg-slate-300"
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

  // Mercury-style Onboarding Steps
  return (
    <div className="min-h-screen bg-[#1a1f36] text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-[#0f1729]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#635bff] to-[#5046e5] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold">TAXU</span>
          </div>
          <button className="text-sm text-slate-300 hover:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
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
          <div>
            <div className="mb-8">
              <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">TAXU, INC.</div>
              <h1 className="text-4xl font-bold mb-3">You're nearly there!</h1>
              <p className="text-slate-300 text-lg">
                {currentStep === 4
                  ? "Complete the required setup step to start using Taxu."
                  : "Complete the setup to start using Taxu."}
              </p>
            </div>

            {/* Step Content */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Step 2: Fund Account */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <h2 className="text-3xl font-bold">Fund your account</h2>
                  </div>

                  {transferQueued ? (
                    <Card className="p-6 bg-[#2e364f] border-slate-600">
                      <div className="space-y-4">
                        <div className="text-3xl font-bold text-white">${transferAmount}</div>

                        <div className="flex items-center justify-between p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                              {connectedBank.institution.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-lg">
                                {connectedBank.institution} - {selectedAccount?.name} ••{selectedAccount?.mask}
                              </div>
                              <div className="text-sm text-slate-400">
                                {selectedAccount?.subtype || "Checking"} – {connectedBank.institution}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                          <div className="text-slate-300">Your transfer is queued.</div>
                        </div>

                        <Button
                          onClick={handleNextStep}
                          className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12 text-lg font-semibold"
                        >
                          Next
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 bg-[#2e364f] border-slate-600">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-slate-300 text-base mb-3 block">From</Label>
                          <div className="flex items-center justify-between p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                                {connectedBank.institution.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-white text-lg">
                                  {selectedAccount?.name?.toUpperCase()} ...{selectedAccount?.mask} ••
                                  {selectedAccount?.mask}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Business {selectedAccount?.subtype || "Checking"} – {connectedBank.institution}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-slate-300 text-base mb-3 block">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-4 top-4 text-slate-300 text-lg">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              placeholder="0.00"
                              className="pl-8 bg-[#1a1f36] border-slate-600 text-white h-14 text-lg"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={() => setTransferQueued(true)}
                          disabled={!transferAmount || Number.parseFloat(transferAmount) <= 0}
                          className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12 text-lg font-semibold disabled:bg-slate-600"
                        >
                          Schedule Transfer
                        </Button>

                        <p className="text-xs text-slate-400 text-center">
                          Moving large amounts?{" "}
                          <button onClick={handleSkip} className="text-[#635bff] hover:underline">
                            Skip this
                          </button>{" "}
                          and make a wire transfer after approval.
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 3: Credit Card */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h2 className="text-3xl font-bold">Set up Taxu IO credit card</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      {/* Card Preview */}
                      <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl p-8 aspect-[1.586/1] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <div className="relative flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-base text-slate-200 mb-1 font-medium">Sam Lightson</div>
                              <div className="text-sm text-slate-400">Taxu Inc.</div>
                            </div>
                            <div className="flex gap-1">
                              <div className="w-10 h-10 rounded-full bg-red-500/80"></div>
                              <div className="w-10 h-10 rounded-full bg-orange-500/80 -ml-4"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CreditCard className="w-4 h-4 text-[#635bff]" />
                          </div>
                          <div className="text-slate-300">
                            <div className="font-semibold text-white mb-1">1.5% cashback on all purchases</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Building2 className="w-4 h-4 text-[#635bff]" />
                          </div>
                          <div className="text-slate-300">
                            <div className="font-semibold text-white mb-1">Variable limit based on balance</div>
                            <button className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-[#635bff] font-bold text-sm">$</span>
                          </div>
                          <div className="text-slate-300">
                            <div className="font-semibold text-white mb-1">No interest or annual fees</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CreditCard className="w-4 h-4 text-[#635bff]" />
                          </div>
                          <div className="text-slate-300">
                            <div className="font-semibold text-white mb-1">No impact on personal credit score</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Zap className="w-4 h-4 text-[#635bff]" />
                          </div>
                          <div className="text-slate-300">
                            <div className="font-semibold text-white mb-1">Balance automatically paid daily</div>
                            <button className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <Label className="text-slate-300 text-base mb-2 block">Company name on card</Label>
                        <Input defaultValue="Taxu Inc." className="bg-[#1a1f36] border-slate-600 text-white h-12" />
                        <p className="text-xs text-slate-400 mt-2">Printed on all cards (9 of 23 characters)</p>
                      </div>

                      {/* Physical Card Option */}
                      <div className="flex items-start gap-3 p-4 bg-[#1a1f36] rounded-lg">
                        <Checkbox
                          id="physical-card"
                          checked={physicalCard}
                          onCheckedChange={(checked) => setPhysicalCard(checked as boolean)}
                          className="mt-0.5"
                        />
                        <label htmlFor="physical-card" className="cursor-pointer">
                          <div className="font-semibold text-white">Send me a physical card</div>
                          <div className="text-sm text-slate-400">
                            Arrives 2-4 days after first deposit but you can start spending with virtual cards.
                          </div>
                        </label>
                      </div>

                      {/* Address */}
                      <div className="p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                        <div className="text-slate-300">1767 Tearose Lane, Cherry Hill Township, NJ 08003</div>
                        <button className="text-[#635bff] hover:underline flex items-center gap-1 mt-2 text-sm">
                          Update company address
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSkip}
                          variant="outline"
                          className="flex-1 h-12 bg-transparent text-white border-slate-600 hover:bg-slate-700"
                        >
                          Skip for now
                        </Button>
                        <Button
                          onClick={handleNextStep}
                          className="flex-[2] bg-[#635bff] hover:bg-[#5046e5] h-12 font-semibold"
                        >
                          Next
                        </Button>
                      </div>

                      <p className="text-xs text-slate-400 text-center">
                        By clicking "Next," I agree to Taxu's{" "}
                        <a href="#" className="underline hover:text-slate-300">
                          Cardholder Agreement
                        </a>{" "}
                        <button className="inline-flex items-center">
                          <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 4: Invite Team */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <h2 className="text-3xl font-bold">Invite team members</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      {/* Current User */}
                      <div className="flex items-center gap-3 p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                        <div className="w-12 h-12 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold text-lg">
                          SL
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-lg">Sam Lightson</div>
                          <div className="text-sm text-slate-400">saml@taxu.io</div>
                        </div>
                        <Badge className="bg-slate-700 text-slate-200 px-3 py-1">Admin</Badge>
                      </div>

                      {/* Add Team Member Button */}
                      <button className="w-full flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-600 rounded-lg hover:border-[#635bff] transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-slate-700 group-hover:bg-[#635bff] flex items-center justify-center transition-colors">
                          <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                          Add a team member
                        </span>
                      </button>

                      {/* Info Note */}
                      <div className="flex items-start gap-3 p-4 bg-[#1a1f36] rounded-lg">
                        <Shield className="w-5 h-5 text-[#635bff] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">Team members will be invited after you're approved</p>
                      </div>

                      <Button
                        onClick={handleNextStep}
                        className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12 text-lg font-semibold"
                      >
                        Next
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 5: Two-Factor Authentication */}
              {currentStep === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold">
                      4
                    </div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      Enable two-factor authentication
                      <Badge className="bg-red-600 text-white px-2 py-0.5 text-xs">Required</Badge>
                    </h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      <p className="text-slate-300">
                        Each time you log in, you'll need to enter a unique code generated by an app for added security.
                        Not sure which app to use? Check out our guide{" "}
                        <a href="#" className="text-[#635bff] hover:underline">
                          here
                        </a>
                        .
                      </p>

                      {/* Tabs */}
                      <div className="flex border-b border-slate-600">
                        <button className="px-4 py-2 text-white border-b-2 border-[#635bff] font-medium">
                          Taxu app
                        </button>
                        <button className="px-4 py-2 text-slate-400 hover:text-white">Other authentication app</button>
                      </div>

                      {/* QR Code Section */}
                      <div>
                        <div className="flex items-start gap-1 mb-4">
                          <div className="w-6 h-6 rounded-full bg-[#635bff] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            1
                          </div>
                          <div>
                            <div className="font-semibold text-white mb-2">Open the Taxu app on your phone</div>
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                              <div className="bg-[#1a1f36] rounded-lg p-4">
                                <div className="bg-white rounded-lg p-2 mb-2">
                                  <div className="w-16 h-16 mx-auto bg-black"></div>
                                </div>
                                <div className="text-xs text-slate-300 text-center mb-2">
                                  If logged out, tap the '2FA Codes' button or the QR Code icon.
                                </div>
                              </div>
                              <div className="bg-[#1a1f36] rounded-lg p-4">
                                <div className="bg-white rounded-lg p-2 mb-2">
                                  <div className="w-16 h-16 mx-auto bg-black"></div>
                                </div>
                                <div className="text-xs text-slate-300 text-center mb-2">
                                  If logged in, go to Settings → Two-Factor Authentication → " • "
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-1 mb-4">
                          <div className="w-6 h-6 rounded-full bg-[#635bff] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            2
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-3">
                              Scan this QR code using the camera in the Taxu app
                            </div>
                            <div className="bg-white p-6 rounded-lg inline-block">
                              <div className="w-48 h-48 bg-black"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-1">
                          <div className="w-6 h-6 rounded-full bg-[#635bff] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            3
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white mb-3">Enter the code generated by the app</div>
                            <div className="flex gap-2 max-w-sm">
                              {[...Array(6)].map((_, i) => (
                                <Input
                                  key={i}
                                  type="text"
                                  maxLength={1}
                                  className="w-12 h-14 text-center text-2xl bg-[#1a1f36] border-slate-600 text-white"
                                />
                              ))}
                            </div>
                            <button className="text-sm text-slate-400 hover:text-white mt-3">Resend code</button>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleNextStep}
                        className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12 text-lg font-semibold"
                      >
                        Complete Setup
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 6: Get Mobile Updates */}
              {currentStep === 6 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-bold">
                      5
                    </div>
                    <h2 className="text-3xl font-bold">Get mobile updates</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      <p className="text-slate-300">
                        Download the Taxu app to get notifications about important account activity and manage your
                        finances on the go.
                      </p>

                      <div className="flex gap-4">
                        <a
                          href="#"
                          className="flex-1 flex items-center justify-center gap-2 p-4 bg-[#1a1f36] border border-slate-600 rounded-lg hover:border-[#635bff] transition-colors"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                          </svg>
                          <span className="text-white font-medium">Download on App Store</span>
                        </a>

                        <a
                          href="#"
                          className="flex-1 flex items-center justify-center gap-2 p-4 bg-[#1a1f36] border border-slate-600 rounded-lg hover:border-[#635bff] transition-colors"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.14-.047L.161 20.753a1 1 0 0 1-.002-1.502L2.8 17.5a9.994 9.994 0 0 0 0-7L.159 8.75a1 1 0 0 1 .002-1.502L3.47 5.862c.046-.016.093-.032.139-.048zM14.5 12.707l2.646 2.647 3.697-2.133a1 1 0 0 0 0-1.732l-3.697-2.133-2.646 2.647a1 1 0 0 1 0 1.414-.996.996 0 0 1 0 0zm-.708-5.207L5.546 2.9l8.246-1.48z" />
                          </svg>
                          <span className="text-white font-medium">Get it on Google Play</span>
                        </a>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={handleSkip}
                          variant="outline"
                          className="flex-1 h-12 bg-transparent text-white border-slate-600 hover:bg-slate-700"
                        >
                          Skip
                        </Button>
                        <Button
                          onClick={handleFinish}
                          className="flex-[2] bg-[#635bff] hover:bg-[#5046e5] h-12 font-semibold"
                        >
                          Finish Setup
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Progress Sidebar */}
          <div>
            <Card className="p-6 bg-[#2e364f] border-slate-600 sticky top-6">
              <h3 className="text-lg font-semibold mb-6">Application timeline</h3>

              <div className="space-y-6">
                {/* Apply */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#635bff] border-2 border-[#1a1f36] ring-2 ring-[#635bff]"></div>
                    <div className="w-px h-full bg-slate-600 mt-2"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">Apply</div>
                    <div className="text-sm text-slate-400">Received Dec 12</div>
                  </div>
                </div>

                {/* In Review */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#635bff] border-2 border-[#1a1f36] ring-2 ring-[#635bff]"></div>
                    <div className="w-px h-full bg-slate-600 mt-2"></div>
                  </div>
                  <div>
                    <div className="font-medium text-white">In review</div>
                    <div className="text-sm text-slate-400">Approx. 1 day</div>
                  </div>
                </div>

                {/* Account Ready */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-600 border-2 border-[#1a1f36]"></div>
                  </div>
                  <div>
                    <div className="font-medium text-slate-400">Account ready</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-600">
                <div className="text-sm font-medium text-white mb-2">Questions?</div>
                <div className="text-sm text-slate-400">Our support team can help:</div>
                <a href="mailto:help@taxu.com" className="text-sm text-[#635bff] hover:underline">
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
