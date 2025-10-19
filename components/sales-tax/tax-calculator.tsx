"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const US_STATES = [
  { code: "CA", name: "California" },
  { code: "NY", name: "New York" },
  { code: "TX", name: "Texas" },
  { code: "FL", name: "Florida" },
  { code: "IL", name: "Illinois" },
]

export function TaxCalculator() {
  const [formData, setFormData] = useState({
    subtotal: "",
    shipping: "",
    state: "",
    county: "",
    city: "",
    zip: "",
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function calculateTax() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Call the calculate_sales_tax function
    const { data, error } = await supabase.rpc("calculate_sales_tax", {
      p_subtotal: Number.parseFloat(formData.subtotal),
      p_shipping: Number.parseFloat(formData.shipping || "0"),
      p_state: formData.state,
      p_county: formData.county || null,
      p_city: formData.city || null,
      p_zip: formData.zip || null,
      p_user_id: user.id,
    })

    if (data && data.length > 0) {
      setResult(data[0])
    }

    setLoading(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculate Sales Tax
        </h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="subtotal">Subtotal</Label>
            <Input
              id="subtotal"
              type="number"
              value={formData.subtotal}
              onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
              placeholder="100.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="shipping">Shipping (Optional)</Label>
            <Input
              id="shipping"
              type="number"
              value={formData.shipping}
              onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
              placeholder="10.00"
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="county">County (Optional)</Label>
            <Input
              id="county"
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              placeholder="Los Angeles"
            />
          </div>

          <div>
            <Label htmlFor="city">City (Optional)</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Los Angeles"
            />
          </div>

          <div>
            <Label htmlFor="zip">ZIP Code (Optional)</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              placeholder="90001"
            />
          </div>

          <Button onClick={calculateTax} disabled={loading || !formData.subtotal || !formData.state} className="w-full">
            {loading ? "Calculating..." : "Calculate Tax"}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tax Calculation Result</h3>

        {result ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Tax</p>
              <p className="text-3xl font-bold text-blue-600">${Number(result.total_tax).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Effective Rate: {Number(result.effective_rate).toFixed(3)}%
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-muted-foreground">State Tax</span>
                <span className="font-semibold">${Number(result.state_tax).toFixed(2)}</span>
              </div>

              {Number(result.county_tax) > 0 && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">County Tax</span>
                  <span className="font-semibold">${Number(result.county_tax).toFixed(2)}</span>
                </div>
              )}

              {Number(result.city_tax) > 0 && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm text-muted-foreground">City Tax</span>
                  <span className="font-semibold">${Number(result.city_tax).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Grand Total</span>
                <span>
                  $
                  {(
                    Number.parseFloat(formData.subtotal) +
                    Number.parseFloat(formData.shipping || "0") +
                    Number(result.total_tax)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter transaction details to calculate sales tax</p>
          </div>
        )}
      </Card>
    </div>
  )
}
