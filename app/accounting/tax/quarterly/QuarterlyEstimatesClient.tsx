"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calculator, ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function QuarterlyEstimatesClient() {
  const [income, setIncome] = useState("50000")
  const [deductions, setDeductions] = useState("8000")
  const [taxRate, setTaxRate] = useState("22")

  const calculateTax = () => {
    const taxableIncome = Number.parseFloat(income) - Number.parseFloat(deductions)
    const estimatedTax = (taxableIncome * Number.parseFloat(taxRate)) / 100
    return estimatedTax.toFixed(2)
  }

  const quarterlyPayment = (Number.parseFloat(calculateTax()) / 4).toFixed(2)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/accounting/tax">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tax Management
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-2">Quarterly Tax Estimates</h1>
        <p className="text-muted-foreground">Calculate and track quarterly estimated tax payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Annual Tax Estimate</p>
            <p className="text-3xl font-bold">${calculateTax()}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calculator className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Quarterly Payment</p>
            <p className="text-3xl font-bold">${quarterlyPayment}</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Effective Tax Rate</p>
            <p className="text-3xl font-bold">{taxRate}%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Tax Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Annual Income</label>
              <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="50000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Deductions</label>
              <Input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="8000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
              <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="22" />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Taxable Income</span>
                <span className="font-semibold">
                  ${(Number.parseFloat(income) - Number.parseFloat(deductions)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Estimated Tax</span>
                <span className="font-bold text-primary">${calculateTax()}</span>
              </div>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Estimate
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">2025 Payment Schedule</h2>
          <div className="space-y-4">
            {[
              { quarter: "Q1 2025", due: "April 15, 2025", amount: quarterlyPayment, status: "upcoming" },
              { quarter: "Q2 2025", due: "June 15, 2025", amount: quarterlyPayment, status: "pending" },
              { quarter: "Q3 2025", due: "September 15, 2025", amount: quarterlyPayment, status: "pending" },
              { quarter: "Q4 2025", due: "January 15, 2026", amount: quarterlyPayment, status: "pending" },
            ].map((payment, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-semibold">{payment.quarter}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    Due: {payment.due}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${payment.amount}</p>
                  <Badge variant={payment.status === "upcoming" ? "default" : "outline"} className="mt-1">
                    {payment.status === "upcoming" ? "Due Soon" : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Payment Vouchers
          </Button>
        </Card>
      </div>
    </div>
  )
}
