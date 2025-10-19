"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TaxRate {
  id: string
  name: string
  state: string
  jurisdiction: string
  tax_rate: number
  is_active: boolean
}

export function TaxRatesManager() {
  const [rates, setRates] = useState<TaxRate[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRates()
  }, [])

  async function loadRates() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("sales_tax_rates").select("*").eq("user_id", user.id).order("state")

    if (data) setRates(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading tax rates...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Tax Rates</h3>
          <p className="text-sm text-muted-foreground">Manage sales tax rates by jurisdiction</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
        </Button>
      </div>

      <div className="space-y-3">
        {rates.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tax rates configured</p>
            <p className="text-sm text-muted-foreground mt-1">Add tax rates for your nexus locations</p>
          </div>
        ) : (
          rates.map((rate) => (
            <div key={rate.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{rate.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {rate.state} • {rate.jurisdiction}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{rate.tax_rate}%</span>
                <Badge variant={rate.is_active ? "default" : "secondary"}>
                  {rate.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
