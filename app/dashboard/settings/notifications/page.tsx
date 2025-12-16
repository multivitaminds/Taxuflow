"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, DollarSign, Mail } from "lucide-react"

export default function NotificationsPage() {
  const [balanceAlerts, setBalanceAlerts] = useState([
    { id: "ops", name: "Operations / Payroll", enabled: true, threshold: 10000 },
    { id: "ap", name: "Accounts Payable", enabled: false, threshold: 0 },
    { id: "ar", name: "Accounts Receivable", enabled: false, threshold: 0 },
    { id: "checking", name: "Checking ••0297", enabled: true, threshold: 40000 },
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Notifications</h1>
        <p className="text-slate-600 leading-relaxed">Manage how and when you receive notifications from Taxu</p>
      </div>

      {/* Balance Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Balance alerts</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Get notified when account balances fall below your custom thresholds
          </p>
        </div>

        <div className="space-y-6 ml-12">
          {balanceAlerts.map((alert) => (
            <div key={alert.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 mb-3">
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={(checked) => {
                    setBalanceAlerts(balanceAlerts.map((a) => (a.id === alert.id ? { ...a, enabled: checked } : a)))
                  }}
                />
                <Label className="text-sm font-medium text-slate-900 cursor-pointer">{alert.name}</Label>
              </div>
              {alert.enabled && (
                <div className="ml-11">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-600">Notify when balance drops below:</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <Input
                        type="number"
                        value={alert.threshold}
                        onChange={(e) => {
                          setBalanceAlerts(
                            balanceAlerts.map((a) =>
                              a.id === alert.id ? { ...a, threshold: Number.parseInt(e.target.value) } : a,
                            ),
                          )
                        }}
                        className="w-40 h-9 pl-6"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Account activity</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Choose which account events trigger notifications</p>
        </div>

        <div className="space-y-4 ml-12">
          {[
            { label: "Tax filing status updates", enabled: true, description: "E-file confirmations and IRS updates" },
            { label: "IRS notices and correspondence", enabled: true, description: "Important tax notices" },
            { label: "Large transactions", enabled: true, description: "Transactions over $10,000" },
            { label: "Investment performance reports", enabled: false, description: "Weekly portfolio updates" },
            { label: "Failed or declined payments", enabled: true, description: "Payment processing issues" },
            { label: "New login from unrecognized device", enabled: true, description: "Security alerts" },
            { label: "Team member access changes", enabled: true, description: "Permission updates" },
            { label: "Expense policy violations", enabled: true, description: "Out-of-policy spending" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-900 cursor-pointer">{item.label}</Label>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
              <Switch checked={item.enabled} className="flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Email Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Email preferences</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Control the types of emails you receive from us</p>
        </div>

        <div className="space-y-4 ml-12">
          {[
            { label: "Product updates and announcements", enabled: true, description: "New features and improvements" },
            { label: "Weekly activity digest", enabled: false, description: "Summary of weekly transactions" },
            { label: "Marketing and promotional emails", enabled: false, description: "Special offers and tips" },
            { label: "Tax tips and recommendations", enabled: true, description: "Personalized tax advice" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-900 cursor-pointer">{item.label}</Label>
                <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
              </div>
              <Switch checked={item.enabled} className="flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
