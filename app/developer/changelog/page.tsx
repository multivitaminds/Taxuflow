"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, AlertTriangle, Bug, Sparkles, Code2, Zap } from "lucide-react"

export default function ChangelogPage() {
  const releases = [
    {
      version: "2.1.0",
      date: "January 15, 2025",
      type: "major",
      changes: [
        {
          type: "feature",
          title: "AI-Powered Tax Optimization",
          description: "New AI agents automatically identify tax-saving opportunities and deductions",
          icon: Sparkles,
        },
        {
          type: "feature",
          title: "Multi-State Filing Support",
          description: "File taxes across multiple states with automatic apportionment calculations",
          icon: Rocket,
        },
        {
          type: "improvement",
          title: "Webhook Delivery Performance",
          description: "Reduced webhook delivery latency by 60% with new infrastructure",
          icon: Zap,
        },
      ],
    },
    {
      version: "2.0.0",
      date: "December 1, 2024",
      type: "major",
      breaking: true,
      changes: [
        {
          type: "breaking",
          title: "API Version 2.0 Released",
          description: "New REST API with improved performance and consistency. See migration guide below.",
          icon: AlertTriangle,
        },
        {
          type: "feature",
          title: "OAuth 2.0 Support",
          description: "Secure third-party integrations with OAuth 2.0 authorization flow",
          icon: Rocket,
        },
        {
          type: "feature",
          title: "Sandbox Environment",
          description: "Test your integrations with realistic sample data before going live",
          icon: Code2,
        },
      ],
      migration: {
        title: "Migrating to API v2.0",
        steps: [
          "Update your API base URL from /v1/ to /v2/",
          "Replace deprecated endpoints with new equivalents",
          "Update error response handling for new error format",
          "Test thoroughly in sandbox environment",
        ],
      },
    },
    {
      version: "1.8.2",
      date: "November 10, 2024",
      type: "patch",
      changes: [
        {
          type: "fix",
          title: "Document Processing Accuracy",
          description: "Fixed W-2 parsing issues for certain employer formats",
          icon: Bug,
        },
        {
          type: "fix",
          title: "Webhook Retry Logic",
          description: "Improved retry mechanism for failed webhook deliveries",
          icon: Bug,
        },
      ],
    },
    {
      version: "1.8.0",
      date: "October 20, 2024",
      type: "minor",
      changes: [
        {
          type: "feature",
          title: "Real-Time Chat API",
          description: "New streaming chat endpoint for conversational tax assistance",
          icon: Sparkles,
        },
        {
          type: "improvement",
          title: "Document Intelligence",
          description: "Enhanced OCR accuracy for handwritten documents",
          icon: Zap,
        },
      ],
    },
    {
      version: "1.7.5",
      date: "September 15, 2024",
      type: "patch",
      changes: [
        {
          type: "fix",
          title: "Rate Limiting Headers",
          description: "Fixed incorrect rate limit headers in API responses",
          icon: Bug,
        },
      ],
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "improvement":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "fix":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      case "breaking":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "feature":
        return "New"
      case "improvement":
        return "Improved"
      case "fix":
        return "Fixed"
      case "breaking":
        return "Breaking"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Changelog</Badge>
          <h1 className="text-4xl font-bold mb-4">Product Updates</h1>
          <p className="text-xl text-gray-400">Stay up to date with new features, improvements, and bug fixes</p>
        </div>

        {/* Releases */}
        <div className="space-y-8">
          {releases.map((release) => (
            <Card key={release.version} className="bg-[#111] border-gray-800 p-8">
              {/* Release Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">v{release.version}</h2>
                    {release.breaking && (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Breaking Changes</Badge>
                    )}
                  </div>
                  <p className="text-gray-400">{release.date}</p>
                </div>
              </div>

              {/* Changes */}
              <div className="space-y-4">
                {release.changes.map((change, idx) => {
                  const Icon = change.icon
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] border border-gray-800 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getTypeColor(change.type)}>{getTypeLabel(change.type)}</Badge>
                          <h3 className="font-semibold">{change.title}</h3>
                        </div>
                        <p className="text-gray-400">{change.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Migration Guide */}
              {release.migration && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {release.migration.title}
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-300">
                    {release.migration.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-red-400">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Subscribe */}
        <Card className="bg-[#111] border-gray-800 p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-gray-400 mb-6">Subscribe to our changelog to get notified about new releases</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold">Subscribe</button>
          </div>
        </Card>
      </div>
    </div>
  )
}
