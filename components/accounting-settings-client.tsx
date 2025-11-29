"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Building2, DollarSign, Bell, Shield, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AccountingSettingsClient() {
  const { toast } = useToast()
  const [companyName, setCompanyName] = useState("My Company")
  const [fiscalYearStart, setFiscalYearStart] = useState("january")
  const [currency, setCurrency] = useState("USD")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your accounting settings have been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your accounting preferences and integrations</p>
        </div>
        <Button onClick={handleSave} className="bg-[#635bff] hover:bg-[#5851df] text-white">
          Save Changes
        </Button>
      </div>

      {/* Company Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Company Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input id="taxId" placeholder="XX-XXXXXXX" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input id="address" placeholder="Enter business address" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" placeholder="ZIP" />
            </div>
          </div>
        </div>
      </Card>

      {/* Accounting Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Accounting Preferences</h2>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
              <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
                <SelectTrigger id="fiscalYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accountingMethod">Accounting Method</Label>
              <Select defaultValue="accrual">
                <SelectTrigger id="accountingMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accrual">Accrual</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxYear">Tax Year</Label>
              <Select defaultValue="calendar">
                <SelectTrigger id="taxYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calendar">Calendar Year</SelectItem>
                  <SelectItem value="fiscal">Fiscal Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications & Alerts */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Notifications & Alerts</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifs">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
            </div>
            <Switch id="emailNotifs" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="overdueReminders">Overdue Bill Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about overdue bills and invoices</p>
            </div>
            <Switch id="overdueReminders" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="paymentConfirm">Payment Confirmations</Label>
              <p className="text-sm text-muted-foreground">Receive confirmations for received payments</p>
            </div>
            <Switch id="paymentConfirm" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyReports">Weekly Summary Reports</Label>
              <p className="text-sm text-muted-foreground">Get weekly accounting summaries via email</p>
            </div>
            <Switch id="weeklyReports" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Data & Backup */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Data & Backup</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoBackup">Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
            </div>
            <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">Download all your accounting data</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-red-600">Delete All Data</Label>
              <p className="text-sm text-muted-foreground">Permanently delete all accounting records</p>
            </div>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">QuickBooks</h3>
                <p className="text-sm text-muted-foreground">Connect to QuickBooks Online</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Xero</h3>
                <p className="text-sm text-muted-foreground">Sync with Xero accounting</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
