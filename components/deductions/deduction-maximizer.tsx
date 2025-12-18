"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Search,
  Shield,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Sparkles,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DeductionMaximizer() {
  const [industry, setIndustry] = useState("")
  const [revenue, setRevenue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [deductions, setDeductions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"discover" | "templates" | "audit">("discover")

  const handleDiscoverDeductions = async () => {
    setIsSearching(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock deductions based on industry
    const mockDeductions = [
      {
        id: 1,
        name: "Home Office Deduction",
        category: "Office Expenses",
        estimatedSavings: 3600,
        auditRisk: "low",
        description: "Exclusive and regular use of part of your home for business purposes",
        requirements: ["Dedicated workspace", "Regular business use", "Square footage measurement"],
        documentation: ["Utility bills", "Rent/mortgage statements", "Photos of workspace"],
        taxFormLine: "Schedule C, Line 30",
        confidence: 92,
      },
      {
        id: 2,
        name: "Business Vehicle Deduction",
        category: "Transportation",
        estimatedSavings: 5200,
        auditRisk: "medium",
        description: "Standard mileage rate or actual expenses for business vehicle use",
        requirements: ["Mileage log", "Business purpose documentation", "50%+ business use"],
        documentation: ["Mileage tracker", "Receipts for gas/maintenance", "Vehicle registration"],
        taxFormLine: "Schedule C, Line 9",
        confidence: 88,
      },
      {
        id: 3,
        name: "Software & SaaS Subscriptions",
        category: "Technology",
        estimatedSavings: 2400,
        auditRisk: "low",
        description: "Business software, tools, and online services used exclusively for work",
        requirements: ["Business use only", "Subscription receipts", "Usage records"],
        documentation: ["Subscription invoices", "Payment confirmations", "Usage logs"],
        taxFormLine: "Schedule C, Line 18",
        confidence: 95,
      },
      {
        id: 4,
        name: "Professional Development",
        category: "Education",
        estimatedSavings: 1800,
        auditRisk: "low",
        description: "Courses, conferences, and training that maintain or improve job skills",
        requirements: ["Job-related courses", "Skill improvement", "Industry-relevant"],
        documentation: ["Course receipts", "Certificates", "Conference tickets"],
        taxFormLine: "Schedule C, Line 27a",
        confidence: 90,
      },
      {
        id: 5,
        name: "Health Insurance Premiums",
        category: "Insurance",
        estimatedSavings: 7200,
        auditRisk: "low",
        description: "Self-employed health insurance deduction for you and dependents",
        requirements: ["Self-employed status", "Not eligible for employer plan", "Premium payments"],
        documentation: ["Insurance statements", "Payment records", "Coverage details"],
        taxFormLine: "Form 1040, Line 17",
        confidence: 93,
      },
      {
        id: 6,
        name: "Retirement Contributions",
        category: "Retirement",
        estimatedSavings: 4500,
        auditRisk: "low",
        description: "SEP-IRA, Solo 401(k), or SIMPLE IRA contributions",
        requirements: ["Established retirement plan", "Contribution limits", "Self-employed income"],
        documentation: ["Contribution receipts", "Account statements", "Plan documents"],
        taxFormLine: "Form 1040, Schedule 1, Line 16",
        confidence: 96,
      },
    ]

    setDeductions(mockDeductions)
    setIsSearching(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20"
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20"
    }
  }

  const totalSavings = deductions.reduce((sum, d) => sum + d.estimatedSavings, 0)

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Brain className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Deduction Maximizer
            </h1>
            <p className="text-muted-foreground mt-1">
              Industry-specific deduction finder with audit defense optimization
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        {deductions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Potential Savings</p>
                  <p className="text-2xl font-bold text-emerald-500">${totalSavings.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Deductions Found</p>
                  <p className="text-2xl font-bold text-blue-500">{deductions.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Low Audit Risk</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {deductions.filter((d) => d.auditRisk === "low").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="text-2xl font-bold text-amber-500">
                    {Math.round(deductions.reduce((sum, d) => sum + d.confidence, 0) / deductions.length)}%
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Discovery Form */}
      {deductions.length === 0 && (
        <Card className="p-8 mb-8 bg-gradient-to-br from-background to-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Tell Us About Your Business</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry" className="mt-2">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology & Software</SelectItem>
                    <SelectItem value="consulting">Consulting & Professional Services</SelectItem>
                    <SelectItem value="retail">Retail & E-commerce</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="creative">Creative & Media</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="revenue">Annual Revenue</Label>
                <Input
                  id="revenue"
                  type="text"
                  placeholder="$100,000"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={handleDiscoverDeductions}
                disabled={!industry || !revenue || isSearching}
              >
                {isSearching ? (
                  <>
                    <Brain className="h-5 w-5 mr-2 animate-pulse" />
                    AI Analyzing Your Situation...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Find My Deductions
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results - Tabs */}
      {deductions.length > 0 && (
        <>
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "discover" ? "text-blue-500" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              Discovered Deductions
              {activeTab === "discover" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "templates" ? "text-purple-500" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Documentation Templates
              {activeTab === "templates" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "audit" ? "text-amber-500" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Audit Defense
              {activeTab === "audit" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
            </button>
          </div>

          {/* Deductions Tab */}
          {activeTab === "discover" && (
            <div className="space-y-4">
              {deductions.map((deduction) => (
                <Card key={deduction.id} className="p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                          {deduction.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                            deduction.auditRisk,
                          )}`}
                        >
                          {deduction.auditRisk.toUpperCase()} RISK
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {deduction.confidence}% CONFIDENCE
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">{deduction.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Requirements:</p>
                          <ul className="space-y-1">
                            {deduction.requirements.map((req: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Required Documentation:</p>
                          <ul className="space-y-1">
                            {deduction.documentation.map((doc: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Tax Form: <span className="font-medium text-foreground">{deduction.taxFormLine}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Category: <span className="font-medium text-foreground">{deduction.category}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Tax Savings</p>
                      <p className="text-3xl font-bold text-emerald-500">
                        ${deduction.estimatedSavings.toLocaleString()}
                      </p>
                      <Button size="sm" className="mt-4 bg-transparent" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Template
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Home Office Worksheet", icon: FileText, color: "blue" },
                { name: "Mileage Log Template", icon: FileText, color: "purple" },
                { name: "Receipt Organizer", icon: FileText, color: "emerald" },
                { name: "Business Expense Tracker", icon: FileText, color: "amber" },
                { name: "Professional Development Log", icon: FileText, color: "rose" },
                { name: "Health Insurance Deduction Form", icon: FileText, color: "cyan" },
              ].map((template, idx) => (
                <Card key={idx} className="p-6 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-${template.color}-500/10 border border-${template.color}-500/20`}
                    >
                      <template.icon className={`h-6 w-6 text-${template.color}-500`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2 group-hover:text-purple-500 transition-colors">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Pre-filled template to track and document this deduction
                      </p>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Audit Defense Tab */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-emerald-500">Overall Audit Risk: LOW</h3>
                    <p className="text-muted-foreground mb-4">
                      Your deduction profile is well-documented and falls within normal ranges for your industry
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>All deductions have proper documentation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>Deduction amounts are reasonable for your income level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span>No red flags detected in your deduction profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Audit Defense Optimization</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Document Everything</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep receipts, invoices, and records for all deductions. Digital copies are acceptable.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Brain className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Business Purpose Test</h4>
                      <p className="text-sm text-muted-foreground">
                        Every deduction must have a clear business purpose. Document the why, not just the what.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Reasonable & Ordinary</h4>
                      <p className="text-sm text-muted-foreground">
                        Deductions should be reasonable for your industry and ordinary for your business type.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Red Flag Avoidance</h4>
                      <p className="text-sm text-muted-foreground">
                        Avoid round numbers, excessive deductions relative to income, and inconsistent year-over-year
                        changes.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
