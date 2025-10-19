"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Download, Share2, Calendar, DollarSign, TrendingUp } from "lucide-react"

export default function RefundPage() {
  const router = useRouter()
  const [filing, setFiling] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFiling()
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
        <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const refundAmount = filing?.refund_amount || 0
  const estimatedDate = new Date()
  estimatedDate.setDate(estimatedDate.getDate() + 10)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-neon to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-background" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Return Filed Successfully!</h1>
          <p className="text-xl text-muted-foreground">Your 2024 tax return has been submitted to the IRS</p>
        </div>

        {/* Refund Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-neon/10 to-blue-500/10 border-neon/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Refund</p>
            <h2 className="text-6xl font-bold text-neon mb-4">${refundAmount.toLocaleString()}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <p>Expected by {estimatedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">Refund Status</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-background" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Return Accepted</p>
                <p className="text-sm text-muted-foreground">IRS has received and accepted your return</p>
                <p className="text-xs text-muted-foreground mt-1">Today</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-neon animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Processing</p>
                <p className="text-sm text-muted-foreground">IRS is reviewing your return</p>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-muted-foreground">Refund Sent</p>
                <p className="text-sm text-muted-foreground">Direct deposit to your account</p>
                <p className="text-xs text-muted-foreground mt-1">7-10 business days</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neon flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Track Your Refund</p>
                <p className="text-sm text-muted-foreground">We'll send you email updates as your refund progresses</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neon flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Download Your Return</p>
                <p className="text-sm text-muted-foreground">Keep a copy for your records</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-neon flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Plan for Next Year</p>
                <p className="text-sm text-muted-foreground">Get AI-powered tax planning advice</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download Return
          </Button>
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Share Status
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full bg-transparent"
            onClick={() => router.push("/dashboard")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>

        {/* Referral CTA */}
        <Card className="p-6 bg-gradient-to-r from-neon/10 to-blue-500/10 border-neon/20 text-center">
          <h3 className="text-xl font-bold mb-2">Love Taxu? Get $50</h3>
          <p className="text-muted-foreground mb-4">Refer a friend and you both get $50 off your next tax filing</p>
          <Button className="bg-neon hover:bg-neon/90 text-background">Share Referral Link</Button>
        </Card>
      </div>
    </div>
  )
}
