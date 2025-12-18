"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Pencil } from "lucide-react"
import { Form1099NEC } from "@/components/forms/form-1099-nec"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"

interface Form1099NECTabsProps {
  userId: string
}

export function Form1099NECTabs({ userId }: Form1099NECTabsProps) {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10">
        <TabsTrigger
          value="upload"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-orange-600"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload 1099-NEC
        </TabsTrigger>
        <TabsTrigger
          value="quickbooks"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-orange-600"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 6h10v1H7zm0 3h10v1H7zm0 3h10v1H7zm-4 3h18v1H3z" />
          </svg>
          QuickBooks
        </TabsTrigger>
        <TabsTrigger
          value="manual"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-orange-600"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Manual Entry
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-6">
        <DocumentUpload
          userId={userId}
          formType="1099-NEC"
          title="Upload Tax Documents"
          description="Upload 1099-NECs, receipts, and other tax documents for AI extraction"
        />
      </TabsContent>

      <TabsContent value="quickbooks" className="mt-6">
        <QuickBooksSync userId={userId} formType="1099-NEC" />
      </TabsContent>

      <TabsContent value="manual" className="mt-6">
        <Form1099NEC userId={userId} />
      </TabsContent>
    </Tabs>
  )
}
