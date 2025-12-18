"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const [balanceAlerts, setBalanceAlerts] = useState({
    opsPayroll: { enabled: true, threshold: "10000" },
    ap: { enabled: false, threshold: "5000" },
    ar: { enabled: false, threshold: "5000" },
    checking: { enabled: true, threshold: "40000" },
  })

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Control how and when you receive notifications about your Taxu account.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Balance Alerts */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Balance alerts</CardTitle>
                <CardDescription className="text-sm">
                  Set a custom threshold for each account and get an email alert when the balance falls below it.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                2 active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Ops / Payroll */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={balanceAlerts.opsPayroll.enabled}
                    onCheckedChange={(checked) =>
                      setBalanceAlerts({
                        ...balanceAlerts,
                        opsPayroll: { ...balanceAlerts.opsPayroll, enabled: checked },
                      })
                    }
                  />
                  <Label className="text-sm font-medium">Ops / Payroll</Label>
                </div>
                {balanceAlerts.opsPayroll.enabled && (
                  <div className="mt-3 ml-11 flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Send when balance falls below:</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        value={balanceAlerts.opsPayroll.threshold}
                        onChange={(e) =>
                          setBalanceAlerts({
                            ...balanceAlerts,
                            opsPayroll: { ...balanceAlerts.opsPayroll, threshold: e.target.value },
                          })
                        }
                        className="h-8 w-32 pl-6 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AP */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={balanceAlerts.ap.enabled}
                    onCheckedChange={(checked) =>
                      setBalanceAlerts({ ...balanceAlerts, ap: { ...balanceAlerts.ap, enabled: checked } })
                    }
                  />
                  <Label className="text-sm font-medium">AP</Label>
                </div>
              </div>
            </div>

            {/* AR */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={balanceAlerts.ar.enabled}
                    onCheckedChange={(checked) =>
                      setBalanceAlerts({ ...balanceAlerts, ar: { ...balanceAlerts.ar, enabled: checked } })
                    }
                  />
                  <Label className="text-sm font-medium">AR</Label>
                </div>
              </div>
            </div>

            {/* Checking */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={balanceAlerts.checking.enabled}
                    onCheckedChange={(checked) =>
                      setBalanceAlerts({ ...balanceAlerts, checking: { ...balanceAlerts.checking, enabled: checked } })
                    }
                  />
                  <Label className="text-sm font-medium">Checking ••0297</Label>
                </div>
                {balanceAlerts.checking.enabled && (
                  <div className="mt-3 ml-11 flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Send when balance falls below:</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        value={balanceAlerts.checking.threshold}
                        onChange={(e) =>
                          setBalanceAlerts({
                            ...balanceAlerts,
                            checking: { ...balanceAlerts.checking, threshold: e.target.value },
                          })
                        }
                        className="h-8 w-32 pl-6 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Account activity</CardTitle>
                <CardDescription className="text-sm">
                  Get notified about important changes to your accounts and transactions.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                11 active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Large transactions</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Failed transactions</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tax filing reminders</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Investment updates</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
