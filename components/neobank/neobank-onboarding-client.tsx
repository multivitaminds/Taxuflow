"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Smartphone,
  Building2,
  CreditCard,
  UserPlus,
  Loader2,
} from "lucide-react"
import { usePlaidLink } from "react-plaid-link"

const STEPS = [
  { id: 1, name: "Fund your account", completed: false },
  { id: 2, name: "Set up Taxu IO credit card", completed: false },
  { id: 3, name: "Invite team members", completed: false },
  { id: 4, name: "Enable two-factor authentication", completed: false, required: true },
  { id: 5, name: "Get mobile updates", completed: false },
]

export function NeobankOnboardingClient() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connectedBank, setConnectedBank] = useState<any>(null)
  const [transferAmount, setTransferAmount] = useState("10.00")
  const [transferQueued, setTransferQueued] = useState(false)
  const [cardSetup, setCardSetup] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [qrCode, setQrCode] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=taxu-2fa")

  // Fetch Plaid link token for step 1
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
          })
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

  const handleScheduleTransfer = () => {
    setTransferQueued(true)
    setTimeout(() => {
      setCurrentStep(2)
    }, 1000)
  }

  const handleSkipStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/neobank")
    }
  }

  const handleNextStep = () => {
    if (currentStep === 4 && !twoFactorEnabled) {
      return // Require 2FA completion
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/neobank")
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f36] text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-[#0a2540]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1a1f36] font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-semibold">TAXU</span>
          </div>
          <div className="text-sm text-slate-300">Sam Lightson</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
          {/* Left Column - Main Content */}
          <div>
            <div className="mb-8">
              <div className="text-sm text-slate-400 mb-2">TAXU, INC.</div>
              <h1 className="text-4xl font-bold mb-2">You're nearly there!</h1>
              <p className="text-slate-300">Complete the required setup step to start using Mercury.</p>
            </div>

            {/* Step Content */}
            <div className="space-y-8">
              {/* Step 1: Fund Account */}
              {currentStep === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                      1
                    </div>
                    <h2 className="text-2xl font-bold">Fund your account</h2>
                  </div>

                  {!connectedBank ? (
                    <Card className="p-6 bg-[#2e364f] border-slate-600">
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-4 text-white">
                            Connect your US bank to schedule a transfer
                            <button className="ml-2 text-slate-400 hover:text-white">
                              <svg className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </h3>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Priority review for applications with scheduled transfers
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Instant access to cards and payments post-approval
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Securely connect with all major banks via Plaid
                            </div>
                          </div>
                        </div>

                        {/* Bank Logos */}
                        <div className="flex items-center gap-4 pt-4">
                          {["Wise", "Chase", "HSBC", "Capital One", "Chime", "Ally"].map((bank) => (
                            <div key={bank} className="text-xs text-slate-400 font-medium">
                              {bank}
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => plaidReady && openPlaid()}
                          disabled={!plaidReady || loading}
                          className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect Account"}
                        </Button>

                        <p className="text-xs text-slate-400 text-center">
                          Moving large amounts? Don't have a US bank account?{" "}
                          <button onClick={handleSkipStep} className="text-[#635bff] hover:underline">
                            Skip this step
                          </button>{" "}
                          and make a wire transfer after approval.
                        </p>
                      </div>
                    </Card>
                  ) : transferQueued ? (
                    <Card className="p-6 bg-[#2e364f] border-slate-600">
                      <div className="space-y-4">
                        <div className="text-lg font-semibold text-white">${transferAmount}</div>
                        <div className="flex items-center justify-between p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
                              W
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {connectedBank.institution} - {connectedBank.name} ••{connectedBank.mask}
                              </div>
                              <div className="text-sm text-slate-400">Checking – {connectedBank.institution}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-[#1a1f36] rounded-lg border border-slate-600">
                          <div className="text-sm text-slate-300">Your transfer is queued.</div>
                        </div>
                        <Button onClick={handleNextStep} className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12">
                          Next
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-6 bg-[#2e364f] border-slate-600">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
                              W
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {connectedBank.institution} - {connectedBank.name} ••{connectedBank.mask}
                              </div>
                              <div className="text-sm text-slate-400">Checking – {connectedBank.institution}</div>
                            </div>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div>
                          <Label className="text-slate-300">Amount</Label>
                          <div className="relative mt-2">
                            <span className="absolute left-4 top-3 text-slate-300">$</span>
                            <Input
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              className="pl-8 bg-[#1a1f36] border-slate-600 text-white h-12"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleScheduleTransfer}
                          className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12"
                        >
                          Schedule Transfer
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}

              {/* Step 2: Credit Card */}
              {currentStep === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                      2
                    </div>
                    <h2 className="text-2xl font-bold">Set up Taxu IO credit card</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      {/* Card Preview */}
                      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 aspect-[1.586/1]">
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Sam Lightson</div>
                              <div className="text-xs text-slate-400">Taxu Inc.</div>
                            </div>
                            <div className="flex gap-1">
                              <div className="w-8 h-8 rounded-full bg-white/80"></div>
                              <div className="w-8 h-8 rounded-full bg-white/80 -ml-3"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-slate-300">
                          <CreditCard className="w-5 h-5 mt-0.5 text-[#635bff]" />
                          <div>
                            <div className="font-medium text-white">1.5% cashback on all purchases</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-300">
                          <Building2 className="w-5 h-5 mt-0.5 text-[#635bff]" />
                          <div>
                            <div className="font-medium text-white">Variable limit based on balance</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm text-slate-300">
                          <Zap className="w-5 h-5 mt-0.5 text-[#635bff]" />
                          <div>
                            <div className="font-medium text-white">No interest or annual fees</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-slate-300">Company name on card</Label>
                        <Input
                          defaultValue="Taxu Inc."
                          className="mt-2 bg-[#1a1f36] border-slate-600 text-white h-12"
                        />
                        <p className="text-xs text-slate-400 mt-1">Printed on all cards (9 of 23 characters)</p>
                      </div>

                      <div className="flex items-start gap-2">
                        <input type="checkbox" defaultChecked className="mt-1" />
                        <div className="text-sm">
                          <div className="font-medium text-white">Send me a physical card</div>
                          <div className="text-slate-400 text-xs">
                            Arrives 2-4 days after first deposit but you can start spending with virtual cards.
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#1a1f36] rounded-lg border border-slate-600">
                        <div className="text-sm text-slate-300">1767 Tearose Lane, Cherry Hill Township, NJ 08003</div>
                        <button className="text-sm text-[#635bff] hover:underline flex items-center gap-1 mt-1">
                          Update company address
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={handleSkipStep} variant="outline" className="flex-1 h-12 bg-transparent">
                          Skip for now
                        </Button>
                        <Button
                          onClick={() => {
                            setCardSetup(true)
                            handleNextStep()
                          }}
                          className="flex-[2] bg-[#635bff] hover:bg-[#5046e5] h-12"
                        >
                          Next
                        </Button>
                      </div>

                      <p className="text-xs text-slate-400 text-center">
                        By clicking "Next," I agree to Mercury's{" "}
                        <a href="#" className="underline">
                          Cardholder Agreement
                        </a>
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 3: Invite Team */}
              {currentStep === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                      3
                    </div>
                    <h2 className="text-2xl font-bold">Invite team members</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                        <div className="w-10 h-10 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                          SL
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">Sam Lightson</div>
                          <div className="text-sm text-slate-400">saml@taxu.io</div>
                        </div>
                        <Badge className="bg-slate-700 text-slate-300">Admin</Badge>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-600 rounded-lg hover:border-[#635bff] transition-colors text-slate-300 hover:text-white">
                        <UserPlus className="w-5 h-5" />
                        <span>Add a team member</span>
                      </button>

                      <div className="flex items-start gap-2 text-sm text-slate-400">
                        <Shield className="w-4 h-4 mt-0.5" />
                        <span>Team members will be invited after you're approved</span>
                      </div>

                      <Button onClick={handleNextStep} className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12">
                        Next
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 4: Two-Factor Auth */}
              {currentStep === 4 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                      4
                    </div>
                    <h2 className="text-2xl font-bold">
                      Enable two-factor authentication <Badge className="ml-2 bg-red-500">Required</Badge>
                    </h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      <p className="text-slate-300">
                        Each time you log in, you'll need to enter a unique code generated by an app for added security.
                        Not sure which app to use?{" "}
                        <a href="#" className="text-[#635bff] underline">
                          Check out our guide here
                        </a>
                        .
                      </p>

                      <div className="flex gap-2 border-b border-slate-600">
                        <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-[#635bff]">
                          Mercury app
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-slate-400">
                          Other authentication app
                        </button>
                      </div>

                      <div>
                        <div className="font-medium text-white mb-4">1. Open the Mercury app on your phone</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                            <div className="aspect-[9/16] bg-[#0a2540] rounded-lg mb-3 flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-400">
                              If logged out, tap the '2FA Codes' button or the QR Code icon.
                            </p>
                          </div>
                          <div className="p-4 bg-[#1a1f36] rounded-lg border border-slate-600">
                            <div className="aspect-[9/16] bg-[#0a2540] rounded-lg mb-3 flex items-center justify-center">
                              <Smartphone className="w-8 h-8 text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-400">
                              If logged in, go to Settings → Two-Factor Authentication → "*"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-white mb-4">
                          2. Scan this QR code using the camera in the Mercury app
                        </div>
                        <div className="flex justify-center p-6 bg-white rounded-lg">
                          <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-white mb-4">3. Enter the code generated by the app</div>
                        <div className="flex gap-2">
                          {[0, 1, 2].map((i) => (
                            <Input
                              key={i}
                              maxLength={1}
                              className="w-16 h-16 text-center text-2xl bg-[#1a1f36] border-slate-600 text-white"
                            />
                          ))}
                          <span className="flex items-center text-2xl text-slate-500">-</span>
                          {[3, 4, 5].map((i) => (
                            <Input
                              key={i}
                              maxLength={1}
                              className="w-16 h-16 text-center text-2xl bg-[#1a1f36] border-slate-600 text-white"
                            />
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setTwoFactorEnabled(true)
                          handleNextStep()
                        }}
                        className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Step 5: Mobile Updates */}
              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center text-white font-semibold">
                      5
                    </div>
                    <h2 className="text-2xl font-bold">Get mobile updates</h2>
                  </div>

                  <Card className="p-6 bg-[#2e364f] border-slate-600">
                    <div className="space-y-6">
                      <p className="text-slate-300">
                        Stay informed with push notifications for important account activity.
                      </p>

                      <div className="space-y-3">
                        {["Large transactions", "Security alerts", "Bill payment reminders"].map((item) => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span className="text-slate-300">{item}</span>
                          </label>
                        ))}
                      </div>

                      <Button
                        onClick={() => router.push("/neobank")}
                        className="w-full bg-[#635bff] hover:bg-[#5046e5] h-12"
                      >
                        Complete Setup
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Progress & Info */}
          <div className="space-y-6">
            {/* Application Timeline */}
            <Card className="p-6 bg-[#2e364f] border-slate-600">
              <h3 className="font-semibold mb-4 text-white">Application timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#635bff]"></div>
                  <div>
                    <div className="font-medium text-sm text-white">Apply</div>
                    <div className="text-xs text-slate-400">Received Dec 12</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#635bff]"></div>
                  <div>
                    <div className="font-medium text-sm text-white">In review</div>
                    <div className="text-xs text-slate-400">Approx. 1 day</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div>
                    <div className="font-medium text-sm text-slate-400">Account ready</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Questions */}
            <Card className="p-6 bg-[#2e364f] border-slate-600">
              <h3 className="font-semibold mb-2 text-white">Questions?</h3>
              <p className="text-sm text-slate-300">
                Our support team can help:{" "}
                <a href="mailto:help@mercury.com" className="text-[#635bff] underline">
                  help@mercury.com
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
