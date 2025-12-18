"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Globe, Star, Plus } from "lucide-react"

export default function CurrencySettingsClient() {
  const [baseCurrency, setBaseCurrency] = useState("USD")

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, isBase: true, enabled: true },
    { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, isBase: false, enabled: true },
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, isBase: false, enabled: true },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.35, isBase: false, enabled: true },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52, isBase: false, enabled: false },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.5, isBase: false, enabled: false },
  ]

  const stats = [
    { label: "Base Currency", value: "USD", icon: Star, color: "text-blue-600" },
    { label: "Active Currencies", value: "4", icon: Globe, color: "text-emerald-600" },
    { label: "Last Updated", value: "2 hours ago", icon: TrendingUp, color: "text-purple-600" },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Multi-Currency Settings</h1>
          <p className="text-slate-600 mt-1">Manage currencies and exchange rates</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Update Rates</Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Currency
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Currencies List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Active Currencies</h2>
        <div className="space-y-4">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{currency.name}</h3>
                    <Badge variant="outline">{currency.code}</Badge>
                    {currency.isBase && <Badge className="bg-blue-100 text-blue-700">Base Currency</Badge>}
                  </div>
                  <p className="text-sm text-slate-600">
                    Symbol: <span className="font-medium">{currency.symbol}</span>
                    {!currency.isBase && (
                      <span className="ml-4">
                        Rate:{" "}
                        <span className="font-medium">
                          {currency.rate} {currency.code} = 1 {baseCurrency}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={currency.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                  {currency.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Button variant="outline" size="sm">
                  {currency.enabled ? "Disable" : "Enable"}
                </Button>
                {!currency.isBase && (
                  <Button variant="outline" size="sm">
                    Set as Base
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
