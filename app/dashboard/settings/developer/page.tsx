"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Terminal, Zap, BookOpen, ExternalLink, Copy, Check } from "lucide-react"

export default function DeveloperPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Developer Tools</h1>
            <p className="text-slate-600 leading-relaxed">
              Build integrations and automate workflows with the Taxu API
            </p>
          </div>
          <Badge variant="secondary" className="h-fit">
            Developer Plan
          </Badge>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            label: "API Documentation",
            description: "Complete API reference",
            href: "#",
          },
          {
            icon: Code,
            label: "Code Examples",
            description: "Sample integrations",
            href: "#",
          },
          {
            icon: Zap,
            label: "Webhooks",
            description: "Real-time events",
            href: "#",
          },
        ].map((link, idx) => {
          const Icon = link.icon
          return (
            <a
              key={idx}
              href={link.href}
              className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-[#635bff] hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-[#635bff]/10 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-slate-700 group-hover:text-[#635bff] transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">{link.label}</h3>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#635bff] transition-colors" />
                  </div>
                  <p className="text-sm text-slate-600">{link.description}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* API Keys - Link to API Tokens */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">API Keys</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">Manage your API keys and access tokens for authentication</p>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/dashboard/settings/api-tokens")}>
            Manage API Keys
          </Button>
        </div>

        <div className="ml-12 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-start gap-3">
            <Terminal className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900 mb-1">Keep your keys secure</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never share your secret API keys in publicly accessible areas such as GitHub, client-side code, or
                unsecured environments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SDK Libraries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Code className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Official SDKs</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Install the Taxu SDK in your preferred language</p>
        </div>

        <div className="ml-12 space-y-4">
          {[
            {
              language: "Node.js",
              package: "npm install @taxu/node",
              badge: "Latest",
            },
            {
              language: "Python",
              package: "pip install taxu",
              badge: "Latest",
            },
            {
              language: "Ruby",
              package: "gem install taxu",
              badge: "Beta",
            },
          ].map((sdk, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{sdk.language}</span>
                  <Badge variant="secondary" className="text-xs">
                    {sdk.badge}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(sdk.package)} className="h-7 text-xs">
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <code className="block px-3 py-2 bg-slate-900 text-slate-100 rounded text-xs font-mono">
                {sdk.package}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Webhooks</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">
              Receive real-time notifications when events occur in your account
            </p>
          </div>
          <Button variant="outline">Configure Webhooks</Button>
        </div>

        <div className="ml-12">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              No webhooks configured. Set up webhook endpoints to receive notifications about form submissions, payment
              status changes, and filing updates.
            </p>
          </div>
        </div>
      </div>

      {/* API Usage */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">API Usage (Current month)</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Monitor your API request volume and rate limits</p>
        </div>

        <div className="ml-12 grid grid-cols-3 gap-4">
          {[
            { label: "Total Requests", value: "12,458", limit: "100,000" },
            { label: "Success Rate", value: "99.8%", limit: "" },
            { label: "Avg Response", value: "124ms", limit: "" },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
              {stat.limit && <div className="text-xs text-slate-500 mt-1">of {stat.limit}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
