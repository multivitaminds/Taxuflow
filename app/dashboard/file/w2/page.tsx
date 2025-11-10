"use client"

import { useState } from "react"
import FormW2 from "@/components/forms/form-w2"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { PayrollIntegration } from "@/components/payroll-integration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useDashboard } from "@/components/dashboard-provider"

export default function FileW2Page() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const { user } = useDashboard()
  const userId = user?.id || ""

  const handleExtractComplete = (data: any, metadata?: any) => {
    console.log("[v0] Extracted data received in page:", data)

    if (!data || !data.employer || !data.income) {
      console.error("[v0] Invalid extraction data structure:", data)
      toast({
        title: "⚠️ Extraction Failed",
        description: "Could not extract W-2 data. Please enter manually.",
        variant: "destructive",
      })
      setActiveTab("manual")
      return
    }

    if (data.isTemplateData === true || metadata?.warning === "template_data_detected") {
      console.log("[v0] Template/demo document detected")
      toast({
        title: "📋 Sample Document Detected",
        description:
          "This appears to be a demo/sample W-2. The data has been pre-filled as a starting point. Please update with your actual information before submitting.",
        duration: 8000,
      })
      setExtractedData(data)
      setActiveTab("manual")
      return
    }

    // Only keep basic validation
    const hasMinimumData =
      data.employer?.name && data.employee?.name && (data.income?.wages !== undefined || data.income?.wages !== null)

    if (!hasMinimumData) {
      console.error("[v0] Incomplete extraction data")
      toast({
        title: "⚠️ Incomplete Extraction",
        description: "Some required fields could not be extracted. Please complete the missing information manually.",
        variant: "destructive",
      })
      setExtractedData(data)
      setActiveTab("manual")
      return
    }

    setExtractedData(data)
    setActiveTab("manual")

    toast({
      title: "✅ Extraction Successful",
      description: `Data extracted for ${data.employee?.name || "employee"}. Review and complete any missing fields before submitting.`,
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
            <DocumentUpload userId={userId} onExtractComplete={handleExtractComplete} />
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
