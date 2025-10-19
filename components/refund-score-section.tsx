"use client"

import { Info } from "lucide-react"

export function RefundScoreSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Refund Confidence Score</h2>
            <p className="text-xl text-muted-foreground text-balance">AI-backed audit confidence with every return</p>
          </div>

          <div className="relative inline-flex items-center justify-center">
            <svg className="w-64 h-64" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/20"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray="502"
                strokeDashoffset="125"
                strokeLinecap="round"
                className="text-green-500 transition-all duration-1000"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
              <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-5xl font-bold fill-current">
                94%
              </text>
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">Standard deduction selected — saved you $940</span>
          </div>
        </div>
      </div>
    </section>
  )
}
