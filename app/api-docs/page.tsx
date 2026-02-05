"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                    Getting Started
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#authentication" className="text-accent hover:underline">
                        Authentication
                      </a>
                    </li>
                    <li>
                      <a href="#quickstart" className="hover:text-accent transition-colors">
                        Quickstart
                      </a>
                    </li>
                    <li>
                      <a href="#errors" className="hover:text-accent transition-colors">
                        Error Handling
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                    Core Resources
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#filing" className="hover:text-accent transition-colors">
                        Tax Filing
                      </a>
                    </li>
                    <li>
                      <a href="#documents" className="hover:text-accent transition-colors">
                        Documents
                      </a>
                    </li>
                    <li>
                      <a href="#quickbooks" className="hover:text-accent transition-colors">
                        QuickBooks Sync
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                    Advanced
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#webhooks" className="hover:text-accent transition-colors">
                        Webhooks
                      </a>
                    </li>
                    <li>
                      <a href="#rate-limits" className="hover:text-accent transition-colors">
                        Rate Limits
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="space-y-16">
              {/* Header */}
              <div>
                <h1 className="text-5xl font-bold mb-4">API Documentation</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Complete reference for the Taxu REST API. Build tax intelligence into your application with our
                  developer-first platform.
                </p>
              </div>

              {/* Authentication */}
              <section id="authentication">
                <h2 className="text-3xl font-bold mb-4">Authentication</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Authenticate your API requests using your secret API key in the Authorization header.
                </p>
                <CodeBlock
                  language="bash"
                  code={`curl https://api.taxu.ai/v1/returns \\
  -H "Authorization: Bearer sk_live_abc123xyz"`}
                />
                <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm">
                    <strong className="text-accent">Important:</strong> Keep your API keys secure. Never expose them in
                    client-side code or public repositories.
                  </p>
                </div>
              </section>

              {/* Quickstart */}
              <section id="quickstart">
                <h2 className="text-3xl font-bold mb-4">Quickstart</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Get started with a simple refund estimate in under 5 minutes.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">1. Install the SDK</h3>
                    <CodeBlock
                      language="bash"
                      code={`npm install @taxu/taxu-js
# or
pip install taxu-python  # Coming soon`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">2. Make your first request</h3>
                    <CodeBlock
                      language="javascript"
                      code={`import { TaxuClient } from '@taxu/taxu-js';

const taxu = new TaxuClient('sk_live_abc123xyz');

const estimate = await taxu.refunds.estimate({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});

console.log(estimate.refundAmount); // 2,450`}
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm">
                      <strong className="text-accent">New:</strong> JavaScript SDK is now available on npm.{" "}
                      <Link href="/sdk/javascript" className="underline">
                        View documentation
                      </Link>
                    </p>
                  </div>
                </div>
              </section>

              {/* Tax Filing */}
              <section id="filing">
                <h2 className="text-3xl font-bold mb-4">Tax Filing</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Submit tax forms including 1099-NEC, W-2, and Form 941 directly to the IRS via TaxBandits.
                </p>

                <div className="space-y-8">
                  <ApiEndpoint
                    method="POST"
                    path="/api/filing/submit-1099"
                    title="Submit 1099-NEC Form"
                    description="File 1099-NEC forms for contractors"
                    requestExample={`{
  "businessName": "Acme Corp",
  "ein": "12-3456789",
  "recipients": [{
    "name": "John Contractor",
    "ssn": "123-45-6789",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "compensation": 5000.00
  }]
}`}
                    responseExample={`{
  "success": true,
  "submissionId": "sub_abc123",
  "status": "pending",
  "filingId": "filing_xyz789"
}`}
                  />

                  <ApiEndpoint
                    method="POST"
                    path="/api/filing/submit-w2"
                    title="Submit W-2 Form"
                    description="File W-2 forms for employees"
                    requestExample={`{
  "employer": {
    "name": "Acme Corp",
    "ein": "12-3456789",
    "address": "456 Business Ave"
  },
  "employee": {
    "name": "Jane Employee",
    "ssn": "987-65-4321",
    "wages": 75000.00,
    "federalWithheld": 8500.00
  }
}`}
                    responseExample={`{
  "success": true,
  "submissionId": "sub_def456",
  "status": "accepted"
}`}
                  />

                  <ApiEndpoint
                    method="GET"
                    path="/api/filing/status"
                    title="Get Filing Status"
                    description="Check the status of a submitted filing"
                    responseExample={`{
  "filingId": "filing_xyz789",
  "status": "accepted",
  "submittedAt": "2025-01-15T10:30:00Z",
  "acceptedAt": "2025-01-15T10:35:00Z",
  "confirmationNumber": "IRS-2025-ABC123"
}`}
                  />
                </div>
              </section>

              {/* Documents */}
              <section id="documents">
                <h2 className="text-3xl font-bold mb-4">Documents</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Upload and extract data from tax documents using AI-powered OCR.
                </p>

                <div className="space-y-8">
                  <ApiEndpoint
                    method="POST"
                    path="/api/filing/upload-document"
                    title="Upload Document"
                    description="Upload W-2, 1099, or receipt documents"
                    requestExample={`{
  "file": "base64_encoded_file",
  "filename": "w2-2024.pdf",
  "type": "w2"
}`}
                    responseExample={`{
  "success": true,
  "url": "https://blob.vercel-storage.com/...",
  "documentId": "doc_abc123"
}`}
                  />

                  <ApiEndpoint
                    method="POST"
                    path="/api/filing/extract-document"
                    title="Extract Document Data"
                    description="Use AI to extract structured data from uploaded documents"
                    requestExample={`{
  "documentUrl": "https://blob.vercel-storage.com/...",
  "documentType": "w2"
}`}
                    responseExample={`{
  "success": true,
  "extractedData": {
    "employer": "Acme Corp",
    "ein": "12-3456789",
    "employee": "John Doe",
    "ssn": "123-45-6789",
    "wages": 75000.00,
    "federalWithheld": 8500.00
  }
}`}
                  />
                </div>
              </section>

              {/* QuickBooks Sync */}
              <section id="quickbooks">
                <h2 className="text-3xl font-bold mb-4">QuickBooks Integration</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Connect to QuickBooks and sync transaction data for tax categorization.
                </p>

                <div className="space-y-8">
                  <ApiEndpoint
                    method="GET"
                    path="/api/quickbooks/connect"
                    title="Connect QuickBooks"
                    description="Initiate OAuth flow to connect QuickBooks account"
                    responseExample={`{
  "authUrl": "https://appcenter.intuit.com/connect/oauth2?..."
}`}
                  />

                  <ApiEndpoint
                    method="POST"
                    path="/api/quickbooks/sync"
                    title="Sync Transactions"
                    description="Pull transactions from QuickBooks and categorize for taxes"
                    responseExample={`{
  "success": true,
  "transactionCount": 247,
  "categorized": 245,
  "needsReview": 2
}`}
                  />
                </div>
              </section>

              {/* Webhooks */}
              <section id="webhooks">
                <h2 className="text-3xl font-bold mb-4">Webhooks</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Receive real-time notifications when events occur in your Taxu account.
                </p>

                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-3">Setting up webhooks</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Create a webhook endpoint on your server</li>
                      <li>Register the endpoint URL in your Taxu dashboard</li>
                      <li>Verify webhook signatures for security</li>
                      <li>Handle events and respond with 200 OK</li>
                    </ol>
                  </div>

                  <CodeBlock
                    language="javascript"
                    code={`// Example webhook handler
app.post('/webhooks/taxu', (req, res) => {
  const event = req.body;
  
  switch(event.type) {
    case 'return.filed':
      console.log('Return filed:', event.data.returnId);
      break;
    case 'refund.issued':
      console.log('Refund issued:', event.data.amount);
      break;
  }
  
  res.status(200).send('OK');
});`}
                  />
                </div>
              </section>

              {/* Rate Limits */}
              <section id="rate-limits">
                <h2 className="text-3xl font-bold mb-4">Rate Limits</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  API requests are rate limited based on your plan tier.
                </p>

                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-background-alt">
                      <tr>
                        <th className="text-left p-4 font-semibold">Plan</th>
                        <th className="text-left p-4 font-semibold">Rate Limit</th>
                        <th className="text-left p-4 font-semibold">Burst</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-4">Developer</td>
                        <td className="p-4 text-muted-foreground">100 req/min</td>
                        <td className="p-4 text-muted-foreground">200 req/min</td>
                      </tr>
                      <tr>
                        <td className="p-4">Startup</td>
                        <td className="p-4 text-muted-foreground">1,000 req/min</td>
                        <td className="p-4 text-muted-foreground">2,000 req/min</td>
                      </tr>
                      <tr>
                        <td className="p-4">Business</td>
                        <td className="p-4 text-muted-foreground">10,000 req/min</td>
                        <td className="p-4 text-muted-foreground">20,000 req/min</td>
                      </tr>
                      <tr>
                        <td className="p-4">Enterprise</td>
                        <td className="p-4 text-muted-foreground">Custom</td>
                        <td className="p-4 text-muted-foreground">Custom</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-xl bg-background-alt border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-accent">{code}</code>
      </pre>
    </div>
  )
}

function ApiEndpoint({
  method,
  path,
  title,
  description,
  requestExample,
  responseExample,
}: {
  method: string
  path: string
  title: string
  description: string
  requestExample?: string
  responseExample?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
            method === "GET"
              ? "bg-blue-500/10 text-blue-500"
              : method === "POST"
                ? "bg-green-500/10 text-green-500"
                : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {method}
        </span>
        <code className="font-mono text-sm">{path}</code>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      {requestExample && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Request</h4>
          <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-accent">
              <code>{requestExample}</code>
            </pre>
          </div>
        </div>
      )}

      {responseExample && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Response</h4>
          <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-accent">
              <code>{responseExample}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
