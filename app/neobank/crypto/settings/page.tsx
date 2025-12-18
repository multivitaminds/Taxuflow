"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bitcoin, Shield, Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CryptoSettingsPage() {
  const [refundToCrypto, setRefundToCrypto] = useState(false)
  const [autoConvert, setAutoConvert] = useState(true)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex items-center gap-4">
        <Link href="/neobank/crypto">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crypto Settings</h1>
          <p className="text-slate-500 mt-1">Configure your cryptocurrency preferences and tax refund options</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tax Refund Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#635bff]/10 rounded-lg">
                <Bitcoin className="h-5 w-5 text-[#635bff]" />
              </div>
              <div>
                <CardTitle>Tax Refund to Crypto</CardTitle>
                <CardDescription>Automatically convert your IRS refund into cryptocurrency</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Crypto Refunds</p>
                <p className="text-xs text-slate-500 mt-1">
                  Your refund will be converted at market rate when received
                </p>
              </div>
              <Switch
                checked={refundToCrypto}
                onCheckedChange={setRefundToCrypto}
                className="data-[state=checked]:bg-[#635bff]"
              />
            </div>

            {refundToCrypto && (
              <div className="space-y-4 pl-4 border-l-2 border-[#635bff]">
                <div className="space-y-2">
                  <Label>Convert to</Label>
                  <Select defaultValue="btc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-sm">Auto-Convert</p>
                    <p className="text-xs text-slate-500 mt-1">Convert immediately when refund arrives</p>
                  </div>
                  <Switch
                    checked={autoConvert}
                    onCheckedChange={setAutoConvert}
                    className="data-[state=checked]:bg-[#635bff]"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#635bff]/10 rounded-lg">
                <Shield className="h-5 w-5 text-[#635bff]" />
              </div>
              <div>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>Manage security settings and tax reporting</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500 mt-1">Required for crypto transactions</p>
              </div>
              <Switch checked={true} disabled className="data-[state=checked]:bg-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Automatic Tax Reporting</p>
                <p className="text-xs text-slate-500 mt-1">Generate Form 8949 for capital gains</p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-[#635bff]" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#635bff]/10 rounded-lg">
                <Bell className="h-5 w-5 text-[#635bff]" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage alerts for price changes and transactions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Price Alerts</p>
                <p className="text-xs text-slate-500 mt-1">Get notified of significant price movements</p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-[#635bff]" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Transaction Confirmations</p>
                <p className="text-xs text-slate-500 mt-1">Alerts when transactions complete</p>
              </div>
              <Switch checked={true} className="data-[state=checked]:bg-[#635bff]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/neobank/crypto">
          <Button variant="outline" className="bg-white">
            Cancel
          </Button>
        </Link>
        <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white">Save Settings</Button>
      </div>
    </div>
  )
}
