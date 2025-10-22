import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FileText, ArrowRight, Code } from "lucide-react"
import Link from "next/link"

export default function TaxFilingAPIPage() {
  // const taxu = new Taxu("sk_live_abc123xyz")

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
            <span className="text-foreground">Tax Filing API</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">Tax Filing API</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Complete tax return preparation and e-filing for individuals and businesses
            </p>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Tax Filing API enables you to programmatically prepare, validate, and file tax returns for your users.
              It supports all major tax forms including Individual 1040, Business 1120, Partnership 1065, S-Corp 1120-S,
              Estate/Trust 1041, and Amended Returns 1040-X.
            </p>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold mb-3">Key Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Automated form selection based on taxpayer profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Real-time validation against IRS rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>E-file directly to IRS and state agencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Track filing status and acceptance/rejection</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>Generate PDF copies for taxpayer records</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>

            {/* Create Tax Return */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-sm font-mono font-bold">
                  POST
                </span>
                <code className="text-sm font-mono">/v1/tax-returns</code>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Create a new tax return</p>

              <h4 className="font-bold text-sm mb-3">Request Body</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto mb-4">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "taxYear": 2024,
  "taxType": "individual_1040",
  "filingStatus": "single",
  "taxpayer": {
    "firstName": "John",
    "lastName": "Doe",
    "ssn": "123-45-6789",
    "dateOfBirth": "1990-01-15",
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94102"
    }
  },
  "income": {
    "w2Income": 75000,
    "interestIncome": 250,
    "dividendIncome": 500
  },
  "deductions": {
    "type": "standard"
  }
}`}</code>
                </pre>
              </div>

              <h4 className="font-bold text-sm mb-3">Response</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "id": "txr_abc123xyz",
  "status": "draft",
  "taxYear": 2024,
  "taxType": "individual_1040",
  "estimatedRefund": 2450,
  "createdAt": "2024-10-22T10:30:00Z",
  "updatedAt": "2024-10-22T10:30:00Z"
}`}</code>
                </pre>
              </div>
            </div>

            {/* Get Tax Return */}
            <div className="rounded-xl border border-border bg-card p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-mono font-bold">
                  GET
                </span>
                <code className="text-sm font-mono">/v1/tax-returns/:id</code>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Retrieve a tax return by ID</p>

              <h4 className="font-bold text-sm mb-3">Response</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "id": "txr_abc123xyz",
  "status": "filed",
  "taxYear": 2024,
  "taxType": "individual_1040",
  "filingStatus": "single",
  "estimatedRefund": 2450,
  "filedAt": "2024-10-22T14:30:00Z",
  "irsAcceptanceStatus": "accepted",
  "pdfUrl": "https://api.taxu.io/returns/txr_abc123xyz.pdf"
}`}</code>
                </pre>
              </div>
            </div>

            {/* File Tax Return */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-500 text-sm font-mono font-bold">
                  POST
                </span>
                <code className="text-sm font-mono">/v1/tax-returns/:id/file</code>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Submit tax return to IRS for e-filing</p>

              <h4 className="font-bold text-sm mb-3">Request Body</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto mb-4">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "electronicSignature": true,
  "signatureDate": "2024-10-22",
  "taxpayerPin": "12345"
}`}</code>
                </pre>
              </div>

              <h4 className="font-bold text-sm mb-3">Response</h4>
              <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-accent">
                  <code>{`{
  "id": "txr_abc123xyz",
  "status": "filed",
  "filedAt": "2024-10-22T14:30:00Z",
  "submissionId": "sub_xyz789abc",
  "irsAcceptanceStatus": "pending"
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
                    <code>{`// Create a tax return
const taxReturn = await taxu.taxReturns.create({
  taxYear: 2024,
  taxType: 'individual_1040',
  filingStatus: 'single',
  taxpayer: {
    firstName: 'John',
    lastName: 'Doe',
    ssn: '123-45-6789',
    dateOfBirth: '1990-01-15'
  },
  income: {
    w2Income: 75000
  }
});

console.log('Tax Return ID:', taxReturn.id);
console.log('Estimated Refund:', taxReturn.estimatedRefund);

// File the return
const filed = await taxu.taxReturns.file(taxReturn.id, {
  electronicSignature: true,
  signatureDate: '2024-10-22',
  taxpayerPin: '12345'
});

console.log('Filing Status:', filed.status);`}</code>
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

taxu.api_key = 'sk_live_abc123xyz'

# Create a tax return
tax_return = TaxReturn.create(
    tax_year=2024,
    tax_type='individual_1040',
    filing_status='single',
    taxpayer={
        'first_name': 'John',
        'last_name': 'Doe',
        'ssn': '123-45-6789',
        'date_of_birth': '1990-01-15'
    },
    income={
        'w2_income': 75000
    }
)

print(f'Tax Return ID: {tax_return.id}')
print(f'Estimated Refund: ${tax_return.estimated_refund}')

# File the return
filed = TaxReturn.file(
    tax_return.id,
    electronic_signature=True,
    signature_date='2024-10-22',
    taxpayer_pin='12345'
)

print(f'Filing Status: {filed.status}')`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Webhooks */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Subscribe to webhook events to receive real-time notifications about tax return status changes.
            </p>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-bold mb-3">Available Events</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    tax_return.created
                  </code>
                  <span className="text-muted-foreground">Tax return was created</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    tax_return.filed
                  </code>
                  <span className="text-muted-foreground">Tax return was submitted to IRS</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    tax_return.accepted
                  </code>
                  <span className="text-muted-foreground">IRS accepted the tax return</span>
                </li>
                <li className="flex items-start gap-2">
                  <code className="px-2 py-1 rounded bg-background-alt border border-border text-accent">
                    tax_return.rejected
                  </code>
                  <span className="text-muted-foreground">IRS rejected the tax return</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/developer/docs/api/refund-estimation">
                <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                  <h3 className="font-bold mb-2">Refund Estimation API</h3>
                  <p className="text-sm text-muted-foreground">Calculate refund estimates before filing</p>
                </div>
              </Link>
              <Link href="/developer/docs/api/document-intelligence">
                <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                  <h3 className="font-bold mb-2">Document Intelligence API</h3>
                  <p className="text-sm text-muted-foreground">Extract data from W-2s and tax forms</p>
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
