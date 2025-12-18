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
import { formatEIN } from "@/lib/format-utils"

export function AccountingSettingsClient() {
  const { toast } = useToast()
  const [companyName, setCompanyName] = useState("Taxu, Inc")
  const [taxId, setTaxId] = useState("12-3456789")
  const [address, setAddress] = useState("1767 Tearose Ln")
  const [city, setCity] = useState("Cherry Hill")
  const [state, setState] = useState("NJ")
  const [zip, setZip] = useState("08003")
  const [fiscalYearStart, setFiscalYearStart] = useState("january")
  const [currency, setCurrency] = useState("EUR")
  const [accountingMethod, setAccountingMethod] = useState("cash")
  const [taxYear, setTaxYear] = useState("calendar")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)

  const [isConnectingQBO, setIsConnectingQBO] = useState(false)
  const [isConnectingXero, setIsConnectingXero] = useState(false)

  const [autoTaxCalculation, setAutoTaxCalculation] = useState(true)
  const [salesTaxRate, setSalesTaxRate] = useState("8.5")
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [approvalThreshold, setApprovalThreshold] = useState("5000")

  const handleSave = () => {
    console.log("[v0] Save Changes clicked")
    toast({
      title: "Settings saved",
      description: "Your accounting settings have been updated successfully.",
    })
  }

  const handleConnectQuickBooks = async () => {
    setIsConnectingQBO(true)
    try {
      const response = await fetch("/api/books/qbo/connect")
      const data = await response.json()

      if (data.error) {
        toast({
          title: "Configuration Required",
          description: data.message || "Please configure QuickBooks credentials in environment variables",
          variant: "destructive",
        })
        return
      }

      // Redirect to QuickBooks OAuth
      window.location.href = data.authUrl
    } catch (error) {
      console.error("[v0] QuickBooks connect error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to initiate QuickBooks connection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnectingQBO(false)
    }
  }

  const handleConnectXero = async () => {
    setIsConnectingXero(true)
    try {
      const response = await fetch("/api/books/xero/connect")
      const data = await response.json()

      if (data.error) {
        toast({
          title: "Configuration Required",
          description: data.message || "Please configure Xero credentials in environment variables",
          variant: "destructive",
        })
        return
      }

      // Redirect to Xero OAuth
      window.location.href = data.authUrl
    } catch (error) {
      console.error("[v0] Xero connect error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to initiate Xero connection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnectingXero(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your accounting preferences and integrations</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#635bff] hover:bg-[#5851df] text-white cursor-pointer relative z-10"
          type="button"
        >
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
              <Input
                id="taxId"
                placeholder="XX-XXXXXXX"
                value={taxId}
                onChange={(e) => {
                  const formatted = formatEIN(e.target.value)
                  setTaxId(formatted)
                }}
                maxLength={10}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              placeholder="Enter business address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
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
              <Select value={accountingMethod} onValueChange={setAccountingMethod}>
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
              <Select value={taxYear} onValueChange={setTaxYear}>
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

      {/* Tax Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Tax Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoTax">Automatic Tax Calculation</Label>
              <p className="text-sm text-muted-foreground">Automatically calculate sales tax on transactions</p>
            </div>
            <Switch id="autoTax" checked={autoTaxCalculation} onCheckedChange={setAutoTaxCalculation} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="salesTaxRate">Default Sales Tax Rate (%)</Label>
            <Input
              id="salesTaxRate"
              type="number"
              step="0.01"
              value={salesTaxRate}
              onChange={(e) => setSalesTaxRate(e.target.value)}
              placeholder="8.5"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tax Jurisdictions</Label>
              <p className="text-sm text-muted-foreground">Manage state and local tax rates</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/accounting/settings/tax-jurisdictions">Manage</a>
            </Button>
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

      {/* Payment Gateways */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">Payment Gateways</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#635bff] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Stripe</h3>
                <p className="text-sm text-muted-foreground">Accept credit cards and ACH payments</p>
                {stripeEnabled && <span className="text-xs text-green-600 font-medium">Connected</span>}
              </div>
            </div>
            <Button variant="outline" onClick={() => setStripeEnabled(!stripeEnabled)}>
              {stripeEnabled ? "Disconnect" : "Connect"}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#635bff] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">PayPal</h3>
                <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </div>
      </Card>

      {/* User Roles & Permissions */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-[#635bff]" />
          <h2 className="text-xl font-semibold">User Roles & Permissions</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Manage User Roles</Label>
              <p className="text-sm text-muted-foreground">Configure permissions for different user types</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/accounting/settings/roles">Manage Roles</a>
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="approvalThreshold">Approval Threshold ($)</Label>
            <p className="text-sm text-muted-foreground mb-2">Transactions above this amount require approval</p>
            <Input
              id="approvalThreshold"
              type="number"
              value={approvalThreshold}
              onChange={(e) => setApprovalThreshold(e.target.value)}
              placeholder="5000"
            />
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
          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#635bff] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">QuickBooks</h3>
                <p className="text-sm text-muted-foreground">Connect to QuickBooks Online</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleConnectQuickBooks} disabled={isConnectingQBO}>
              {isConnectingQBO ? "Connecting..." : "Connect"}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:border-[#635bff] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Xero</h3>
                <p className="text-sm text-muted-foreground">Sync with Xero accounting</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleConnectXero} disabled={isConnectingXero}>
              {isConnectingXero ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AccountingSettingsClient
