"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Smartphone, Key, Shield, Monitor, AlertTriangle, CheckCircle2, Mail, History } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-1">Security</h1>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication settings</p>
      </div>

      {/* Security Status */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Your account is secure</p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Two-factor authentication is enabled and your password was last changed 3 months ago
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Password</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Change your password regularly to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium mb-1">Current password</p>
              <p className="text-sm text-muted-foreground">••••••••••••</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription className="text-xs">Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* SMS */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">SMS Authentication</p>
                <p className="text-xs text-muted-foreground">+1 (330) 678-3920</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100">Enabled</Badge>
          </div>

          {/* Authenticator App */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Use an app like Google Authenticator</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>

          {/* Hardware Keys */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Hardware Keys</p>
                <p className="text-xs text-muted-foreground">Use a physical security key</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
          </div>
          <CardDescription className="text-xs">These devices are currently signed into your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Chrome on Mac</p>
                <p className="text-xs text-muted-foreground">San Francisco, CA • Current session</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Active now
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Safari on iPhone</p>
                <p className="text-xs text-muted-foreground">San Francisco, CA • 192.168.1.1</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">2h ago</span>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700">
                Revoke
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Login Activity</CardTitle>
          </div>
          <CardDescription className="text-xs">Recent login attempts to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { success: true, device: "Chrome on Mac", location: "San Francisco, CA", time: "Dec 14, 11:47 AM" },
            { success: true, device: "Safari on iPhone", location: "San Francisco, CA", time: "Dec 13, 9:23 PM" },
            { success: false, device: "Unknown device", location: "New York, NY", time: "Dec 12, 3:15 PM" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                {activity.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {activity.success ? "Successful login" : "Failed login attempt"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.device} • {activity.location}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recovery Options */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Account Recovery</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Set up recovery options in case you lose access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium mb-1">Recovery email</p>
              <p className="text-sm text-muted-foreground">tim@backup-email.com</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
