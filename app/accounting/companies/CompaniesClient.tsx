"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Search, Settings, Users, DollarSign, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  industry: string
  ein: string
  fiscalYearEnd: string
  employees: number
  annualRevenue: number
  status: "active" | "inactive"
  createdDate: string
}

export function CompaniesClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const companies: Company[] = [
    {
      id: "1",
      name: "Acme Corporation",
      industry: "Technology",
      ein: "12-3456789",
      fiscalYearEnd: "December 31",
      employees: 45,
      annualRevenue: 2500000,
      status: "active",
      createdDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Smith Consulting LLC",
      industry: "Consulting",
      ein: "98-7654321",
      fiscalYearEnd: "December 31",
      employees: 12,
      annualRevenue: 850000,
      status: "active",
      createdDate: "2023-06-20",
    },
    {
      id: "3",
      name: "Green Energy Inc",
      industry: "Energy",
      ein: "45-6789012",
      fiscalYearEnd: "June 30",
      employees: 28,
      annualRevenue: 1200000,
      status: "active",
      createdDate: "2022-11-10",
    },
  ]

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Companies</h1>
          <p className="text-slate-600 mt-1">Manage all your business entities from one place</p>
        </div>
        <Link href="/accounting/companies/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Company
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Companies</p>
              <p className="text-3xl font-bold mt-2">{companies.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Entities</p>
              <p className="text-3xl font-bold mt-2">{companies.filter((c) => c.status === "active").length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Employees</p>
              <p className="text-3xl font-bold mt-2">{companies.reduce((sum, c) => sum + c.employees, 0)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Combined Revenue</p>
              <p className="text-3xl font-bold mt-2">
                ${(companies.reduce((sum, c) => sum + c.annualRevenue, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <Building2 className="h-6 w-6 text-slate-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <Badge
                      variant={company.status === "active" ? "default" : "secondary"}
                      className={
                        company.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""
                      }
                    >
                      {company.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500">Industry</p>
                      <p className="text-sm font-medium mt-1">{company.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">EIN</p>
                      <p className="text-sm font-medium mt-1">{company.ein}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Fiscal Year End</p>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {company.fiscalYearEnd}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Employees</p>
                      <p className="text-sm font-medium mt-1 flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        {company.employees}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-xs text-slate-500">Annual Revenue</p>
                      <p className="text-sm font-medium mt-1">${(company.annualRevenue / 1000000).toFixed(2)}M</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Created</p>
                      <p className="text-sm font-medium mt-1">{new Date(company.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/accounting/companies/${company.id}`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Settings className="h-4 w-4" />
                    Manage
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
