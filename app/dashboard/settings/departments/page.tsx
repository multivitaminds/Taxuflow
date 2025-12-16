"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Plus, DollarSign, ChevronRight, TrendingUp, Briefcase, Code, Palette } from "lucide-react"
import Link from "next/link"

interface Department {
  id: string
  name: string
  category: string
  memberCount: number
  budget: string
  manager: {
    name: string
    avatar?: string
    initials: string
  }
  icon: any
  color: string
}

export default function DepartmentsPage() {
  const [departments] = useState<Department[]>([
    {
      id: "dept-executive",
      name: "Executive",
      category: "Leadership",
      memberCount: 5,
      budget: "$2,500,000",
      manager: { name: "Jane Black", initials: "JB" },
      icon: Briefcase,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: "dept-finance",
      name: "Finance",
      category: "Operations",
      memberCount: 8,
      budget: "$1,800,000",
      manager: { name: "Michael Chen", initials: "MC" },
      icon: DollarSign,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "dept-accounting",
      name: "Accounting",
      category: "Finance",
      memberCount: 6,
      budget: "$950,000",
      manager: { name: "Sarah Williams", initials: "SW" },
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "dept-audit",
      name: "Audit",
      category: "Finance",
      memberCount: 4,
      budget: "$720,000",
      manager: { name: "David Park", initials: "DP" },
      icon: Building2,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      id: "dept-product",
      name: "Product",
      category: "Technology",
      memberCount: 12,
      budget: "$2,100,000",
      manager: { name: "Emily Rodriguez", initials: "ER" },
      icon: Code,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "dept-design",
      name: "Design",
      category: "Product",
      memberCount: 7,
      budget: "$1,200,000",
      manager: { name: "Alex Johnson", initials: "AJ" },
      icon: Palette,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
  ])

  const groupedDepartments = departments.reduce(
    (acc, dept) => {
      if (!acc[dept.category]) {
        acc[dept.category] = []
      }
      acc[dept.category].push(dept)
      return acc
    },
    {} as Record<string, Department[]>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
          <p className="mt-1 text-sm text-gray-600">Manage organizational departments and team structure</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Card className="border border-gray-200 bg-white">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-200">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Connect HR System</h3>
                <p className="text-xs text-gray-600">Sync departments with your HR platform</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        </div>

        {Object.entries(groupedDepartments).map(([category, depts]) => (
          <div key={category} className="border-b border-gray-100 last:border-0">
            <div className="px-6 py-4 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wider">{category}</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {depts.map((dept) => {
                const Icon = dept.icon
                return (
                  <Link
                    key={dept.id}
                    href={`/dashboard/settings/departments/${dept.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${dept.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">{dept.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {dept.memberCount} members
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  {dept.manager.avatar && (
                                    <AvatarImage src={dept.manager.avatar || "/placeholder.svg"} />
                                  )}
                                  <AvatarFallback className="text-[10px]">{dept.manager.initials}</AvatarFallback>
                                </Avatar>
                                <span>{dept.manager.name}</span>
                              </div>
                              <span className="text-gray-400">·</span>
                              <span className="font-medium text-gray-900">{dept.budget}</span>
                              <span className="text-gray-500">annual budget</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
