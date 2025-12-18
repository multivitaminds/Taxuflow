"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PoliciesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Policies</h1>
          <p className="text-sm text-slate-600 mt-1">Manage card spend and reimbursement policies</p>
        </div>
      </div>

      {/* Card Spend Policy */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Card spend policy</h2>
          <p className="text-sm text-slate-600 mb-6">
            Restrict spend or require additional information for card spend at your organization.
          </p>

          {/* Receipt Requirement */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">📄 Receipt requirement</h3>
                <p className="text-sm text-slate-600">Receipt required if transaction amount exceeds $75</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  Disable
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            <div className="pl-6">
              <p className="text-sm text-slate-600">
                Excluded merchants:{" "}
                {["Amazon Web Services", "Facebook", "Google", "Notion", "Github"].map((merchant, idx) => (
                  <Badge key={idx} variant="secondary" className="ml-1">
                    {merchant}
                  </Badge>
                ))}
              </p>
            </div>
          </div>

          {/* Notes Requirement */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">📝 Notes requirement</h3>
                <p className="text-sm text-slate-600">Notes required if transaction amount exceeds $100</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  Disable
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Category Requirement */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">🏷️ Category requirement</h3>
                <p className="text-sm text-slate-600">Category required if transaction amount exceeds $1</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  Disable
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Spend Controls */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-slate-900 mb-1">📊 Spend controls</h3>
                <p className="text-sm text-slate-600 mb-3">Will override controls set for individual cards</p>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-600">
                    Blocked merchants:{" "}
                    {["Amazon Web Services", "Facebook", "Google", "Notion", "Github"].map((merchant, idx) => (
                      <Badge key={idx} variant="secondary" className="ml-1">
                        {merchant}
                      </Badge>
                    ))}
                  </p>
                  <p className="text-slate-600">
                    Blocked merchant types:{" "}
                    {["Alcohol and Bars", "Gambling"].map((type, idx) => (
                      <Badge key={idx} variant="secondary" className="ml-1">
                        {type}
                      </Badge>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  Disable
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
