"use client"

import { useState } from "react"
import FormW2 from "@/components/forms/form-w2"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { PayrollIntegration } from "@/components/payroll-integration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function FileW2Page() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleExtractComplete = (data: any) => {
    console.log("[v0] Extracted data received in page:", data)

    if (!data || !data.employer || !data.income) {
      console.error("[v0] Invalid extraction data structure:", data)
      toast({
        title: "⚠️ Extraction Failed",
        description: "Could not extract W-2 data. Please enter manually.",
        variant: "destructive",
      })
      setActiveTab("manual") // Switch to manual entry tab
      return
    }

    const templatePatterns = [
      "Company Name",
      "John Doe",
      "Jane Doe",
      "TechNova Solutions",
      "ABC Corporation",
      "XYZ Company",
      "Sample Company",
      "Example Corp",
      "Test Company",
      "Demo Company",
      "Template",
      "Placeholder",
      "123-45-6789",
      "12-3456789",
      "000-00-0000",
      "00-0000000",
      "XX-XXXXXXX",
      "XXX-XX-XXXX",
    ]

    const hasTemplateData = templatePatterns.some(
      (pattern) =>
        data.employer?.name?.includes(pattern) ||
        data.employee?.name?.includes(pattern) ||
        data.employee?.ssn?.includes(pattern) ||
        data.employer?.ein?.includes(pattern),
    )

    if (hasTemplateData) {
      console.error("[v0] AI returned template/placeholder data")
      toast({
        title: "⚠️ Template Data Detected",
        description: "AI returned placeholder values instead of real data. Please enter your information manually.",
        variant: "destructive",
      })
      setActiveTab("manual") // Switch to manual entry tab
      return
    }

    setExtractedData(data)
    setActiveTab("manual")

    toast({
      title: "✅ Extraction Successful",
      description: `Data extracted for ${data.employee?.name || "employee"}. Review and complete any missing fields.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              File Form W-2
            </h1>
            <p className="text-muted-foreground mt-2">Report employee wages and tax withholdings</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="upload">📄 Upload W-2</TabsTrigger>
            <TabsTrigger value="payroll">💼 Payroll Sync</TabsTrigger>
            <TabsTrigger value="quickbooks">📊 QuickBooks</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload onExtractComplete={handleExtractComplete} />
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <PayrollIntegration />
          </TabsContent>

          <TabsContent value="quickbooks" className="mt-6">
            <QuickBooksSync onSyncComplete={handleExtractComplete} />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <FormW2 extractedData={extractedData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
