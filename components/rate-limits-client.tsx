"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RateLimitsClient() {
  const usageData = [
    { time: "00:00", rpm: 650, quota: 280000 },
    { time: "04:00", rpm: 420, quota: 310000 },
    { time: "08:00", rpm: 780, quota: 340000 },
    { time: "12:00", rpm: 920, quota: 365000 },
    { time: "16:00", rpm: 847, quota: 387000 },
    { time: "20:00", rpm: 710, quota: 387000 },
  ]

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rate Limits</h1>
        <p className="text-xl text-muted-foreground">Monitor your API usage and rate limit status</p>
      </div>

      {/* Current Usage */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Requests per Minute</h2>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">847</span>
              <span className="text-2xl text-muted-foreground">/ 1000</span>
            </div>
            <div className="h-3 rounded-full bg-background-alt overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: "84.7%" }}></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">84.7% of your per-minute limit used</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Monthly Quota</h2>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">387K</span>
              <span className="text-2xl text-muted-foreground">/ 1M</span>
            </div>
            <div className="h-3 rounded-full bg-background-alt overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: "38.7%" }}></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">38.7% of your monthly quota used</p>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Usage Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="rpm" stroke="hsl(var(--accent))" strokeWidth={2} name="Requests/min" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Plan Limits */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Plan Limits</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
            <div>
              <p className="font-semibold mb-1">Rate Limit</p>
              <p className="text-sm text-muted-foreground">Maximum requests per minute</p>
            </div>
            <p className="text-2xl font-bold">1,000</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
            <div>
              <p className="font-semibold mb-1">Burst Limit</p>
              <p className="text-sm text-muted-foreground">Short-term spike allowance</p>
            </div>
            <p className="text-2xl font-bold">2,000</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
            <div>
              <p className="font-semibold mb-1">Monthly Quota</p>
              <p className="text-sm text-muted-foreground">Total requests per month</p>
            </div>
            <p className="text-2xl font-bold">1,000,000</p>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="rounded-2xl border border-accent/30 bg-card p-8 glow-neon">
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 text-accent flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Need Higher Limits?</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to our Enterprise plan for custom rate limits, dedicated support, and SLA guarantees.
            </p>
            <Link href="/pricing">
              <Button className="glow-neon-strong">View Plans</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
