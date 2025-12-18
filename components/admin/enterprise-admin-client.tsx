"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Building2, Shield, CheckCircle2, AlertTriangle, Palette, Key, Users, FileCheck, Lock } from "lucide-react"

export function EnterpriseAdminClient() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Administration</h1>
          <p className="text-muted-foreground">Manage multi-tenant architecture, SSO, compliance, and branding</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Building2 className="h-4 w-4 mr-2" />
          Enterprise Plan
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSO Connections</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">All checks passed</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Themes</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="multi-tenant">Multi-Tenant</TabsTrigger>
          <TabsTrigger value="sso">SSO/SAML</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Enterprise Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest enterprise events and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "SSO enabled for Acme Corp",
                      time: "2 hours ago",
                      color: "text-green-600",
                    },
                    {
                      icon: Users,
                      text: "New tenant onboarded: TechStart",
                      time: "5 hours ago",
                      color: "text-blue-600",
                    },
                    { icon: Shield, text: "Compliance audit completed", time: "1 day ago", color: "text-purple-600" },
                    {
                      icon: Palette,
                      text: "Custom theme updated for Beta Inc",
                      time: "2 days ago",
                      color: "text-orange-600",
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>Important security notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { severity: "high", message: "2 failed SSO login attempts detected", tenant: "Acme Corp" },
                    { severity: "medium", message: "SSL certificate expiring in 30 days", tenant: "TechStart" },
                    { severity: "low", message: "API rate limit warning", tenant: "Beta Inc" },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alert.severity === "high"
                            ? "text-red-600"
                            : alert.severity === "medium"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">Tenant: {alert.tenant}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="multi-tenant" className="space-y-4">
          {/* Multi-Tenant Management */}
          <Card>
            <CardHeader>
              <CardTitle>Tenant Isolation & Management</CardTitle>
              <CardDescription>Configure multi-tenant architecture and data isolation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="max-users">Max Users Per Tenant</Label>
                    <Input id="max-users" type="number" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-docs">Max Documents</Label>
                    <Input id="max-docs" type="number" defaultValue="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-api">Max API Calls/Day</Label>
                    <Input id="max-api" type="number" defaultValue="100000" />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Strict Data Isolation</Label>
                    <p className="text-sm text-muted-foreground">Enforce tenant-level RLS policies</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Cross-Tenant Analytics</Label>
                    <p className="text-sm text-muted-foreground">Allow aggregated anonymous metrics</p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Tenant Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="space-y-4">
          {/* SSO/SAML Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>SSO & SAML Configuration</CardTitle>
              <CardDescription>Configure single sign-on for enterprise tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="provider">Identity Provider</Label>
                  <select id="provider" className="w-full rounded-md border px-3 py-2">
                    <option>Okta</option>
                    <option>Azure AD</option>
                    <option>Google Workspace</option>
                    <option>OneLogin</option>
                    <option>Custom SAML</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry-point">SSO Entry Point URL</Label>
                  <Input id="entry-point" placeholder="https://idp.example.com/sso/saml" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer URL</Label>
                  <Input id="issuer" placeholder="https://app.taxu.com/saml/metadata" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">X.509 Certificate</Label>
                  <textarea
                    id="certificate"
                    className="w-full rounded-md border px-3 py-2 font-mono text-sm"
                    rows={4}
                    placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                  />
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>Enable SSO</Label>
                    <p className="text-sm text-muted-foreground">Require SSO for tenant users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Save SSO Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Dashboard */}
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { name: "SOC 2 Type II", score: 98, status: "Compliant", icon: Shield },
              { name: "GDPR", score: 95, status: "Compliant", icon: FileCheck },
              { name: "PCI-DSS", score: 92, status: "Compliant", icon: Lock },
              { name: "HIPAA", score: 88, status: "In Progress", icon: AlertTriangle },
            ].map((cert) => (
              <Card key={cert.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <cert.icon className="h-5 w-5" />
                      {cert.name}
                    </CardTitle>
                    <Badge variant={cert.status === "Compliant" ? "default" : "secondary"}>{cert.status}</Badge>
                  </div>
                  <CardDescription>Last audited: 7 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Compliance Score</span>
                      <span className="font-bold">{cert.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cert.score >= 90 ? "bg-green-600" : "bg-yellow-600"}`}
                        style={{ width: `${cert.score}%` }}
                      />
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          {/* Custom Branding */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Branding & Theming</CardTitle>
              <CardDescription>Configure white-label branding for tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input id="primary-color" type="color" defaultValue="#3b82f6" className="w-16 h-10" />
                      <Input defaultValue="#3b82f6" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input id="secondary-color" type="color" defaultValue="#8b5cf6" className="w-16 h-10" />
                      <Input defaultValue="#8b5cf6" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input id="accent-color" type="color" defaultValue="#10b981" className="w-16 h-10" />
                      <Input defaultValue="#10b981" className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input id="logo" placeholder="https://cdn.example.com/logo.png" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font">Font Family</Label>
                  <select id="font" className="w-full rounded-md border px-3 py-2">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Poppins</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <textarea
                    id="custom-css"
                    className="w-full rounded-md border px-3 py-2 font-mono text-sm"
                    rows={6}
                    placeholder=".custom-button { ... }"
                  />
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="space-y-0.5">
                    <Label>White Label Mode</Label>
                    <p className="text-sm text-muted-foreground">Remove all Taxu branding</p>
                  </div>
                  <Switch />
                </div>

                <Button className="w-full">Save Branding Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
