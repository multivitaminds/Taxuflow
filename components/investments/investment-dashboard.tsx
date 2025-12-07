"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioOverview } from "./portfolio-overview"
import { CustomReportBuilder } from "./custom-report-builder"
import { AIInsightsDashboard } from "./ai-insights-dashboard"
import { HoldingsAnalysis } from "./holdings-analysis"
import { PerformanceComparison } from "./performance-comparison"

export function InvestmentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Investment Platform</h1>
          <p className="text-muted-foreground">Enterprise-grade portfolio analytics and AI-powered insights</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PortfolioOverview />
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            <HoldingsAnalysis />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AIInsightsDashboard />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <CustomReportBuilder />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <PerformanceComparison />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
