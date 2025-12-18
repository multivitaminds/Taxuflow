"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function CompanySecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Company Security</h1>
        <p className="text-sm text-slate-600 mt-1">Banking history for all users connected to your company</p>
      </div>

      {/* Activity History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Activity history</h2>
          <p className="text-sm text-slate-600 mt-1">Here are the last 90 days of activity on your account</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">Event</TableHead>
              <TableHead className="font-semibold text-slate-900">Name</TableHead>
              <TableHead className="font-semibold text-slate-900">Description</TableHead>
              <TableHead className="font-semibold text-slate-900">Source</TableHead>
              <TableHead className="font-semibold text-slate-900">IP address</TableHead>
              <TableHead className="font-semibold text-slate-900">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                event: "Log in",
                name: "Jane Black",
                description: "Logged into account",
                source: "Chrome (macOS)",
                ip: "127.0.0.1",
                timestamp: "12/14 12:00 PM",
              },
              {
                event: "Log in",
                name: "Stephen Mike",
                description: "Logged into account",
                source: "Safari (iOS 16.7.8)",
                ip: "127.0.0.1",
                timestamp: "12/14 11:00 AM",
              },
              {
                event: "Log in",
                name: "Jane Black",
                description: "Email change failed",
                source: "Postie Plus (macOS 11.0.18)",
                ip: "127.0.0.1",
                timestamp: "12/14 10:00 AM",
              },
            ].map((activity, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50">
                <TableCell>
                  <Badge variant={activity.event === "Log in" ? "default" : "destructive"} className="text-xs">
                    {activity.event}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-900">{activity.name}</TableCell>
                <TableCell className="text-slate-600 text-sm">{activity.description}</TableCell>
                <TableCell className="text-slate-600 text-sm">{activity.source}</TableCell>
                <TableCell className="text-slate-600 text-sm font-mono">{activity.ip}</TableCell>
                <TableCell className="text-slate-600 text-sm">{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
