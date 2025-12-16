"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Search, ExternalLink, Zap } from "lucide-react"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const activeIntegrations = [
    {
      name: "QuickBooks Online",
      description: "Sync transactions and categorize expenses automatically",
      status: "connected",
      logo: "📒",
      category: "Accounting",
      lastSync: "2 minutes ago",
    },
    {
      name: "Stripe",
      description: "Accept card payments on invoices",
      status: "connected",
      logo: "💳",
      category: "Payments",
      lastSync: "1 hour ago",
    },
  ]

  const availableIntegrations = [
    {
      name: "NetSuite",
      description: "Enterprise resource planning and financial management",
      category: "Accounting",
      logo: "📊",
      popular: true,
    },
    {
      name: "Xero",
      description: "Cloud accounting software for small business",
      category: "Accounting",
      logo: "📗",
      popular: true,
    },
    { name: "Slack", description: "Real-time notifications and alerts", category: "Communication", logo: "💬" },
    {
      name: "Plaid",
      description: "Connect bank accounts and verify transactions",
      category: "Banking",
      logo: "🔗",
      popular: true,
    },
    {
      name: "Zapier",
      description: "Automate workflows across 5,000+ apps",
      category: "Automation",
      logo: "🔄",
    },
    { name: "Gusto", description: "Sync payroll and team member data", category: "HR & Payroll", logo: "👥" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Integrations</h1>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            {activeIntegrations.length} active
          </Badge>
        </div>
        <p className="text-slate-600 leading-relaxed">Connect Taxu with your favorite business tools</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search integrations by name or category..."
          className="pl-10 h-11 bg-white border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Active Integrations */}
      {activeIntegrations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Connected integrations</h2>
          </div>

          <div className="space-y-3">
            {activeIntegrations.map((integration, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-2xl shadow-sm">
                      {integration.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                          {integration.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{integration.description}</p>
                      <p className="text-xs text-slate-500">Last synced: {integration.lastSync}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Browse all integrations</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {availableIntegrations.map((integration, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 p-5 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  {integration.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{integration.name}</h3>
                    {integration.popular && (
                      <Badge variant="secondary" className="bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200 mb-2">
                    {integration.category}
                  </Badge>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{integration.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 group-hover:border-[#635bff] group-hover:text-[#635bff] bg-transparent"
                  >
                    Connect
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
