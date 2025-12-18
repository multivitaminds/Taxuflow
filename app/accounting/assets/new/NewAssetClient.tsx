"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewAssetClient() {
  const [formData, setFormData] = useState({
    name: "",
    category: "Computer Equipment",
    serialNumber: "",
    purchaseDate: "",
    cost: "",
    salvageValue: "",
    usefulLife: "4",
    depreciationMethod: "Straight Line",
    location: "",
    assignedTo: "",
    vendor: "",
    notes: "",
  })

  const categories = [
    "Computer Equipment",
    "Furniture & Fixtures",
    "Vehicles",
    "Machinery",
    "Buildings",
    "Land",
    "Office Equipment",
    "Software",
  ]

  const depreciationMethods = ["Straight Line", "Declining Balance", "Double Declining Balance", "Sum of Years Digits"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Asset created:", formData)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/accounting/assets">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Asset
          </h1>
          <p className="text-muted-foreground mt-1">Track and depreciate fixed assets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., MacBook Pro 16 inch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    placeholder="S/N or ID"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    placeholder="Vendor name"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Main Office"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    placeholder="Employee name"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Depreciation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost">Purchase Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salvageValue">Salvage Value</Label>
                  <Input
                    id="salvageValue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.salvageValue}
                    onChange={(e) => setFormData({ ...formData, salvageValue: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="usefulLife">Useful Life (Years) *</Label>
                  <Input
                    id="usefulLife"
                    type="number"
                    placeholder="5"
                    value={formData.usefulLife}
                    onChange={(e) => setFormData({ ...formData, usefulLife: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="depreciationMethod">Depreciation Method *</Label>
                  <select
                    id="depreciationMethod"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={formData.depreciationMethod}
                    onChange={(e) => setFormData({ ...formData, depreciationMethod: e.target.value })}
                    required
                  >
                    {depreciationMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Additional notes about this asset"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Depreciation Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Cost</span>
                  <span className="font-medium">${formData.cost || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Salvage Value</span>
                  <span className="font-medium">${formData.salvageValue || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Depreciable Amount</span>
                  <span className="font-medium">
                    $
                    {(
                      Number.parseFloat(formData.cost || "0") - Number.parseFloat(formData.salvageValue || "0")
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Annual Depreciation</span>
                  <span className="font-medium text-orange-600">
                    $
                    {(
                      (Number.parseFloat(formData.cost || "0") - Number.parseFloat(formData.salvageValue || "0")) /
                      Number.parseFloat(formData.usefulLife || "1")
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Depreciation</span>
                  <span className="font-medium text-orange-600">
                    $
                    {(
                      (Number.parseFloat(formData.cost || "0") - Number.parseFloat(formData.salvageValue || "0")) /
                      Number.parseFloat(formData.usefulLife || "1") /
                      12
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Save className="h-4 w-4 mr-2" />
                Save Asset
              </Button>
              <Link href="/accounting/assets" className="block">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
