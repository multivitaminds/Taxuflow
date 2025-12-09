"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  TrendingUp,
  Download,
  Clock,
  BarChart3,
  FileText,
  Target,
  Building2,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Share2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AIReportGenerator() {
  const [query, setQuery] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const suggestedQueries = [
    "Show me Q4 profit trends",
    "Compare revenue vs expenses for 2024",
    "What are my top 5 customers by revenue?",
    "Analyze expense breakdown by category",
    "Generate cash flow forecast for next quarter",
    "Show year-over-year growth metrics",
  ]

  const reportTemplates = [
    {
      id: "executive",
      name: "Executive Summary",
      description: "High-level business overview with key metrics",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
      estimatedTime: "30s",
    },
    {
      id: "financial",
      name: "Financial Analysis",
      description: "Comprehensive P&L, balance sheet, and cash flow",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      estimatedTime: "45s",
    },
    {
      id: "benchmark",
      name: "Industry Benchmark",
      description: "Compare your metrics to industry standards",
      icon: Building2,
      color: "from-orange-500 to-red-500",
      estimatedTime: "60s",
    },
    {
      id: "custom",
      name: "Custom Query",
      description: "Ask anything in natural language",
      icon: Sparkles,
      color: "from-green-500 to-emerald-500",
      estimatedTime: "Varies",
    },
  ]

  const recentReports = [
    {
      id: 1,
      title: "Q4 2024 Revenue Analysis",
      type: "Financial Analysis",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      title: "Customer Profitability Report",
      type: "Executive Summary",
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      title: "Industry Benchmark - Tech Sector",
      type: "Benchmark",
      date: "2 days ago",
      status: "completed",
    },
  ]

  const handleGenerateReport = async () => {
    if (!query.trim() && !selectedTemplate) return

    setIsGenerating(true)

    setTimeout(() => {
      setGeneratedReport({
        title: query || `${reportTemplates.find((t) => t.id === selectedTemplate)?.name} Report`,
        summary: `AI-generated insights for: "${query || selectedTemplate}"`,
        metrics: {
          revenue: "$524,892",
          profit: "$187,234",
          growth: "+23.5%",
          margin: "35.7%",
        },
        insights: [
          "Revenue increased 23.5% compared to previous quarter",
          "Top 3 customers account for 45% of total revenue",
          "Operating expenses decreased by 8% due to efficiency improvements",
          "Profit margin improved from 32.1% to 35.7%",
        ],
        recommendations: [
          "Focus on high-margin products to maximize profitability",
          "Invest in customer retention programs for top accounts",
          "Continue cost optimization initiatives",
        ],
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">AI Report Generator</h1>
              </div>
              <p className="text-slate-400">Generate comprehensive reports in seconds with natural language queries</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Clock className="h-4 w-4" />
                History
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Reports Generated</p>
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">127</p>
            <p className="text-xs text-emerald-400 mt-1">+12 this month</p>
          </Card>

          <Card className="p-6 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Avg Generation Time</p>
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">42s</p>
            <p className="text-xs text-slate-400 mt-1">Faster than manual</p>
          </Card>

          <Card className="p-6 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Insights Provided</p>
              <Target className="h-5 w-5 text-orange-400" />
            </div>
            <p className="text-3xl font-bold text-white">384</p>
            <p className="text-xs text-emerald-400 mt-1">+15% accuracy</p>
          </Card>

          <Card className="p-6 bg-slate-900 border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-400">Time Saved</p>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">48hrs</p>
            <p className="text-xs text-slate-400 mt-1">This month</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Query Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Natural Language Query */}
            <Card className="p-6 bg-slate-900 border-slate-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Ask Anything</h2>
                <p className="text-sm text-slate-400">Type your question in natural language or select a template</p>
              </div>

              <div className="relative mb-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateReport()}
                  placeholder="e.g., Show me Q4 profit trends..."
                  className="h-14 pl-12 pr-32 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-lg"
                />
                <Sparkles className="absolute left-4 top-4 h-6 w-6 text-purple-400" />
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating || (!query.trim() && !selectedTemplate)}
                  className="absolute right-2 top-2 h-10 gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {/* Suggested Queries */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Suggested queries:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Report Templates */}
            <Card className="p-6 bg-slate-900 border-slate-800">
              <h2 className="text-xl font-bold text-white mb-4">Report Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color}`}>
                        <template.icon className="h-5 w-5 text-white" />
                      </div>
                      {selectedTemplate === template.id && <CheckCircle2 className="h-5 w-5 text-blue-400" />}
                    </div>
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">{template.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Generated Report */}
            {generatedReport && (
              <Card className="p-6 bg-slate-900 border-slate-800">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{generatedReport.title}</h2>
                    <p className="text-sm text-slate-400">{generatedReport.summary}</p>
                  </div>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </div>

                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
                    <TabsTrigger value="summary" className="data-[state=active]:bg-slate-700">
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="data-[state=active]:bg-slate-700">
                      Insights
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="data-[state=active]:bg-slate-700">
                      Recommendations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {Object.entries(generatedReport.metrics).map(([key, value]) => (
                        <Card key={key} className="p-4 bg-slate-800 border-slate-700">
                          <p className="text-sm text-slate-400 capitalize mb-1">{key}</p>
                          <p className="text-2xl font-bold text-white">{value as string}</p>
                        </Card>
                      ))}
                    </div>

                    <div className="h-64 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                      <p className="text-slate-400">Chart visualization will appear here</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="insights" className="mt-6">
                    <div className="space-y-3">
                      {generatedReport.insights.map((insight: string, index: number) => (
                        <Card key={index} className="p-4 bg-slate-800 border-slate-700 flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-blue-400" />
                          </div>
                          <p className="text-slate-300 flex-1">{insight}</p>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-6">
                    <div className="space-y-3">
                      {generatedReport.recommendations.map((rec: string, index: number) => (
                        <Card key={index} className="p-4 bg-slate-800 border-slate-700 flex items-start gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <Target className="h-4 w-4 text-green-400" />
                          </div>
                          <p className="text-slate-300 flex-1">{rec}</p>
                          <ArrowUpRight className="h-5 w-5 text-slate-500" />
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <Card className="p-6 bg-slate-900 border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-slate-800 hover:bg-slate-750 rounded-lg border border-slate-700 hover:border-slate-600 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm">{report.title}</h4>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{report.type}</span>
                      <span className="text-slate-500">{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              >
                View All Reports
              </Button>
            </Card>

            {/* Industry Benchmarks */}
            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-6 w-6 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Industry Benchmarks</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">Profit Margin</span>
                    <span className="text-sm font-medium text-white">Above Average</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-green-500 to-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span>Industry Avg: 28%</span>
                    <span>Your Business: 35.7%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">Revenue Growth</span>
                    <span className="text-sm font-medium text-white">Top Quartile</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500" />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span>Industry Avg: 15%</span>
                    <span>Your Business: 23.5%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">Operating Efficiency</span>
                    <span className="text-sm font-medium text-white">Excellent</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-purple-500 to-pink-500" />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
                    <span>Industry Avg: 68%</span>
                    <span>Your Business: 84%</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                View Full Benchmark Report
              </Button>
            </Card>

            {/* Pro Tip */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-white">Pro Tip</h3>
              </div>
              <p className="text-sm text-slate-300">
                Ask specific questions for better insights. Try "Compare my top 3 customers by profitability" instead of
                "Show customers"
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
