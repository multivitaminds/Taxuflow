"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Home,
  Car,
  Heart,
  Briefcase,
  Plane,
  Users,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  FileText,
  Sparkles,
  Plus,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function InsuranceClient() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    {
      label: "Total Coverage",
      value: "$1.2M",
      change: "4 active policies",
      trend: "neutral",
      icon: Shield,
      subtext: "Protected value",
    },
    {
      label: "Monthly Premium",
      value: "$427",
      change: "-12.3%",
      trend: "down",
      icon: DollarSign,
      subtext: "vs last year",
    },
    {
      label: "Claims This Year",
      value: "2",
      change: "$3,450 paid",
      trend: "neutral",
      icon: FileText,
      subtext: "Total claims",
    },
    {
      label: "Potential Savings",
      value: "$89/mo",
      change: "AI-found",
      trend: "up",
      icon: TrendingUp,
      subtext: "Bundle discount",
    },
  ]

  const policies = [
    {
      id: 1,
      type: "Home Insurance",
      provider: "StateFarm",
      coverage: "$500,000",
      premium: "$145/mo",
      status: "active",
      renewalDate: "2024-06-15",
      icon: Home,
      color: "blue",
      claims: 0,
      deductible: "$2,500",
    },
    {
      id: 2,
      type: "Auto Insurance",
      provider: "Geico",
      coverage: "$250,000",
      premium: "$180/mo",
      status: "active",
      renewalDate: "2024-03-22",
      icon: Car,
      color: "green",
      claims: 1,
      deductible: "$1,000",
    },
    {
      id: 3,
      type: "Health Insurance",
      provider: "Blue Cross",
      coverage: "$2,000,000",
      premium: "$85/mo",
      status: "active",
      renewalDate: "2024-12-01",
      icon: Heart,
      color: "red",
      claims: 1,
      deductible: "$3,000",
    },
    {
      id: 4,
      type: "Life Insurance",
      provider: "MetLife",
      coverage: "$500,000",
      premium: "$42/mo",
      status: "active",
      renewalDate: "2025-01-15",
      icon: Users,
      color: "purple",
      claims: 0,
      deductible: "N/A",
    },
  ]

  const availableProducts = [
    {
      type: "Travel Insurance",
      description: "Coverage for trips, medical emergencies, and cancellations",
      icon: Plane,
      fromPrice: "$15/trip",
      features: ["Medical emergency", "Trip cancellation", "Lost baggage", "24/7 support"],
      popular: false,
    },
    {
      type: "Disability Insurance",
      description: "Income protection if you're unable to work due to illness or injury",
      icon: Briefcase,
      fromPrice: "$35/mo",
      features: ["60% income replacement", "Covers illness & injury", "Tax-free benefits", "Flexible terms"],
      popular: true,
    },
    {
      type: "Pet Insurance",
      description: "Veterinary care coverage for your furry family members",
      icon: Heart,
      fromPrice: "$25/mo",
      features: ["Accidents & illness", "Emergency care", "Prescription drugs", "Hereditary conditions"],
      popular: false,
    },
  ]

  const recentClaims = [
    {
      id: 1,
      type: "Auto",
      description: "Minor collision repair",
      date: "2023-11-15",
      amount: "$2,450",
      status: "paid",
      icon: Car,
    },
    {
      id: 2,
      type: "Health",
      description: "Emergency room visit",
      date: "2023-10-03",
      amount: "$1,000",
      status: "paid",
      icon: Heart,
    },
  ]

  const aiRecommendations = [
    {
      title: "Bundle & Save",
      description: "Bundling your home and auto insurance with the same provider could save you $89/month.",
      impact: "High",
      confidence: 94,
      action: "View Bundle Options",
      icon: Shield,
      potentialSaving: "$1,068/year",
      type: "savings",
    },
    {
      title: "Review Life Coverage",
      description:
        "Based on recent life changes, you may benefit from increasing your life insurance coverage to $750K.",
      impact: "Medium",
      confidence: 87,
      action: "Get Quote",
      icon: Users,
      potentialSaving: "Better protection",
      type: "coverage",
    },
    {
      title: "Consider Umbrella Policy",
      description:
        "Your assets exceed basic coverage limits. An umbrella policy provides additional liability protection.",
      impact: "High",
      confidence: 91,
      action: "Learn More",
      icon: Shield,
      potentialSaving: "$1M coverage for $20/mo",
      type: "protection",
    },
  ]

  const filteredPolicies = policies.filter(
    (policy) =>
      policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.provider.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Insurance Hub</h1>
          <p className="text-slate-600 mt-1">Manage all your insurance policies and discover coverage options</p>
        </div>
        <Button className="bg-gradient-to-r from-[#635bff] to-[#4f46e5] hover:from-[#5349e6] hover:to-[#4338ca]">
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-lg", "bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10")}>
                <stat.icon className="h-6 w-6 text-[#635bff]" />
              </div>
              {stat.trend !== "neutral" && (
                <Badge variant={stat.trend === "down" ? "default" : "secondary"} className="text-xs">
                  {stat.change}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.subtext}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["overview", "policies", "marketplace", "claims", "insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors capitalize",
              activeTab === tab ? "text-[#635bff] border-b-2 border-[#635bff]" : "text-slate-600 hover:text-slate-900",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredPolicies.map((policy) => (
              <Card
                key={policy.id}
                className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        policy.color === "blue" && "bg-blue-100",
                        policy.color === "green" && "bg-green-100",
                        policy.color === "red" && "bg-red-100",
                        policy.color === "purple" && "bg-purple-100",
                      )}
                    >
                      <policy.icon
                        className={cn(
                          "h-6 w-6",
                          policy.color === "blue" && "text-blue-600",
                          policy.color === "green" && "text-green-600",
                          policy.color === "red" && "text-red-600",
                          policy.color === "purple" && "text-purple-600",
                        )}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{policy.type}</h4>
                      <p className="text-sm text-slate-600">{policy.provider}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    {policy.status}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Coverage</span>
                    <span className="font-semibold text-slate-900">{policy.coverage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Premium</span>
                    <span className="font-semibold text-slate-900">{policy.premium}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Deductible</span>
                    <span className="font-semibold text-slate-900">{policy.deductible}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Renewal</span>
                    <span className="font-semibold text-slate-900">{policy.renewalDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Claims</span>
                    <Badge variant="outline" className="text-xs">
                      {policy.claims} this year
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                    <FileText className="h-3 w-3 mr-1" />
                    Documents
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                    <Shield className="h-3 w-3 mr-1" />
                    File Claim
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy.id} className="p-6 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      policy.color === "blue" && "bg-blue-100",
                      policy.color === "green" && "bg-green-100",
                      policy.color === "red" && "bg-red-100",
                      policy.color === "purple" && "bg-purple-100",
                    )}
                  >
                    <policy.icon
                      className={cn(
                        "h-6 w-6",
                        policy.color === "blue" && "text-blue-600",
                        policy.color === "green" && "text-green-600",
                        policy.color === "red" && "text-red-600",
                        policy.color === "purple" && "text-purple-600",
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{policy.type}</h4>
                    <p className="text-sm text-slate-600">
                      {policy.provider} • {policy.coverage} coverage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{policy.premium}</p>
                    <p className="text-sm text-slate-600">Renews {policy.renewalDate}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Insurance Products</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {availableProducts.map((product, index) => (
                <Card
                  key={index}
                  className={cn(
                    "p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 bg-white",
                    product.popular && "border-2 border-[#635bff]",
                  )}
                >
                  {product.popular && (
                    <Badge className="mb-4 bg-[#635bff]">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}

                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10 w-fit mb-4">
                    <product.icon className="h-6 w-6 text-[#635bff]" />
                  </div>

                  <h4 className="font-semibold text-slate-900 mb-2">{product.type}</h4>
                  <p className="text-sm text-slate-600 mb-4">{product.description}</p>

                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-2">Starting from</p>
                    <p className="text-2xl font-bold text-slate-900">{product.fromPrice}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-[#635bff] hover:bg-[#5349e6]">Get Quote</Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Claims History</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              File New Claim
            </Button>
          </div>

          {recentClaims.map((claim) => (
            <Card key={claim.id} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-100">
                    <claim.icon className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{claim.type} Insurance Claim</p>
                    <p className="text-sm text-slate-600">{claim.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{claim.amount}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="bg-green-100 text-green-700 text-xs">
                      {claim.status}
                    </Badge>
                    <span className="text-sm text-slate-500">{claim.date}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#635bff]" />
            <h3 className="text-lg font-semibold text-slate-900">AI Insurance Insights</h3>
          </div>

          <div className="grid gap-4">
            {aiRecommendations.map((recommendation, index) => (
              <Card
                key={index}
                className={cn(
                  "p-6 border-l-4 hover:shadow-lg transition-all duration-200 cursor-pointer",
                  recommendation.type === "savings" && "border-l-green-500 bg-green-50/50",
                  recommendation.type === "coverage" && "border-l-blue-500 bg-blue-50/50",
                  recommendation.type === "protection" && "border-l-amber-500 bg-amber-50/50",
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      recommendation.type === "savings" && "bg-green-100",
                      recommendation.type === "coverage" && "bg-blue-100",
                      recommendation.type === "protection" && "bg-amber-100",
                    )}
                  >
                    <recommendation.icon
                      className={cn(
                        "h-6 w-6",
                        recommendation.type === "savings" && "text-green-600",
                        recommendation.type === "coverage" && "text-blue-600",
                        recommendation.type === "protection" && "text-amber-600",
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{recommendation.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs bg-white">
                          {recommendation.confidence}% confidence
                        </Badge>
                        <Badge className="text-xs bg-slate-100 text-slate-900">{recommendation.potentialSaving}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{recommendation.description}</p>

                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "text-xs",
                        recommendation.type === "savings" && "border-green-200 text-green-700 hover:bg-green-50",
                        recommendation.type === "coverage" && "border-blue-200 text-blue-700 hover:bg-blue-50",
                        recommendation.type === "protection" && "border-amber-200 text-amber-700 hover:bg-amber-50",
                      )}
                    >
                      {recommendation.action}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
