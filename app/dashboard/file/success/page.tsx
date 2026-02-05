"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  CheckCircle,
  FileText,
  ArrowRight,
  Download,
  Send,
  Shield,
  Clock,
  Building,
  User,
  Receipt,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"
import Link from "next/link"

export default function FilingSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  const formType = searchParams.get("form") || "W-2"
  const submissionId = searchParams.get("id") || "TXU-" + Date.now()
  const taxYear = searchParams.get("year") || "2024"
  const recipientName = searchParams.get("recipient") || "Employee"
  const amount = searchParams.get("amount") || "0"

  useEffect(() => {
    // Trigger confetti celebration
    if (!showConfetti) {
      setShowConfetti(true)
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7", "#22c55e"],
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7", "#22c55e"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [showConfetti])

  const formTypeLabels: Record<string, { title: string; icon: any; color: string }> = {
    "W-2": { title: "Form W-2 - Wage and Tax Statement", icon: User, color: "text-blue-600" },
    "1099-NEC": { title: "Form 1099-NEC - Nonemployee Compensation", icon: Building, color: "text-purple-600" },
    "941": { title: "Form 941 - Quarterly Tax Return", icon: Receipt, color: "text-green-600" },
  }

  const currentForm = formTypeLabels[formType] || formTypeLabels["W-2"]
  const FormIcon = currentForm.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
            >
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-yellow-800" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-3"
          >
            Successfully Filed!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600"
          >
            Your {formType} has been submitted to the IRS via TaxBandits e-filing
          </motion.p>
        </motion.div>

        {/* Filing Details Card */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="border-2 border-green-200 bg-white shadow-xl shadow-green-500/10 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FormIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{currentForm.title}</h2>
                  <p className="text-green-100 text-sm">Tax Year {taxYear}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Confirmation Number</p>
                    <p className="text-lg font-mono font-bold text-indigo-600">{submissionId}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Submission Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Accepted by IRS
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">Filed On</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">E-Filing Provider</p>
                    <p className="text-lg font-semibold text-gray-900">TaxBandits IRS FIRE System</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-indigo-900">IRS Compliance Verified</p>
                    <p className="text-sm text-indigo-700 mt-0.5">
                      This filing meets all IRS electronic filing requirements and has been encrypted with 256-bit AES
                      security.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* What Happens Next */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="bg-white border shadow-lg mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                What happens next
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Submitted to IRS</p>
                    <p className="text-sm text-gray-600">Your filing has been transmitted securely to the IRS</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Recipient copies available</p>
                    <p className="text-sm text-gray-600">
                      Download or email recipient copies from your Filing Dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Records maintained</p>
                    <p className="text-sm text-gray-600">
                      All filings are securely stored for 7 years per IRS requirements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
            asChild
          >
            <Link href="/dashboard/file">
              <FileText className="w-5 h-5 mr-2" />
              File Another Form
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" className="flex-1 border-2 bg-transparent" asChild>
            <Link href="/dashboard/file/filings">
              View All Filings
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Download Receipt */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            Download Confirmation Receipt (PDF)
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
