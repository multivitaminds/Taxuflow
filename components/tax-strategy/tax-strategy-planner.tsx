"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  TrendingUp,
  Calculator,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export function TaxStrategyPlanner() {
  const [activeTab, setActiveTab] = useState("entity")
  const [income, setIncome] = useState("150000")
  const [expenses, setExpenses] = useState("35000")

  const taxableIncome = Number.parseFloat(income) - Number.parseFloat(expenses)

  // Self-employment tax calculation
  const selfEmploymentTax = taxableIncome * 0.153 // 15.3% SE tax
  const incomeTax = taxableIncome * 0.24 // 24% income tax bracket
  const totalTaxSoleProprietor = selfEmploymentTax + incomeTax

  // S-Corp savings (reasonable salary: 40% of profit)
  const reasonableSalary = taxableIncome * 0.4
  const distributions = taxableIncome * 0.6
  const sCorpSelfEmploymentTax = reasonableSalary * 0.153
  const sCorpIncomeTax = taxableIncome * 0.24
  const totalTaxSCorp = sCorpSelfEmploymentTax + sCorpIncomeTax
  const sCorpSavings = totalTaxSoleProprietor - totalTaxSCorp

  // C-Corp calculation
  const corporateTax = taxableIncome * 0.21
  const dividendTax = (taxableIncome - corporateTax) * 0.15
  const totalTaxCCorp = corporateTax + dividendTax

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Tax Strategy Planner</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-powered entity structure recommendations and multi-year tax planning
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-emerald-500">Recommended</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Best Structure</p>
            <p className="text-2xl font-bold">S Corporation</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Save ${sCorpSavings.toFixed(0)}/year</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="outline">2025 Estimate</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Next Quarter Due</p>
            <p className="text-2xl font-bold">${(totalTaxSCorp / 4).toFixed(0)}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">April 15, 2025</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="outline">5-Year Plan</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Projected Savings</p>
            <p className="text-2xl font-bold">${(sCorpSavings * 5).toFixed(0)}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">2025-2029</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-background">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900">
                AI Insight
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Optimization Score</p>
            <p className="text-2xl font-bold">92/100</p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Excellent strategy</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-6">
            {[
              { id: "entity", label: "Entity Structure" },
              { id: "multi-year", label: "Multi-Year Planning" },
              { id: "quarterly", label: "Quarterly Payments" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Entity Structure Tab */}
        {activeTab === "entity" && (
          <div className="space-y-6">
            {/* Input Calculator */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Revenue</label>
                  <Input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="150000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Expenses</label>
                  <Input
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    placeholder="35000"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Taxable Income</span>
                  <span className="text-2xl font-bold">${taxableIncome.toFixed(0)}</span>
                </div>
              </div>
            </Card>

            {/* Entity Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sole Proprietorship / LLC */}
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-muted">
                    Current
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Sole Proprietorship / LLC</h3>
                    <p className="text-sm text-muted-foreground">Pass-through entity</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Simple setup and maintenance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">No separate tax return</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Pay self-employment tax on all profit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Higher tax burden at your income level</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Self-Employment Tax</span>
                      <span className="font-medium">${selfEmploymentTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Income Tax</span>
                      <span className="font-medium">${incomeTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Tax</span>
                      <span className="text-red-600 dark:text-red-400">${totalTaxSoleProprietor.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* S Corporation */}
              <Card className="p-6 relative overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500">Recommended</Badge>
                </div>
                <div className="space-y-4 relative">
                  <div>
                    <h3 className="text-xl font-bold mb-1">S Corporation</h3>
                    <p className="text-sm text-muted-foreground">Tax-optimized structure</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Reduce self-employment tax</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Take salary + distributions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Significant tax savings at your income</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Requires payroll and separate return</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reasonable Salary</span>
                      <span className="font-medium">${reasonableSalary.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distributions</span>
                      <span className="font-medium">${distributions.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SE Tax (on salary only)</span>
                      <span className="font-medium">${sCorpSelfEmploymentTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Income Tax</span>
                      <span className="font-medium">${sCorpIncomeTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Tax</span>
                      <span className="text-emerald-600 dark:text-emerald-400">${totalTaxSCorp.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Annual Savings</span>
                      <span>${sCorpSavings.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                    Get Started with S-Corp
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* C Corporation */}
              <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900">
                    Advanced
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">C Corporation</h3>
                    <p className="text-sm text-muted-foreground">For scaling businesses</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Lower corporate tax rate (21%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited shareholders & stock classes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Double taxation on dividends</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">More complex compliance</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Corporate Tax (21%)</span>
                      <span className="font-medium">${corporateTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dividend Tax (15%)</span>
                      <span className="font-medium">${dividendTax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total Tax</span>
                      <span className="text-orange-600 dark:text-orange-400">${totalTaxCCorp.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </div>
              </Card>
            </div>

            {/* AI Recommendation */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">AI Tax Strategy Recommendation</h3>
                  <p className="text-muted-foreground mb-4">
                    Based on your income of ${taxableIncome.toFixed(0)}, we recommend transitioning to an{" "}
                    <strong>S Corporation</strong>. This structure will save you approximately{" "}
                    <strong className="text-emerald-600 dark:text-emerald-400">${sCorpSavings.toFixed(0)}</strong> per
                    year in self-employment taxes.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm">
                        Pay yourself a reasonable salary of ${reasonableSalary.toFixed(0)} (40% of profit)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm">Take ${distributions.toFixed(0)} as distributions (no SE tax)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm">Set up quarterly payroll for your salary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span className="text-sm">File Form 1120S annually</span>
                    </li>
                  </ul>
                  <Button>
                    Schedule S-Corp Election
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Multi-Year Planning Tab */}
        {activeTab === "multi-year" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">5-Year Tax Projection (2025-2029)</h2>
              <div className="space-y-4">
                {[
                  { year: 2025, income: taxableIncome, growth: 0 },
                  { year: 2026, income: taxableIncome * 1.1, growth: 10 },
                  { year: 2027, income: taxableIncome * 1.21, growth: 10 },
                  { year: 2028, income: taxableIncome * 1.33, growth: 10 },
                  { year: 2029, income: taxableIncome * 1.46, growth: 10 },
                ].map((projection) => {
                  const yearSoleProprietorTax = projection.income * 0.153 + projection.income * 0.24
                  const yearSCorpTax = projection.income * 0.4 * 0.153 + projection.income * 0.24
                  const yearSavings = yearSoleProprietorTax - yearSCorpTax

                  return (
                    <div
                      key={projection.year}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold">{projection.year}</p>
                            {projection.growth > 0 && (
                              <p className="text-xs text-muted-foreground">+{projection.growth}% growth projected</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Projected Income</p>
                          <p className="text-lg font-bold">${projection.income.toFixed(0)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Sole Prop Tax</p>
                          <p className="text-lg font-bold text-red-600 dark:text-red-400">
                            ${yearSoleProprietorTax.toFixed(0)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">S-Corp Tax</p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            ${yearSCorpTax.toFixed(0)}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Annual Savings</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            ${yearSavings.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total 5-Year Savings with S-Corp</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${(sCorpSavings * 6.1).toFixed(0)}
                    </p>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quarterly Payments Tab */}
        {activeTab === "quarterly" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">2025 Quarterly Payment Schedule</h2>
              <div className="space-y-4">
                {[
                  { quarter: "Q1 2025", due: "April 15, 2025", status: "upcoming" },
                  { quarter: "Q2 2025", due: "June 15, 2025", status: "pending" },
                  { quarter: "Q3 2025", due: "September 15, 2025", status: "pending" },
                  { quarter: "Q4 2025", due: "January 15, 2026", status: "pending" },
                ].map((payment, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 border-2 border-border rounded-xl hover:bg-muted/50 transition-all hover:border-blue-500"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${payment.status === "upcoming" ? "bg-blue-100 dark:bg-blue-900" : "bg-muted"}`}
                      >
                        <Calculator
                          className={`h-6 w-6 ${payment.status === "upcoming" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{payment.quarter}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Due: {payment.due}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${(totalTaxSCorp / 4).toFixed(0)}</p>
                      <Badge
                        variant={payment.status === "upcoming" ? "default" : "outline"}
                        className={payment.status === "upcoming" ? "mt-2 bg-blue-500" : "mt-2"}
                      >
                        {payment.status === "upcoming" ? "Due in 15 days" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Annual Estimated Tax</p>
                    <p className="text-3xl font-bold">${totalTaxSCorp.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Effective Tax Rate</p>
                    <p className="text-3xl font-bold">{((totalTaxSCorp / taxableIncome) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Payment Vouchers
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Set Up Auto-Pay
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">EFTPS</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Electronic Federal Tax Payment System - IRS recommended
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Enroll Now
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">IRS Direct Pay</h3>
                  <p className="text-sm text-muted-foreground mb-3">Pay directly from your bank account</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Pay Now
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2">Check / Money Order</h3>
                  <p className="text-sm text-muted-foreground mb-3">Mail with payment voucher</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Print Voucher
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
