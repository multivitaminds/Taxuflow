"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Activity } from "lucide-react"

export default function CompanySecurityPage() {
  const securityEvents = [
    {
      time: "10/24 1:02 PM",
      name: "Stephen Miles",
      event: "Log in",
      source: "Chrome (Gmail)",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
    {
      time: "10/24 1:02 PM",
      name: "Landon Shepherd",
      event: "Log out",
      source: "Firefox",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
    {
      time: "10/24 1:02 PM",
      name: "Anthony Arias",
      event: "Other Mercury profile linked",
      source: "Safari (Mac OS X, 10.16)",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
    {
      time: "10/24 12:10 AM",
      name: "Maya Osorio",
      event: "Log in",
      source: "Safari (Mac OS X, 10.16)",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
    {
      time: "10/23 10:00 AM",
      name: "Frank Lazaro",
      event: "Business login failed",
      source: "Chrome (Gmail)",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
    {
      time: "10/23 10:00 AM",
      name: "Frank Lazaro",
      event: "Two factor auth audited",
      source: "Chrome (Gmail)",
      ip: "2001:0db8:85a3:0000:0000:8a2e",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Company Security</h1>
        <p className="text-sm text-muted-foreground">
          Banking history & login all team members activity from all linked accounts
        </p>
      </div>

      <div className="grid gap-6">
        {/* Security Overview */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-xs text-muted-foreground">Active sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">1,284</p>
                  <p className="text-xs text-muted-foreground">Total events (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Failed logins (7d)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity History */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Activity history</CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                Last 30 days
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Here are the last 90 days of activity on your account</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-muted-foreground">Time</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Event</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">Source</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground">IP address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event, index) => (
                  <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                    <TableCell className="text-xs text-muted-foreground">{event.time}</TableCell>
                    <TableCell className="text-xs font-medium">{event.name}</TableCell>
                    <TableCell className="text-xs">{event.event}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{event.source}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{event.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
