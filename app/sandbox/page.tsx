import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Play, RefreshCw, Copy, CheckCircle2 } from "lucide-react"

export default function SandboxPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
              Sandbox Environment
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Test Before You <span className="text-glow">Launch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Full-featured test environment with sample data. No real tax filings, no charges, just pure development.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Realistic Data</h3>
              <p className="text-muted-foreground text-sm">Sample W2s, 1099s, and tax scenarios</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reset Anytime</h3>
              <p className="text-muted-foreground text-sm">Clear data and start fresh instantly</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Full API Access</h3>
              <p className="text-muted-foreground text-sm">All endpoints work exactly like production</p>
            </div>
          </div>

          {/* Interactive Sandbox */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Request Panel */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="text-2xl font-bold mb-6">Try It Now</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Endpoint</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground">
                    <option>POST /api/v1/refund-estimate</option>
                    <option>POST /api/v1/returns</option>
                    <option>GET /api/v1/returns/:id</option>
                    <option>POST /api/v1/documents/upload</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Request Body</label>
                  <div className="rounded-lg border border-border bg-background-alt p-4">
                    <pre className="font-mono text-sm text-accent overflow-x-auto">
                      <code>{`{
  "income": 75000,
  "filingStatus": "single",
  "deductions": ["standard"]
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <Button className="w-full glow-neon-strong">
                <Play className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>

            {/* Response Panel */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Response</h2>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="rounded-lg border border-border bg-background-alt p-4 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-mono font-semibold">
                    200 OK
                  </span>
                  <span className="text-xs text-muted-foreground">45ms</span>
                </div>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`{
  "estimatedRefund": 3250.00,
  "effectiveTaxRate": 12.5,
  "federalTax": 9375.00,
  "stateTax": 2375.00,
  "deductions": {
    "standard": 13850
  },
  "confidence": 0.95
}`}</code>
                </pre>
              </div>

              <p className="text-sm text-muted-foreground">
                This is sample data from the sandbox environment. No real tax calculations are performed.
              </p>
            </div>
          </div>

          {/* Test Data */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Sample Test Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Test Users</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">user_test_single_w2</code>
                    <p className="text-xs text-muted-foreground mt-1">Single filer with W2 income</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">user_test_married_1099</code>
                    <p className="text-xs text-muted-foreground mt-1">Married filer with 1099 income</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">user_test_business_owner</code>
                    <p className="text-xs text-muted-foreground mt-1">Self-employed with Schedule C</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Test Documents</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">sample_w2.pdf</code>
                    <p className="text-xs text-muted-foreground mt-1">Standard W2 form with typical values</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">sample_1099_misc.pdf</code>
                    <p className="text-xs text-muted-foreground mt-1">1099-MISC for contractor income</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background-alt border border-border">
                    <code className="text-sm font-mono text-accent">sample_receipts.pdf</code>
                    <p className="text-xs text-muted-foreground mt-1">Business expense receipts</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
