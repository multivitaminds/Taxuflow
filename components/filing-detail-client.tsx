"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Filing {
  id: string
  tax_year: number
  filing_status: string
  provider_name: string
  submission_id: string
  irs_status: string
  state_status: string
  rejection_reasons: string[]
  refund_amount: number
  filed_at: string
  accepted_at: string
  rejected_at: string
  provider_response: any
}

export default function FilingDetailClient({ filing }: { filing: Filing }) {
  const router = useRouter()
  const { toast } = useToast()
  const [downloading, setDownloading] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Call TaxBandits API to download the filed return
      const response = await fetch(`/api/filing/download/${filing.id}`)

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tax-return-${filing.tax_year}-${filing.submission_id}.pdf`
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
                Filing Details
              </h1>
              <p className="text-slate-600 mt-1">Submission ID: {filing.submission_id}</p>
            </div>

            {filing.irs_status === "accepted" && (
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

        {/* Status Card */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(filing.irs_status)}
              <div>
                <h2 className="text-xl font-semibold">Filing Status</h2>
                <p className="text-sm text-slate-600">Tax Year {filing.tax_year}</p>
              </div>
            </div>
            <Badge className={getStatusColor(filing.irs_status)}>{filing.irs_status?.toUpperCase() || "PENDING"}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
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

          {filing.refund_amount && (
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
