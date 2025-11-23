import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Terminal, Download } from "lucide-react"
import Link from "next/link"

export default function CLIPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 gradient-stripe-hero clip-diagonal">
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Header */}
          <div className="mb-12 text-center">
            <Terminal className="w-16 h-16 text-[#00d4ff] mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-white">
              Taxu <span className="text-[#00d4ff]">CLI</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Command-line tool for fast integration, testing, and automation of Taxu API workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="container mx-auto max-w-4xl">
          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-[#0a2540]">Installation</h2>
            <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
              <pre className="font-mono text-[#79c0ff]">
                <code>npm install -g @taxu/cli</code>
              </pre>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-[#0a2540]">Quick Start</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <p className="text-sm text-slate-400 mb-3">1. Login with your API key</p>
                <pre className="font-mono text-sm text-[#79c0ff]">
                  <code>taxu login</code>
                </pre>
              </div>
              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <p className="text-sm text-slate-400 mb-3">2. Test an endpoint</p>
                <pre className="font-mono text-sm text-[#79c0ff]">
                  <code>taxu refund:estimate --income 75000 --status single</code>
                </pre>
              </div>
              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <p className="text-sm text-slate-400 mb-3">3. Create a tax return</p>
                <pre className="font-mono text-sm text-[#79c0ff]">
                  <code>taxu returns:create --user user_123 --year 2024</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Commands */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-[#0a2540]">Available Commands</h2>
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
            <h2 className="text-3xl font-bold mb-6 text-[#0a2540]">Examples</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Estimate Refund</h3>
                <pre className="font-mono text-sm text-[#79c0ff] overflow-x-auto">
                  <code>{`$ taxu refund:estimate \\
  --income 75000 \\
  --status single \\
  --deductions standard

✓ Estimated refund: $3,250.00
  Effective tax rate: 12.5%
  Federal tax: $9,375.00`}</code>
                </pre>
              </div>

              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Upload Document</h3>
                <pre className="font-mono text-sm text-[#79c0ff] overflow-x-auto">
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

              <div className="rounded-lg border border-slate-200 bg-[#0d1117] p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Test Webhooks</h3>
                <pre className="font-mono text-sm text-[#79c0ff] overflow-x-auto">
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
            <div className="rounded-lg border border-[#635bff]/30 bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5 p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-[#0a2540]">Ready to Get Started?</h2>
              <p className="text-xl text-slate-600 mb-8">Install the CLI and start building in minutes</p>
              <Link href="/developer">
                <Button className="rounded-full bg-[#635bff] hover:bg-[#5851df] text-white px-8 py-6 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Install CLI
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
