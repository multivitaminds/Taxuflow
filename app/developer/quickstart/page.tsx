import { Code2, Key, Zap } from 'lucide-react'
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
          <h2 className="text-2xl font-bold">Use the REST API</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Make API requests using your favorite HTTP library. SDKs coming soon!
        </p>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm mb-4">
          <div className="text-muted-foreground mb-2"># Node.js (using fetch)</div>
          <div>npm install node-fetch</div>
          <div className="text-muted-foreground mt-4 mb-2"># Python (using requests)</div>
          <div>pip install requests</div>
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
          <div className="text-purple-400">const</div> response = <div className="text-purple-400 inline">await</div>{" "}
          <div className="text-purple-400 inline">fetch</div>(
          <div className="text-yellow-300 inline">'https://api.taxu.io/v1/refunds/estimate'</div>, {"{"}
          <br />
          <div className="pl-4">
            method: <div className="text-yellow-300 inline">'POST'</div>,
          </div>
          <div className="pl-4">headers: {"{"}</div>
          <div className="pl-8">
            <div className="text-yellow-300 inline">'Authorization'</div>:{" "}
            <div className="text-yellow-300 inline">'Bearer your_api_key'</div>,
          </div>
          <div className="pl-8">
            <div className="text-yellow-300 inline">'Content-Type'</div>:{" "}
            <div className="text-yellow-300 inline">'application/json'</div>
          </div>
          <div className="pl-4">{"}"},</div>
          <div className="pl-4">body: JSON.stringify({"{"}</div>
          <div className="pl-8">income: 75000,</div>
          <div className="pl-8">
            filingStatus: <div className="text-yellow-300 inline">'single'</div>,
          </div>
          <div className="pl-8">deductions: 12000</div>
          <div className="pl-4">{"}"})</div>
          {"}"})
          <br />
          <br />
          <div className="text-purple-400">const</div> estimate = <div className="text-purple-400 inline">await</div>{" "}
          response.json()
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
