"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  ArrowLeft,
  Download,
  FileText,
  CreditCard,
  Calculator,
  TrendingUp,
  Building,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const payrollHistory = [
  { period: "Jun 1-15, 2024", gross: 5208.33, deductions: 364.58, net: 4843.75, date: "Jun 15, 2024" },
  { period: "May 16-31, 2024", gross: 5208.33, deductions: 364.58, net: 4843.75, date: "May 31, 2024" },
  { period: "May 1-15, 2024", gross: 5208.33, deductions: 364.58, net: 4843.75, date: "May 15, 2024" },
  { period: "Apr 16-30, 2024", gross: 5208.33, deductions: 364.58, net: 4843.75, date: "Apr 30, 2024" },
]

const taxWithholdings = {
  federal: { rate: 0.22, amount: 1145.83 },
  state: { rate: 0.05, amount: 260.42 },
  socialSecurity: { rate: 0.062, amount: 322.92 },
  medicare: { rate: 0.0145, amount: 75.52 },
  total: 1804.69,
}

const deductions = [
  { name: "401(k) Contribution", amount: 520.83, type: "Pre-tax" },
  { name: "Health Insurance", amount: 250.0, type: "Pre-tax" },
  { name: "Dental Insurance", amount: 45.0, type: "Pre-tax" },
  { name: "HSA Contribution", amount: 100.0, type: "Pre-tax" },
]

export default function EmployeePayrollDetailClient({ employeeId }: { employeeId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/accounting/employees/payroll">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">Sarah Johnson - Payroll</h1>
              <p className="text-muted-foreground">Senior Software Engineer</p>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Pay Stub
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Annual Salary</p>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">$125,000</p>
              <p className="text-xs text-muted-foreground">$5,208.33 bi-weekly</p>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">YTD Gross</p>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">$62,500</p>
              <p className="text-xs text-muted-foreground">As of Jun 15</p>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">YTD Taxes</p>
                <Calculator className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">$21,656</p>
              <p className="text-xs text-muted-foreground">34.6% effective rate</p>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">YTD Net Pay</p>
                <CreditCard className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">$58,125</p>
              <p className="text-xs text-muted-foreground">After deductions</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pay-stubs">Pay Stubs</TabsTrigger>
            <TabsTrigger value="tax-withholdings">Tax Withholdings</TabsTrigger>
            <TabsTrigger value="direct-deposit">Direct Deposit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6 border-border mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Current Pay Period</h3>
                <Badge className="bg-blue-500/10 text-blue-500">Jun 1-15, 2024</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Gross Pay</p>
                  <p className="text-3xl font-bold text-foreground">$5,208.33</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Deductions</p>
                  <p className="text-3xl font-bold text-red-500">-$364.58</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Net Pay</p>
                  <p className="text-3xl font-bold text-green-500">$4,843.75</p>
                </div>
              </div>
            </Card>

            {/* Deductions Breakdown */}
            <Card className="p-6 border-border mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Deductions Breakdown</h3>
              <div className="space-y-3">
                {deductions.map((deduction, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{deduction.name}</p>
                      <p className="text-sm text-muted-foreground">{deduction.type}</p>
                    </div>
                    <p className="font-semibold text-foreground">${deduction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tax Summary */}
            <Card className="p-6 border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Tax Withholdings (This Period)</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Federal Income Tax</p>
                    <p className="text-sm text-muted-foreground">{(taxWithholdings.federal.rate * 100).toFixed(1)}%</p>
                  </div>
                  <p className="font-semibold text-foreground">${taxWithholdings.federal.amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">State Income Tax</p>
                    <p className="text-sm text-muted-foreground">{(taxWithholdings.state.rate * 100).toFixed(1)}%</p>
                  </div>
                  <p className="font-semibold text-foreground">${taxWithholdings.state.amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Social Security</p>
                    <p className="text-sm text-muted-foreground">
                      {(taxWithholdings.socialSecurity.rate * 100).toFixed(2)}%
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">${taxWithholdings.socialSecurity.amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-foreground">Medicare</p>
                    <p className="text-sm text-muted-foreground">{(taxWithholdings.medicare.rate * 100).toFixed(2)}%</p>
                  </div>
                  <p className="font-semibold text-foreground">${taxWithholdings.medicare.amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border-t-2 border-border pt-3">
                  <p className="font-semibold text-foreground">Total Tax Withholdings</p>
                  <p className="text-xl font-bold text-foreground">${taxWithholdings.total.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pay-stubs">
            <Card className="border-border">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Pay Stub History</h3>
                <p className="text-sm text-muted-foreground">Download and view past pay stubs</p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {payrollHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{entry.period}</p>
                          <p className="text-sm text-muted-foreground">Paid on {entry.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Net Pay</p>
                          <p className="font-semibold text-foreground">${entry.net.toLocaleString()}</p>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tax-withholdings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tax Withholding Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Filing Status</p>
                    <p className="font-semibold text-foreground">Single</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Federal Allowances</p>
                    <p className="font-semibold text-foreground">1</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">State Allowances</p>
                    <p className="font-semibold text-foreground">1</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-1">Additional Withholding</p>
                    <p className="font-semibold text-foreground">$0.00 per paycheck</p>
                  </div>
                  <Button className="w-full">Update W-4 Information</Button>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Year-to-Date Tax Summary</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Federal Income Tax</p>
                      <p className="font-semibold text-foreground">$13,750</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "45%" }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">State Income Tax</p>
                      <p className="font-semibold text-foreground">$3,125</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "10%" }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Social Security</p>
                      <p className="font-semibold text-foreground">$3,875</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "12%" }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Medicare</p>
                      <p className="font-semibold text-foreground">$906</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: "3%" }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border-2 border-accent">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">Total YTD Taxes</p>
                      <p className="text-xl font-bold text-accent">$21,656</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="direct-deposit">
            <Card className="p-6 border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Direct Deposit Information</h3>
              <div className="space-y-6">
                <div className="p-6 rounded-lg border-2 border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Primary Account</p>
                      <p className="text-sm text-muted-foreground">100% of net pay</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                      <p className="font-medium text-foreground">Chase Bank</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                      <p className="font-medium text-foreground">Checking</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Routing Number</p>
                      <p className="font-medium text-foreground">021000021</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                      <p className="font-medium text-foreground">****6789</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <CreditCard className="h-4 w-4" />
                    Add Secondary Account
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Building className="h-4 w-4" />
                    Update Bank Info
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Next Direct Deposit</p>
                      <p className="text-sm text-muted-foreground">
                        Your next paycheck of $4,843.75 will be deposited on June 30, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
