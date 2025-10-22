import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Database, Key, TestTube, ArrowRight, CheckCircle2, Copy } from "lucide-react"
import Link from "next/link"

export default function SandboxPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
              <TestTube className="w-4 h-4" />
              Sandbox Environment
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">Test Without Limits</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Full-featured sandbox environment with realistic test data. Build and test your integration risk-free
              before going live.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Realistic Test Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pre-populated with sample tax returns, W-2s, 1099s, and financial data that mirrors production
                scenarios.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Key className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Separate API Keys</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Use test API keys (sk_test_...) that never touch production data. Switch to live keys when ready.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <TestTube className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Full API Parity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every endpoint, webhook, and feature available in production works identically in sandbox.
              </p>
            </div>
          </div>

          {/* Getting Started */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Getting Started with Sandbox</h2>
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Get Your Test API Key</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up and get instant access to your sandbox API key. No credit card required.
                    </p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-accent">sk_test_4eC39HqLyjWDarjtT1zdp7dc</span>
                        <Button size="sm" variant="ghost">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Use Sandbox Base URL</h3>
                    <p className="text-muted-foreground mb-4">Point your API calls to the sandbox environment:</p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                      <span className="text-accent">https://api-sandbox.taxu.io/v1</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Make Your First Request</h3>
                    <p className="text-muted-foreground mb-4">Test the API with a simple refund estimate:</p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code className="text-accent">{`curl https://api-sandbox.taxu.io/v1/refunds/estimate \\
  -H "Authorization: Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc" \\
  -d income=75000 \\
  -d filing_status=single`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Data */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Available Test Data</h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-alt border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold">Test Scenario</th>
                      <th className="text-left p-4 font-semibold">Test ID</th>
                      <th className="text-left p-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-4">Simple W-2 Return</td>
                      <td className="p-4 font-mono text-sm text-accent">test_w2_simple_001</td>
                      <td className="p-4 text-sm text-muted-foreground">Single filer, one W-2, standard deduction</td>
                    </tr>
                    <tr>
                      <td className="p-4">Multiple Income Sources</td>
                      <td className="p-4 font-mono text-sm text-accent">test_multi_income_001</td>
                      <td className="p-4 text-sm text-muted-foreground">W-2, 1099-INT, 1099-DIV, capital gains</td>
                    </tr>
                    <tr>
                      <td className="p-4">Self-Employed</td>
                      <td className="p-4 font-mono text-sm text-accent">test_self_employed_001</td>
                      <td className="p-4 text-sm text-muted-foreground">Schedule C, home office, vehicle expenses</td>
                    </tr>
                    <tr>
                      <td className="p-4">Rental Property</td>
                      <td className="p-4 font-mono text-sm text-accent">test_rental_001</td>
                      <td className="p-4 text-sm text-muted-foreground">Schedule E, depreciation, rental income</td>
                    </tr>
                    <tr>
                      <td className="p-4">Complex Return</td>
                      <td className="p-4 font-mono text-sm text-accent">test_complex_001</td>
                      <td className="p-4 text-sm text-muted-foreground">Multiple states, AMT, foreign income, K-1s</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Webhook Testing */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Testing Webhooks</h2>
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-muted-foreground mb-4">
                Use the Taxu CLI to forward sandbox webhooks to your local development environment:
              </p>
              <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto mb-4">
                <pre className="text-sm font-mono">
                  <code className="text-accent">{`# Install Taxu CLI
npm install -g @taxu/cli

# Login to your sandbox account
taxu login --sandbox

# Forward webhooks to localhost
taxu webhooks listen --forward-to http://localhost:3000/webhooks`}</code>
                </pre>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  All webhook events in sandbox are signed with your test webhook secret. Verify signatures the same way
                  you would in production.
                </p>
              </div>
            </div>
          </div>

          {/* Going Live */}
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl font-bold mb-4">Ready to Go Live?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Switch to production API keys and start processing real tax returns
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/developer-portal/keys/create">
                <Button size="lg" className="glow-neon-strong">
                  Get Production Keys
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/developer/docs">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
