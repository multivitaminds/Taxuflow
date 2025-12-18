"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#0f172a] mb-1">Password</h3>
            <p className="text-sm text-[#64748b]">Last changed 30 days ago</p>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Change Password
          </Button>
        </div>
      </div>

      {/* Two-factor authentication */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <h3 className="text-sm font-medium text-[#0f172a] mb-4">Two-factor authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#e0e6ed]">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">Backup codes</p>
              <p className="text-xs text-[#64748b] mt-1">Generate emergency access codes</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[#e0e6ed]">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">SMS verification</p>
              <p className="text-xs text-[#64748b] mt-1">Receive codes via text message</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[#e0e6ed]">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">Authenticator app</p>
              <p className="text-xs text-[#64748b] mt-1">Use an authentication app for codes</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-[#0f172a]">Hardware keys</p>
              <p className="text-xs text-[#64748b] mt-1">Use a physical security key</p>
            </div>
            <Badge variant="outline" className="text-xs">
              Disabled
            </Badge>
          </div>
        </div>
      </div>

      {/* Passkeys */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#0f172a] mb-1">Passkeys</h3>
            <p className="text-sm text-[#64748b]">Sign in securely without a password</p>
          </div>
          <Button size="sm" className="bg-[#635bff] hover:bg-[#5146e5] text-white">
            Add Passkey
          </Button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-[#0f172a]">Active sessions</h3>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            Log Out All Devices
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#e0e6ed]">
              <TableHead className="text-[#64748b] text-xs">Device</TableHead>
              <TableHead className="text-[#64748b] text-xs">Location</TableHead>
              <TableHead className="text-[#64748b] text-xs">Last active</TableHead>
              <TableHead className="text-[#64748b] text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-[#e0e6ed]">
              <TableCell className="text-sm text-[#0f172a]">Chrome • macOS</TableCell>
              <TableCell className="text-sm text-[#64748b]">San Francisco, CA</TableCell>
              <TableCell className="text-sm text-[#64748b]">Active now</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-[#10b981] text-white text-xs">
                  Current
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Recent Security Activity */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <h3 className="text-sm font-medium text-[#0f172a] mb-4">Recent security activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b border-[#e0e6ed]">
            <div className="w-2 h-2 rounded-full bg-[#10b981] mt-2" />
            <div className="flex-1">
              <p className="text-sm text-[#0f172a]">Login from Chrome on macOS</p>
              <p className="text-xs text-[#64748b] mt-1">Dec 14, 2025 at 7:30 PM • United States</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
