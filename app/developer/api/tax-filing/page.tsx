export default function TaxFilingAPIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/v1/returns",
      description: "Create a new tax return",
    },
    {
      method: "GET",
      path: "/v1/returns/:id",
      description: "Retrieve a tax return",
    },
    {
      method: "PUT",
      path: "/v1/returns/:id",
      description: "Update a tax return",
    },
    {
      method: "POST",
      path: "/v1/returns/:id/file",
      description: "File a tax return with the IRS",
    },
  ]

  return (
    <div className="max-w-4xl ml-24 mt-24">
      <h1 className="text-4xl font-bold mb-4">Tax Filing API</h1>
      <p className="text-xl text-muted-foreground mb-8">Create, manage, and file tax returns programmatically</p>

      {/* Endpoints */}
      <div className="space-y-4 mb-8">
        {endpoints.map((endpoint) => (
          <div key={endpoint.path} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-lg font-mono text-sm font-semibold ${
                  endpoint.method === "POST"
                    ? "bg-green-500/10 text-green-500"
                    : endpoint.method === "GET"
                      ? "bg-blue-500/10 text-blue-500"
                      : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {endpoint.method}
              </span>
              <code className="font-mono text-sm">{endpoint.path}</code>
            </div>
            <p className="text-muted-foreground">{endpoint.description}</p>
          </div>
        ))}
      </div>

      {/* Example Request */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-4">Example: Create Tax Return</h2>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
          <div className="text-muted-foreground mb-2">// Node.js Example</div>
          <div>
            <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span>{" "}
            taxu.returns.create({"{"}
          </div>
          <div className="pl-4">
            year: <span className="text-yellow-300">2024</span>,
          </div>
          <div className="pl-4">
            filingStatus: <span className="text-yellow-300">'single'</span>,
          </div>
          <div className="pl-4">taxpayer: {"{"}</div>
          <div className="pl-8">
            name: <span className="text-yellow-300">'John Doe'</span>,
          </div>
          <div className="pl-8">
            ssn: <span className="text-yellow-300">'123-45-6789'</span>,
          </div>
          <div className="pl-8">
            address: <span className="text-yellow-300">'123 Main St'</span>
          </div>
          <div className="pl-4">{"}"},</div>
          <div className="pl-4">income: {"{"}</div>
          <div className="pl-8">
            wages: <span className="text-yellow-300">75000</span>
          </div>
          <div className="pl-4">{"}"}</div>
          <div>{"}"})</div>
        </div>
      </div>
    </div>
  )
}
