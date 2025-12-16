"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Clock, Bell, Mail, Globe, Calendar, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PreferencesPage() {
  const [autoSave, setAutoSave] = useState(true)
  const [timezone, setTimezone] = useState("America/New_York")
  const [currency, setCurrency] = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Preferences</h1>
        <p className="text-slate-600 leading-relaxed">Customize your Taxu experience and default settings</p>
      </div>

      {/* Regional Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Regional settings</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Set your location, language, and formatting preferences</p>
        </div>

        <div className="ml-12 space-y-5">
          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                Time zone
              </div>
            </Label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Anchorage">Alaska Time (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1.5">Used for deadline reminders and scheduling</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-600" />
                Date format
              </div>
            </Label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/14/2025)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (14/12/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-14)</option>
              <option value="Month DD, YYYY">Month DD, YYYY (December 14, 2025)</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-600" />
                Currency
              </div>
            </Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
            >
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="CAD">CAD - Canadian Dollar (C$)</option>
            </select>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">Language</Label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Settings className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Document preferences</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Set defaults for document handling and form management</p>
        </div>

        <div className="ml-12 space-y-1">
          {[
            {
              label: "Auto-save forms",
              description: "Automatically save your progress as you work on tax forms",
              enabled: autoSave,
              onChange: setAutoSave,
              badge: "Recommended",
            },
            {
              label: "Prefill known information",
              description: "Automatically populate forms with information from your profile",
              enabled: true,
              onChange: () => {},
              badge: null,
            },
            {
              label: "Show calculation details",
              description: "Display detailed breakdowns of tax calculations and deductions",
              enabled: true,
              onChange: () => {},
              badge: null,
            },
            {
              label: "Enable AI assistance",
              description: "Get smart suggestions and help while filling out forms",
              enabled: true,
              onChange: () => {},
              badge: "Beta",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm font-medium text-slate-900 cursor-pointer">{item.label}</Label>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
              <Switch checked={item.enabled} onCheckedChange={item.onChange} className="shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Filing Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Filing preferences</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Set your default tax filing options</p>
        </div>

        <div className="ml-12 space-y-5">
          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">Default filing method</Label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent">
              <option>E-file (Electronic filing)</option>
              <option>Mail (Paper forms)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1.5">E-filing is faster and more secure</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-900 mb-2 block">Refund delivery method</Label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent">
              <option>Direct deposit</option>
              <option>Paper check</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email Digest */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Email digest</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Choose when you want to receive summary emails</p>
        </div>

        <div className="ml-12">
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent">
            <option value="daily">Daily digest</option>
            <option value="weekly">Weekly digest</option>
            <option value="monthly">Monthly digest</option>
            <option value="never">Never</option>
          </select>
          <p className="text-xs text-slate-500 mt-1.5">Receive a summary of activity, reminders, and updates</p>
        </div>
      </div>
    </div>
  )
}
