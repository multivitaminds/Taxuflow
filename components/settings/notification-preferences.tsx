"use client"

import { useState } from "react"
import { Mail, MessageSquare, Smartphone } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    email: {
      transactions: true,
      reports: true,
      security: true,
      marketing: false,
    },
    push: {
      transactions: true,
      reports: false,
      security: true,
      marketing: false,
    },
    sms: {
      transactions: false,
      reports: false,
      security: true,
      marketing: false,
    },
  })

  const categories = [
    {
      id: "transactions",
      title: "Transactions",
      description: "Notifications about your financial transactions",
    },
    {
      id: "reports",
      title: "Reports",
      description: "Monthly reports and analytics summaries",
    },
    {
      id: "security",
      title: "Security",
      description: "Login alerts and security notifications",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Product updates and promotional content",
    },
  ]

  const channels = [
    { id: "email", title: "Email", icon: Mail },
    { id: "push", title: "Push", icon: Smartphone },
    { id: "sms", title: "SMS", icon: MessageSquare },
  ]

  const handleToggle = (channel: string, category: string) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [category]: !prev[channel as keyof typeof prev][category as keyof typeof prev.email],
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notification Preferences</h1>
          <p className="text-muted-foreground">Choose how you want to be notified about important updates</p>
        </div>

        <Card className="p-6">
          <div className="space-y-8">
            {/* Header Row */}
            <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 pb-4 border-b">
              <div className="font-semibold">Notification Type</div>
              {channels.map((channel) => (
                <div key={channel.id} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <channel.icon className="h-4 w-4" />
                    <span className="font-semibold">{channel.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notification Categories */}
            {categories.map((category) => (
              <div key={category.id} className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 items-start">
                <div>
                  <Label className="font-medium">{category.title}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>

                {channels.map((channel) => (
                  <div key={channel.id} className="flex justify-center">
                    <Switch
                      checked={
                        preferences[channel.id as keyof typeof preferences][
                          category.id as keyof typeof preferences.email
                        ]
                      }
                      onCheckedChange={() => handleToggle(channel.id, category.id)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Button variant="outline">Reset to Default</Button>
            <Button>Save Preferences</Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors text-left">
              <div>
                <p className="font-medium">Mute all notifications</p>
                <p className="text-sm text-muted-foreground">Temporarily pause all notifications for 1 hour</p>
              </div>
              <Switch />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors text-left">
              <div>
                <p className="font-medium">Do Not Disturb</p>
                <p className="text-sm text-muted-foreground">Silence notifications from 10 PM to 8 AM</p>
              </div>
              <Switch />
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
