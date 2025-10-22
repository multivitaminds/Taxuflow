export default function DocumentsAPIPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Document Intelligence API</h1>
      <p className="text-xl text-muted-foreground mb-8">Upload and extract data from tax documents using AI</p>

      {/* Overview */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Document Intelligence API automatically extracts structured data from tax documents like W-2s, 1099s, and
          receipts.
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Supports PDF, PNG, JPG formats</li>
          <li>• Extracts employer info, income, deductions</li>
          <li>• 99.9% accuracy on standard forms</li>
          <li>• Results in under 2 seconds</li>
        </ul>
      </div>

      {/* Example */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-4">Example: Upload Document</h2>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-x-auto">
          <div className="text-muted-foreground mb-2">// Upload a W-2 form</div>
          <div>
            <span className="text-purple-400">const</span> upload = <span className="text-purple-400">await</span>{" "}
            taxu.documents.upload({"{"}
          </div>
          <div className="pl-4">
            file: fs.readFileSync(<span className="text-yellow-300">'w2.pdf'</span>),
          </div>
          <div className="pl-4">
            type: <span className="text-yellow-300">'w2'</span>
          </div>
          <div>{"}"})</div>
          <br />
          <div className="text-muted-foreground">// Wait for processing</div>
          <div>
            <span className="text-purple-400">const</span> processed = <span className="text-purple-400">await</span>{" "}
            taxu.documents.retrieve(upload.id)
          </div>
          <br />
          <div className="text-muted-foreground">// Access extracted data</div>
          <div>console.log(processed.data.employerName)</div>
          <div>console.log(processed.data.wages)</div>
        </div>
      </div>
    </div>
  )
}
