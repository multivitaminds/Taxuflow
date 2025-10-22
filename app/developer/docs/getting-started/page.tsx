"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function GettingStartedPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Get started</h1>
        <p className="text-xl text-gray-600 leading-relaxed">Create an account and learn how to build on Taxu.</p>
      </div>

      {/* Create an account */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Create an account</h2>
        <p className="text-gray-600 mb-6">Set up a Taxu account and immediately start building your integration.</p>
        <p className="text-gray-600 mb-6">
          If you're ready to start developing, see our{" "}
          <Link href="/developer/quickstart" className="text-[#635bff] hover:underline font-medium">
            Checkout quickstart
          </Link>
          .
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 text-[#635bff] hover:underline font-bold text-lg">
          Create account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Developer setup */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Developer setup</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Set up your development environment</h3>
            <p className="text-gray-600 mb-4">Get familiar with the Taxu CLI and our core SDKs.</p>
            <Link href="/developer/cli" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Get your API keys</h3>
            <p className="text-gray-600 mb-4">Get your API keys and learn about authentication.</p>
            <Link href="/developer-portal/keys/create" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>

      {/* Start building */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Start building</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Accept a payment</h3>
            <p className="text-gray-600 mb-4">Set up a payment integration for the web or iOS and Android apps.</p>
            <Link href="/developer/docs/api/documents" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Checkout quickstart</h3>
            <p className="text-gray-600 mb-4">Create a Taxu-hosted checkout page.</p>
            <Link href="/developer/sandbox" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Subscriptions quickstart</h3>
            <p className="text-gray-600 mb-4">
              Build a subscriptions integration using Taxu Billing, Checkout, and your test data.
            </p>
            <Link href="/developer/docs/api/accounting" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Build a marketplace or platform</h3>
            <p className="text-gray-600 mb-4">
              Use one of our platform models to accept payments on behalf of your users, or build a marketplace, or
              other business that manages payments for multiple parties.
            </p>
            <Link href="/developer/examples" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Use Taxu without writing code</h3>
            <p className="text-gray-600 mb-4">Accept payments with shareable links or sending an invoice.</p>
            <Link href="/get-started" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Explore all products</h3>
            <p className="text-gray-600 mb-4">Don't see your use case? Browse all of Taxu's products.</p>
            <Link href="/developer" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>

      {/* Quick Start Code Example */}
      <section className="bg-gray-50 -mx-6 px-6 py-12 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Quick start code example</h2>
        <p className="text-gray-600 mb-8">Here's a simple example to process a W-2 document and calculate taxes:</p>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Node.js</h3>
            </div>
            <pre className="bg-[#0d1117] p-6 rounded-lg overflow-x-auto text-sm border border-gray-800">
              <code className="text-white font-mono">{String.raw`// Install: npm install @taxu/sdk

const Taxu = require('@taxu/sdk');
const taxu = new Taxu('your_api_key');

// Upload and process a W-2 document
const uploadedFile = await taxu.documents.upload({
  file: fs.createReadStream('w2.pdf'),
  type: 'w2'
});

// Get AI analysis results
const analysis = await taxu.documents.retrieve(uploadedFile.id);
console.log('Employer:', analysis.extracted_data.employer_name);
console.log('Wages:', analysis.extracted_data.wages);

// Calculate tax refund
const calculation = await taxu.tax.calculate({
  income: analysis.extracted_data.wages,
  withheld: analysis.extracted_data.federal_tax_withheld
});

console.log('Estimated Refund:', calculation.estimated_refund);`}</code>
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Python</h3>
            </div>
            <pre className="bg-[#0d1117] p-6 rounded-lg overflow-x-auto text-sm border border-gray-800">
              <code className="text-white font-mono">{String.raw`# Install: pip install taxu

import taxu
taxu.api_key = 'your_api_key'

# Upload and process a W-2 document
with open('w2.pdf', 'rb') as file:
    uploaded = taxu.Document.upload(file=file, type='w2')

# Get AI analysis results
analysis = taxu.Document.retrieve(uploaded.id)
print(f'Employer: {analysis.extracted_data.employer_name}')
print(f'Wages: {analysis.extracted_data.wages}')

# Calculate tax refund
calculation = taxu.Tax.calculate(
    income=analysis.extracted_data.wages,
    withheld=analysis.extracted_data.federal_tax_withheld
)

print(f'Estimated Refund: {calculation.estimated_refund}')`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Authentication</h2>
        <p className="text-gray-600 mb-6">
          All API requests require authentication using your API key in the Authorization header:
        </p>
        <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-sm mb-4 border border-gray-800">
          <code className="text-white font-mono">Authorization: Bearer your_api_key_here</code>
        </pre>
        <p className="text-sm text-gray-600">
          Keep your API keys secure and never share them publicly. Use environment variables in production.
        </p>
      </section>

      {/* More resources */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">More resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Browse sample projects</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Use one of our sample projects to get started integrating Taxu.
            </p>
            <Link href="/developer/examples" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Test your integration</h3>
            <p className="text-gray-600 mb-4 text-sm">Test your integration before you go live with Taxu.</p>
            <Link href="/developer/sandbox" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Build on Taxu with LLMs</h3>
            <p className="text-gray-600 mb-4 text-sm">Use LLMs in your Taxu integration workflow.</p>
            <Link href="/developer/docs/api/ai-agents" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
