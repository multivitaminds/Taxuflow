import { Code2, Key, Zap } from "lucide-react"
import Link from "next/link"

export default function QuickStartPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
      <p className="text-xl text-muted-foreground mb-8">Get up and running with the Taxu API in minutes</p>

      {/* Step 1 */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-2xl font-bold">Get Your API Key</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Sign up for a free account and generate your API key from the developer portal.
        </p>
        <Link
          href="/developer-portal"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Key className="w-4 h-4" />
          Get API Key
        </Link>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-2xl font-bold">Install the SDK</h2>
        </div>
        <p className="text-muted-foreground mb-4">Install the Taxu SDK for your preferred language.</p>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm mb-4">
          <div className="text-muted-foreground mb-2"># Node.js</div>
          <div>npm install @taxu/sdk</div>
          <div className="text-muted-foreground mt-4 mb-2"># Python</div>
          <div>pip install taxu</div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-2xl font-bold">Make Your First Request</h2>
        </div>
        <p className="text-muted-foreground mb-4">Create a tax return estimate with just a few lines of code.</p>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm">
          <div className="text-purple-400">const</div> Taxu = <div className="text-purple-400 inline">require</div>(
          <div className="text-yellow-300 inline">'@taxu/sdk'</div>)
          <br />
          <div className="text-purple-400">const</div> taxu = <div className="text-purple-400 inline">new</div> Taxu(
          <div className="text-yellow-300 inline">'your_api_key'</div>)
          <br />
          <br />
          <div className="text-purple-400">const</div> estimate = <div className="text-purple-400 inline">await</div>{" "}
          taxu.refunds.estimate({"{"}
          <br />
          <div className="pl-4">income: 75000,</div>
          <div className="pl-4">
            filingStatus: <div className="text-yellow-300 inline">'single'</div>,
          </div>
          <div className="pl-4">deductions: 12000</div>
          {"}"})
          <br />
          <br />
          console.log(estimate.refundAmount)
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-2xl border border-accent/30 bg-card p-8 glow-neon">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/developer/api/tax-filing"
            className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
          >
            <Code2 className="w-6 h-6 text-accent mb-2" />
            <h3 className="font-semibold mb-1">Explore the API</h3>
            <p className="text-sm text-muted-foreground">Browse all available endpoints</p>
          </Link>
          <Link
            href="/developer/sandbox"
            className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
          >
            <Zap className="w-6 h-6 text-accent mb-2" />
            <h3 className="font-semibold mb-1">Test in Sandbox</h3>
            <p className="text-sm text-muted-foreground">Try the API with test data</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
