"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Privacy</h1>
        <p className="text-sm text-muted-foreground">
          Control your data privacy settings and manage how your information is used.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Data Collection */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Data Collection</CardTitle>
            <CardDescription className="text-sm">
              Choose what data we can collect to improve your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Usage Analytics</Label>
                <p className="text-xs text-muted-foreground mt-1">Help us improve by sharing anonymous usage data</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Product Updates</Label>
                <p className="text-xs text-muted-foreground mt-1">Receive emails about new features and improvements</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm font-medium">Marketing Communications</Label>
                <p className="text-xs text-muted-foreground mt-1">Receive promotional emails and special offers</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-semibold">Data Management</CardTitle>
            <CardDescription className="text-sm">Request a copy of your data or delete your account.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <Label className="text-sm font-medium">Download Your Data</Label>
                <p className="text-xs text-muted-foreground mt-1">Get a copy of all your account data and activity</p>
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                Request Export
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <Label className="text-sm font-medium text-red-600">Delete Account</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs text-red-600 hover:text-red-700 bg-transparent"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
