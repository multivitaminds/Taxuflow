"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Building2, Mail, CheckCircle2, XCircle, Clock } from "lucide-react"

interface Advisor {
  id: string
  name: string
  email: string
  firm: string
  role: string
  status: "active" | "pending" | "declined"
  avatar?: string
  initials: string
  accessLevel: string
}

export default function AdvisorsPage() {
  const [pendingApprovals] = useState<Advisor[]>([
    {
      id: "1",
      name: "Pico Accountants",
      email: "team@pico.com",
      firm: "Pico Accountants",
      role: "Accountant",
      status: "pending",
      initials: "PA",
      accessLevel: "Full access requested by Lily Q. Indaly",
    },
  ])

  const [activeAdvisors] = useState<Advisor[]>([
    {
      id: "2",
      name: "Andrew Jeffords",
      email: "andrew@demo.taxu.io",
      firm: "Goose Creek",
      role: "Admin",
      status: "active",
      initials: "AJ",
      accessLevel: "Admin",
    },
    {
      id: "3",
      name: "Brian Ford",
      email: "brian@demo.taxu.io",
      firm: "",
      role: "Finance Lead",
      status: "active",
      initials: "BF",
      accessLevel: "Finance Lead",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">Advisors</h1>
            <Badge variant="secondary" className="text-xs">
              1
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-600">Manage external advisors and their access to your account</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Advisor Team
        </Button>
      </div>

      {pendingApprovals.length > 0 && (
        <Card className="border border-orange-200 bg-orange-50">
          <div className="p-4 border-b border-orange-100">
            <h3 className="text-sm font-medium text-orange-900">Pending approvals</h3>
          </div>
          <div className="p-4">
            {pendingApprovals.map((advisor) => (
              <div key={advisor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-medium">
                    {advisor.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{advisor.name}</h4>
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{advisor.accessLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="border border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900">Advisors</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {activeAdvisors.map((advisor) => (
            <div key={advisor.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    {advisor.avatar && <AvatarImage src={advisor.avatar || "/placeholder.svg"} />}
                    <AvatarFallback>{advisor.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{advisor.name}</h4>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{advisor.email}</span>
                      </div>
                      {advisor.firm && (
                        <>
                          <span className="text-gray-400">·</span>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{advisor.firm}</span>
                          </div>
                        </>
                      )}
                      <span className="text-gray-400">·</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {advisor.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
