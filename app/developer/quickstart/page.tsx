import { Code2, Key, Zap } from "lucide-react"
import Link from "next/link"

export default function QuickStartPage() {
  return (
    <div className="max-w-4xl pt-24 px-24">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Quick Start Guide</h1>
      <p className="text-xl text-muted-foreground mb-8">Get up and running with the Taxu API in minutes</p>

      {/* Step 1 */}
      <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 mb-6 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            1
          </div>
          <h2 className="text-2xl font-bold text-foreground">Get Your API Key</h2>
        </div>
        <p className="text-foreground/80 mb-4 text-base">
          Sign up for a free account and generate your API key from the developer portal.
        </p>
        <Link
          href="/developer-portal"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          <Key className="w-5 h-5" />
          Get API Key
        </Link>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-chart-2/5 p-8 mb-6 hover:border-accent/40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            2
          </div>
          <h2 className="text-2xl font-bold text-foreground">Use the REST API</h2>
        </div>
        <p className="text-foreground/80 mb-4 text-base">
          Make API requests using your favorite HTTP library. SDKs coming soon!
        </p>
        <div className="rounded-lg bg-gradient-to-br from-[#1e1e2e] to-[#2a2a3e] border-2 border-accent/30 p-5 font-mono text-sm shadow-lg">
          <div className="text-emerald-400 mb-2 font-semibold"># Node.js (using fetch)</div>
          <div className="text-cyan-300">npm install node-fetch</div>
          <div className="text-emerald-400 mt-4 mb-2 font-semibold"># Python (using requests)</div>
          <div className="text-cyan-300">pip install requests</div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="rounded-2xl border-2 border-chart-5/20 bg-gradient-to-br from-chart-5/5 to-chart-4/5 p-8 mb-6 hover:border-chart-5/40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chart-5 to-chart-4 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            3
          </div>
          <h2 className="text-2xl font-bold text-foreground">Make Your First Request</h2>
        </div>
        <p className="text-foreground/80 mb-4 text-base">Create a tax return estimate with just a few lines of code.</p>
        <div className="rounded-lg bg-gradient-to-br from-[#1e1e2e] to-[#2a2a3e] border-2 border-chart-5/30 p-5 font-mono text-sm shadow-lg overflow-x-auto">
          <div className="text-purple-400 inline font-semibold">const</div>{" "}
          <span className="text-cyan-300">response</span> = <span className="text-purple-400 font-semibold">await</span>{" "}
          <span className="text-blue-400">fetch</span>(
          <span className="text-amber-300">'https://api.taxu.io/v1/refunds/estimate'</span>, {"{"}
          <br />
          <div className="pl-4">
            <span className="text-emerald-400">method</span>: <span className="text-amber-300">'POST'</span>,
          </div>
          <div className="pl-4">
            <span className="text-emerald-400">headers</span>: {"{"}
          </div>
          <div className="pl-8">
            <span className="text-amber-300">'Authorization'</span>:{" "}
            <span className="text-amber-300">'Bearer your_api_key'</span>,
          </div>
          <div className="pl-8">
            <span className="text-amber-300">'Content-Type'</span>:{" "}
            <span className="text-amber-300">'application/json'</span>
          </div>
          <div className="pl-4">{"}"},</div>
          <div className="pl-4">
            <span className="text-emerald-400">body</span>: <span className="text-blue-400">JSON</span>.
            <span className="text-cyan-300">stringify</span>({"{"}
          </div>
          <div className="pl-8">
            <span className="text-emerald-400">income</span>: <span className="text-orange-400">75000</span>,
          </div>
          <div className="pl-8">
            <span className="text-emerald-400">filingStatus</span>: <span className="text-amber-300">'single'</span>,
          </div>
          <div className="pl-8">
            <span className="text-emerald-400">deductions</span>: <span className="text-orange-400">12000</span>
          </div>
          <div className="pl-4">{"}"})</div>
          {"}"})
          <br />
          <br />
          <span className="text-purple-400 font-semibold">const</span> <span className="text-cyan-300">estimate</span> ={" "}
          <span className="text-purple-400 font-semibold">await</span> <span className="text-cyan-300">response</span>.
          <span className="text-blue-400">json</span>()
          <br />
          <span className="text-cyan-300">console</span>.<span className="text-blue-400">log</span>(
          <span className="text-cyan-300">estimate</span>.<span className="text-emerald-400">refundAmount</span>)
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Next Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/developer/api/tax-filing"
            className="p-6 rounded-xl border-2 border-primary/20 bg-card/80 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <Code2 className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2 text-foreground">Explore the API</h3>
            <p className="text-sm text-foreground/70">Browse all available endpoints</p>
          </Link>
          <Link
            href="/developer/sandbox"
            className="p-6 rounded-xl border-2 border-accent/20 bg-card/80 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 shadow-md hover:shadow-lg group"
          >
            <Zap className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2 text-foreground">Test in Sandbox</h3>
            <p className="text-sm text-foreground/70">Try the API with test data</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
