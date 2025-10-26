"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, LinkIcon, Building2, Users, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import { Form1099NEC } from "@/components/forms/form-1099-nec"
import { Form1099NECCSV } from "@/components/forms/form-1099-nec-csv"
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
      case "1099-nec-csv":
        return <Form1099NECCSV userId={userId} />
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

  if (selectedForm && (activeTab === "manual" || activeTab === "csv")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                New Tax Filing
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "csv" ? "Upload CSV file" : "Fill out the form manually"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedForm(null)}
              className="hover:scale-105 transition-transform"
            >
              Back to Form Selection
            </Button>
          </div>
          {renderFormComponent()}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-orange-500/5 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              New Tax Filing
            </h1>
            <p className="text-muted-foreground">Choose how you want to file your taxes</p>
          </div>
          <Link href="/dashboard/filing">
            <Button variant="outline" className="hover:scale-105 transition-transform bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Filing Options */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10">
            <TabsTrigger
              value="select"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-orange-500"
            >
              <FileText className="h-4 w-4" />
              Select Form
            </TabsTrigger>
            <TabsTrigger
              value="csv"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-orange-500"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Bulk CSV Upload
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-orange-500"
            >
              <Upload className="h-4 w-4" />
              Upload Documents
            </TabsTrigger>
            <TabsTrigger
              value="quickbooks"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-orange-500"
            >
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
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-orange-500/20">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.forms.map((form) => (
                      <Card
                        key={form.id}
                        className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 border-2 ${
                          form.supported
                            ? "border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-br from-white/5 to-purple-500/5 backdrop-blur-xl"
                            : "opacity-60 border-white/10"
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
                              <span className="text-xs font-normal px-2 py-1 rounded-full bg-orange-500/20 text-orange-600">
                                Coming Soon
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {form.supported ? (
                            <Button
                              className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg shadow-purple-500/30"
                              size="sm"
                            >
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

          <TabsContent value="csv" className="mt-6">
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-white/5 to-purple-500/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  Bulk CSV Upload
                </CardTitle>
                <CardDescription>Upload a CSV file to file multiple forms at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 border-2 border-purple-500/20 bg-gradient-to-br from-white/5 to-purple-500/5"
                    onClick={() => {
                      setSelectedForm("1099-nec-csv")
                      setActiveTab("csv")
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">1099-NEC Bulk Upload</CardTitle>
                      <CardDescription className="text-sm">Upload multiple contractor forms at once</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 shadow-lg shadow-purple-500/30"
                        size="sm"
                      >
                        Upload 1099-NEC CSV
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="opacity-60 border-2 border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        W-2 Bulk Upload
                        <span className="text-xs font-normal px-2 py-1 rounded-full bg-orange-500/20 text-orange-600">
                          Coming Soon
                        </span>
                      </CardTitle>
                      <CardDescription className="text-sm">Upload multiple employee W-2 forms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-transparent" size="sm" variant="outline" disabled>
                        Not Available Yet
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
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
