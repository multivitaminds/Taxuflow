"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Download, Trash2, Eye, AlertTriangle, FileText, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  const [exportLoading, setExportLoading] = useState(false)

  const handleExportData = async () => {
    setExportLoading(true)
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setExportLoading(false)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Privacy & Data</h1>
        <p className="text-slate-600 leading-relaxed">Control how your information is collected, used, and shared</p>
      </div>

      {/* Data Sharing */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Data sharing preferences</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Control how your data is shared with third parties and used for analytics
          </p>
        </div>

        <div className="ml-12 space-y-1">
          {[
            {
              label: "Analytics and performance",
              description: "Help us improve Taxu by sharing anonymous usage data and performance metrics",
              enabled: true,
              badge: "Recommended",
            },
            {
              label: "Third-party integrations",
              description: "Allow connected apps and services to access your data as needed for functionality",
              enabled: true,
              badge: null,
            },
            {
              label: "Marketing communications",
              description: "Receive product updates, feature announcements, and promotional emails",
              enabled: false,
              badge: null,
            },
            {
              label: "Tax data sharing",
              description: "Share anonymized tax data with research institutions for industry insights",
              enabled: false,
              badge: null,
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
              <Switch checked={item.enabled} className="shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Eye className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Profile visibility</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Choose who can see your profile and activity</p>
        </div>

        <div className="ml-12 space-y-1">
          {[
            {
              label: "Public profile",
              description: "Make your basic profile information visible to other Taxu users",
              enabled: false,
            },
            {
              label: "Show email address",
              description: "Display your email address on your public profile",
              enabled: false,
            },
            {
              label: "Activity status",
              description: "Let others see when you're active on Taxu",
              enabled: true,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <Label className="text-sm font-medium text-slate-900 cursor-pointer mb-1 block">{item.label}</Label>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
              <Switch checked={item.enabled} className="shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <Download className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Export your data</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed ml-12">
              Request a complete copy of all your personal data, tax documents, and activity history stored in Taxu.
              You'll receive a download link via email within 24 hours.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={exportLoading}
            className="ml-4 shrink-0 bg-transparent"
          >
            {exportLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Request Export
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Data retention</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Control how long we keep your data and documents</p>
        </div>

        <div className="ml-12">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 mb-1">Legal compliance retention</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tax documents and records are retained for 7 years as required by IRS regulations. This cannot be
                  changed to ensure compliance with federal law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <h2 className="text-base font-semibold text-red-600">Delete account</h2>
            </div>
            <div className="ml-12 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Permanently delete your Taxu account and all associated data. This action cannot be undone.
              </p>
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div className="text-sm text-red-900">
                  <span className="font-medium">Warning:</span> All tax forms, documents, and payment history will be
                  permanently deleted. Download your data first if you need to keep records.
                </div>
              </div>
            </div>
          </div>
          <Button variant="destructive" className="ml-4 shrink-0">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
