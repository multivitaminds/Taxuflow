"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Shield, Bell, CreditCard, User, Key, AlertTriangle, Trash2, RefreshCw } from "lucide-react"

export default function DeveloperPortalSettingsPage() {
  const [copied, setCopied] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [webhookNotifications, setWebhookNotifications] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_live_abc123xyz789...")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-foreground/70">Manage your developer account and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 bg-background-alt">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Developer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option>UTC (GMT+0:00)</option>
                  <option>America/New_York (GMT-5:00)</option>
                  <option>America/Los_Angeles (GMT-8:00)</option>
                  <option>Europe/London (GMT+0:00)</option>
                  <option>Asia/Tokyo (GMT+9:00)</option>
                </select>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          </Card>

          <Card className="p-6 border-destructive/50">
            <h2 className="text-2xl font-bold text-destructive mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Danger Zone
            </h2>
            <p className="text-foreground/70 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Password</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Two-Factor Authentication</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Enable 2FA</p>
                <p className="text-sm text-foreground/70">Add an extra layer of security to your account</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground mb-2">Scan this QR code with your authenticator app:</p>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <div className="w-32 h-32 bg-background-alt flex items-center justify-center text-xs text-foreground/50">
                    QR Code
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Active Sessions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">MacBook Pro • San Francisco, US</p>
                  <p className="text-sm text-foreground/70">Current session • Last active now</p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">iPhone 15 • New York, US</p>
                  <p className="text-sm text-foreground/70">Last active 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">API Keys</h2>
            <p className="text-foreground/70 mb-6">Manage your API keys for authenticating requests to the Taxu API.</p>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-background-alt">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">Production Key</p>
                    <p className="text-xs text-foreground/70">Created on Nov 29, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyApiKey} className="gap-2 bg-transparent">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Rotate
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-sm bg-[#0d1117] text-[#c9d1d9] p-3 rounded border border-[#30363d]">
                  sk_live_abc123xyz789...
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg bg-background-alt">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">Test Key</p>
                    <p className="text-xs text-foreground/70">Created on Nov 15, 2025</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <RefreshCw className="w-4 h-4" />
                      Rotate
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-sm bg-[#0d1117] text-[#c9d1d9] p-3 rounded border border-[#30363d]">
                  sk_test_def456uvw789...
                </div>
              </div>
            </div>

            <Button className="mt-6 bg-primary hover:bg-primary/90 gap-2">
              <Key className="w-4 h-4" />
              Create New API Key
            </Button>
          </Card>

          <Card className="p-6 bg-[#635bff]/10 border-[#635bff]/20">
            <h3 className="font-semibold text-foreground mb-2">Keep your API keys secure</h3>
            <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
              <li>Never expose API keys in client-side code or public repositories</li>
              <li>Use environment variables to store keys in your applications</li>
              <li>Rotate keys regularly and immediately if compromised</li>
              <li>Use separate keys for development and production environments</li>
            </ul>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Email Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">API Usage Alerts</p>
                  <p className="text-sm text-foreground/70">Get notified when you reach 80% of your rate limit</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Security Alerts</p>
                  <p className="text-sm text-foreground/70">Receive alerts about suspicious activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Product Updates</p>
                  <p className="text-sm text-foreground/70">Stay informed about new features and API changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-foreground/70">Get a weekly summary of your API usage</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Webhook Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Enable Webhooks</p>
                  <p className="text-sm text-foreground/70">Receive real-time event notifications</p>
                </div>
                <Switch checked={webhookNotifications} onCheckedChange={setWebhookNotifications} />
              </div>
              {webhookNotifications && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" placeholder="https://your-domain.com/webhooks/taxu" />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Types</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-foreground">return.filed</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-foreground">refund.issued</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span className="text-foreground">payment.received</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span className="text-foreground">document.processed</span>
                      </label>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Save Webhook Settings</Button>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Current Plan</h2>
            <div className="border border-primary/20 rounded-lg p-6 bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Startup Plan</h3>
                  <p className="text-foreground/70">1,000 API requests per minute</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">$99</p>
                  <p className="text-sm text-foreground/70">per month</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-foreground/70">
                <p>• Unlimited API calls</p>
                <p>• 1,000 req/min rate limit</p>
                <p>• 99.9% uptime SLA</p>
                <p>• Email support</p>
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90">Upgrade Plan</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center text-white font-bold text-xs">
                  VISA
                </div>
                <div>
                  <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-sm text-foreground/70">Expires 12/2026</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Billing History</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">November 2025</p>
                  <p className="text-sm text-foreground/70">Paid on Nov 1, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">$99.00</p>
                  <Button variant="link" size="sm" className="text-primary">
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">October 2025</p>
                  <p className="text-sm text-foreground/70">Paid on Oct 1, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">$99.00</p>
                  <Button variant="link" size="sm" className="text-primary">
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">September 2025</p>
                  <p className="text-sm text-foreground/70">Paid on Sep 1, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">$99.00</p>
                  <Button variant="link" size="sm" className="text-primary">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
