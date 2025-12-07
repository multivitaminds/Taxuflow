"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function CryptoDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState("overview")

  const cryptoInsights = [
    {
      id: 1,
      type: "opportunity",
      title: "Optimal Buying Opportunity",
      description: "ETH has dropped 8% - historical data suggests good entry point",
      confidence: 87,
      impact: "Medium",
    },
    {
      id: 2,
      type: "info",
      title: "Rebalancing Recommended",
      description: "Your BTC allocation is now 66% - consider rebalancing to target 60%",
      confidence: 92,
      impact: "Low",
    },
    {
      id: 3,
      type: "warning",
      title: "Tax Event Alert",
      description: "Your crypto gains qualify for long-term tax rates next week",
      confidence: 95,
      impact: "High",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="tax">Tax Events</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6"></TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {cryptoInsights.map((insight) => (
              <Card
                key={insight.id}
                className={cn(
                  "border-l-4 hover:shadow-lg transition-all cursor-pointer",
                  insight.type === "opportunity" && "border-l-green-500 bg-green-50/50",
                  insight.type === "warning" && "border-l-orange-500 bg-orange-50/50",
                  insight.type === "info" && "border-l-blue-500 bg-blue-50/50",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-5 w-5 text-[#635bff]" />
                        <h3 className="font-bold text-lg text-[#0a2540]">{insight.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{insight.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            insight.impact === "High" && "border-red-200 bg-red-50 text-red-700",
                            insight.impact === "Medium" && "border-orange-200 bg-orange-50 text-orange-700",
                            insight.impact === "Low" && "border-blue-200 bg-blue-50 text-blue-700",
                          )}
                        >
                          {insight.impact} Impact
                        </Badge>
                        <Button size="sm" className="bg-[#635bff] hover:bg-[#4f46e5]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
