"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function DisposedAssetsClient() {
  const disposedAssets = [
    {
      id: 5,
      name: "Conference Room Table",
      category: "Furniture & Fixtures",
      purchaseDate: "2020-08-15",
      disposalDate: "2024-01-10",
      originalCost: 1200.0,
      accumulatedDepreciation: 1200.0,
      disposalValue: 50.0,
      disposalMethod: "Sold",
      gainLoss: -1150.0,
    },
    {
      id: 6,
      name: "Old Printer HP LaserJet",
      category: "Office Equipment",
      purchaseDate: "2019-03-20",
      disposalDate: "2023-11-15",
      originalCost: 450.0,
      accumulatedDepreciation: 450.0,
      disposalValue: 0.0,
      disposalMethod: "Discarded",
      gainLoss: -450.0,
    },
    {
      id: 7,
      name: "Dell Desktop PC",
      category: "Computer Equipment",
      purchaseDate: "2020-01-10",
      disposalDate: "2023-09-20",
      originalCost: 850.0,
      accumulatedDepreciation: 637.5,
      disposalValue: 100.0,
      disposalMethod: "Sold",
      gainLoss: -112.5,
    },
  ]

  const totalOriginalCost = disposedAssets.reduce((sum, a) => sum + a.originalCost, 0)
  const totalDisposalValue = disposedAssets.reduce((sum, a) => sum + a.disposalValue, 0)
  const totalGainLoss = disposedAssets.reduce((sum, a) => sum + a.gainLoss, 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/accounting/assets">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Disposed Assets</h1>
            <p className="text-muted-foreground mt-1">Asset disposal history and gain/loss tracking</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-blue-200">
          <p className="text-sm text-muted-foreground">Total Original Cost</p>
          <p className="text-2xl font-bold">${totalOriginalCost.toLocaleString()}</p>
        </Card>

        <Card className="p-4 border-green-200">
          <p className="text-sm text-muted-foreground">Total Disposal Value</p>
          <p className="text-2xl font-bold">${totalDisposalValue.toLocaleString()}</p>
        </Card>

        <Card className="p-4 border-red-200">
          <p className="text-sm text-muted-foreground">Total Loss on Disposal</p>
          <p className="text-2xl font-bold text-red-600">${Math.abs(totalGainLoss).toLocaleString()}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Disposal History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Asset Name</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Purchase Date</th>
                <th className="text-left p-2">Disposal Date</th>
                <th className="text-right p-2">Original Cost</th>
                <th className="text-right p-2">Disposal Value</th>
                <th className="text-left p-2">Method</th>
                <th className="text-right p-2">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {disposedAssets.map((asset) => (
                <tr key={asset.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">{asset.name}</td>
                  <td className="p-2 text-sm text-muted-foreground">{asset.category}</td>
                  <td className="p-2 text-sm">{asset.purchaseDate}</td>
                  <td className="p-2 text-sm">{asset.disposalDate}</td>
                  <td className="p-2 text-right">${asset.originalCost.toLocaleString()}</td>
                  <td className="p-2 text-right">${asset.disposalValue.toLocaleString()}</td>
                  <td className="p-2">
                    <Badge variant="outline">{asset.disposalMethod}</Badge>
                  </td>
                  <td className="p-2 text-right">
                    <span className={asset.gainLoss < 0 ? "text-red-600" : "text-green-600"}>
                      ${asset.gainLoss.toLocaleString()}
                    </span>
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
