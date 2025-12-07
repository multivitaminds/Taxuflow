"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, FileText, Check, Loader2, Eye, Download } from "lucide-react"

export default function ReceiptScannerClient() {
  const [scanning, setScanning] = useState(false)
  const [scannedReceipts, setScannedReceipts] = useState([
    {
      id: 1,
      filename: "receipt-2024-01-15.jpg",
      date: "2024-01-15",
      vendor: "Office Depot",
      amount: 156.78,
      category: "Office Supplies",
      status: "processed",
    },
    {
      id: 2,
      filename: "receipt-2024-01-14.pdf",
      date: "2024-01-14",
      vendor: "Starbucks",
      amount: 24.5,
      category: "Meals",
      status: "processing",
    },
    {
      id: 3,
      filename: "receipt-2024-01-13.jpg",
      date: "2024-01-13",
      vendor: "Amazon Web Services",
      amount: 489.0,
      category: "Software",
      status: "processed",
    },
  ])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScanning(true)
    setTimeout(() => setScanning(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Receipt Scanner</h1>
          <p className="text-muted-foreground">Upload and scan receipts with AI-powered data extraction</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 border-border hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">23 This Month</Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Scanned Receipts</h3>
            <p className="text-muted-foreground text-sm">Automatically processed</p>
          </Card>

          <Card className="p-6 border-border hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">98% Accuracy</Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Data Extracted</h3>
            <p className="text-muted-foreground text-sm">AI-powered recognition</p>
          </Card>

          <Card className="p-6 border-border hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">2 Pending</Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Review Queue</h3>
            <p className="text-muted-foreground text-sm">Awaiting approval</p>
          </Card>
        </div>

        <Card className="p-8 border-border border-dashed mb-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {scanning ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <Camera className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {scanning ? "Scanning Receipt..." : "Upload Receipt"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {scanning ? "Extracting data with AI" : "Drag and drop or click to upload"}
            </p>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="receipt-upload"
            />
            <label htmlFor="receipt-upload">
              <Button className="gap-2" disabled={scanning}>
                <Upload className="h-4 w-4" />
                {scanning ? "Processing..." : "Choose File"}
              </Button>
            </label>
          </div>
        </Card>

        <Card className="border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Scans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scannedReceipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(receipt.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-foreground">{receipt.vendor}</td>
                    <td className="p-4">
                      <Badge variant="outline">{receipt.category}</Badge>
                    </td>
                    <td className="p-4 font-medium text-foreground">${receipt.amount.toFixed(2)}</td>
                    <td className="p-4">
                      {receipt.status === "processed" ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                          <Check className="h-3 w-3" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
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
