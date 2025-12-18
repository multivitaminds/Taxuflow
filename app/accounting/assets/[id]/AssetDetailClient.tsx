"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar, TrendingDown, FileText } from "lucide-react"
import Link from "next/link"

interface AssetDetailClientProps {
  assetId: string
}

export default function AssetDetailClient({ assetId }: AssetDetailClientProps) {
  const asset = {
    id: assetId,
    name: 'MacBook Pro 16"',
    category: "Computer Equipment",
    serialNumber: "C02XG0FDH05J",
    purchaseDate: "2023-01-15",
    cost: 2499.0,
    salvageValue: 250.0,
    usefulLife: 4,
    depreciationMethod: "Straight Line",
    currentValue: 1874.25,
    accumulatedDepreciation: 624.75,
    monthlyDepreciation: 46.81,
    status: "Active",
    location: "Main Office",
    assignedTo: "John Smith",
    vendor: "Apple Inc.",
    warrantyExpiration: "2026-01-15",
  }

  const depreciationSchedule = [
    { year: 2023, opening: 2499.0, depreciation: 562.31, closing: 1936.69 },
    { year: 2024, opening: 1936.69, depreciation: 562.31, closing: 1374.38 },
    { year: 2025, opening: 1374.38, depreciation: 562.31, closing: 812.07 },
    { year: 2026, opening: 812.07, depreciation: 562.07, closing: 250.0 },
  ]

  const maintenanceHistory = [
    { date: "2024-03-15", description: "Battery replacement", cost: 199.0, performedBy: "Apple Service" },
    { date: "2023-09-20", description: "Keyboard repair", cost: 149.0, performedBy: "Apple Service" },
    { date: "2023-05-10", description: "Software upgrade", cost: 0.0, performedBy: "IT Department" },
  ]

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{asset.name}</h1>
              <Badge variant={asset.status === "Active" ? "default" : "secondary"}>{asset.status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {asset.category} • Serial: {asset.serialNumber}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Dispose
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Cost</p>
              <p className="text-2xl font-bold">${asset.cost.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-2xl font-bold">${asset.currentValue.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Accumulated Depreciation</p>
              <p className="text-2xl font-bold">${asset.accumulatedDepreciation.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Depreciation</p>
              <p className="text-2xl font-bold">${asset.monthlyDepreciation.toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation Schedule</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purchase Date</span>
                  <span className="font-medium">{asset.purchaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="font-medium">{asset.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{asset.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="font-medium">{asset.assignedTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warranty Expiration</span>
                  <span className="font-medium">{asset.warrantyExpiration}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Depreciation Settings</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{asset.depreciationMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Useful Life</span>
                  <span className="font-medium">{asset.usefulLife} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salvage Value</span>
                  <span className="font-medium">${asset.salvageValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Depreciation</span>
                  <span className="font-medium">${(asset.monthlyDepreciation * 12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Depreciation</span>
                  <span className="font-medium">${asset.monthlyDepreciation.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="depreciation">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Depreciation Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Year</th>
                    <th className="text-right p-2">Opening Balance</th>
                    <th className="text-right p-2">Depreciation</th>
                    <th className="text-right p-2">Closing Balance</th>
                    <th className="text-right p-2">Book Value %</th>
                  </tr>
                </thead>
                <tbody>
                  {depreciationSchedule.map((schedule) => (
                    <tr key={schedule.year} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{schedule.year}</td>
                      <td className="p-2 text-right">${schedule.opening.toLocaleString()}</td>
                      <td className="p-2 text-right text-orange-600">${schedule.depreciation.toLocaleString()}</td>
                      <td className="p-2 text-right font-medium">${schedule.closing.toLocaleString()}</td>
                      <td className="p-2 text-right text-green-600">
                        {((schedule.closing / asset.cost) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Maintenance History</h3>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Log Maintenance
              </Button>
            </div>
            <div className="space-y-4">
              {maintenanceHistory.map((record, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{record.description}</p>
                        <p className="text-sm text-muted-foreground">by {record.performedBy}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${record.cost.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Attached Documents</h3>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents attached yet</p>
              <p className="text-sm">Upload purchase receipts, warranties, or maintenance records</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
