"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Mail, Send, Smartphone, Monitor } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function EmailTemplatePreviewClient() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  const previewHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #2563eb;">Invoice from Acme Corporation</h1>
  <p>Hello John Doe,</p>
  <p>Thank you for your business! Please find your invoice details below:</p>
  
  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Invoice Number:</strong> INV-2024-001</p>
    <p><strong>Invoice Date:</strong> January 15, 2024</p>
    <p><strong>Due Date:</strong> February 15, 2024</p>
    <p><strong>Amount Due:</strong> $5,250.00</p>
  </div>

  <p style="margin: 30px 0;">
    <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Invoice</a>
    <a href="#" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-left: 10px;">Pay Now</a>
  </p>

  <p>If you have any questions, please don't hesitate to contact us.</p>
  
  <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
    Best regards,<br>
    Acme Corporation
  </p>
</div>`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/email-templates/1">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Preview Email Template</h1>
              <p className="text-slate-600">See how your email will look to recipients</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Send className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>

        {/* View Mode Toggle */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop View
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile View
              </Button>
            </div>
            <div className="text-sm text-slate-600">
              <Mail className="h-4 w-4 inline mr-2" />
              Preview generated with sample data
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Email Header */}
            <div className="border-b pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-700">From:</span>
                  <span className="text-slate-900">Acme Corporation &lt;hello@acme.com&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-700">To:</span>
                  <span className="text-slate-900">John Doe &lt;john@example.com&gt;</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-slate-700">Subject:</span>
                  <span className="text-slate-900">Invoice INV-2024-001 from Acme Corporation</span>
                </div>
              </div>
            </div>

            {/* Email Body Preview */}
            <div className={`mx-auto transition-all ${viewMode === "mobile" ? "max-w-[375px]" : "max-w-[800px]"}`}>
              <div
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </Card>

        {/* Preview Info */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Preview Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Variables have been replaced with sample data</li>
            <li>• Links are disabled in preview mode</li>
            <li>• Send a test email to see how it renders in different email clients</li>
            <li>• Check mobile responsiveness by toggling between desktop and mobile views</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
