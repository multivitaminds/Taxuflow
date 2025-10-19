"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calculator, FileText, Shield, TrendingUp, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TaxNexusManager } from "./tax-nexus-manager"
import { TaxRatesManager } from "./tax-rates-manager"
import { TaxComplianceReports } from "./tax-compliance-reports"
import { TaxCalculator } from "./tax-calculator"

interface TaxStats {
  totalNexus: number
  activeTaxRates: number
  monthlyTaxCollected: number
  pendingReports: number
  complianceScore: number
}

export function SalesTaxDashboard() {
  const [stats, setStats] = useState<TaxStats>({
    totalNexus: 0,
    activeTaxRates: 0,
    monthlyTaxCollected: 0,
    pendingReports: 0,
    complianceScore: 95,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load nexus count
    const { data: nexus } = await supabase
      .from("sales_tax_nexus")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)

    // Load tax rates count
    const { data: rates } = await supabase
      .from("sales_tax_rates")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)

    // Load pending reports
    const { data: reports } = await supabase
      .from("tax_compliance_reports")
      .select("id")
      .eq("user_id", user.id)
      .in("status", ["draft", "ready"])

    setStats({
      totalNexus: nexus?.length || 0,
      activeTaxRates: rates?.length || 0,
      monthlyTaxCollected: 12450.75, // Mock data
      pendingReports: reports?.length || 0,
      complianceScore: 95,
    })

    setLoading(false)
  }

  if (loading) {
    return <div>Loading sales tax dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Tax Management</h1>
          <p className="text-muted-foreground">Automated tax calculation, nexus tracking, and compliance reporting</p>
        </div>
        <Button>
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Tax
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tax Nexus</p>
              <p className="text-2xl font-bold">{stats.totalNexus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Rates</p>
              <p className="text-2xl font-bold">{stats.activeTaxRates}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">${stats.monthlyTaxCollected.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reports</p>
              <p className="text-2xl font-bold">{stats.pendingReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Compliance</p>
              <p className="text-2xl font-bold text-green-700">{stats.complianceScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Alerts */}
      {stats.pendingReports > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="font-medium text-orange-900">Action Required</p>
              <p className="text-sm text-orange-700">
                You have {stats.pendingReports} pending tax report{stats.pendingReports > 1 ? "s" : ""} that need to be
                filed.
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Reports
            </Button>
          </div>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            Tax Calculator
          </TabsTrigger>
          <TabsTrigger value="nexus">
            <MapPin className="h-4 w-4 mr-2" />
            Nexus
          </TabsTrigger>
          <TabsTrigger value="rates">
            <TrendingUp className="h-4 w-4 mr-2" />
            Tax Rates
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <FileText className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="exemptions">
            <Shield className="h-4 w-4 mr-2" />
            Exemptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <TaxCalculator />
        </TabsContent>

        <TabsContent value="nexus">
          <TaxNexusManager />
        </TabsContent>

        <TabsContent value="rates">
          <TaxRatesManager />
        </TabsContent>

        <TabsContent value="compliance">
          <TaxComplianceReports />
        </TabsContent>

        <TabsContent value="exemptions">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tax Exemptions</h3>
            <p className="text-muted-foreground">Manage customer tax exemption certificates</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
