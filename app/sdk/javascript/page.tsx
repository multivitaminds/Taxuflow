import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Terminal, CheckCircle2, Github, Download, Star } from "lucide-react"
import Link from "next/link"

export default function JavaScriptSDKPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent p-8 text-center glow-neon">
            <div className="flex items-center justify-center gap-4 mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">Production Ready</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">JavaScript SDK Now Available</h2>
            <p className="text-muted-foreground mb-6">
              Install from npm and start building tax intelligence into your apps today. 23 tests passing, 60.6%
              coverage.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://github.com/multivitaminds/taxu-js" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </Button>
              </Link>
              <Link href="https://www.npmjs.com/package/@taxu/taxu-js" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="glow-neon-strong">
                  <Download className="mr-2 h-5 w-5" />
                  Install from npm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
              JavaScript / TypeScript SDK
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Build with <span className="text-glow">Node.js</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Official JavaScript/TypeScript SDK for integrating Taxu into your Node.js, React, Next.js, or any
              JavaScript application.
            </p>
          </div>

          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Installation</h2>
            <div className="rounded-xl border border-accent/20 bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="w-4 h-4" />
                  <span>npm</span>
                </div>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="font-mono text-accent">
                <code>npm install @taxu/taxu-js</code>
              </pre>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-600 dark:text-green-400">
                <strong>Latest version:</strong> v1.0.0 |{" "}
                <Link href="/sdk/changelog" className="underline">
                  View changelog
                </Link>
              </p>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <pre className="font-mono text-sm text-accent overflow-x-auto">
                <code>{`import { TaxuClient } from '@taxu/taxu-js';

const taxu = new TaxuClient({
  apiKey: process.env.TAXU_API_KEY,
  environment: 'production' // or 'sandbox'
});

// Estimate refund
const estimate = await taxu.refunds.estimate({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});

console.log(\`Estimated refund: $\${estimate.amount}\`);`}</code>
              </pre>
            </div>
          </section>

          {/* Core Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Core Features</h2>
            <div className="space-y-6">
              {/* Returns */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Tax Returns</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`// Create a new tax return
const taxReturn = await taxu.returns.create({
  userId: 'user_123',
  taxYear: 2024,
  filingStatus: 'married_jointly'
});

// Add income
await taxu.returns.addIncome(taxReturn.id, {
  type: 'W2',
  employer: 'Acme Corp',
  amount: 85000
});

// File the return
const filed = await taxu.returns.file(taxReturn.id);`}</code>
                </pre>
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Document Upload</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`// Upload and parse documents
const document = await taxu.documents.upload({
  file: fs.createReadStream('./w2.pdf'),
  type: 'W2',
  returnId: 'ret_abc123'
});

// Get parsed data
console.log(document.parsed);
// { employer: 'Acme Corp', wages: 85000, ... }`}</code>
                </pre>
              </div>

              {/* Webhooks */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Webhooks</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`// Verify webhook signature
app.post('/webhooks/taxu', (req, res) => {
  const signature = req.headers['taxu-signature'];
  
  const event = taxu.webhooks.verify(
    req.body,
    signature
  );
  
  switch (event.type) {
    case 'return.filed':
      console.log('Return filed:', event.data);
      break;
    case 'refund.issued':
      console.log('Refund issued:', event.data);
      break;
  }
  
  res.json({ received: true });
});`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* TypeScript Support */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">TypeScript Support</h2>
            <div className="rounded-xl border border-accent/30 bg-card p-6 glow-neon">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Fully Typed</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The SDK includes complete TypeScript definitions with IntelliSense support for all methods,
                    parameters, and return types.
                  </p>
                </div>
              </div>
              <pre className="font-mono text-sm text-accent overflow-x-auto">
                <code>{`import { TaxuClient, TaxReturn, FilingStatus } from '@taxu/taxu-js';

const taxu = new TaxuClient({ apiKey: process.env.TAXU_API_KEY });

const status: FilingStatus = 'single';
const taxReturn: TaxReturn = await taxu.returns.create({
  userId: 'user_123',
  taxYear: 2024,
  filingStatus: status
});`}</code>
              </pre>
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                <h3 className="text-xl font-bold mb-2">API Reference</h3>
                <p className="text-muted-foreground mb-4">Complete documentation of all SDK methods</p>
                <Link href="/api-docs">
                  <Button variant="outline" className="bg-transparent">
                    View Docs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                <h3 className="text-xl font-bold mb-2">GitHub Repository</h3>
                <p className="text-muted-foreground mb-4">Source code, issues, and contributions</p>
                <Link href="https://github.com/multivitaminds/taxu-js" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="bg-transparent">
                    <Github className="mr-2 w-4 h-4" />
                    View on GitHub
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                <h3 className="text-xl font-bold mb-2">Example Apps</h3>
                <p className="text-muted-foreground mb-4">Full working examples and templates</p>
                <Link
                  href="https://github.com/multivitaminds/taxu-js/tree/main/examples"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Browse Examples
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
