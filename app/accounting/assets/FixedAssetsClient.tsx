"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingDown, DollarSign, Calendar, Archive } from "lucide-react"
import Link from "next/link"

export default function FixedAssetsClient() {
  const assets = [
    {
      id: 1,
      name: 'MacBook Pro 16"',
      category: "Computer Equipment",
      purchaseDate: "2023-01-15",
      cost: 2499.0,
      currentValue: 1874.25,
      accumulatedDepreciation: 624.75,
      status: "Active",
      method: "Straight Line",
      usefulLife: 4,
    },
    {
      id: 2,
      name: "Office Furniture Set",
      category: "Furniture & Fixtures",
      purchaseDate: "2023-03-20",
      cost: 5200.0,
      currentValue: 4368.0,
      accumulatedDepreciation: 832.0,
      status: "Active",
      method: "Straight Line",
      usefulLife: 10,
    },
    {
      id: 3,
      name: "Delivery Van - Ford Transit",
      category: "Vehicles",
      purchaseDate: "2022-06-10",
      cost: 32000.0,
      currentValue: 25600.0,
      accumulatedDepreciation: 6400.0,
      status: "Active",
      method: "Declining Balance",
      usefulLife: 5,
    },
    {
      id: 4,
      name: "Server Rack",
      category: "Computer Equipment",
      purchaseDate: "2021-11-05",
      cost: 8500.0,
      currentValue: 3400.0,
      accumulatedDepreciation: 5100.0,
      status: "Active",
      method: "Straight Line",
      usefulLife: 5,
    },
    {
      id: 5,
      name: "Conference Room Table",
      category: "Furniture & Fixtures",
      purchaseDate: "2020-08-15",
      cost: 1200.0,
      currentValue: 0.0,
      accumulatedDepreciation: 1200.0,
      status: "Disposed",
      method: "Straight Line",
      usefulLife: 7,
    },
  ]

  const totalCost = assets.filter((a) => a.status === "Active").reduce((sum, a) => sum + a.cost, 0)
  const totalCurrentValue = assets.filter((a) => a.status === "Active").reduce((sum, a) => sum + a.currentValue, 0)
  const totalDepreciation = assets
    .filter((a) => a.status === "Active")
    .reduce((sum, a) => sum + a.accumulatedDepreciation, 0)
  const activeAssets = assets.filter((a) => a.status === "Active").length

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fixed Assets
            </h1>
            <p className="text-muted-foreground mt-1">Track assets and depreciation schedules</p>
          </div>
          <Link href="/accounting/assets/new">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Accumulated Depreciation</p>
              <p className="text-2xl font-bold">${totalDepreciation.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Assets</p>
              <p className="text-2xl font-bold">{activeAssets}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Archive className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/accounting/assets/depreciation">
          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-blue-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Depreciation Schedule</h3>
                <p className="text-sm text-muted-foreground">View monthly depreciation</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/accounting/assets/disposed">
          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-orange-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Archive className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Disposed Assets</h3>
                <p className="text-sm text-muted-foreground">View asset history</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/accounting/reports/asset-register">
          <Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-green-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Asset Register Report</h3>
                <p className="text-sm text-muted-foreground">Complete asset listing</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Assets</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Asset Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Purchase Date</th>
                <th className="text-right p-2">Cost</th>
                <th className="text-right p-2">Current Value</th>
                <th className="text-right p-2">Depreciation</th>
                <th className="text-left p-2">Method</th>
                <th className="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b hover:bg-muted/50 cursor-pointer transition-colors">
                  <td className="p-2">
                    <Link href={`/accounting/assets/${asset.id}`} className="hover:text-blue-600 font-medium">
                      {asset.name}
                    </Link>
                  </td>
                  <td className="p-2 text-sm text-muted-foreground">{asset.category}</td>
                  <td className="p-2 text-sm">{asset.purchaseDate}</td>
                  <td className="p-2 text-right font-medium">${asset.cost.toLocaleString()}</td>
                  <td className="p-2 text-right">${asset.currentValue.toLocaleString()}</td>
                  <td className="p-2 text-right text-orange-600">${asset.accumulatedDepreciation.toLocaleString()}</td>
                  <td className="p-2 text-sm">{asset.method}</td>
                  <td className="p-2 text-center">
                    <Badge variant={asset.status === "Active" ? "default" : "secondary"}>{asset.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
