export default function RefundsAPIPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Refund Estimator API</h1>
      <p className="text-xl text-muted-foreground mb-8">Calculate estimated tax refunds in real-time</p>

      {/* Overview */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          Get instant tax refund estimates based on income, deductions, and filing status.
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Supports all filing statuses</li>
          <li>• Includes federal and state calculations</li>
          <li>• Accounts for standard and itemized deductions</li>
          <li>• Real-time results in milliseconds</li>
        </ul>
      </div>

      {/* Example */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-4">Example: Calculate Refund</h2>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
          <div className="text-muted-foreground mb-2">// Calculate refund estimate</div>
          <div>
            <span className="text-purple-400">const</span> estimate = <span className="text-purple-400">await</span>{" "}
            taxu.refunds.estimate({"{"}
          </div>
          <div className="pl-4">
            income: <span className="text-yellow-300">75000</span>,
          </div>
          <div className="pl-4">
            filingStatus: <span className="text-yellow-300">'single'</span>,
          </div>
          <div className="pl-4">
            deductions: <span className="text-yellow-300">12000</span>,
          </div>
          <div className="pl-4">
            withheld: <span className="text-yellow-300">8500</span>
          </div>
          <div>{"}"})</div>
          <br />
          <div className="text-muted-foreground">// Response</div>
          <div>{"{"}</div>
          <div className="pl-4">
            refundAmount: <span className="text-yellow-300">2847</span>,
          </div>
          <div className="pl-4">
            taxLiability: <span className="text-yellow-300">5653</span>,
          </div>
          <div className="pl-4">
            effectiveRate: <span className="text-yellow-300">7.54</span>
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  )
}
