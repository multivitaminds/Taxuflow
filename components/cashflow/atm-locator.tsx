"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, DollarSign, Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ATM {
  id: string
  name: string
  address: string
  distance: string
  fee: string
  network: string
  features: string[]
  lat: number
  lng: number
}

export function AtmLocator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("all")

  // Mock ATM data
  const atms: ATM[] = [
    {
      id: "1",
      name: "Chase Bank ATM",
      address: "123 Main St, San Francisco, CA 94102",
      distance: "0.2 mi",
      fee: "Free",
      network: "Allpoint",
      features: ["24/7", "Deposit", "Withdrawal"],
      lat: 37.7749,
      lng: -122.4194,
    },
    {
      id: "2",
      name: "7-Eleven ATM",
      address: "456 Market St, San Francisco, CA 94103",
      distance: "0.4 mi",
      fee: "$2.50",
      network: "MoneyPass",
      features: ["24/7", "Withdrawal"],
      lat: 37.7849,
      lng: -122.4094,
    },
    {
      id: "3",
      name: "Walgreens ATM",
      address: "789 Mission St, San Francisco, CA 94104",
      distance: "0.6 mi",
      fee: "Free",
      network: "Allpoint",
      features: ["24/7", "Withdrawal"],
      lat: 37.7949,
      lng: -122.3994,
    },
    {
      id: "4",
      name: "CVS Pharmacy ATM",
      address: "321 Geary St, San Francisco, CA 94105",
      distance: "0.8 mi",
      fee: "Free",
      network: "Allpoint",
      features: ["Daily 6am-11pm", "Withdrawal"],
      lat: 37.7649,
      lng: -122.4294,
    },
  ]

  const filteredAtms = atms.filter((atm) => {
    const matchesSearch =
      searchQuery === "" ||
      atm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNetwork = selectedNetwork === "all" || atm.network === selectedNetwork
    return matchesSearch && matchesNetwork
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0a2540]">ATM Locator</h1>
        <p className="text-slate-600 mt-2">Find fee-free ATMs near you</p>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by location, zip code, or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="Allpoint">Allpoint</SelectItem>
                <SelectItem value="MoneyPass">MoneyPass</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#635bff] hover:bg-[#4f46e5]" disabled={true} title="Coming soon">
              <Navigation className="h-4 w-4 mr-2" />
              Use My Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-[400px] bg-slate-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Interactive map will load here</p>
                <p className="text-slate-400 text-xs mt-1">
                  Integration with Google Maps or Mapbox
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ATM List */}
      <div>
        <h2 className="text-xl font-semibold text-[#0a2540] mb-4">
          Nearby ATMs ({filteredAtms.length})
        </h2>
        <div className="grid gap-4">
          {filteredAtms.map((atm) => (
            <Card key={atm.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#f0f4ff] rounded-lg">
                        <MapPin className="h-5 w-5 text-[#635bff]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0a2540]">{atm.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{atm.address}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="secondary" className="bg-[#f0f4ff] text-[#635bff]">
                            {atm.network}
                          </Badge>
                          {atm.features.map((feature) => (
                            <Badge key={feature} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-600">Distance</p>
                      <p className="text-lg font-semibold text-[#0a2540]">{atm.distance}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      <span
                        className={`text-sm font-medium ${
                          atm.fee === "Free" ? "text-green-600" : "text-slate-600"
                        }`}
                      >
                        {atm.fee}
                      </span>
                    </div>
                    <Button size="sm" className="bg-[#635bff] hover:bg-[#4f46e5] mt-2" disabled={true} title="Coming soon">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Network Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Our ATM Networks</CardTitle>
          <CardDescription>Access over 55,000 fee-free ATMs nationwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#0a2540] mb-2">Allpoint Network</h4>
              <p className="text-sm text-slate-600">
                Access 40,000+ ATMs at major retailers including CVS, Walgreens, Target, and more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#0a2540] mb-2">MoneyPass Network</h4>
              <p className="text-sm text-slate-600">
                Use 15,000+ ATMs at 7-Eleven, Costco, and other convenient locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
