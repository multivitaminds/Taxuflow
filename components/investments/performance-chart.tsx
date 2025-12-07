"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function PerformanceChart() {
  const data = [
    { month: "Jan", portfolio: 100, sp500: 100 },
    { month: "Feb", portfolio: 105, sp500: 102 },
    { month: "Mar", portfolio: 103, sp500: 104 },
    { month: "Apr", portfolio: 108, sp500: 106 },
    { month: "May", portfolio: 112, sp500: 108 },
    { month: "Jun", portfolio: 115, sp500: 110 },
    { month: "Jul", portfolio: 118, sp500: 112 },
    { month: "Aug", portfolio: 122, sp500: 114 },
    { month: "Sep", portfolio: 125, sp500: 116 },
    { month: "Oct", portfolio: 128, sp500: 118 },
    { month: "Nov", portfolio: 131, sp500: 120 },
    { month: "Dec", portfolio: 130, sp500: 119 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="portfolio"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          name="Your Portfolio"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sp500"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          name="S&P 500"
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
