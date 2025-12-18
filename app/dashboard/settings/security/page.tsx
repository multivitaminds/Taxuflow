"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, Key, Monitor, Globe, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function SecurityPage() {
  const [sessions] = useState([
    {
      device: "Chrome on macOS",
      location: "San Francisco, CA",
      ip: "192.168.1.1",
      lastActive: "Active now",
      current: true,
    },
    {
      device: "Safari on iPhone 15 Pro",
      location: "San Francisco, CA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Security</h1>
        <p className="text-slate-600 leading-relaxed">
          Manage your account security settings and authentication methods
        </p>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Password</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">Last changed 3 months ago</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-[#635bff] hover:text-[#5246e0] hover:border-[#635bff]/20 bg-transparent"
          >
            Change password
          </Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Key className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Two-factor authentication</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Add an extra layer of security to your account</p>
        </div>
        <div className="space-y-0 ml-12">
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">SMS authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">+1 (•••) •••-4567</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1.5" />
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Authenticator app</p>
                <p className="text-xs text-slate-500 mt-0.5">Use Google Authenticator or similar</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5246e0] hover:bg-[#635bff]/5">
              Set up
            </Button>
          </div>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">Hardware security keys</p>
                <p className="text-xs text-slate-500 mt-0.5">YubiKey, Titan Security Key, or similar</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5246e0] hover:bg-[#635bff]/5">
              Add key
            </Button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Active sessions</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Manage devices currently logged into your account</p>
        </div>
        <div className="ml-12 bg-slate-50/50 rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-700">Device</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Location</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">IP Address</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700">Last Active</TableHead>
                <TableHead className="text-xs font-semibold text-slate-700"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session, idx) => (
                <TableRow key={idx} className="bg-white hover:bg-slate-50/50">
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{session.device}</span>
                      {session.current && (
                        <Badge
                          variant="secondary"
                          className="ml-1 text-xs bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      {session.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 font-mono text-xs">{session.ip}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {session.lastActive}
                    </div>
                  </TableCell>
                  <TableCell>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Recent security activity</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Track important security events on your account</p>
        </div>
        <div className="space-y-0 ml-12">
          {[
            { action: "Logged in", device: "Chrome on macOS", time: "2 minutes ago", status: "success" },
            { action: "Password changed", device: "Chrome on macOS", time: "3 months ago", status: "success" },
            { action: "2FA enabled via SMS", device: "Chrome on macOS", time: "6 months ago", status: "success" },
            { action: "Failed login attempt", device: "Unknown device", time: "1 week ago", status: "warning" },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    activity.status === "success"
                      ? "bg-green-500 shadow-sm shadow-green-500/50"
                      : "bg-amber-500 shadow-sm shadow-amber-500/50",
                  )}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    {activity.status === "warning" && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activity.device} • {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
