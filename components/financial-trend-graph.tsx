"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

interface FinancialTrendGraphProps {
  title?: string
  metrics: {
    label: string
    value: number
    change?: string
    color: string
  }[]
  graphData?: {
    name: string
    [key: string]: string | number
  }[]
  graphKeys?: {
    key: string
    color: string
    label: string
  }[]
}

export function FinancialTrendGraph({
  title = "Financial Trends",
  metrics,
  graphData,
  graphKeys,
}: FinancialTrendGraphProps) {
  const [showGraphs, setShowGraphs] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate default graph data if not provided
  const defaultGraphData = graphData || [
    { name: "Dec 1", value1: 820000, value2: 320000 },
    { name: "Dec 3", value1: 950000, value2: 380000 },
    { name: "Dec 5", value1: 2100000, value2: 420000 },
    { name: "Dec 7", value1: 2300000, value2: 460000 },
    { name: "Dec 9", value1: 2500000, value2: 480000 },
    { name: "Dec 11", value1: 2700000, value2: 520000 },
    { name: "Dec 13", value1: 2929069, value2: 599457 },
  ]

  const defaultGraphKeys = graphKeys || [
    { key: "value1", color: "#22c55e", label: "Money in" },
    { key: "value2", color: "#ef4444", label: "Money out" },
  ]

  return (
    <div className="space-y-3">
      {/* Metrics Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3">
              {index > 0 && <div className="w-px h-8 bg-slate-200" />}
              <div>
                <p className="text-xs text-slate-500">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metric.value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  })}
                </p>
                {metric.change && <p className="text-xs text-slate-500 mt-0.5">{metric.change}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGraphs(!showGraphs)}
          className="text-xs text-slate-600 hover:text-slate-900 gap-1.5 h-7"
        >
          {showGraphs ? (
            <>
              Hide graphs <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show graphs <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Graph Section */}
      {showGraphs && (
        <Card className="p-4 bg-slate-50/50 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <div className="flex items-center gap-4">
              {defaultGraphKeys.map((graphKey) => (
                <div key={graphKey.key} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: graphKey.color }} />
                  <span className="text-xs text-slate-600">{graphKey.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[200px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={defaultGraphData}>
                  <defs>
                    {defaultGraphKeys.map((graphKey) => (
                      <linearGradient key={graphKey.key} id={`gradient-${graphKey.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={graphKey.color} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={graphKey.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                  />
                  {defaultGraphKeys.map((graphKey) => (
                    <Area
                      key={graphKey.key}
                      type="monotone"
                      dataKey={graphKey.key}
                      stroke={graphKey.color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#gradient-${graphKey.key})`}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg animate-pulse">
                <div className="h-4 w-4 bg-slate-200 rounded-full" />
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
