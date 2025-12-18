"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download, MoreHorizontal, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "invited" | "suspended"
  jobTitle: string
  avatar?: string
  initials: string
}

export default function UsersPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Jane Black",
      email: "jane@demo.taxu.io",
      role: "Admin",
      department: "Executive",
      status: "active",
      jobTitle: "Chief Financial Officer",
      initials: "JB",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@demo.taxu.io",
      role: "Manager",
      department: "Finance",
      status: "active",
      jobTitle: "Finance Manager",
      initials: "MC",
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah@demo.taxu.io",
      role: "User",
      department: "Accounting",
      status: "active",
      jobTitle: "Senior Accountant",
      initials: "SW",
    },
    {
      id: "4",
      name: "Bruce Collins",
      email: "bruce@demo.taxu.io",
      role: "User",
      department: "Product",
      status: "invited",
      jobTitle: "Product Manager",
      initials: "BC",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200"
      case "invited":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "suspended":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Manager":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">Manage team member access and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Roles
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    {user.avatar && <AvatarImage src={user.avatar || "/placeholder.svg"} />}
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(user.status)}`}>
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{user.email}</span>
                      <span className="text-gray-400">·</span>
                      <span>{user.jobTitle}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{user.department}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-600">
            Showing {users.length} of {users.length} users
          </p>
        </div>
      </Card>
    </div>
  )
}
