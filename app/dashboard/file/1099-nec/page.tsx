"use client"

import { useState } from "react"
import { Form1099NEC } from "@/components/forms/form-1099-nec"
import { DocumentUpload } from "@/components/forms/document-upload"
import { DocumentChecklist } from "@/components/document-checklist"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import { PayrollIntegration } from "@/components/payroll-integration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useDashboard } from "@/components/dashboard-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function File1099NECPage() {
  const [extractedData, setExtractedData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Array<{ documentType: string; status: string; fileName: string; data: any }>
  >([])
  const [targetDocType, setTargetDocType] = useState<string | undefined>(undefined)

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

      validContractors.forEach((contractor: any, index: number) => {
        setUploadedDocuments((prev) => [
          ...prev,
          {
            documentType: "1099-nec",
            status: "complete",
            fileName: contractor.fileName || `contractor-${index + 1}.pdf`,
            data: contractor,
          },
        ])
      })

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

      setUploadedDocuments((prev) => [
        ...prev,
        {
          documentType: "1099-nec",
          status: "complete",
          fileName: metadata?.fileName || "uploaded-1099-nec.pdf",
          data: data,
        },
      ])
      return
    }

    const hasMinimumData =
      data.payer?.name &&
      data.recipient?.name &&
      (data.compensation !== undefined ||
        data.nonemployeeCompensation !== undefined ||
        data.income?.nonemployeeCompensation !== undefined)

    if (!hasMinimumData) {
      console.error("[v0] Incomplete extraction data - missing required fields")
      console.log("[v0] Payer name:", data.payer?.name)
      console.log("[v0] Recipient name:", data.recipient?.name)
      console.log(
        "[v0] Compensation:",
        data.compensation || data.nonemployeeCompensation || data.income?.nonemployeeCompensation,
      )

      toast({
        title: "⚠️ Incomplete Extraction",
        description:
          "Some required fields could not be extracted from the document. The data has been loaded - please complete missing information (especially compensation amount) manually.",
        variant: "destructive",
        duration: 8000,
      })
      setExtractedData(data)
      setActiveTab("manual")

      setUploadedDocuments((prev) => [
        ...prev,
        {
          documentType: "1099-nec",
          status: "complete",
          fileName: metadata?.fileName || "uploaded-1099-nec.pdf",
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
        documentType: "1099-nec",
        status: "complete",
        fileName: metadata?.fileName || "uploaded-1099-nec.pdf",
        data: data,
      },
    ])

    toast({
      title: "✅ Extraction Successful",
      description: `Data extracted for ${data.recipient?.name || "contractor"}. Review and complete any missing fields before submitting.`,
    })

    setTargetDocType(undefined)
  }

  const handleUploadRequired = (docType: string) => {
    console.log("[v0] Upload required for document type:", docType)
    setTargetDocType(docType)
    setActiveTab("upload")

    const docLabels: Record<string, string> = {
      "1099-nec": "1099-NEC Form",
      w9: "W-9 Contractor Information Form",
      contract: "Independent Contractor Agreement",
    }

    toast({
      title: "Upload Document",
      description: `Please upload ${docLabels[docType] || docType.toUpperCase()}`,
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

        <DocumentChecklist
          filingType="1099-nec"
          uploadedDocuments={uploadedDocuments}
          onUploadRequired={handleUploadRequired}
        />

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-1">Required for 1099-NEC E-Filing:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>1099-NEC Form</strong> - Nonemployee compensation statement (Required)
              </li>
              <li>
                <strong>W-9 Form</strong> - Contractor's taxpayer identification information (Required)
              </li>
              <li>
                <strong>Contractor Agreement</strong> - Independent contractor agreement or contract (Optional but
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
            <TabsTrigger value="upload">📄 Upload 1099-NEC</TabsTrigger>
            <TabsTrigger value="payroll">💼 Payroll Sync</TabsTrigger>
            <TabsTrigger value="quickbooks">📊 QuickBooks</TabsTrigger>
            <TabsTrigger value="manual">✍️ Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload
              userId={userId}
              onExtractComplete={handleExtractComplete}
              formType="1099-NEC"
              expectedDocType="1099-nec"
              targetDocumentType={targetDocType}
              allowMultiple={!targetDocType || targetDocType === "1099-nec"}
              title={
                targetDocType === "w9"
                  ? "Upload W-9 Form"
                  : targetDocType === "contract"
                    ? "Upload Contractor Agreement"
                    : "Upload 1099-NEC Documents"
              }
              description={
                targetDocType === "w9"
                  ? "Upload the W-9 form with contractor taxpayer information"
                  : targetDocType === "contract"
                    ? "Upload independent contractor agreement or service contract"
                    : "Upload 1099-NEC forms and supporting documents (W-9, contracts)"
              }
            />
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <PayrollIntegration formType="1099-NEC" />
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
