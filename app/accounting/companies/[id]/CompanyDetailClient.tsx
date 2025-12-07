"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, Save, Users, DollarSign, Calendar, Shield, Trash2 } from "lucide-react"

export function CompanyDetailClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const company = {
    id: "1",
    name: "Acme Corporation",
    legalName: "Acme Corporation Inc.",
    industry: "Technology",
    ein: "12-3456789",
    address: "123 Tech Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "(555) 123-4567",
    email: "info@acmecorp.com",
    website: "www.acmecorp.com",
    fiscalYearEnd: "December 31",
    accountingMethod: "Accrual",
    employees: 45,
    annualRevenue: 2500000,
    status: "active",
    createdDate: "2023-01-15",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100">
            <Building2 className="h-8 w-8 text-slate-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-slate-600 mt-1">{company.industry}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                {company.status}
              </Badge>
              <span className="text-sm text-slate-500">
                Created {new Date(company.createdDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Trash2 className="h-4 w-4" />
            Delete Company
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Employees</p>
              <p className="text-3xl font-bold mt-2">{company.employees}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Annual Revenue</p>
              <p className="text-3xl font-bold mt-2">${(company.annualRevenue / 1000000).toFixed(2)}M</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Fiscal Year End</p>
              <p className="text-2xl font-bold mt-2">{company.fiscalYearEnd}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="data">Data & Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Legal Name</Label>
                <Input defaultValue={company.legalName} />
              </div>
              <div className="space-y-2">
                <Label>DBA / Trading Name</Label>
                <Input defaultValue={company.name} />
              </div>
              <div className="space-y-2">
                <Label>EIN</Label>
                <Input defaultValue={company.ein} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input defaultValue={company.industry} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={company.address} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input defaultValue={company.city} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input defaultValue={company.state} />
              </div>
              <div className="space-y-2">
                <Label>ZIP Code</Label>
                <Input defaultValue={company.zip} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={company.phone} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={company.email} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Accounting Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Fiscal Year End</Label>
                <Input defaultValue={company.fiscalYearEnd} />
              </div>
              <div className="space-y-2">
                <Label>Accounting Method</Label>
                <Input defaultValue={company.accountingMethod} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Isolation</h3>
            <p className="text-sm text-slate-600 mb-4">
              All data for this company is completely isolated from other entities in your account. Financial reports,
              transactions, and settings are specific to this company only.
            </p>
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-900 font-medium">Enterprise-grade data isolation enabled</span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Users with Access</h3>
              <Button size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                Invite User
              </Button>
            </div>
            <p className="text-sm text-slate-600">
              Manage who has access to this company's data and their permission levels.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Export Company Data</p>
                  <p className="text-sm text-slate-600">Download all company data as CSV</p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-medium">Backup Company</p>
                  <p className="text-sm text-slate-600">Create a full backup of company data</p>
                </div>
                <Button variant="outline" size="sm">
                  Backup
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
