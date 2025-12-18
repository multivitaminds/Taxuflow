"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AIInsightsDashboard() {
  const insights = [
    {
      id: 1,
      type: "opportunity",
      priority: "high",
      title: "Portfolio Rebalancing Recommended",
      summary: "Your tech sector allocation has grown to 45%, above your 35% target",
      impact: "+$12,500 potential tax savings",
      confidence: 94,
      actions: ["Review allocation", "Implement tax-loss harvesting", "Rebalance portfolio"],
      category: "positive",
    },
    {
      id: 2,
      type: "risk_alert",
      priority: "medium",
      title: "Sector Concentration Risk Detected",
      summary: "Technology sector represents 45% of portfolio, increasing volatility exposure",
      impact: "Risk score increased by 15%",
      confidence: 89,
      actions: ["Diversify holdings", "Consider defensive sectors", "Review risk tolerance"],
      category: "negative",
    },
    {
      id: 3,
      type: "performance_trend",
      priority: "low",
      title: "Strong Momentum in Growth Stocks",
      summary: "Your growth stocks outperformed market by 8.4% this quarter",
      impact: "+$18,200 additional gains",
      confidence: 91,
      actions: ["Monitor performance", "Consider taking profits", "Review exit strategy"],
      category: "positive",
    },
    {
      id: 4,
      type: "tax_optimization",
      priority: "high",
      title: "Tax-Loss Harvesting Opportunity",
      summary: "Potential to realize $8,500 in losses to offset capital gains",
      impact: "$3,400 estimated tax savings",
      confidence: 96,
      actions: ["Review losing positions", "Identify replacement securities", "Execute harvest"],
      category: "action_required",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI-Powered Insights</h2>
          <p className="text-muted-foreground">Intelligent recommendations based on your portfolio</p>
        </div>
        <Button variant="outline">
          <SparklesIcon className="w-4 h-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className={cn(
              "border-l-4 hover:shadow-lg transition-all cursor-pointer",
              insight.category === "positive" && "border-l-emerald-500",
              insight.category === "negative" && "border-l-red-500",
              insight.category === "action_required" && "border-l-amber-500",
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {insight.type === "opportunity" && <TrendingUpIcon className="w-5 h-5 text-emerald-600" />}
                    {insight.type === "risk_alert" && <AlertTriangleIcon className="w-5 h-5 text-red-600" />}
                    {insight.type === "performance_trend" && <LightbulbIcon className="w-5 h-5 text-blue-600" />}
                    {insight.type === "tax_optimization" && <SparklesIcon className="w-5 h-5 text-amber-600" />}
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{insight.summary}</CardDescription>
                </div>
                <Badge
                  variant={
                    insight.priority === "high"
                      ? "destructive"
                      : insight.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {insight.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Potential Impact</p>
                    <p className="text-lg font-semibold text-foreground">{insight.impact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-lg font-semibold text-primary">{insight.confidence}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Recommended Actions:</p>
                  <div className="space-y-2">
                    {insight.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2Icon className="w-4 h-4 text-primary" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  View Detailed Analysis
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
