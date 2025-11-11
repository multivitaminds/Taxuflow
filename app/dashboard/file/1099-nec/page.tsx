"use client"

import { useState } from "react"
import { Form1099NEC } from "@/components/forms/form-1099-nec"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useDashboard } from "@/components/dashboard-provider"

export default function File1099NECPage() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const { user } = useDashboard()
  const userId = user?.id || ""

  const handleExtractComplete = (data: any, metadata?: any) => {
    console.log("[v0] Extracted data received in 1099-NEC page:", data)

    if (metadata?.isMultiple && data.contractors && Array.isArray(data.contractors)) {
      console.log("[v0] Processing multiple contractors:", data.contractors.length)

      const validContractors = data.contractors.filter(
        (contractor: any) => contractor && contractor.documentType === "1099-nec",
      )

      if (validContractors.length === 0) {
        toast({
          title: "⚠️ No Valid 1099-NEC Documents",
          description: "None of the uploaded documents were recognized as 1099-NEC forms.",
          variant: "destructive",
        })
        return
      }

      if (validContractors.length !== data.contractors.length) {
        toast({
          title: "⚠️ Some Documents Skipped",
          description: `${data.contractors.length - validContractors.length} document(s) were not 1099-NEC forms and were skipped.`,
          variant: "destructive",
        })
      }

      setExtractedData({ contractors: validContractors })
      setActiveTab("manual")

      toast({
        title: "✅ Multiple Contractors Loaded",
        description: `${validContractors.length} contractor document${validContractors.length > 1 ? "s" : ""} ready for review`,
      })
      return
    }

    if (!data || data.documentType !== "1099-nec") {
      console.error("[v0] Invalid extraction data - expected 1099-NEC:", data)
      toast({
        title: "⚠️ Wrong Document Type",
        description: "This appears to be a different form type. Please upload a 1099-NEC document.",
        variant: "destructive",
      })
      return
    }

    if (data.isTemplateData === true || metadata?.warning === "template_data_detected") {
      console.log("[v0] Template/demo document detected")
      toast({
        title: "📋 Sample Document Detected",
        description:
          "This appears to be a demo/sample 1099-NEC. The data has been pre-filled as a starting point. Please update with actual contractor information before submitting.",
        duration: 8000,
      })
      setExtractedData(data)
      setActiveTab("manual")
      return
    }

    // Validate minimum required data for 1099-NEC
    const hasMinimumData =
      data.payer?.name &&
      data.recipient?.name &&
      (data.compensation !== undefined || data.nonemployeeCompensation !== undefined)

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
      description: `Data extracted for ${data.recipient?.name || "contractor"}. Review and complete any missing fields before submitting.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              File Form 1099-NEC
            </h1>
            <p className="text-muted-foreground mt-2">Report nonemployee compensation for contractors</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="upload">📄 Upload 1099-NEC</TabsTrigger>
            <TabsTrigger value="quickbooks">📊 QuickBooks</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload
              userId={userId}
              onExtractComplete={handleExtractComplete}
              formType="1099-NEC"
              expectedDocType="1099-nec"
            />
          </TabsContent>

          <TabsContent value="quickbooks" className="mt-6">
            <QuickBooksSync onSyncComplete={handleExtractComplete} formType="1099-NEC" />
          </TabsContent>

          <TabsContent value="manual" className="mt-6">
            <Form1099NEC userId={userId} extractedData={extractedData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
