"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  PiggyBank,
  TrendingUp,
  Zap,
  Target,
  Calendar,
  DollarSign,
  Sparkles,
  Settings,
  Check,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SavingsAutomationClient() {
  const [activeTab, setActiveTab] = useState("overview")
  const [roundUpEnabled, setRoundUpEnabled] = useState(true)
  const [multiplier, setMultiplier] = useState([2])

  const stats = [
    {
      label: "Auto-Saved This Month",
      value: "$847.32",
      change: "+23.4%",
      trend: "up",
      icon: PiggyBank,
      subtext: "vs last month",
    },
    {
      label: "Round-Up Savings",
      value: "$234.50",
      change: "468 transactions",
      trend: "neutral",
      icon: Zap,
      subtext: "This month",
    },
    {
      label: "Projected Annual Savings",
      value: "$10,168",
      change: "On track",
      trend: "up",
      icon: TrendingUp,
      subtext: "At current rate",
    },
    {
      label: "Active Rules",
      value: "6",
      change: "All enabled",
      trend: "neutral",
      icon: Settings,
      subtext: "Automation rules",
    },
  ]

  const savingsRules = [
    {
      id: 1,
      name: "Round-Up Savings",
      description: "Round up every purchase to the nearest dollar and save the difference",
      type: "round-up",
      enabled: true,
      saved: "$234.50",
      frequency: "Per transaction",
      icon: Zap,
      multiplier: 2,
    },
    {
      id: 2,
      name: "Weekly Auto-Save",
      description: "Automatically save a fixed amount every week",
      type: "recurring",
      enabled: true,
      saved: "$400.00",
      frequency: "Weekly",
      icon: Calendar,
      amount: 100,
    },
    {
      id: 3,
      name: "Spare Change",
      description: "Save any amount under $5 from your account at end of day",
      type: "spare",
      enabled: true,
      saved: "$142.82",
      frequency: "Daily",
      icon: DollarSign,
    },
    {
      id: 4,
      name: "Paycheck Percentage",
      description: "Save 10% of every paycheck automatically",
      type: "percentage",
      enabled: false,
      saved: "$0.00",
      frequency: "Per paycheck",
      icon: TrendingUp,
      percentage: 10,
    },
    {
      id: 5,
      name: "Smart Save",
      description: "AI analyzes your spending patterns and saves when you can afford it",
      type: "ai",
      enabled: true,
      saved: "$70.00",
      frequency: "Dynamic",
      icon: Sparkles,
    },
  ]

  const recentSaves = [
    { date: "2024-01-15", amount: 2.47, method: "Round-Up", transaction: "Coffee Shop" },
    { date: "2024-01-15", amount: 100.0, method: "Weekly Auto-Save", transaction: "Scheduled" },
    { date: "2024-01-14", amount: 3.12, method: "Round-Up", transaction: "Grocery Store" },
    { date: "2024-01-14", amount: 4.85, method: "Spare Change", transaction: "End of Day" },
    { date: "2024-01-13", amount: 1.23, method: "Round-Up", transaction: "Gas Station" },
    { date: "2024-01-13", amount: 25.0, method: "Smart Save", transaction: "AI Suggestion" },
  ]

  const aiRecommendations = [
    {
      title: "Increase Round-Up Multiplier",
      description:
        "Based on your spending patterns, increasing round-up to 3x could add $150/month in savings without impacting your lifestyle.",
      impact: "High",
      confidence: 94,
      action: "Apply Recommendation",
      icon: Zap,
      potentialSaving: "$150/mo",
    },
    {
      title: "Enable Paycheck Savings",
      description: "Your income is stable. Saving 10% of each paycheck could add $500/month to your savings.",
      impact: "High",
      confidence: 91,
      action: "Enable Rule",
      icon: TrendingUp,
      potentialSaving: "$500/mo",
    },
    {
      title: "Optimize Smart Save Timing",
      description: "Smart Save can be more aggressive during mid-month when your balance is typically higher.",
      impact: "Medium",
      confidence: 87,
      action: "Optimize Settings",
      icon: Sparkles,
      potentialSaving: "$75/mo",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Savings Automation</h1>
          <p className="text-slate-600 mt-1">Set it and forget it - automate your way to financial goals</p>
        </div>
        <Button className="bg-gradient-to-r from-[#635bff] to-[#4f46e5] hover:from-[#5349e6] hover:to-[#4338ca]">
          <Settings className="h-4 w-4 mr-2" />
          Create Rule
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
                <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
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
        {["overview", "rules", "history", "insights"].map((tab) => (
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
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#635bff]" />
              Round-Up Settings
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Enable Round-Ups</p>
                  <p className="text-sm text-slate-600">Save the change from every purchase</p>
                </div>
                <Switch checked={roundUpEnabled} onCheckedChange={setRoundUpEnabled} />
              </div>

              {roundUpEnabled && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Multiplier</label>
                      <span className="text-sm font-semibold text-[#635bff]">{multiplier[0]}x</span>
                    </div>
                    <Slider
                      value={multiplier}
                      onValueChange={setMultiplier}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">Multiply your round-up savings for faster goal achievement</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-1">Example</p>
                    <p className="text-sm text-green-700">
                      Purchase: $4.35 → Round-up: $0.65 × {multiplier[0]} = ${(0.65 * multiplier[0]).toFixed(2)} saved
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-[#635bff]" />
              Savings Progress
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Monthly Goal</span>
                  <span className="text-sm font-semibold text-slate-900">$847 / $1,000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#635bff] to-[#4f46e5] h-3 rounded-full"
                    style={{ width: "84.7%" }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">84.7% complete - On track!</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Annual Goal</span>
                  <span className="text-sm font-semibold text-slate-900">$2,341 / $12,000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                    style={{ width: "19.5%" }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">19.5% complete - Ahead of schedule</p>
              </div>

              <Button className="w-full mt-4 bg-transparent" variant="outline">
                View All Goals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "rules" && (
        <div className="grid gap-4">
          {savingsRules.map((rule) => (
            <Card
              key={rule.id}
              className="p-6 border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#635bff]/10 to-[#4f46e5]/10 group-hover:from-[#635bff]/20 group-hover:to-[#4f46e5]/20 transition-colors">
                    <rule.icon className="h-6 w-6 text-[#635bff]" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{rule.name}</h4>
                      <Badge variant={rule.enabled ? "default" : "secondary"} className="text-xs">
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{rule.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-slate-500">Saved:</span>
                        <span className="font-semibold text-slate-900 ml-2">{rule.saved}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Frequency:</span>
                        <span className="font-semibold text-slate-900 ml-2">{rule.frequency}</span>
                      </div>
                      {rule.multiplier && (
                        <div>
                          <span className="text-slate-500">Multiplier:</span>
                          <span className="font-semibold text-slate-900 ml-2">{rule.multiplier}x</span>
                        </div>
                      )}
                      {rule.amount && (
                        <div>
                          <span className="text-slate-500">Amount:</span>
                          <span className="font-semibold text-slate-900 ml-2">${rule.amount}</span>
                        </div>
                      )}
                      {rule.percentage && (
                        <div>
                          <span className="text-slate-500">Percentage:</span>
                          <span className="font-semibold text-slate-900 ml-2">{rule.percentage}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={rule.enabled} />
                  <Button size="sm" variant="ghost">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Auto-Saves</h3>
          {recentSaves.map((save, index) => (
            <Card key={index} className="p-4 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{save.method}</p>
                    <p className="text-sm text-slate-600">{save.transaction}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+${save.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">{save.date}</p>
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
            <h3 className="text-lg font-semibold text-slate-900">AI Savings Optimization</h3>
          </div>

          <div className="grid gap-4">
            {aiRecommendations.map((recommendation, index) => (
              <Card
                key={index}
                className="p-6 border-l-4 border-l-[#635bff] hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-r from-[#635bff]/5 to-transparent"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#635bff]/10">
                    <recommendation.icon className="h-6 w-6 text-[#635bff]" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{recommendation.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs bg-white">
                          {recommendation.confidence}% confidence
                        </Badge>
                        <Badge className="text-xs bg-green-100 text-green-700">{recommendation.potentialSaving}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">{recommendation.description}</p>

                    <Button size="sm" className="bg-[#635bff] hover:bg-[#5349e6]">
                      {recommendation.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
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
