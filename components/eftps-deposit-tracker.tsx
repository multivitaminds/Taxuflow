"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, DollarSign, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EFTPSDeposit {
  id: string
  deposit_date: string
  deposit_amount: number
  deposit_status: string
  eftps_confirmation_number: string | null
  federal_income_tax: number
  social_security_tax: number
  medicare_tax: number
  quarter: number
  tax_year: number
}

export default function EFTPSDepositTracker({ taxYear, quarter }: { taxYear: number; quarter: number }) {
  const { toast } = useToast()
  const [deposits, setDeposits] = useState<EFTPSDeposit[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [formData, setFormData] = useState({
    deposit_amount: "",
    deposit_date: "",
    scheduled_date: "",
    federal_income_tax: "",
    social_security_tax: "",
    medicare_tax: "",
  })

  useEffect(() => {
    fetchDeposits()
  }, [taxYear, quarter])

  const fetchDeposits = async () => {
    try {
      const response = await fetch(`/api/form-941/eftps/list?tax_year=${taxYear}&quarter=${quarter}`)
      const data = await response.json()
      setDeposits(data.deposits || [])
    } catch (error) {
      console.error("[v0] Error fetching EFTPS deposits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleDeposit = async () => {
    try {
      const response = await fetch("/api/form-941/eftps/schedule-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quarter,
          tax_year: taxYear,
          deposit_amount: Number.parseFloat(formData.deposit_amount),
          federal_income_tax: Number.parseFloat(formData.federal_income_tax) || 0,
          social_security_tax: Number.parseFloat(formData.social_security_tax) || 0,
          medicare_tax: Number.parseFloat(formData.medicare_tax) || 0,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Deposit Scheduled",
          description: "Your EFTPS deposit has been scheduled successfully.",
        })
        setShowScheduleDialog(false)
        fetchDeposits()
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "scheduled":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const totalDeposits = deposits.reduce((sum, d) => sum + d.deposit_amount, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>EFTPS Deposit Tracker</CardTitle>
            <CardDescription>
              Track your Electronic Federal Tax Payment System deposits for Q{quarter} {taxYear}
            </CardDescription>
          </div>
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule EFTPS Deposit</DialogTitle>
                <DialogDescription>Schedule a new tax deposit via EFTPS</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit_amount">Deposit Amount *</Label>
                  <Input
                    id="deposit_amount"
                    type="number"
                    step="0.01"
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                    placeholder="10000.00"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit_date">Deposit Date *</Label>
                  <Input
                    id="deposit_date"
                    type="date"
                    value={formData.deposit_date}
                    onChange={(e) => setFormData({ ...formData, deposit_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduled_date">Scheduled Date (Optional)</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="federal_income_tax">Federal Income Tax</Label>
                    <Input
                      id="federal_income_tax"
                      type="number"
                      step="0.01"
                      value={formData.federal_income_tax}
                      onChange={(e) => setFormData({ ...formData, federal_income_tax: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="social_security_tax">Social Security Tax</Label>
                    <Input
                      id="social_security_tax"
                      type="number"
                      step="0.01"
                      value={formData.social_security_tax}
                      onChange={(e) => setFormData({ ...formData, social_security_tax: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medicare_tax">Medicare Tax</Label>
                    <Input
                      id="medicare_tax"
                      type="number"
                      step="0.01"
                      value={formData.medicare_tax}
                      onChange={(e) => setFormData({ ...formData, medicare_tax: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleScheduleDeposit} className="w-full">
                  Schedule Deposit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Deposit Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deposits.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {deposits.filter((d) => d.deposit_status === "pending" || d.deposit_status === "scheduled").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deposit List */}
          <div className="space-y-2">
            {deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-orange-500/20">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">${deposit.deposit_amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(deposit.deposit_date).toLocaleDateString()}
                      {deposit.eftps_confirmation_number && (
                        <span className="text-xs">• Conf: {deposit.eftps_confirmation_number}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(deposit.deposit_status)}>{deposit.deposit_status}</Badge>
              </div>
            ))}
            {deposits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No deposits scheduled yet. Click "Schedule Deposit" to add one.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
