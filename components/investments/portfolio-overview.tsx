"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, PieChartIcon, ActivityIcon } from "lucide-react"
import { DrillDownCard } from "./drill-down-card"
import { PerformanceChart } from "./performance-chart"
import { AllocationDonut } from "./allocation-donut"

export function PortfolioOverview() {
  const portfolioMetrics = [
    {
      id: "total-value",
      title: "Total Portfolio Value",
      value: "$1,247,582.43",
      change: "+12.4%",
      changeType: "positive" as const,
      icon: DollarSignIcon,
      subtitle: "vs last month",
      drillDownPath: "/investments/portfolio/total-value",
    },
    {
      id: "day-change",
      title: "Today's Change",
      value: "+$8,432.21",
      change: "+0.68%",
      changeType: "positive" as const,
      icon: TrendingUpIcon,
      subtitle: "Market close 4:00 PM EST",
      drillDownPath: "/investments/portfolio/daily-change",
    },
    {
      id: "ytd-return",
      title: "YTD Return",
      value: "+$142,891.12",
      change: "+12.94%",
      changeType: "positive" as const,
      icon: ActivityIcon,
      subtitle: "Since Jan 1, 2025",
      drillDownPath: "/investments/portfolio/ytd-performance",
    },
    {
      id: "total-gain",
      title: "Total Gain/Loss",
      value: "+$287,582.43",
      change: "+30.0%",
      changeType: "positive" as const,
      icon: PieChartIcon,
      subtitle: "All time",
      drillDownPath: "/investments/portfolio/total-gain-loss",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metric Cards with Drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric) => (
          <DrillDownCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            subtitle={metric.subtitle}
            drillDownPath={metric.drillDownPath}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Last 12 months performance vs S&P 500</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current portfolio distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationDonut />
          </CardContent>
        </Card>
      </div>

      {/* Top Holdings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <CardDescription>Your largest positions</CardDescription>
        </CardHeader>
        <CardContent>
          <TopHoldingsTable />
        </CardContent>
      </Card>
    </div>
  )
}

function TopHoldingsTable() {
  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      value: "$125,430.50",
      shares: "850",
      change: "+2.4%",
      changeType: "positive",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      value: "$98,762.30",
      shares: "250",
      change: "+1.8%",
      changeType: "positive",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      value: "$87,215.00",
      shares: "630",
      change: "-0.5%",
      changeType: "negative",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      value: "$76,543.20",
      shares: "520",
      change: "+3.2%",
      changeType: "positive",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      value: "$65,891.45",
      shares: "140",
      change: "+5.7%",
      changeType: "positive",
    },
  ]

  return (
    <div className="space-y-3">
      {holdings.map((holding) => (
        <div
          key={holding.symbol}
          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{holding.symbol}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{holding.symbol}</p>
              <p className="text-sm text-muted-foreground">{holding.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{holding.value}</p>
            <div className="flex items-center gap-1">
              {holding.changeType === "positive" ? (
                <ArrowUpIcon className="w-3 h-3 text-emerald-600" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 text-red-600" />
              )}
              <span className={holding.changeType === "positive" ? "text-emerald-600 text-sm" : "text-red-600 text-sm"}>
                {holding.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
