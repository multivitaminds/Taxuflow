"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Bitcoin, Coins, DollarSign, Shield, Wallet } from "lucide-react"

export function CryptoSettings() {
  const [cryptoRefunds, setCryptoRefunds] = useState(true)
  const [autoHarvesting, setAutoHarvesting] = useState(false)
  const [defaultCurrency, setDefaultCurrency] = useState("btc")

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0a2540]">Crypto Settings</h1>
        <p className="text-slate-600 mt-2">Configure your crypto preferences and tax automation</p>
      </div>

      <div className="grid gap-6">
        {/* Refund Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#635bff]" />
              Refund Preferences
            </CardTitle>
            <CardDescription>Control how you receive your tax refunds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium text-[#0a2540]">Crypto Refunds</Label>
                <p className="text-sm text-slate-500">Automatically convert IRS refunds to cryptocurrency</p>
              </div>
              <Switch checked={cryptoRefunds} onCheckedChange={setCryptoRefunds} />
            </div>

            {cryptoRefunds && (
              <div className="pt-4 border-t border-slate-100">
                <Label className="text-base font-medium text-[#0a2540] mb-4 block">Preferred Asset</Label>
                <RadioGroup
                  value={defaultCurrency}
                  onValueChange={setDefaultCurrency}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="btc" id="btc" className="peer sr-only" />
                    <Label
                      htmlFor="btc"
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-[#635bff] peer-data-[state=checked]:bg-[#f0f4ff]"
                    >
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Bitcoin className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2540]">Bitcoin</p>
                        <p className="text-xs text-slate-500">BTC</p>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="eth" id="eth" className="peer sr-only" />
                    <Label
                      htmlFor="eth"
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-[#635bff] peer-data-[state=checked]:bg-[#f0f4ff]"
                    >
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Coins className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2540]">Ethereum</p>
                        <p className="text-xs text-slate-500">ETH</p>
                      </div>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem value="usdc" id="usdc" className="peer sr-only" />
                    <Label
                      htmlFor="usdc"
                      className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 peer-data-[state=checked]:border-[#635bff] peer-data-[state=checked]:bg-[#f0f4ff]"
                    >
                      <div className="p-2 bg-blue-100 rounded-full">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2540]">USDC</p>
                        <p className="text-xs text-slate-500">Stablecoin</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Automation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#635bff]" />
              Tax Automation
            </CardTitle>
            <CardDescription>Smart features to minimize your tax liability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium text-[#0a2540]">Tax-Loss Harvesting</Label>
                <p className="text-sm text-slate-500">Automatically sell losing assets to offset gains (Coming Soon)</p>
              </div>
              <Switch checked={autoHarvesting} onCheckedChange={setAutoHarvesting} disabled />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <Label className="text-base font-medium text-[#0a2540]">FIFO Accounting</Label>
                <p className="text-sm text-slate-500">Use First-In, First-Out method for cost basis calculations</p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Discard Changes</Button>
          <Button className="bg-[#635bff] hover:bg-[#4f46e5]">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
