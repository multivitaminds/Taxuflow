"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Plus, Trash2, Edit, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface TaxJurisdiction {
  id: string
  name: string
  type: "state" | "county" | "city"
  rate: number
  active: boolean
}

export function TaxJurisdictionsClient() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [jurisdictions, setJurisdictions] = useState<TaxJurisdiction[]>([
    { id: "1", name: "New Jersey", type: "state", rate: 6.625, active: true },
    { id: "2", name: "Camden County", type: "county", rate: 1.0, active: true },
    { id: "3", name: "Cherry Hill", type: "city", rate: 0.875, active: true },
    { id: "4", name: "Pennsylvania", type: "state", rate: 6.0, active: false },
  ])

  const filteredJurisdictions = jurisdictions.filter((j) => j.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleDelete = (id: string) => {
    setJurisdictions(jurisdictions.filter((j) => j.id !== id))
    toast({ title: "Jurisdiction deleted", description: "Tax jurisdiction has been removed." })
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/accounting/settings"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Tax Jurisdictions</h1>
          <p className="text-muted-foreground mt-2">Manage state, county, and city tax rates</p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5851df] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Jurisdiction
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jurisdictions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredJurisdictions.map((jurisdiction) => (
            <div
              key={jurisdiction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-[#635bff] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    jurisdiction.active ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <MapPin className={`h-5 w-5 ${jurisdiction.active ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <h3 className="font-medium">{jurisdiction.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize">{jurisdiction.type}</span>
                    <span>•</span>
                    <span>{jurisdiction.rate}% tax rate</span>
                    <span>•</span>
                    <span className={jurisdiction.active ? "text-green-600" : "text-gray-400"}>
                      {jurisdiction.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(jurisdiction.id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
