"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ControlsPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Controls</h1>
        <p className="text-sm text-muted-foreground">
          Set up spending limits, approval workflows, and other financial controls.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Spending Controls */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Spending Controls</CardTitle>
            <CardDescription className="text-sm">Manage limits and restrictions on company spending.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Require approval for transactions over $500</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Transactions above this amount will need manager approval
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Enforce budget limits</Label>
                <p className="text-xs text-muted-foreground mt-1">Prevent spending that exceeds department budgets</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm font-medium">Restrict international transactions</Label>
                <p className="text-xs text-muted-foreground mt-1">Block transactions from outside the United States</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Approval Workflows */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Approval Workflows</CardTitle>
            <CardDescription className="text-sm">
              Configure multi-level approval processes for different transaction types.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Enable multi-level approvals</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Require approval from multiple managers for high-value transactions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm font-medium">Auto-approve recurring transactions</Label>
                <p className="text-xs text-muted-foreground mt-1">Automatically approve known recurring charges</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
