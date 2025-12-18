"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, FilterIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react"

export function HoldingsAnalysis() {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Holdings</CardTitle>
              <CardDescription>Complete view of your investment positions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search holdings..." className="pl-10" />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Symbol</th>
                  <th className="text-left p-3 text-sm font-medium">Name</th>
                  <th className="text-right p-3 text-sm font-medium">Shares</th>
                  <th className="text-right p-3 text-sm font-medium">Price</th>
                  <th className="text-right p-3 text-sm font-medium">Value</th>
                  <th className="text-right p-3 text-sm font-medium">Return</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    symbol: "AAPL",
                    name: "Apple Inc.",
                    shares: "850",
                    price: "$147.56",
                    value: "$125,430",
                    return: "+24.5%",
                    positive: true,
                  },
                  {
                    symbol: "MSFT",
                    name: "Microsoft Corp.",
                    shares: "250",
                    price: "$395.05",
                    value: "$98,762",
                    return: "+18.3%",
                    positive: true,
                  },
                  {
                    symbol: "GOOGL",
                    name: "Alphabet Inc.",
                    shares: "630",
                    price: "$138.43",
                    value: "$87,215",
                    return: "+12.1%",
                    positive: true,
                  },
                  {
                    symbol: "TSLA",
                    name: "Tesla Inc.",
                    shares: "180",
                    price: "$242.18",
                    value: "$43,592",
                    return: "-8.4%",
                    positive: false,
                  },
                ].map((holding) => (
                  <tr key={holding.symbol} className="border-t hover:bg-accent/30 cursor-pointer transition-colors">
                    <td className="p-3 font-semibold">{holding.symbol}</td>
                    <td className="p-3 text-sm text-muted-foreground">{holding.name}</td>
                    <td className="p-3 text-right">{holding.shares}</td>
                    <td className="p-3 text-right">{holding.price}</td>
                    <td className="p-3 text-right font-semibold">{holding.value}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {holding.positive ? (
                          <ArrowUpIcon className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDownIcon className="w-3 h-3 text-red-600" />
                        )}
                        <span className={holding.positive ? "text-emerald-600" : "text-red-600"}>{holding.return}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
