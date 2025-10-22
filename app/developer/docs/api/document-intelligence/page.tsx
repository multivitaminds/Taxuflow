import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FileSearch, ArrowRight, Code } from "lucide-react"
import Link from "next/link"

export default function DocumentIntelligenceAPIPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/developer" className="hover:text-accent">
              Developer
            </Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/developer/docs" className="hover:text-accent">
              Docs
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground">Document Intelligence API</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileSearch className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">Document Intelligence API</h1>
            </div>
            <p className="text-xl text-muted-foreground">AI-powered OCR and data extraction from tax documents</p>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Document Intelligence API uses advanced AI and OCR technology to automatically extract structured data
              from tax documents including W-2s, 1099s, receipts, and other tax forms. This eliminates manual data entry
              and reduces errors in tax preparation.
            </p>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold mb-3">Supported Documents</h3>
              <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>W-2 (Wage and Tax Statement)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>1099-NEC (Non-Employee Compensation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>1099-INT (Interest Income)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>1099-DIV (Dividends and Distributions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>1098 (Mortgage Interest Statement)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>1098-T (Tuition Statement)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Receipts and Invoices</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Bank Statements</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>

            {/* Upload Document */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-sm font-mono font-bold">
                  POST
                </span>
                <code className="text-sm font-mono">/v1/documents/upload</code>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Upload a document for processing</p>

              <h4 className="font-bold text-sm mb-3">Request (multipart/form-data)</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto mb-4">
                <pre className="text-sm font-mono text-accent">
                  <code>{`file: <binary>
documentType: "w2"
taxYear: 2024`}</code>
                </pre>
              </div>

              <h4 className="font-bold text-sm mb-3">Response</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "id": "doc_abc123xyz",
  "status": "processing",
  "documentType": "w2",
  "taxYear": 2024,
  "uploadedAt": "2024-10-22T10:30:00Z"
}`}</code>
                </pre>
              </div>
            </div>

            {/* Get Document */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-mono font-bold">
                  GET
                </span>
                <code className="text-sm font-mono">/v1/documents/:id</code>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Retrieve document and extracted data</p>

              <h4 className="font-bold text-sm mb-3">Response</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "id": "doc_abc123xyz",
  "status": "completed",
  "documentType": "w2",
  "taxYear": 2024,
  "extractedData": {
    "employerName": "Acme Corporation",
    "employerEIN": "12-3456789",
    "employeeSSN": "***-**-6789",
    "wages": 75000.00,
    "federalTaxWithheld": 12500.00,
    "socialSecurityWages": 75000.00,
    "socialSecurityTaxWithheld": 4650.00,
    "medicareWages": 75000.00,
    "medicareTaxWithheld": 1087.50,
    "stateWages": 75000.00,
    "stateTaxWithheld": 3750.00,
    "state": "CA"
  },
  "confidence": 0.98,
  "processedAt": "2024-10-22T10:30:15Z"
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Code Examples</h2>

            <div className="space-y-6">
              {/* Node.js Example */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-accent" />
                  Node.js
                </h3>
                <div className="rounded-xl bg-background-alt border border-border p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-accent">
                    <code>{`import Taxu from '@taxu/node';
import fs from 'fs';

const taxu = new Taxu('sk_live_abc123xyz');

// Upload document
const document = await taxu.documents.upload({
  file: fs.createReadStream('./w2.pdf'),
  documentType: 'w2',
  taxYear: 2024
});

console.log('Document ID:', document.id);

// Poll for completion
let result;
do {
  await new Promise(resolve => setTimeout(resolve, 2000));
  result = await taxu.documents.retrieve(document.id);
} while (result.status === 'processing');

if (result.status === 'completed') {
  console.log('Employer:', result.extractedData.employerName);
  console.log('Wages:', result.extractedData.wages);
  console.log('Federal Tax Withheld:', result.extractedData.federalTaxWithheld);
}`}</code>
                  </pre>
                </div>
              </div>

              {/* Python Example */}
              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-accent" />
                  Python
                </h3>
                <div className="rounded-xl bg-background-alt border border-border p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-accent">
                    <code>{`import taxu
import time

taxu.api_key = 'sk_live_abc123xyz'

# Upload document
with open('./w2.pdf', 'rb') as file:
    document = taxu.Document.upload(
        file=file,
        document_type='w2',
        tax_year=2024
    )

print(f'Document ID: {document.id}')

# Poll for completion
result = None
while True:
    result = taxu.Document.retrieve(document.id)
    if result.status != 'processing':
        break
    time.sleep(2)

if result.status == 'completed':
    print(f'Employer: {result.extracted_data.employer_name}')
    print(f'Wages: ${result.extracted_data.wages}')
    print(f'Federal Tax Withheld: ${result.extracted_data.federal_tax_withheld}')`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Webhooks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Instead of polling, subscribe to webhook events for document processing updates.
            </p>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold mb-3">Available Events</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    document.uploaded
                  </code>
                  <span className="text-muted-foreground">Document was uploaded</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    document.processing
                  </code>
                  <span className="text-muted-foreground">Document processing started</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    document.completed
                  </code>
                  <span className="text-muted-foreground">Document processing completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    document.failed
                  </code>
                  <span className="text-muted-foreground">Document processing failed</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/developer/docs/api/tax-filing">
                <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                  <h3 className="font-bold mb-2">Tax Filing API</h3>
                  <p className="text-sm text-muted-foreground">Use extracted data to file tax returns</p>
                </div>
              </Link>
              <Link href="/developer/docs/api/accounting">
                <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                  <h3 className="font-bold mb-2">Accounting API</h3>
                  <p className="text-sm text-muted-foreground">Integrate with bookkeeping features</p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
