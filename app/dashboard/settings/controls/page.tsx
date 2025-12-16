"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ControlsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Controls</h1>
        <p className="text-sm text-slate-600 mt-1">Manage financial controls and security settings</p>
      </div>

      {/* ACH Authorization */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">ACH authorization</h2>
            <p className="text-sm text-slate-600 mb-4">
              This security feature allows you to designate vendors that can initiate ACH pulls (debits) from your
              account. Unauthorized pulls will be flagged for review.
            </p>
            <p className="text-sm text-slate-600">
              If the manual review window expires for a flagged transaction:{" "}
              <strong className="text-slate-900">automatically approve</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
            Disable
          </Button>
          <Button variant="link" size="sm" className="text-[#635bff]">
            Learn more →
          </Button>
        </div>
      </div>

      {/* Transaction Limits */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Transaction limits</h2>
            <p className="text-sm text-slate-600 mb-4">
              Set daily and per-transaction limits for different types of transfers
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">ACH transfers</p>
                  <p className="text-xs text-slate-600">Daily limit: $50,000 • Per transaction: $25,000</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">Wire transfers</p>
                  <p className="text-xs text-slate-600">Daily limit: $100,000 • Per transaction: $50,000</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Card transactions</p>
                  <p className="text-xs text-slate-600">Daily limit: $10,000 • Per transaction: $5,000</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" size="sm">
            Manage Limits
          </Button>
        </div>
      </div>

      {/* Vendor Allowlist */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Vendor allowlist</h2>
            <p className="text-sm text-slate-600 mb-4">
              Only allow payments to pre-approved vendors for enhanced security
            </p>
            <Badge variant="secondary" className="bg-slate-100">
              Not configured
            </Badge>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" size="sm">
            Setup Allowlist
          </Button>
        </div>
      </div>
    </div>
  )
}
