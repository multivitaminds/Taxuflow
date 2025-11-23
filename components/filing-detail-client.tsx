"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Filing {
  id: string
  tax_year: number
  filing_status: string
  provider_name: string
  submission_id: string
  irs_status: string
  state_status: string | null
  rejection_reasons: string[]
  refund_amount: number | null
  filed_at: string
  accepted_at: string
  rejected_at: string
  provider_response: any
  wages?: number
  federal_tax_withheld?: number
}

export default function FilingDetailClient({ filing, formType = "W-2" }: { filing: Filing; formType?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCheckStatus = useCallback(async () => {
    if (checkingStatus) return

    console.log("[v0] handleCheckStatus: Starting status check for filing:", filing.id)
    setCheckingStatus(true)

    try {
      // Add timestamp to prevent caching
      const url = `/api/filing/check-status/${filing.id}?t=${Date.now()}`
      console.log("[v0] handleCheckStatus: Fetching", url)

      const response = await fetch(url)

      console.log("[v0] handleCheckStatus: Response status:", response.status)

      const contentType = response.headers.get("content-type")
      let data: any

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
        console.log("[v0] handleCheckStatus: Response data:", data)
      } else {
        const text = await response.text()
        console.error("[v0] handleCheckStatus: Non-JSON response:", text.substring(0, 200))
        throw new Error(`Server returned non-JSON response (${response.status})`)
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Status check failed")
      }

      if (data.status === "accepted" || data.status === "success") {
        console.log("[v0] handleCheckStatus: Status is now accepted!")
        setAutoRefreshEnabled(false)
        toast({
          title: "Filing Accepted!",
          description: "Your filing has been successfully accepted.",
        })
        router.refresh()
      } else {
        console.log("[v0] handleCheckStatus: Status still pending")
        // If we got a valid pending response, we can continue auto-refreshing
      }
    } catch (error) {
      console.error("[v0] handleCheckStatus: Error:", error)
      // Don't disable auto-refresh for network glitches, but do for logic errors
      // For now, we'll keep it enabled to retry, but show error
      toast({
        title: "Status Check Failed",
        description: error instanceof Error ? error.message : "Unable to check status",
        variant: "destructive",
      })
    } finally {
      setCheckingStatus(false)
    }
  }, [filing.id, checkingStatus, autoRefreshEnabled, router, toast])

  // Auto-refresh logic using recursive setTimeout
  useEffect(() => {
    const status = filing.irs_status?.toLowerCase()
    const isPending = status === "pending" || status === "processing" || status === "submitted"

    if (isPending && autoRefreshEnabled) {
      // Clear any existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      // Schedule next check
      timeoutRef.current = setTimeout(() => {
        handleCheckStatus()
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [filing.irs_status, autoRefreshEnabled, handleCheckStatus])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase()
    switch (normalizedStatus) {
      case "accepted":
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/filing/download/${filing.id}`)

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tax-return-${formType}-${filing.tax_year}-${filing.submission_id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download Complete",
        description: "Your tax return has been downloaded successfully.",
      })
    } catch (error) {
      console.error("[v0] Download error:", error)
      toast({
        title: "Download Failed",
        description: "Unable to download the tax return. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const onManualRefresh = () => {
    setAutoRefreshEnabled(true) // Re-enable if it was stopped
    handleCheckStatus()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-orange-50/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard/filing")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Filings
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                {formType} Filing Details
              </h1>
              <p className="text-slate-600 mt-1">Submission ID: {filing.submission_id}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onManualRefresh}
                disabled={checkingStatus}
                variant="outline"
                className="border-purple-200 hover:bg-purple-50 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${checkingStatus ? "animate-spin" : ""}`} />
                {checkingStatus ? "Checking..." : "Check Status"}
              </Button>

              {(filing.irs_status?.toLowerCase() === "accepted" || filing.irs_status?.toLowerCase() === "success") && (
                <Button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white shadow-lg shadow-purple-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloading ? "Downloading..." : "Download Return"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Verification Info Card */}
        {(filing.irs_status?.toLowerCase() === "pending" || filing.irs_status?.toLowerCase() === "processing") && (
          <Card className="p-4 mb-6 bg-blue-50/50 backdrop-blur-sm border-blue-200/50">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Filing Status: Processing</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Your filing is being processed by the IRS e-file provider. This typically takes 2-5 minutes in the
                  sandbox environment, but can occasionally take longer.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={onManualRefresh}
                    disabled={checkingStatus}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white w-fit"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${checkingStatus ? "animate-spin" : ""}`} />
                    Refresh Status Now
                  </Button>
                  <p className="text-xs text-blue-600">
                    Submission ID: <code className="bg-blue-100 px-1 py-0.5 rounded">{filing.submission_id}</code>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Status Card */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(filing.irs_status)}
              <div>
                <h2 className="text-xl font-semibold">{formType} Filing Status</h2>
                <p className="text-sm text-slate-600">Tax Year {filing.tax_year}</p>
              </div>
            </div>
            <Badge className={getStatusColor(filing.irs_status)}>{filing.irs_status?.toUpperCase() || "PENDING"}</Badge>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Filing Timeline
            </h3>
            <div className="space-y-2">
              {filing.filed_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Submitted:</span>
                  <span className="font-medium text-blue-900">{new Date(filing.filed_at).toLocaleString()}</span>
                </div>
              )}
              {filing.accepted_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Accepted:</span>
                  <span className="font-medium text-green-900">{new Date(filing.accepted_at).toLocaleString()}</span>
                </div>
              )}
              {filing.rejected_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Rejected:</span>
                  <span className="font-medium text-red-900">{new Date(filing.rejected_at).toLocaleString()}</span>
                </div>
              )}
              {(filing.irs_status?.toLowerCase() === "accepted" || filing.irs_status?.toLowerCase() === "success") &&
                filing.accepted_at &&
                filing.filed_at && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600">
                      Processing time:{" "}
                      {Math.round(
                        (new Date(filing.accepted_at).getTime() - new Date(filing.filed_at).getTime()) / (1000 * 60),
                      )}{" "}
                      minutes
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-sm text-slate-600">Form Type</p>
              <p className="font-semibold">{formType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Filing Status</p>
              <p className="font-semibold">{filing.filing_status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Provider</p>
              <p className="font-semibold capitalize">{filing.provider_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Filed Date</p>
              <p className="font-semibold">
                {filing.filed_at ? new Date(filing.filed_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Accepted Date</p>
              <p className="font-semibold">
                {filing.accepted_at ? new Date(filing.accepted_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          {filing.refund_amount &&
            formType === "W-2" &&
            (filing.irs_status?.toLowerCase() === "accepted" || filing.irs_status?.toLowerCase() === "success") && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Expected Refund</p>
                <p className="text-2xl font-bold text-green-600">${filing.refund_amount.toLocaleString()}</p>
              </div>
            )}
        </Card>

        {/* Rejection Reasons */}
        {filing.rejection_reasons && filing.rejection_reasons.length > 0 && (
          <Card className="p-6 mb-6 bg-red-50/50 backdrop-blur-sm border-red-200/50 shadow-xl">
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Rejection Reasons
            </h3>
            <ul className="space-y-2">
              {filing.rejection_reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-red-600">
                  <span className="text-red-400">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Provider Response */}
        {filing.provider_response && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Provider Response
            </h3>
            <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-sm border border-slate-200">
              {JSON.stringify(filing.provider_response, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  )
}
