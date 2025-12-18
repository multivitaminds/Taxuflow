"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  DollarSign,
  PiggyBank,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function BusinessInsights() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")

  const handleRequestAnalysis = () => {
    // This would trigger AI analysis in a real implementation
    alert("AI Analysis requested! Our system will analyze your data and provide insights within 5 minutes.")
  }

  const handleViewDetails = (insightId: number) => {
    router.push(`/neobank/insights/${insightId}`)
  }

  const insights = [
    {
      id: 1,
      category: "opportunity",
      icon: TrendingUp,
      color: "bg-emerald-500",
      trend: "positive",
      title: "Revenue Growth Opportunity",
      description:
        "Your income increased by 15% this month. Consider scaling your marketing efforts to maintain this momentum.",
      impact: "High",
      confidence: 92,
      actions: [
        "Increase marketing budget by 20%",
        "Launch new customer acquisition campaign",
        "Expand to new market segments",
      ],
    },
    {
      id: 2,
      category: "warning",
      icon: AlertCircle,
      color: "bg-orange-500",
      trend: "negative",
      title: "Rising Operating Expenses",
      description:
        "Operating costs are up 23% compared to last quarter. Review vendor contracts and operational efficiency.",
      impact: "Medium",
      confidence: 87,
      actions: ["Audit recurring subscriptions", "Renegotiate vendor contracts", "Implement cost-saving measures"],
    },
    {
      id: 3,
      category: "recommendation",
      icon: Target,
      color: "bg-blue-500",
      trend: "neutral",
      title: "Cash Flow Optimization",
      description:
        "You have $35k in idle cash. Consider investing in short-term instruments or paying down high-interest debt.",
      impact: "High",
      confidence: 94,
      actions: ["Move $20k to high-yield savings", "Invest $10k in money market fund", "Keep $5k as operating buffer"],
    },
    {
      id: 4,
      category: "opportunity",
      icon: PiggyBank,
      color: "bg-purple-500",
      trend: "positive",
      title: "Tax Savings Opportunity",
      description: "Based on your spending patterns, you could save $4,200 annually by maximizing business deductions.",
      impact: "High",
      confidence: 89,
      actions: [
        "Track home office expenses",
        "Document business meals and travel",
        "Consider equipment purchases before year-end",
      ],
    },
    {
      id: 5,
      category: "insight",
      icon: Zap,
      color: "bg-indigo-500",
      trend: "neutral",
      title: "Payment Success Rate",
      description:
        "Your payment success rate is 97.2%, which is above industry average. Keep maintaining excellent cash management.",
      impact: "Low",
      confidence: 96,
      actions: [
        "Continue current payment practices",
        "Monitor for any declining trends",
        "Share best practices with team",
      ],
    },
    {
      id: 6,
      category: "warning",
      icon: TrendingDown,
      color: "bg-red-500",
      trend: "negative",
      title: "Declining Transaction Volume",
      description:
        "Transaction count dropped 8% this week. This could indicate reduced customer activity or seasonal trends.",
      impact: "Medium",
      confidence: 85,
      actions: ["Review customer engagement metrics", "Launch re-engagement campaign", "Analyze seasonal patterns"],
    },
  ]

  const categories = [
    { id: "all", label: "All Insights", count: insights.length },
    { id: "opportunity", label: "Opportunities", count: insights.filter((i) => i.category === "opportunity").length },
    { id: "warning", label: "Warnings", count: insights.filter((i) => i.category === "warning").length },
    {
      id: "recommendation",
      label: "Recommendations",
      count: insights.filter((i) => i.category === "recommendation").length,
    },
  ]

  const filteredInsights = activeCategory === "all" ? insights : insights.filter((i) => i.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Business Insights
              </h1>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
            <p className="text-lg text-slate-600">Actionable intelligence to grow your business</p>
          </div>
          <Button
            onClick={handleRequestAnalysis}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Request Analysis
          </Button>
        </div>

        {/* AI Summary Card */}
        <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">AI Financial Health Score: 84/100</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Your business is performing well with strong revenue growth and healthy cash reserves. Focus on
                  optimizing operating expenses and maximizing tax deductions to improve your score.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Strong Revenue
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Good Cash Flow
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    High Expenses
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={cn(activeCategory === category.id ? "bg-indigo-600 text-white" : "bg-white hover:bg-slate-50")}
            >
              {category.label}
              <Badge
                variant="secondary"
                className={cn(
                  "ml-2",
                  activeCategory === category.id ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700",
                )}
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInsights.map((insight) => (
            <Card
              key={insight.id}
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-slate-200 bg-white hover:scale-[1.02]"
              onClick={() => handleViewDetails(insight.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2.5 rounded-lg", insight.color)}>
                      <insight.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 mb-1">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            insight.impact === "High"
                              ? "bg-red-100 text-red-700"
                              : insight.impact === "Medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700",
                          )}
                        >
                          {insight.impact} Impact
                        </Badge>
                        <span className="text-xs text-slate-500">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  {insight.trend !== "neutral" && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "flex items-center gap-1",
                        insight.trend === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                      )}
                    >
                      {insight.trend === "positive" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">{insight.description}</p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    Recommended Actions
                  </p>
                  <div className="space-y-2">
                    {insight.actions.map((action, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-600 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 group-hover:bg-indigo-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewDetails(insight.id)
                  }}
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Revenue Trend", value: "+15.2%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
            { label: "Cost Efficiency", value: "87%", icon: Target, color: "text-blue-600", bg: "bg-blue-100" },
            { label: "Cash Reserve", value: "$35.2k", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-100" },
            {
              label: "Savings Potential",
              value: "$4.2k/yr",
              icon: PiggyBank,
              color: "text-orange-600",
              bg: "bg-orange-100",
            },
          ].map((metric, idx) => (
            <Card key={idx} className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">{metric.label}</span>
                  <div className={cn("p-2 rounded-lg", metric.bg)}>
                    <metric.icon className={cn("h-4 w-4", metric.color)} />
                  </div>
                </div>
                <p className={cn("text-2xl font-bold", metric.color)}>{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
