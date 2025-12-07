"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye, Send, ArrowLeft, Code, Type, ImageIcon, Wand2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const availableVariables = [
  { name: "{{company_name}}", description: "Your company name" },
  { name: "{{customer_name}}", description: "Customer full name" },
  { name: "{{customer_email}}", description: "Customer email address" },
  { name: "{{invoice_number}}", description: "Invoice number" },
  { name: "{{invoice_date}}", description: "Invoice date" },
  { name: "{{invoice_due_date}}", description: "Invoice due date" },
  { name: "{{invoice_amount}}", description: "Invoice total amount" },
  { name: "{{invoice_link}}", description: "Link to view invoice" },
  { name: "{{payment_link}}", description: "Link to make payment" },
  { name: "{{receipt_number}}", description: "Receipt number" },
  { name: "{{payment_date}}", description: "Payment date" },
  { name: "{{payment_amount}}", description: "Payment amount" },
]

function EmailTemplateEditorClient() {
  const [templateName, setTemplateName] = useState("Invoice Email")
  const [subject, setSubject] = useState("Invoice {{invoice_number}} from {{company_name}}")
  const [bodyHtml, setBodyHtml] =
    useState(`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Invoice from {{company_name}}</h1>
  <p>Hello {{customer_name}},</p>
  <p>Thank you for your business! Please find your invoice details below:</p>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Invoice Number:</strong> {{invoice_number}}</p>
    <p><strong>Invoice Date:</strong> {{invoice_date}}</p>
    <p><strong>Due Date:</strong> {{invoice_due_date}}</p>
    <p><strong>Amount Due:</strong> {{invoice_amount}}</p>
  </div>

  <p style="margin: 30px 0;">
    <a href="{{invoice_link}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Invoice</a>
    <a href="{{payment_link}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">Pay Now</a>
  </p>

  <p>If you have any questions, please don't hesitate to contact us.</p>
  
  <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
    Best regards,<br>
    {{company_name}}
  </p>
</div>`)

  const insertVariable = (variable: string) => {
    setBodyHtml((prev) => prev + variable)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/email-templates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Email Template</h1>
              <p className="text-slate-600">Customize your email template</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/accounting/email-templates/1/preview">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send Test
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Invoice Email"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Invoice {{invoice_number}} from {{company_name}}"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use variables like {"{{invoice_number}}"} for dynamic content
                  </p>
                </div>

                <div>
                  <Label htmlFor="body">Email Body</Label>
                  <Tabs defaultValue="html" className="mt-2">
                    <TabsList>
                      <TabsTrigger value="html">
                        <Code className="h-4 w-4 mr-2" />
                        HTML
                      </TabsTrigger>
                      <TabsTrigger value="visual">
                        <Type className="h-4 w-4 mr-2" />
                        Visual Editor
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="html">
                      <Textarea
                        id="body"
                        value={bodyHtml}
                        onChange={(e) => setBodyHtml(e.target.value)}
                        className="font-mono text-sm min-h-[500px]"
                        placeholder="Enter HTML content..."
                      />
                    </TabsContent>
                    <TabsContent value="visual">
                      <Card className="p-6 bg-slate-50 min-h-[500px]">
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Wand2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600">Visual editor coming soon</p>
                            <p className="text-sm text-slate-500 mt-2">Use HTML editor for now</p>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Variables */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Available Variables
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {availableVariables.map((variable, index) => (
                  <button
                    key={index}
                    onClick={() => insertVariable(variable.name)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    <code className="text-sm font-mono text-blue-600">{variable.name}</code>
                    <p className="text-xs text-slate-500 mt-1">{variable.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Template Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-md">
                    <option value="invoice">Invoice</option>
                    <option value="receipt">Receipt</option>
                    <option value="reminder">Reminder</option>
                    <option value="payment">Payment</option>
                    <option value="estimate">Estimate</option>
                    <option value="statement">Statement</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Active Template</Label>
                  <input type="checkbox" id="active" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="trackOpens">Track Opens</Label>
                  <input type="checkbox" id="trackOpens" defaultChecked className="toggle" />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="trackClicks">Track Clicks</Label>
                  <input type="checkbox" id="trackClicks" defaultChecked className="toggle" />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Code className="h-4 w-4 mr-2" />
                  Add Button
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text Block
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplateEditorClient
