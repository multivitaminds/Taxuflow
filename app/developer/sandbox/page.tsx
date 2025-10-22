"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function SandboxPage() {
  const [copied, setCopied] = useState(false)

  const sandboxApiKey = "sk_test_1234567890abcdef"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sandboxApiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Sandbox Environment</h1>
        <p className="text-lg text-muted-foreground">
          Test your integration with sample data before going live. No real data is processed in sandbox mode.
        </p>
      </div>

      <Card className="p-8 bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sandbox API Key</h2>
            <p className="text-muted-foreground">Use this test key to make API calls in sandbox mode</p>
          </div>
          <Badge variant="secondary">Test Mode</Badge>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-background p-3 rounded-lg font-mono text-sm">{sandboxApiKey}</code>
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Sandbox Base URL</h2>
        <p className="text-muted-foreground mb-4">Point your API requests to the sandbox environment:</p>
        <pre className="bg-muted p-4 rounded-lg text-sm">
          <code>https://sandbox.api.taxu.io/v1</code>
        </pre>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Test Data</h2>
        <p className="text-muted-foreground mb-4">Use these test values to simulate different scenarios:</p>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Test W-2 Data</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employer Name:</span>
                <span className="font-mono">Test Corporation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EIN:</span>
                <span className="font-mono">12-3456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Name:</span>
                <span className="font-mono">Test User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wages:</span>
                <span className="font-mono">$75,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Federal Withheld:</span>
                <span className="font-mono">$12,500.00</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Test Customer IDs</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Customer:</span>
                <span className="font-mono">cust_test_valid</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer with Invoices:</span>
                <span className="font-mono">cust_test_invoices</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invalid Customer:</span>
                <span className="font-mono">cust_test_invalid</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Test Document Upload</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upload any PDF or image file. The sandbox will return mock analysis results instantly.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm mb-2">Expected Response:</p>
              <pre className="text-xs overflow-x-auto">
                <code>{String.raw`{
  "id": "doc_test_123",
  "status": "completed",
  "document_type": "w2",
  "ai_confidence": 95,
  "extracted_data": { ... }
}`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Test Error Scenarios</h3>
            <div className="space-y-3">
              <div className="border-l-2 border-destructive pl-4">
                <p className="font-mono text-sm mb-1">
                  Use amount: <code>-1</code>
                </p>
                <p className="text-xs text-muted-foreground">Triggers validation error</p>
              </div>
              <div className="border-l-2 border-destructive pl-4">
                <p className="font-mono text-sm mb-1">
                  Use customer_id: <code>cust_test_invalid</code>
                </p>
                <p className="text-xs text-muted-foreground">Triggers not found error</p>
              </div>
              <div className="border-l-2 border-destructive pl-4">
                <p className="font-mono text-sm mb-1">
                  Use API key: <code>sk_test_expired</code>
                </p>
                <p className="text-xs text-muted-foreground">Triggers authentication error</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Sandbox Limitations</h2>
        <div className="space-y-3">
          <div className="border-l-2 border-muted pl-4">
            <h3 className="font-semibold mb-1">No Real Data Processing</h3>
            <p className="text-sm text-muted-foreground">
              Documents are not actually analyzed. Mock data is returned instantly.
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <h3 className="font-semibold mb-1">No Webhooks Sent</h3>
            <p className="text-sm text-muted-foreground">
              Webhook events are logged but not delivered in sandbox mode.
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <h3 className="font-semibold mb-1">Data Resets Daily</h3>
            <p className="text-sm text-muted-foreground">All sandbox data is cleared every 24 hours.</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <h3 className="font-semibold mb-1">Rate Limits Apply</h3>
            <p className="text-sm text-muted-foreground">Same rate limits as production: 100 requests per minute.</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">Quick Test</h2>
        <p className="text-muted-foreground mb-4">Try this cURL command to test your sandbox access:</p>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`curl https://sandbox.api.taxu.io/v1/tax/calculate \
  -H "Authorization: Bearer sk_test_1234567890abcdef" \
  -H "Content-Type: application/json" \
  -d '{
    "income": 75000,
    "federal_withheld": 12500
  }'`}</code>
        </pre>
      </Card>
    </div>
  )
}
