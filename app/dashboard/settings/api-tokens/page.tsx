"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, MoreHorizontal, Key, Plus, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function APITokensPage() {
  const tokens = [
    {
      nickname: "Production API Key",
      permissions: "Read/Write",
      lastUsed: "2 minutes ago",
      createdBy: "jane@taxu.com",
      createdDate: "Mar 14, 2024",
      whitelistedIPs: 2,
      status: "active",
    },
    {
      nickname: "Development Environment",
      permissions: "Read",
      lastUsed: "1 hour ago",
      createdBy: "john@taxu.com",
      createdDate: "Feb 28, 2024",
      whitelistedIPs: 1,
      status: "active",
    },
    {
      nickname: "Legacy Integration Token",
      permissions: "Read/Write",
      lastUsed: "Never",
      createdBy: "mike@taxu.com",
      createdDate: "Jan 15, 2024",
      whitelistedIPs: 0,
      status: "inactive",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">API Tokens</h1>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1">
              {tokens.filter((t) => t.status === "active").length} active
            </Badge>
          </div>
          <p className="text-slate-600 leading-relaxed mb-3">
            Manage API keys for programmatic access to your Taxu account
          </p>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              API token capabilities reflect the role of the team member who created them. View our{" "}
              <a href="#" className="text-amber-900 underline hover:text-amber-950">
                API documentation
              </a>{" "}
              for more details.
            </p>
          </div>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5246e0] gap-2">
          <Plus className="w-4 h-4" />
          Create Token
        </Button>
      </div>

      {/* Tokens Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Token</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Permissions
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Last Used</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Created By
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Whitelisted IPs
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Key className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{token.nickname}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">sk_live_•••••••••••••{idx + 1}234</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      token.permissions === "Read/Write"
                        ? "bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20"
                        : "bg-slate-100 text-slate-700 border-slate-200",
                    )}
                  >
                    {token.permissions}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{token.lastUsed}</TableCell>
                <TableCell className="text-sm text-slate-600">{token.createdBy}</TableCell>
                <TableCell className="text-sm text-slate-600">{token.createdDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{token.whitelistedIPs}</span>
                    <span className="text-xs text-slate-500">IPs</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        token.status === "active" ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-slate-300",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        token.status === "active" ? "text-green-700" : "text-slate-500",
                      )}
                    >
                      {token.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
