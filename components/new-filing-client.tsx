"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, LinkIcon, Building2, Users, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { Form1099NEC } from "@/components/forms/form-1099-nec"
import { DocumentUpload } from "@/components/forms/document-upload"
import { QuickBooksSync } from "@/components/forms/quickbooks-sync"
import FormW2 from "@/components/forms/form-w2"
import Form941 from "@/components/forms/form-941"

interface NewFilingClientProps {
  userId: string
}

export function NewFilingClient({ userId }: NewFilingClientProps) {
  const [activeTab, setActiveTab] = useState("select")
  const [selectedForm, setSelectedForm] = useState<string | null>(null)

  const formCategories = {
    payroll: {
      title: "Payroll & Employee Forms",
      icon: Users,
      forms: [
        {
          id: "w2",
          name: "Form W-2",
          description: "Wage and Tax Statement for employees",
          supported: true,
        },
        {
          id: "941",
          name: "Form 941",
          description: "Employer's Quarterly Federal Tax Return",
          supported: true,
        },
        {
          id: "940",
          name: "Form 940",
          description: "Employer's Annual Federal Unemployment Tax Return",
          supported: true,
        },
      ],
    },
    contractor: {
      title: "Contractor & 1099 Forms",
      icon: FileText,
      forms: [
        {
          id: "1099-nec",
          name: "Form 1099-NEC",
          description: "Nonemployee Compensation for contractors",
          supported: true,
        },
        {
          id: "1099-misc",
          name: "Form 1099-MISC",
          description: "Miscellaneous Income",
          supported: true,
        },
        {
          id: "1099-int",
          name: "Form 1099-INT",
          description: "Interest Income",
          supported: true,
        },
        {
          id: "1099-div",
          name: "Form 1099-DIV",
          description: "Dividends and Distributions",
          supported: true,
        },
      ],
    },
    business: {
      title: "Business Tax Returns",
      icon: Building2,
      forms: [
        {
          id: "1120",
          name: "Form 1120",
          description: "U.S. Corporation Income Tax Return",
          supported: false,
          comingSoon: true,
        },
        {
          id: "1120-s",
          name: "Form 1120-S",
          description: "U.S. Income Tax Return for S Corporation",
          supported: false,
          comingSoon: true,
        },
        {
          id: "1065",
          name: "Form 1065",
          description: "U.S. Return of Partnership Income",
          supported: false,
          comingSoon: true,
        },
      ],
    },
    individual: {
      title: "Individual Tax Returns",
      icon: FileSpreadsheet,
      forms: [
        {
          id: "1040",
          name: "Form 1040",
          description: "U.S. Individual Income Tax Return",
          supported: false,
          comingSoon: true,
        },
      ],
    },
  }

  const renderFormComponent = () => {
    switch (selectedForm) {
      case "1099-nec":
        return <Form1099NEC userId={userId} />
      case "w2":
        return <FormW2 />
      case "941":
        return <Form941 />
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Form Not Available</CardTitle>
              <CardDescription>This form is not yet implemented</CardDescription>
            </CardHeader>
          </Card>
        )
    }
  }

  if (selectedForm && activeTab === "manual") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">New Tax Filing</h1>
              <p className="text-muted-foreground">Fill out the form manually</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedForm(null)}>
              Back to Form Selection
            </Button>
          </div>
          {renderFormComponent()}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Tax Filing</h1>
            <p className="text-muted-foreground">Choose how you want to file your taxes</p>
          </div>
          <Link href="/dashboard/filing">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Filing Options */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" className="gap-2">
              <FileText className="h-4 w-4" />
              Select Form
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger value="quickbooks" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              QuickBooks Sync
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="mt-6 space-y-8">
            {Object.entries(formCategories).map(([categoryId, category]) => {
              const Icon = category.icon
              return (
                <div key={categoryId} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.forms.map((form) => (
                      <Card
                        key={form.id}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          !form.supported ? "opacity-60" : ""
                        }`}
                        onClick={() => {
                          if (form.supported) {
                            setSelectedForm(form.id)
                            setActiveTab("manual")
                          }
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-base">
                            {form.name}
                            {form.comingSoon && (
                              <span className="text-xs font-normal text-muted-foreground">Coming Soon</span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {form.supported ? (
                            <Button className="w-full" size="sm">
                              File {form.name}
                            </Button>
                          ) : (
                            <Button className="w-full bg-transparent" size="sm" variant="outline" disabled>
                              Not Available Yet
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <DocumentUpload userId={userId} />
          </TabsContent>

          <TabsContent value="quickbooks" className="mt-6">
            <QuickBooksSync userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
