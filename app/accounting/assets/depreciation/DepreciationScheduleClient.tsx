"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Download, Calendar } from "lucide-react"
import Link from "next/link"

export default function DepreciationScheduleClient() {
  const schedule = [
    {
      month: "Jan 2024",
      asset: 'MacBook Pro 16"',
      category: "Computer Equipment",
      depreciation: 46.81,
      accumulated: 46.81,
    },
    {
      month: "Jan 2024",
      asset: "Office Furniture Set",
      category: "Furniture & Fixtures",
      depreciation: 43.33,
      accumulated: 43.33,
    },
    { month: "Jan 2024", asset: "Delivery Van", category: "Vehicles", depreciation: 533.33, accumulated: 533.33 },
    {
      month: "Feb 2024",
      asset: 'MacBook Pro 16"',
      category: "Computer Equipment",
      depreciation: 46.81,
      accumulated: 93.62,
    },
    {
      month: "Feb 2024",
      asset: "Office Furniture Set",
      category: "Furniture & Fixtures",
      depreciation: 43.33,
      accumulated: 86.66,
    },
    { month: "Feb 2024", asset: "Delivery Van", category: "Vehicles", depreciation: 533.33, accumulated: 1066.66 },
  ]

  const totalMonthlyDepreciation = schedule.reduce((sum, s) => sum + s.depreciation, 0)
  const totalAccumulatedDepreciation = schedule.reduce((sum, s) => sum + s.accumulated, 0)

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
            <h1 className="text-3xl font-bold">Depreciation Schedule</h1>
            <p className="text-muted-foreground mt-1">Monthly depreciation by asset</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Depreciation</p>
              <p className="text-2xl font-bold">${totalMonthlyDepreciation.toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Accumulated</p>
              <p className="text-2xl font-bold">${totalAccumulatedDepreciation.toFixed(2)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Depreciation Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Month</th>
                <th className="text-left p-2">Asset</th>
                <th className="text-left p-2">Category</th>
                <th className="text-right p-2">Monthly Depreciation</th>
                <th className="text-right p-2">Accumulated</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-2">{entry.month}</td>
                  <td className="p-2 font-medium">{entry.asset}</td>
                  <td className="p-2 text-sm text-muted-foreground">{entry.category}</td>
                  <td className="p-2 text-right text-orange-600">${entry.depreciation.toFixed(2)}</td>
                  <td className="p-2 text-right font-medium">${entry.accumulated.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
