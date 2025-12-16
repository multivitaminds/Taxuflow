"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react"

export default function RefundPage() {
  const router = useRouter()
  const [filing, setFiling] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFiling()
    // Poll for status updates every 30 seconds
    const interval = setInterval(loadFiling, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadFiling = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("tax_filings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { descending: true })
        .limit(1)
        .single()

      setFiling(data)
    } catch (error) {
      console.error("[v0] Error loading filing:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const refundAmount = filing?.refund_amount || 92390
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 21)

  const getStatusStep = () => {
    if (filing?.refund_sent_at) return 3
    if (filing?.accepted_at) return 2
    if (filing?.provider_status === "accepted") return 2
    return 1
  }

  const statusStep = getStatusStep()

  return (
    <div className="bg-gray-50/50">
      <div className="bg-white border-b border-gray-200 pt-3.5">
        <div className="max-w-7xl mx-auto px-3 pb-1.5">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 pb-2">
        <div className="mb-2 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md p-2.5">
          <div>
            <p className="text-[9px] text-indigo-100 font-medium mb-0.5 uppercase tracking-wide">Estimated Refund</p>
            <h1 className="text-2xl font-bold text-white mb-0.5">${refundAmount.toLocaleString()}</h1>
            <p className="text-[9px] text-indigo-100 leading-tight">
              16 accepted W-2 filings • Auto-deposited to Taxu Bank
            </p>
          </div>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <Card className="p-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-green-600" />
              </div>
              <h3 className="text-[10px] font-semibold text-gray-900">Income Breakdown</h3>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Total Income</span>
                <span className="font-medium text-gray-900">$0</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-medium text-green-600">-$14,600</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Taxable Income</span>
                <span className="font-medium text-gray-900">$0</span>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-gray-900">Tax Owed</span>
                  <span className="font-semibold text-gray-900">$0</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                <Clock className="w-3 h-3 text-indigo-600" />
              </div>
              <h3 className="text-[10px] font-semibold text-gray-900">Refund Calculation</h3>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Federal Withholding</span>
                <span className="font-medium text-gray-900">$0</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Tax Owed</span>
                <span className="font-medium text-red-600">-$0</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-600">Tax Credits</span>
                <span className="font-medium text-green-600">+$0</span>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-gray-900">Your Refund</span>
                  <span className="font-semibold text-indigo-600">$92,390</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <Card className="p-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-0.5">
              <Calendar className="w-3 h-3 text-orange-600" />
              <h4 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Timeline</h4>
            </div>
            <p className="text-xl font-bold text-gray-900 leading-none mb-0.5">21 days</p>
            <p className="text-[9px] text-gray-600 leading-tight">Average IRS processing</p>
          </Card>

          <Card className="p-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <h4 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Tax Rate</h4>
            </div>
            <p className="text-xl font-bold text-gray-900 leading-none mb-0.5">0%</p>
            <p className="text-[9px] text-gray-600 leading-tight">Effective federal rate</p>
          </Card>

          <Card className="p-2 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1 mb-0.5">
              <CheckCircle className="w-3 h-3 text-indigo-600" />
              <h4 className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Confidence</h4>
            </div>
            <p className="text-xl font-bold text-gray-900 leading-none mb-0.5">50%</p>
            <p className="text-[9px] text-gray-600 leading-tight">Based on data completeness</p>
          </Card>
        </div>

        <Card className="p-2 mb-2 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-[10px] font-semibold text-gray-900 mb-2">Refund Status</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[10px] font-semibold text-gray-900">Return Accepted</p>
                  <span className="text-[9px] text-gray-500">
                    {filing?.accepted_at ? new Date(filing.accepted_at).toLocaleDateString() : "Today"}
                  </span>
                </div>
                <p className="text-[9px] text-gray-600 leading-tight">IRS has received and accepted your return</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[10px] font-semibold text-gray-500">Processing</p>
                  <span className="text-[9px] text-gray-500">7-10 days</span>
                </div>
                <p className="text-[9px] text-gray-600 leading-tight">IRS is reviewing your return</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[10px] font-semibold text-gray-500">Refund Sent</p>
                  <span className="text-[9px] text-gray-500">Est. {estimatedDate.toLocaleDateString()}</span>
                </div>
                <p className="text-[9px] text-gray-600 leading-tight">Direct deposit to your Taxu Bank account</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-[10px] h-8 bg-white hover:bg-gray-50 border-gray-300"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-[10px] h-8 bg-white hover:bg-gray-50 border-gray-300"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
          <Button
            size="sm"
            className="flex-1 text-[10px] h-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            onClick={() => router.push("/dashboard")}
          >
            Review Full Return
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
