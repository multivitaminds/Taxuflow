"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Sparkles, TrendingUp, Shield, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const recommendations = [
  {
    id: 1,
    title: "Increase Federal Savings",
    priority: "high",
    description:
      "Based on your recent income spike of 28%, our AI recommends increasing your Federal Tax bucket from 15% to 18%.",
    impact: "$1,200 additional savings per quarter",
    confidence: 94,
    reason: "Your Q4 2024 income is 28% higher than Q3. This increase suggests higher tax liability.",
  },
  {
    id: 2,
    title: "Optimize State Tax Timing",
    priority: "medium",
    description: "Consider front-loading your California state tax savings to take advantage of year-end deductions.",
    impact: "$450 potential tax savings",
    confidence: 87,
    reason: "California allows certain deductions when paid by December 31st.",
  },
  {
    id: 3,
    title: "Sales Tax Buffer",
    priority: "low",
    description: "Add a 0.5% buffer to your sales tax bucket to account for rate changes in 2025.",
    impact: "$180 additional cushion",
    confidence: 76,
    reason: "Several California jurisdictions are increasing sales tax rates in January 2025.",
  },
]

export function RecommendationsClient() {
  const router = useRouter()

  const handleApply = (id: number, title: string) => {
    toast.success(`Applied recommendation: ${title}`)
    console.log("[v0] Applied recommendation:", id)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 text-[#0a2540]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/neobank/tax-buckets")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-[#635bff]" />
            AI Recommendations
          </h1>
          <p className="text-slate-500 mt-1">Personalized tax optimization suggestions based on your financial data</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Active Recommendations</p>
            <p className="text-3xl font-bold">{recommendations.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Potential Savings</p>
            <p className="text-3xl font-bold text-green-600">$1,830</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Avg Confidence</p>
            <p className="text-3xl font-bold text-[#635bff]">86%</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`border-2 shadow-md hover:shadow-lg transition-all ${
              rec.priority === "high"
                ? "border-orange-200 bg-orange-50/30"
                : rec.priority === "medium"
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-slate-200"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{rec.title}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        rec.priority === "high"
                          ? "bg-orange-100 text-orange-700"
                          : rec.priority === "medium"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <CardDescription className="text-base">{rec.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-xs text-slate-500">Estimated Impact</p>
                    <p className="font-semibold text-green-600">{rec.impact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                  <Shield className="h-8 w-8 text-[#635bff]" />
                  <div>
                    <p className="text-xs text-slate-500">AI Confidence</p>
                    <p className="font-semibold text-[#635bff]">{rec.confidence}%</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-1">Why this matters:</p>
                <p className="text-sm text-slate-600">{rec.reason}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button className="flex-1 bg-[#635bff] hover:bg-[#5851e1]" onClick={() => handleApply(rec.id, rec.title)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Apply Recommendation
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Historical Performance */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Past Recommendations</CardTitle>
          <CardDescription>Your history with AI suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Increased Q3 State Tax Allocation</p>
                  <p className="text-xs text-slate-500">Applied Oct 12, 2024</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+$890 saved</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Optimized Sales Tax Timing</p>
                  <p className="text-xs text-slate-500">Applied Sep 5, 2024</p>
                </div>
              </div>
              <p className="font-bold text-green-600">+$340 saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
