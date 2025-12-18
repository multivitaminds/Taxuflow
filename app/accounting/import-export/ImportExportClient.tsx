"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, FileSpreadsheet, FileText, Database, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function ImportExportClient() {
  const [activeTab, setActiveTab] = useState("import")

  const importTemplates = [
    { name: "Chart of Accounts", icon: Database, description: "Import accounts in bulk", format: "CSV, Excel" },
    { name: "Customers", icon: FileSpreadsheet, description: "Import customer data", format: "CSV, Excel" },
    { name: "Vendors", icon: FileSpreadsheet, description: "Import vendor information", format: "CSV, Excel" },
    { name: "Products", icon: FileSpreadsheet, description: "Import product catalog", format: "CSV, Excel" },
    { name: "Invoices", icon: FileText, description: "Bulk invoice import", format: "CSV, Excel" },
    { name: "Bills", icon: FileText, description: "Bulk bill import", format: "CSV, Excel" },
    { name: "Transactions", icon: Database, description: "Import bank transactions", format: "CSV, Excel" },
    { name: "Inventory", icon: FileSpreadsheet, description: "Import inventory data", format: "CSV, Excel" },
  ]

  const exportOptions = [
    { name: "Chart of Accounts", records: 247, lastExport: "2 days ago" },
    { name: "Customers", records: 1853, lastExport: "1 week ago" },
    { name: "Vendors", records: 432, lastExport: "3 days ago" },
    { name: "Products", records: 1247, lastExport: "5 days ago" },
    { name: "Invoices", records: 8934, lastExport: "1 day ago" },
    { name: "Bills", records: 3421, lastExport: "4 days ago" },
    { name: "Payments", records: 6234, lastExport: "2 days ago" },
    { name: "Transactions", records: 15234, lastExport: "1 day ago" },
    { name: "Financial Reports", records: 52, lastExport: "1 week ago" },
    { name: "Tax Records", records: 234, lastExport: "2 weeks ago" },
  ]

  const recentImports = [
    { id: "1", name: "Customer_Import_2024.csv", date: "2024-03-15 10:32 AM", records: 156, status: "completed" },
    { id: "2", name: "Invoices_Q1_2024.xlsx", date: "2024-03-14 3:45 PM", records: 423, status: "completed" },
    { id: "3", name: "Vendors_Update.csv", date: "2024-03-13 9:15 AM", records: 87, status: "completed" },
    { id: "4", name: "Products_Inventory.xlsx", date: "2024-03-12 2:20 PM", records: 234, status: "failed" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("import")}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Imports</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>↑ 12%</span>
                <span className="text-muted-foreground">this month</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("export")}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Exports</p>
              <p className="text-2xl font-bold">3,842</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>↑ 8%</span>
                <span className="text-muted-foreground">this month</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("history")}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Records Processed</p>
              <p className="text-2xl font-bold">127.3K</p>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span>↑ 24%</span>
                <span className="text-muted-foreground">this month</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed Imports</p>
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span>↓ 45%</span>
                <span className="text-muted-foreground">vs last month</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Import Templates</h2>
              <p className="text-sm text-muted-foreground">
                Choose a data type to import. Download the template, fill it with your data, and upload.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {importTemplates.map((template) => (
                <Link
                  href={`/accounting/import-export/import/${template.name.toLowerCase().replace(/\s+/g, "-")}`}
                  key={template.name}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-[#635bff]">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="p-3 bg-[#635bff]/10 rounded-lg">
                        <template.icon className="h-8 w-8 text-[#635bff]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {template.format}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
                <FileSpreadsheet className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Download All Templates</div>
                  <div className="text-xs text-muted-foreground">Get CSV templates for all data types</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Bulk Upload</div>
                  <div className="text-xs text-muted-foreground">Upload multiple files at once</div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 bg-transparent">
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Import Guide</div>
                  <div className="text-xs text-muted-foreground">Learn how to prepare your data</div>
                </div>
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Export Data</h2>
                <p className="text-sm text-muted-foreground">Export your accounting data in CSV or Excel format</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </div>

            <div className="space-y-3">
              {exportOptions.map((option) => (
                <Card key={option.name} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Database className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{option.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {option.records.toLocaleString()} records • Last exported {option.lastExport}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm">
                        Excel
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recent Imports</h2>
              <p className="text-sm text-muted-foreground">View the status of your recent data imports</p>
            </div>

            <div className="space-y-3">
              {recentImports.map((item) => (
                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          item.status === "completed"
                            ? "bg-green-50"
                            : item.status === "failed"
                              ? "bg-red-50"
                              : "bg-yellow-50"
                        }`}
                      >
                        {item.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {item.status === "failed" && <AlertCircle className="h-5 w-5 text-red-600" />}
                        {item.status === "processing" && <Clock className="h-5 w-5 text-yellow-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.date} • {item.records} records
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "default"
                            : item.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {item.status === "completed" ? "Completed" : item.status === "failed" ? "Failed" : "Processing"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
