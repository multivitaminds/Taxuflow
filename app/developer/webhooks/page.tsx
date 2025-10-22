import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Webhook, Shield, Zap, Code, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WebhooksPage() {
  const events = [
    {
      name: "tax_return.filed",
      description: "Triggered when a tax return is successfully e-filed with the IRS",
      payload: {
        id: "tr_1234567890",
        status: "filed",
        filing_date: "2025-04-15T10:30:00Z",
        confirmation_number: "IRS-2025-ABC123",
      },
    },
    {
      name: "refund.processed",
      description: "Triggered when the IRS processes a refund",
      payload: {
        id: "ref_9876543210",
        amount: 2450,
        status: "processed",
        expected_date: "2025-05-01",
      },
    },
    {
      name: "document.processed",
      description: "Triggered when a document is successfully extracted and processed",
      payload: {
        id: "doc_abc123xyz",
        type: "w2",
        status: "processed",
        extracted_data: {
          employer: "Acme Corp",
          wages: 75000,
          federal_tax: 12500,
        },
      },
    },
    {
      name: "audit.risk_updated",
      description: "Triggered when audit risk score changes",
      payload: {
        id: "audit_xyz789",
        risk_score: 0.15,
        risk_level: "low",
        factors: ["income_verification", "deduction_analysis"],
      },
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
              <Webhook className="w-4 h-4" />
              Webhooks
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">Real-Time Event Notifications</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get instant notifications when important events happen. Build reactive, real-time tax applications with
              Taxu webhooks.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Events are delivered within milliseconds of occurrence with automatic retries for failed deliveries.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Signatures</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every webhook is signed with HMAC-SHA256 to verify authenticity and prevent tampering.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Simple HTTP POST requests with JSON payloads. Works with any web framework or serverless function.
              </p>
            </div>
          </div>

          {/* Setup Guide */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Setting Up Webhooks</h2>
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Create an Endpoint</h3>
                    <p className="text-muted-foreground mb-4">
                      Set up an HTTPS endpoint on your server to receive webhook events:
                    </p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code className="text-accent">{`// Node.js / Express example
app.post('/webhooks/taxu', async (req, res) => {
  const signature = req.headers['x-taxu-signature'];
  const payload = req.body;
  
  // Verify signature (see step 3)
  if (!verifySignature(payload, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle the event
  switch (payload.type) {
    case 'tax_return.filed':
      await handleTaxReturnFiled(payload.data);
      break;
    case 'refund.processed':
      await handleRefundProcessed(payload.data);
      break;
  }
  
  res.status(200).send('Received');
});`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Register Your Endpoint</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your webhook URL in the developer dashboard or via API:
                    </p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code className="text-accent">{`curl https://api.taxu.io/v1/webhooks \\
  -H "Authorization: Bearer sk_live_..." \\
  -d url="https://yourdomain.com/webhooks/taxu" \\
  -d events[]="tax_return.filed" \\
  -d events[]="refund.processed"`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Verify Signatures</h3>
                    <p className="text-muted-foreground mb-4">
                      Always verify webhook signatures to ensure requests are from Taxu:
                    </p>
                    <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto">
                      <pre className="text-sm font-mono">
                        <code className="text-accent">{`import crypto from 'crypto';

function verifySignature(payload, signature) {
  const secret = process.env.TAXU_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Available Events</h2>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 font-mono text-accent">{event.name}</h3>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-background-alt border border-border p-4 overflow-x-auto">
                    <pre className="text-sm font-mono">
                      <code className="text-accent">{JSON.stringify(event.payload, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Return 200 Quickly</h3>
                    <p className="text-sm text-muted-foreground">
                      Respond with 200 OK immediately, then process the event asynchronously to avoid timeouts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Handle Duplicates</h3>
                    <p className="text-sm text-muted-foreground">
                      Use event IDs to detect and ignore duplicate webhook deliveries.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Monitor Failures</h3>
                    <p className="text-sm text-muted-foreground">
                      Check the webhook logs in your dashboard to monitor delivery success rates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-2">Test in Sandbox</h3>
                    <p className="text-sm text-muted-foreground">
                      Use the Taxu CLI to test webhooks locally before deploying to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl font-bold mb-4">Start Receiving Events</h2>
            <p className="text-xl text-muted-foreground mb-8">Set up your first webhook in minutes</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/developer-portal">
                <Button size="lg" className="glow-neon-strong">
                  Configure Webhooks
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/developer/docs">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Full Documentation
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
