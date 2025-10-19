import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Terminal, Download } from "lucide-react"

export default function CLIPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Terminal className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Taxu <span className="text-glow">CLI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Command-line tool for fast integration, testing, and automation of Taxu API workflows.
            </p>
          </div>

          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Installation</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <pre className="font-mono text-accent">
                <code>npm install -g @taxu/cli</code>
              </pre>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-3">1. Login with your API key</p>
                <pre className="font-mono text-sm text-accent">
                  <code>taxu login</code>
                </pre>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-3">2. Test an endpoint</p>
                <pre className="font-mono text-sm text-accent">
                  <code>taxu refund:estimate --income 75000 --status single</code>
                </pre>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-3">3. Create a tax return</p>
                <pre className="font-mono text-sm text-accent">
                  <code>taxu returns:create --user user_123 --year 2024</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Commands */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Available Commands</h2>
            <div className="space-y-3">
              {[
                { cmd: "taxu login", desc: "Authenticate with your API key" },
                { cmd: "taxu refund:estimate", desc: "Calculate refund estimate" },
                { cmd: "taxu returns:create", desc: "Create a new tax return" },
                { cmd: "taxu returns:list", desc: "List all tax returns" },
                { cmd: "taxu returns:file", desc: "File a tax return" },
                { cmd: "taxu documents:upload", desc: "Upload and parse documents" },
                { cmd: "taxu webhooks:test", desc: "Test webhook endpoints" },
                { cmd: "taxu logs", desc: "View API request logs" },
              ].map((command, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
                >
                  <code className="font-mono text-sm text-accent flex-1">{command.cmd}</code>
                  <span className="text-sm text-muted-foreground">{command.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Examples</h2>
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Estimate Refund</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`$ taxu refund:estimate \\
  --income 75000 \\
  --status single \\
  --deductions standard

✓ Estimated refund: $3,250.00
  Effective tax rate: 12.5%
  Federal tax: $9,375.00`}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Upload Document</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`$ taxu documents:upload \\
  --file ./w2.pdf \\
  --type W2 \\
  --return ret_abc123

✓ Document uploaded successfully
  Document ID: doc_xyz789
  Parsed data: 
    Employer: Acme Corp
    Wages: $85,000.00`}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Test Webhooks</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`$ taxu webhooks:test \\
  --event return.filed \\
  --url https://myapp.com/webhooks

✓ Webhook delivered successfully
  Status: 200 OK
  Response time: 145ms`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Download */}
          <section>
            <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground mb-8">Install the CLI and start building in minutes</p>
              <Button size="lg" className="glow-neon-strong">
                <Download className="w-5 h-5 mr-2" />
                Install CLI
              </Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
