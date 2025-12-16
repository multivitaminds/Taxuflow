"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, MoreHorizontal, Mail, Clock, Shield, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const teamMembers = [
    {
      name: "Jane Black",
      email: "jane@taxu.com",
      role: "Admin",
      status: "active",
      lastActive: "Active now",
      avatar: "/placeholder.svg",
      department: "Executive",
    },
    {
      name: "John Smith",
      email: "john@taxu.com",
      role: "Accountant",
      status: "active",
      lastActive: "2 hours ago",
      avatar: "/placeholder.svg",
      department: "Finance",
    },
    {
      name: "Sarah Wilson",
      email: "sarah@taxu.com",
      role: "Member",
      status: "active",
      lastActive: "1 day ago",
      avatar: "/placeholder.svg",
      department: "Product",
    },
    {
      name: "Mike Johnson",
      email: "mike@taxu.com",
      role: "Member",
      status: "invited",
      lastActive: "—",
      avatar: "/placeholder.svg",
      department: "Design",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Team</h1>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1">
              {teamMembers.length} members
            </Badge>
          </div>
          <p className="text-slate-600 leading-relaxed">Manage team members, roles, and permissions</p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5246e0] gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name, email, or role..."
          className="pl-10 h-11 bg-white border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Team Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Active members", value: "3", icon: UserIcon, color: "green" },
          { label: "Pending invites", value: "1", icon: Mail, color: "amber" },
          { label: "Admin users", value: "1", icon: Shield, color: "blue" },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stat.color === "green" && "bg-green-50",
                    stat.color === "amber" && "bg-amber-50",
                    stat.color === "blue" && "bg-blue-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      stat.color === "green" && "text-green-600",
                      stat.color === "amber" && "text-amber-600",
                      stat.color === "blue" && "text-blue-600",
                    )}
                  />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Member</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Department
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Role</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Last Active
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-700 uppercase tracking-wider"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-slate-100">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-[#635bff] to-[#5246e0] text-white font-semibold text-sm">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{member.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                    {member.department}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      member.role === "Admin"
                        ? "bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20"
                        : "bg-slate-100 text-slate-700 border-slate-200",
                    )}
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        member.status === "active"
                          ? "bg-green-500 shadow-sm shadow-green-500/50"
                          : "bg-amber-500 shadow-sm shadow-amber-500/50",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        member.status === "active" ? "text-green-700" : "text-amber-700",
                      )}
                    >
                      {member.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {member.lastActive}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
