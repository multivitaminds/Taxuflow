import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Terminal } from "lucide-react"
import Link from "next/link"

export default function PythonSDKPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-6">
              Python SDK
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Build with <span className="text-glow">Python</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Official Python SDK for integrating Taxu into your Django, Flask, FastAPI, or any Python application.
            </p>
          </div>

          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Installation</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="w-4 h-4" />
                  <span>pip</span>
                </div>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="font-mono text-accent">
                <code>pip install taxu</code>
              </pre>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
            <div className="rounded-xl border border-border bg-card p-6">
              <pre className="font-mono text-sm text-accent overflow-x-auto">
                <code>{`import taxu

# Initialize client
client = taxu.Client(
    api_key="your_api_key",
    environment="production"  # or "sandbox"
)

# Estimate refund
estimate = client.refunds.estimate(
    income=75000,
    filing_status="single",
    deductions=["standard"]
)

print(f"Estimated refund: ${estimate.amount}")`}</code>
              </pre>
            </div>
          </section>

          {/* Core Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Core Features</h2>
            <div className="space-y-6">
              {/* Returns */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Tax Returns</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`# Create a new tax return
tax_return = client.returns.create(
    user_id="user_123",
    tax_year=2024,
    filing_status="married_jointly"
)

# Add income
client.returns.add_income(
    tax_return.id,
    type="W2",
    employer="Acme Corp",
    amount=85000
)

# File the return
filed = client.returns.file(tax_return.id)`}</code>
                </pre>
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Document Upload</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`# Upload and parse documents
with open("w2.pdf", "rb") as file:
    document = client.documents.upload(
        file=file,
        type="W2",
        return_id="ret_abc123"
    )

# Get parsed data
print(document.parsed)
# {'employer': 'Acme Corp', 'wages': 85000, ...}`}</code>
                </pre>
              </div>

              {/* Async Support */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Async/Await Support</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{`import asyncio
from taxu import AsyncClient

async def main():
    client = AsyncClient(api_key="your_api_key")
    
    # All methods support async
    estimate = await client.refunds.estimate(
        income=75000,
        filing_status="single"
    )
    
    print(f"Refund: ${estimate.amount}")

asyncio.run(main())`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Next Steps</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                <h3 className="text-xl font-bold mb-2">API Reference</h3>
                <p className="text-muted-foreground mb-4">Complete documentation of all SDK methods</p>
                <Link href="/developers#api-reference">
                  <Button variant="outline" className="bg-transparent">
                    View Docs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-all">
                <h3 className="text-xl font-bold mb-2">Example Apps</h3>
                <p className="text-muted-foreground mb-4">Full working examples on GitHub</p>
                <Link href="https://github.com/taxu/examples" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Browse Examples
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
