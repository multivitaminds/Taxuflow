"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Mail, FileText, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Suspense } from "react"

function SuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appNumber = searchParams.get("applicationNumber")

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Application submitted!</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Thank you for applying to Taxu. We're reviewing your application and will get back to you shortly.
          </p>
          {appNumber && (
            <div className="mt-4 inline-block px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="text-sm text-gray-600">Application #:</span>
              <span className="ml-2 text-sm font-mono font-semibold text-indigo-600">{appNumber}</span>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <Card className="p-8 border border-gray-200 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check your email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation to your email address. Please verify your email if you haven't already.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Application review</h3>
                <p className="text-sm text-gray-600">
                  Our compliance team will review your application within 2-3 business days. We may reach out if we need
                  additional information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account activation</h3>
                <p className="text-sm text-gray-600">
                  Once approved, you'll receive an email with instructions to activate your account and access your
                  selected Taxu platforms.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Selected Platforms */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Your selected platforms</h3>
          <p className="text-sm text-gray-600 mb-4">
            You'll have access to these platforms once your account is activated:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">🏦 Neobank</div>
              <div className="text-xs text-gray-600 mt-1">Banking & payments</div>
            </div>
            <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">📈 Investment</div>
              <div className="text-xs text-gray-600 mt-1">Portfolio management</div>
            </div>
            <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">📊 Accounting</div>
              <div className="text-xs text-gray-600 mt-1">Bookkeeping & reports</div>
            </div>
            <div className="px-4 py-3 bg-white rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">📝 Tax Filing</div>
              <div className="text-xs text-gray-600 mt-1">Tax preparation & e-filing</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => router.push("/")} variant="outline" className="flex-1 h-12 bg-white">
            Return Home
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Help Section */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Have questions?{" "}
            <a href="mailto:support@taxu.io" className="text-indigo-600 hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
