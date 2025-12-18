"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, FileText, AlertCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface TaxRate {
  id: string
  name: string
  rate: number
  jurisdiction: string
  active: boolean
}

export function SalesTaxClient() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTaxRates()
  }, [])

  async function loadTaxRates() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("tax_rates").select("*").order("name")

    if (!error && data) {
      setTaxRates(data)
    }
    setLoading(false)
  }

  const stats = {
    totalRates: taxRates.length,
    activeRates: taxRates.filter((r) => r.active).length,
    avgRate: taxRates.length > 0 ? (taxRates.reduce((sum, r) => sum + r.rate, 0) / taxRates.length).toFixed(2) : "0.00",
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Tax Management</h1>
          <p className="text-muted-foreground">Manage tax rates and jurisdictions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tax Rate
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">Total Tax Rates</div>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.totalRates}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">Active Rates</div>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.activeRates}</div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <div className="text-sm font-medium text-muted-foreground">Average Rate</div>
          </div>
          <div className="mt-2 text-2xl font-bold">{stats.avgRate}%</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Tax Rates</h2>
        {taxRates.length === 0 ? (
          <div className="py-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tax rates configured</h3>
            <p className="mt-2 text-sm text-muted-foreground">Add your first tax rate to start tracking sales tax</p>
          </div>
        ) : (
          <div className="space-y-3">
            {taxRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">{rate.name}</div>
                  <div className="text-sm text-muted-foreground">{rate.jurisdiction}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{rate.rate}%</div>
                  </div>
                  <Badge variant={rate.active ? "default" : "secondary"}>{rate.active ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
