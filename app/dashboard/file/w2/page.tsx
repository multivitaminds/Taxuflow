"use client"

import { useState } from "react"
import FormW2 from "@/components/forms/form-w2"
import { DocumentUpload } from "@/components/forms/document-upload"
import { DocumentChecklist } from "@/components/document-checklist"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { PayrollIntegration } from "@/components/payroll-integration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useDashboard } from "@/components/dashboard-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function FileW2Page() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Array<{ documentType: string; status: string; fileName: string; data: any }>
  >([])
  const [targetDocType, setTargetDocType] = useState<string | undefined>(undefined)

  const { user } = useDashboard()
  const userId = user?.id || ""

  const handleExtractComplete = (data: any, metadata?: any) => {
    console.log("[v0] Extracted data received in page:", data)

    // The extraction API returns flat structure: { employer_name, employer_ein, employee_name, wages, ... }
    // Not nested structure: { employer: { name }, income: { wages } }

    if (!data) {
      console.error("[v0] No data received from extraction")
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

      setUploadedDocuments((prev) => [
        ...prev,
        {
          documentType: data.documentType || "w2",
          status: "complete",
          fileName: metadata?.fileName || "uploaded-document.pdf",
          data: data,
        },
      ])
      return
    }

    // Check for minimum required data using flat structure
    const hasMinimumData =
      data.employer_name &&
      (data.employee_name || (data.employee_name?.first && data.employee_name?.last)) &&
      data.wages !== undefined &&
      data.wages !== null

    if (!hasMinimumData) {
      console.log("[v0] Partial extraction - some fields missing, but allowing user to complete")
      toast({
        title: "⚠️ Partial Extraction",
        description: "Some fields could not be extracted. Please review and complete the missing information.",
      })
      setExtractedData(data)
      setActiveTab("manual")

      setUploadedDocuments((prev) => [
        ...prev,
        {
          documentType: data.documentType || "w2",
          status: "complete",
          fileName: metadata?.fileName || "uploaded-document.pdf",
          data: data,
        },
      ])
      return
    }

    setExtractedData(data)
    setActiveTab("manual")

    setUploadedDocuments((prev) => [
      ...prev,
      {
        documentType: data.documentType || "w2",
        status: "complete",
        fileName: metadata?.fileName || "uploaded-document.pdf",
        data: data,
      },
    ])

    const employeeName =
      typeof data.employee_name === "string"
        ? data.employee_name
        : `${data.employee_name?.first || ""} ${data.employee_name?.last || ""}`.trim()

    toast({
      title: "✅ Extraction Successful",
      description: `Data extracted for ${employeeName || "employee"}. Review and submit to IRS.`,
    })

    setTargetDocType(undefined)
  }

  const handleUploadRequired = (docType: string) => {
    console.log("[v0] Upload required for document type:", docType)
    setTargetDocType(docType)
    setActiveTab("upload")

    toast({
      title: "Upload Document",
      description: `Please upload ${docType.toUpperCase()} document`,
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

        <DocumentChecklist
          filingType="w2"
          uploadedDocuments={uploadedDocuments}
          onUploadRequired={handleUploadRequired}
        />

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-1">Required for W-2 E-Filing:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>W-2 Form</strong> - The actual wage and tax statement (Required)
              </li>
              <li>
                <strong>Employee ID</strong> - Verification documents like passport or driver's license (Optional but
                recommended)
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Upload all documents using the tabs below. AI will automatically extract data from tax forms.
            </p>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="upload">📄 Upload W-2</TabsTrigger>
            <TabsTrigger value="payroll">💼 Payroll Sync</TabsTrigger>
            <TabsTrigger value="quickbooks">📊 QuickBooks</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload
              userId={userId}
              onExtractComplete={handleExtractComplete}
              targetDocumentType={targetDocType}
              allowMultiple={true}
              title={targetDocType ? `Upload ${targetDocType.toUpperCase()}` : "Upload W-2 Documents"}
              description={
                targetDocType === "w2"
                  ? "Upload W-2 forms for yourself and spouse (if filing jointly)"
                  : targetDocType === "identification"
                    ? "Upload employee ID verification (passport, driver's license, etc.)"
                    : "Upload W-2 and supporting documents for all household members"
              }
            />
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
