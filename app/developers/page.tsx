import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Webhook, Key, Zap, FileJson, Terminal, Book, Github } from "lucide-react"
import Link from "next/link"

export default function DevelopersPage() {
  const features = [
    {
      icon: Code,
      title: "RESTful API",
      description: "Clean, predictable REST endpoints with comprehensive documentation",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Real-time notifications for filing status, refund updates, and more",
    },
    {
      icon: Key,
      title: "OAuth 2.0",
      description: "Secure authentication flow for accessing user tax data",
    },
    {
      icon: Zap,
      title: "Rate Limiting",
      description: "Generous rate limits with automatic scaling for enterprise",
    },
    {
      icon: FileJson,
      title: "JSON Responses",
      description: "Consistent, well-structured JSON for all API responses",
    },
    {
      icon: Terminal,
      title: "Sandbox Environment",
      description: "Full-featured test environment with sample data",
    },
  ]

  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/returns",
      description: "Create a new tax return",
    },
    {
      method: "GET",
      path: "/api/v1/returns/:id",
      description: "Retrieve return details",
    },
    {
      method: "POST",
      path: "/api/v1/returns/:id/file",
      description: "Submit return to IRS",
    },
    {
      method: "GET",
      path: "/api/v1/refund-estimate",
      description: "Calculate refund estimate",
    },
    {
      method: "POST",
      path: "/api/v1/documents/upload",
      description: "Upload tax documents",
    },
    {
      method: "GET",
      path: "/api/v1/deductions",
      description: "Get available deductions",
    },
  ]

  const useCases = [
    {
      title: "Embedded Refund Estimator",
      description: "Add a refund calculator widget to your app or website",
      code: `const estimate = await taxu.estimateRefund({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});`,
    },
    {
      title: "Automated Filing",
      description: "Integrate tax filing into your payroll or accounting software",
      code: `const filing = await taxu.createReturn({
  userId: 'user_123',
  forms: [w2Data, form1099Data],
  autoFile: true
});`,
    },
    {
      title: "Tax Data Sync",
      description: "Keep tax information synchronized across platforms",
      code: `taxu.webhooks.on('return.filed', (data) => {
  console.log('Return filed:', data.returnId);
  syncToDatabase(data);
});`,
    },
  ]

  const embeddableComponents = [
    {
      title: "Refund Calculator Widget",
      description: "Drop-in refund estimator for your website",
      code: `<script src="https://cdn.taxu.ai/widget.js"></script>
<div data-taxu-widget="refund-calculator"></div>`,
      preview: "Interactive calculator with real-time estimates",
    },
    {
      title: "Tax Chat Assistant",
      description: "AI-powered tax help for your users",
      code: `import { TaxuChat } from '@taxu/react';

<TaxuChat apiKey={process.env.TAXU_API_KEY} />`,
      preview: "Full-featured chat interface with AI agents",
    },
    {
      title: "Document Uploader",
      description: "Secure document upload with OCR parsing",
      code: `<TaxuUploader
  onUpload={(doc) => console.log(doc)}
  acceptedTypes={['W2', '1099', 'receipts']}
/>`,
      preview: "Drag-and-drop with automatic form detection",
    },
  ]

  const webhookEvents = [
    { event: "return.created", description: "New tax return initiated" },
    { event: "return.filed", description: "Return successfully submitted to IRS" },
    { event: "refund.issued", description: "Refund processed and sent" },
    { event: "document.parsed", description: "Document OCR completed" },
    { event: "subscription.updated", description: "User subscription changed" },
    { event: "audit.flagged", description: "Potential audit risk detected" },
  ]

  const integrationExamples = [
    {
      company: "Uber",
      useCase: "Driver Tax Summaries",
      description: "Automatic year-end tax summaries for 5M+ drivers",
      integration: "API + Webhooks",
    },
    {
      company: "Gusto",
      useCase: "Embedded Filing",
      description: "One-click filing for contractors and employees",
      integration: "OAuth + REST API",
    },
    {
      company: "Mercury",
      useCase: "Startup Tax Automation",
      description: "Auto-fill Delaware franchise tax for startups",
      integration: "REST API + SDK",
    },
    {
      company: "QuickBooks",
      useCase: "Tax Data Sync",
      description: "Real-time sync of deductions and expenses",
      integration: "Webhooks + GraphQL",
    },
  ]

  const apiPricing = [
    {
      tier: "Developer",
      price: "Free",
      requests: "10,000/month",
      features: ["Sandbox access", "Basic support", "Community forum"],
    },
    {
      tier: "Startup",
      price: "$299/mo",
      requests: "100,000/month",
      features: ["Production access", "Email support", "Webhook events", "99.9% SLA"],
    },
    {
      tier: "Business",
      price: "$999/mo",
      requests: "1M/month",
      features: ["Priority support", "Custom rate limits", "Dedicated account manager", "99.99% SLA"],
    },
    {
      tier: "Enterprise",
      price: "Custom",
      requests: "Unlimited",
      features: ["White-label options", "On-premise deployment", "24/7 phone support", "Custom SLA"],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-8">
            <Code className="w-4 h-4" />
            Developer Platform
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-[1.1]">
            Tax Intelligence
            <br />
            <span className="text-glow">As a Service</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-8">
            Embed AI-powered tax filing, refund estimates, and compliance into any application with our developer-first
            API.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/developer-portal">
              <Button size="lg" className="glow-neon-strong">
                Get API Key
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="bg-transparent">
                <Book className="mr-2 h-5 w-5" />
                View Docs
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              99.99% Uptime
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              50ms Response Time
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              SOC 2 Certified
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Developer-First API</h2>
            <p className="text-xl text-muted-foreground">Built for speed, reliability, and ease of integration</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 hover:glow-neon transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Core Endpoints</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build tax features</p>
          </div>

          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                    endpoint.method === "GET" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="font-mono text-sm flex-1">{endpoint.path}</code>
                <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/api-docs">
              <Button variant="outline" className="bg-transparent">
                View Full API Reference
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Common Use Cases</h2>
            <p className="text-xl text-muted-foreground">See what you can build with Taxu API</p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-8">
                <h3 className="text-2xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <div className="rounded-xl bg-background-alt border border-border p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-accent">
                    <code>{useCase.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embeddable Components Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Embeddable Components</h2>
            <p className="text-xl text-muted-foreground">Drop-in UI components for instant integration</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {embeddableComponents.map((component, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-all"
              >
                <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
                <div className="rounded-lg bg-background-alt border border-border p-4 mb-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-accent">
                    <code>{component.code}</code>
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground italic">{component.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Webhook Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Webhook Events</h2>
            <p className="text-xl text-muted-foreground">Real-time notifications for critical tax events</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {webhookEvents.map((webhook, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <Webhook className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <code className="font-mono text-sm font-semibold text-accent">{webhook.event}</code>
                  <p className="text-sm text-muted-foreground mt-1">{webhook.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-card border border-border p-6">
            <h3 className="text-lg font-bold mb-4">Example Webhook Payload</h3>
            <div className="rounded-lg bg-background-alt border border-border p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-accent">
                <code>{`{
  "event": "return.filed",
  "timestamp": "2025-04-15T10:30:00Z",
  "data": {
    "returnId": "ret_abc123",
    "userId": "user_xyz789",
    "taxYear": 2024,
    "status": "accepted",
    "refundAmount": 3250.00
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Integration Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">See how companies use Taxu API in production</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {integrationExamples.map((example, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-8 hover:glow-neon transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{example.company}</h3>
                    <p className="text-accent font-semibold">{example.useCase}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    {example.integration}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{example.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">API Pricing</h2>
            <p className="text-xl text-muted-foreground">Flexible plans that scale with your business</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {apiPricing.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-6 ${
                  plan.tier === "Business" ? "border-accent bg-accent/5 glow-neon" : "border-border bg-card"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{plan.tier}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.requests}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.tier === "Enterprise" ? "/pricing" : "/developer-portal"}>
                  <Button
                    className={`w-full ${plan.tier === "Business" ? "glow-neon-strong" : ""}`}
                    variant={plan.tier === "Business" ? "default" : "outline"}
                  >
                    {plan.tier === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDK Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <Github className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Official SDKs</h2>
            <p className="text-xl text-muted-foreground mb-8">Get started faster with our official client libraries</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {["Node.js", "Python", "Ruby", "PHP", "Go"].map((lang) => (
                <div
                  key={lang}
                  className="px-4 py-2 rounded-lg bg-background-alt border border-border font-mono text-sm"
                >
                  {lang}
                </div>
              ))}
            </div>
            <Link href="/sdk/javascript">
              <Button size="lg" className="glow-neon-strong">
                Browse SDKs on GitHub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-alt">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Developer Support</h2>
            <p className="text-xl text-muted-foreground">We're here to help you build</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <Book className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-muted-foreground mb-4">Comprehensive guides and API reference</p>
              <Link href="/api-docs">
                <Button variant="outline" className="bg-transparent">
                  Read Docs
                </Button>
              </Link>
            </div>
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <Github className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">GitHub</h3>
              <p className="text-muted-foreground mb-4">SDKs, examples, and community support</p>
              <Link href="/sdk/javascript">
                <Button variant="outline" className="bg-transparent">
                  View Repos
                </Button>
              </Link>
            </div>
            <div className="text-center p-8 rounded-2xl border border-border bg-card">
              <Terminal className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Workbench</h3>
              <p className="text-muted-foreground mb-4">Interactive API testing environment</p>
              <Link href="/developer/shell">
                <Button variant="outline" className="bg-transparent">
                  Try Workbench
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
