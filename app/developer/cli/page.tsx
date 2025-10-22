import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Terminal, Download, Code, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function CLIPage() {
  const commands = [
    {
      command: "taxu login",
      description: "Authenticate with your Taxu account",
      example: "taxu login --sandbox",
    },
    {
      command: "taxu refunds estimate",
      description: "Calculate refund estimates from the command line",
      example: "taxu refunds estimate --income 75000 --filing-status single",
    },
    {
      command: "taxu documents upload",
      description: "Upload tax documents for processing",
      example: "taxu documents upload ./w2-2024.pdf --type w2",
    },
    {
      command: "taxu returns file",
      description: "E-file a tax return",
      example: "taxu returns file --return-id tr_123456 --confirm",
    },
    {
      command: "taxu webhooks listen",
      description: "Forward webhooks to your local development server",
      example: "taxu webhooks listen --forward-to http://localhost:3000/webhooks",
    },
    {
      command: "taxu logs tail",
      description: "Stream real-time API request logs",
      example: "taxu logs tail --filter status=error",
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
              <Terminal className="w-4 h-4" />
              Taxu CLI
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">Build, Test, and Deploy from Your Terminal</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The Taxu CLI brings the power of our tax platform to your command line. Test integrations, manage API
              keys, and debug webhooks without leaving your terminal.
            </p>
          </div>

          {/* Installation */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Installation</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">npm</h3>
                </div>
                <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                  <code className="text-accent">npm install -g @taxu/cli</code>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">Homebrew</h3>
                </div>
                <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                  <code className="text-accent">brew install taxu/tap/taxu-cli</code>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">Direct Download</h3>
                </div>
                <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                  <code className="text-accent">curl -L taxu.io/cli | sh</code>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Quick Start</h2>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2">1. Login to your Taxu account:</p>
                  <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                    <code className="text-accent">$ taxu login</code>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2">2. Test the connection:</p>
                  <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                    <code className="text-accent">$ taxu whoami</code>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2">3. Calculate a refund estimate:</p>
                  <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                    <code className="text-accent">
                      $ taxu refunds estimate --income 75000 --filing-status single
                      <br />
                      <span className="text-green-500">✓ Estimated refund: $2,450</span>
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commands */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Available Commands</h2>
            <div className="space-y-4">
              {commands.map((cmd, index) => (
                <div key={index} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Terminal className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 font-mono text-accent">{cmd.command}</h3>
                      <p className="text-muted-foreground mb-4">{cmd.description}</p>
                      <div className="rounded-xl bg-background-alt border border-border p-4 font-mono text-sm">
                        <code className="text-accent">$ {cmd.example}</code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Local Webhook Testing</h3>
                    <p className="text-sm text-muted-foreground">
                      Forward webhook events to your local development server for easy testing and debugging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Real-Time Logs</h3>
                    <p className="text-sm text-muted-foreground">
                      Stream API request logs in real-time to debug issues and monitor your integration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Sandbox Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Easily switch between sandbox and production environments with the --sandbox flag.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Interactive Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Use interactive prompts for complex operations with helpful guidance and validation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl font-bold mb-4">Get Started with the CLI</h2>
            <p className="text-xl text-muted-foreground mb-8">Install now and start building faster</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/developer/docs">
                <Button size="lg" className="glow-neon-strong">
                  View Full Documentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/taxu/cli">
                <Button size="lg" variant="outline" className="bg-transparent">
                  <Code className="mr-2 h-5 w-5" />
                  View on GitHub
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
