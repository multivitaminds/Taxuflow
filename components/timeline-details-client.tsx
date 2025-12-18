"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface TimelineDetailsClientProps {
  user: User
  profile: any
}

export function TimelineDetailsClient({ user, profile }: TimelineDetailsClientProps) {
  const router = useRouter()
  const [taxCalc, setTaxCalc] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [taxData, docsData] = await Promise.all([
        supabase
          .from("tax_calculations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("documents").select("*").eq("user_id", user.id),
      ])

      if (taxData.data) setTaxCalc(taxData.data)
      if (docsData.data) setDocuments(docsData.data)
      setLoading(false)
    }

    fetchData()
  }, [user.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading timeline details...</p>
        </div>
      </div>
    )
  }

  const processedDocs = documents.filter((d) => d.processing_status === "completed").length
  const totalDocs = documents.length
  const completionPercentage = totalDocs > 0 ? Math.round((processedDocs / totalDocs) * 100) : 0

  const milestones = [
    {
      title: "Document Upload",
      status: totalDocs > 0 ? "completed" : "pending",
      date: totalDocs > 0 ? "Completed" : "Pending",
      description: `${totalDocs} documents uploaded`,
    },
    {
      title: "AI Analysis",
      status:
        processedDocs === totalDocs && totalDocs > 0 ? "completed" : processedDocs > 0 ? "in-progress" : "pending",
      date: processedDocs === totalDocs && totalDocs > 0 ? "Completed" : processedDocs > 0 ? "In Progress" : "Pending",
      description: `${processedDocs} of ${totalDocs} documents analyzed`,
    },
    {
      title: "Tax Calculation",
      status: taxCalc && taxCalc.confidence_percentage >= 50 ? "completed" : "pending",
      date: taxCalc && taxCalc.confidence_percentage >= 50 ? "Completed" : "Pending",
      description: "Refund estimate calculated",
    },
    {
      title: "Review & Submit",
      status: "pending",
      date: "Not Started",
      description: "Review your return before filing",
    },
    {
      title: "IRS Processing",
      status: "pending",
      date: "21 days after filing",
      description: "Average processing time for e-filed returns",
    },
    {
      title: "Refund Issued",
      status: "pending",
      date: "Expected in 21-28 days",
      description: "Direct deposit or check mailed",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard/refund")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Refund Details
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Expected Timeline</h1>
          <p className="text-muted-foreground">Track your tax filing journey from start to refund</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h3 className="font-semibold">Average Timeline</h3>
            </div>
            <p className="text-4xl font-bold mb-2">21 days</p>
            <p className="text-sm text-muted-foreground">IRS processing time for e-filed returns</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Your Progress</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{completionPercentage}%</p>
            <p className="text-sm text-muted-foreground">Documents processed and analyzed</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Faster Than</h3>
            </div>
            <p className="text-4xl font-bold mb-2">Paper Filing</p>
            <p className="text-sm text-muted-foreground">E-filing is 3-4 weeks faster</p>
          </Card>
        </div>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-6">Filing Milestones</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === "completed"
                        ? "bg-green-500/20 text-green-500"
                        : milestone.status === "in-progress"
                          ? "bg-orange-500/20 text-orange-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {milestone.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : milestone.status === "in-progress" ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  {index < milestones.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${milestone.status === "completed" ? "bg-green-500/20" : "bg-border"}`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{milestone.title}</h3>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        milestone.status === "completed"
                          ? "bg-green-500/20 text-green-500"
                          : milestone.status === "in-progress"
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {milestone.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Timeline Factors</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">E-Filing Advantage</h4>
                <p className="text-sm text-muted-foreground">
                  Electronic filing is processed 3-4 weeks faster than paper returns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Direct Deposit</h4>
                <p className="text-sm text-muted-foreground">
                  Choosing direct deposit can speed up refund delivery by 1-2 weeks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Peak Season Delays</h4>
                <p className="text-sm text-muted-foreground">
                  Filing closer to the April deadline may result in longer processing times
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Additional Review</h4>
                <p className="text-sm text-muted-foreground">
                  Returns claiming certain credits (EITC, ACTC) may require additional verification
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
