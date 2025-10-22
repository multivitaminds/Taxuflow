"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DocumentsAPIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Document Processing API</h1>
        <p className="text-lg text-muted-foreground">
          Upload, analyze, and extract data from tax documents using AI-powered OCR and document intelligence.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/documents/upload</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Upload a tax document (W-2, 1099, 1040, receipt, etc.) for AI analysis and data extraction.
        </p>

        <h3 className="font-semibold mb-3">Request Parameters</h3>
        <div className="space-y-3 mb-6">
          <div className="border-l-2 border-primary pl-4">
            <p className="font-mono text-sm mb-1">
              file <span className="text-muted-foreground">(required)</span>
            </p>
            <p className="text-sm text-muted-foreground">The document file (PDF, PNG, JPG). Max size: 10MB</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              type <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">Document type hint: w2, 1099, 1040, receipt, bank_statement</p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/documents/upload \
  -H "Authorization: Bearer your_api_key" \
  -F "file=@w2_2024.pdf" \
  -F "type=w2"`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "id": "doc_1234567890",
  "object": "document",
  "created": 1704067200,
  "file_name": "w2_2024.pdf",
  "file_type": "application/pdf",
  "status": "processing",
  "document_type": null,
  "extracted_data": null
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary">GET</Badge>
          <code className="text-lg">/v1/documents/:id</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Retrieve a document and its AI analysis results. Processing typically takes 5-15 seconds.
        </p>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/documents/doc_1234567890 \
  -H "Authorization: Bearer your_api_key"`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response (W-2 Example)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "id": "doc_1234567890",
  "object": "document",
  "created": 1704067200,
  "file_name": "w2_2024.pdf",
  "file_type": "application/pdf",
  "status": "completed",
  "document_type": "w2",
  "ai_confidence": 96,
  "ai_description": "W-2 Wage and Tax Statement from Acme Corp",
  "extracted_data": {
    "employer_name": "Acme Corporation",
    "employer_ein": "12-3456789",
    "employee_name": "John Smith",
    "employee_ssn": "XXX-XX-1234",
    "tax_year": 2024,
    "wages": 75000.00,
    "federal_tax_withheld": 12500.00,
    "social_security_wages": 75000.00,
    "social_security_tax_withheld": 4650.00,
    "medicare_wages": 75000.00,
    "medicare_tax_withheld": 1087.50,
    "state_wages": 75000.00,
    "state_tax_withheld": 3750.00,
    "state": "CA"
  },
  "key_findings": [
    "Total wages: $75,000",
    "Federal tax withheld: $12,500",
    "Employer: Acme Corporation"
  ]
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="destructive">DELETE</Badge>
          <code className="text-lg">/v1/documents/:id</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Delete a document and all associated data. This action cannot be undone.
        </p>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl -X DELETE https://api.taxu.io/v1/documents/doc_1234567890 \
  -H "Authorization: Bearer your_api_key"`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`{
  "id": "doc_1234567890",
  "object": "document",
  "deleted": true
}`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Supported Document Types</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">W-2 Forms</h3>
            <p className="text-sm text-muted-foreground mb-2">Wage and Tax Statement</p>
            <p className="text-xs text-muted-foreground">
              Extracts: employer info, wages, federal/state/SS/Medicare withholding
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">1099 Forms</h3>
            <p className="text-sm text-muted-foreground mb-2">All 1099 variants (MISC, NEC, INT, DIV, etc.)</p>
            <p className="text-xs text-muted-foreground">
              Extracts: payer info, income amounts, tax withheld, form type
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Form 1040</h3>
            <p className="text-sm text-muted-foreground mb-2">U.S. Individual Income Tax Return</p>
            <p className="text-xs text-muted-foreground">
              Extracts: taxpayer info, AGI, deductions, credits, refund/owed
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Receipts</h3>
            <p className="text-sm text-muted-foreground mb-2">Expense receipts and invoices</p>
            <p className="text-xs text-muted-foreground">Extracts: merchant, date, amount, items, payment method</p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Bank Statements</h3>
            <p className="text-sm text-muted-foreground mb-2">Monthly bank statements</p>
            <p className="text-xs text-muted-foreground">Extracts: account info, transactions, balances, dates</p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-2">Investment Statements</h3>
            <p className="text-sm text-muted-foreground mb-2">Brokerage and investment statements</p>
            <p className="text-xs text-muted-foreground">Extracts: account info, holdings, gains/losses, dividends</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">AI Processing Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Processing Time</h3>
            <p className="text-sm text-muted-foreground">
              Documents are typically processed in 5-15 seconds. Complex multi-page documents may take up to 30 seconds.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Confidence Scores</h3>
            <p className="text-sm text-muted-foreground">
              Each extraction includes a confidence score (0-100). Scores above 85 indicate high accuracy. Lower scores
              may require manual review.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to <code className="bg-background px-1 py-0.5 rounded">document.processed</code> webhook events
              to receive real-time notifications when processing completes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
