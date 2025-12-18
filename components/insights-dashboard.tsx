"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"

export default function InsightsDashboard() {
  const insights = [
    {
      type: "positive",
      title: "Revenue Growth",
      description: "Your revenue increased by 23% compared to last month",
      metric: "+$42,340",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      action: "View revenue report",
    },
    {
      type: "warning",
      title: "High Expense Category",
      description: "Operating expenses are 15% higher than average",
      metric: "$12,450",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      action: "Review expenses",
    },
    {
      type: "positive",
      title: "Improved Collection Rate",
      description: "Invoice collection time decreased by 5 days",
      metric: "28 days",
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      action: "View AR aging",
    },
    {
      type: "negative",
      title: "Declining Profit Margin",
      description: "Profit margin decreased by 3.2% this quarter",
      metric: "45.3%",
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      action: "Analyze profitability",
    },
  ]

  const recommendations = [
    {
      title: "Optimize Vendor Payments",
      description: "You can save $2,340 by taking advantage of early payment discounts from 3 vendors",
      priority: "High",
      savings: "$2,340",
    },
    {
      title: "Review Subscription Expenses",
      description: "Found 2 duplicate software subscriptions costing $240/month",
      priority: "Medium",
      savings: "$240/mo",
    },
    {
      title: "Invoice Follow-up Needed",
      description: "5 invoices over 45 days old totaling $18,500 need collection action",
      priority: "High",
      savings: "$18,500",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Business Insights</h1>
        <p className="text-muted-foreground mt-1">AI-powered financial intelligence and recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg ${insight.bgColor} flex items-center justify-center flex-shrink-0`}>
                <insight.icon className={`w-6 h-6 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${insight.color}`}>{insight.metric}</span>
                  <Button variant="ghost" size="sm" className="text-primary">
                    {insight.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recommended Actions</h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === "High" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xs text-muted-foreground">Potential Savings</div>
                  <div className="text-lg font-bold text-green-600">{rec.savings}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Take Action
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
