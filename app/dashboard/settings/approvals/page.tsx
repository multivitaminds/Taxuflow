"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

export default function ApprovalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Approvals</h1>
        <p className="text-sm text-slate-600 mt-1">Manage approval workflows for payments and transactions</p>
      </div>

      {/* Per-payment Approvals */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Per-payment approvals</h2>
          <p className="text-sm text-slate-600 mb-4">
            Require approvals when someone tries to make a payment over a certain amount. If the payment creator is
            eligible to approve, they'll automatically fulfill one approval.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              If a payment already needs approval under your per-payment rule, the daily maximum rule won't ask for
              another approval. Approvers will still be notified if a member went over their daily maximum.
            </p>
          </div>

          <div className="space-y-6">
            {/* Rule 1 */}
            <div className="border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  Active
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-600">
                  •••
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-600">If amount is less than</span>
                  <span className="text-base font-semibold text-slate-900">$100.00</span>
                </div>

                <div className="pl-4 border-l-2 border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">Require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Any Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  Active
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-600">
                  •••
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-600">If amount is greater or equal to</span>
                  <span className="text-base font-semibold text-slate-900">$100.00</span>
                  <span className="text-sm text-slate-600">and less than</span>
                  <span className="text-base font-semibold text-slate-900">$250.00</span>
                </div>

                <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">Require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Any Admin</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">And require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Jane Black</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  Active
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-600">
                  •••
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-600">If amount is greater or equal to</span>
                  <span className="text-base font-semibold text-slate-900">$250.00</span>
                </div>

                <div className="pl-4 border-l-2 border-slate-200 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">Require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Any Admin</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">And require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Jane Black</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <input type="checkbox" className="mt-1" checked readOnly />
                    <div>
                      <span className="text-sm text-slate-700">And require</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Jessica Awad</span>
                      <span className="text-sm text-slate-600 ml-1">or</span>
                      <span className="text-sm font-semibold text-slate-900 ml-1">Mary Metcalfe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Rule Button */}
            <Button variant="outline" className="w-full border-dashed bg-transparent">
              + Add Rule
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
