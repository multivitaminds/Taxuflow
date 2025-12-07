"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, DollarSign, Calendar, Plus, Edit, Trash2 } from "lucide-react"

export default function MileageTrackerClient() {
  const [trips, setTrips] = useState([
    {
      id: 1,
      date: "2024-01-15",
      from: "Office",
      to: "Client Meeting",
      miles: 24.5,
      rate: 0.67,
      amount: 16.42,
      purpose: "Client consultation",
    },
    {
      id: 2,
      date: "2024-01-14",
      from: "Home",
      to: "Office",
      miles: 12.3,
      rate: 0.67,
      amount: 8.24,
      purpose: "Commute",
    },
    {
      id: 3,
      date: "2024-01-13",
      from: "Office",
      to: "Vendor Site",
      miles: 45.8,
      rate: 0.67,
      amount: 30.69,
      purpose: "Vendor meeting",
    },
  ])

  const stats = {
    totalMiles: trips.reduce((sum, trip) => sum + trip.miles, 0),
    totalAmount: trips.reduce((sum, trip) => sum + trip.amount, 0),
    thisMonth: trips.filter((t) => new Date(t.date).getMonth() === new Date().getMonth()).length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Mileage Tracker</h1>
              <p className="text-muted-foreground">Track business mileage and calculate deductions</p>
            </div>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Log Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Miles</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalMiles.toFixed(1)}</p>
                </div>
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deduction Amount</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalAmount.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Trips This Month</p>
                  <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Card className="border-border mb-6 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Current IRS Mileage Rate</h2>
          <div className="flex items-center gap-4">
            <Badge className="text-lg py-2 px-4">$0.67 per mile</Badge>
            <p className="text-muted-foreground text-sm">Effective January 2024</p>
          </div>
        </Card>

        <Card className="border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Trip Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">From</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">To</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Miles</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rate</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Purpose</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(trip.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-foreground">{trip.from}</td>
                    <td className="p-4 font-medium text-foreground">{trip.to}</td>
                    <td className="p-4 text-muted-foreground">{trip.miles.toFixed(1)}</td>
                    <td className="p-4 text-muted-foreground">${trip.rate}</td>
                    <td className="p-4 font-medium text-foreground">${trip.amount.toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground">{trip.purpose}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
