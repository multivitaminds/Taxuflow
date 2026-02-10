import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Terminal, Github } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-static"

export default function PythonSDKPage() {
  const quickStartCode = `import taxu

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

print(f"Estimated refund: $" + str(estimate.amount))`

  const returnsCode = `# Create a new tax return
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
filed = client.returns.file(tax_return.id)`

  const documentsCode = `# Upload and parse documents
with open("w2.pdf", "rb") as file:
    document = client.documents.upload(
        file=file,
        type="W2",
        return_id="ret_abc123"
    )

# Get parsed data
print(document.parsed)
# {'employer': 'Acme Corp', 'wages': 85000, ...}`

  const asyncCode = `import asyncio
from taxu import AsyncClient

async def main():
    client = AsyncClient(api_key="your_api_key")
    
    # All methods support async
    estimate = await client.refunds.estimate(
        income=75000,
        filing_status="single"
    )
    
    print(f"Refund: $" + str(estimate.amount))

asyncio.run(main())`

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8 text-center glow-neon">
            <Terminal className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Python SDK In Development</h2>
            <p className="text-muted-foreground mb-6">
              We're actively building the Python SDK. Star the repo on GitHub to get notified when it launches.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://github.com/multivitaminds/taxu-python" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="glow-neon-strong">
                  <Github className="mr-2 h-5 w-5" />
                  Star on GitHub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/developer-portal">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>

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
            <div className="mb-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                <strong>Coming Soon:</strong> The taxu-python package will be available on PyPI.{" "}
                <Link
                  href="https://github.com/multivitaminds/taxu-python"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow progress on GitHub
                </Link>
              </p>
            </div>
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
                <code>{quickStartCode}</code>
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
                  <code>{returnsCode}</code>
                </pre>
              </div>

              {/* Documents */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Document Upload</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{documentsCode}</code>
                </pre>
              </div>

              {/* Async Support */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Async/Await Support</h3>
                <pre className="font-mono text-sm text-accent overflow-x-auto">
                  <code>{asyncCode}</code>
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
                <Link href="https://github.com/multivitaminds/examples" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Browse Examples
                    <ArrowRight className="ml-2 h-5 w-5" />
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
