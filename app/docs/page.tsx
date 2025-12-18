import type { Metadata } from "next"
import Link from "next/link"
import { Book, Code, FileText, Terminal, Zap, Shield, Users, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Documentation | Taxu",
  description: "Complete API reference and technical documentation for Taxu's platform",
}

const sections = [
  {
    title: "API Reference",
    icon: Code,
    description: "Complete API documentation with endpoints, parameters, and examples",
    href: "/api-docs",
    featured: true,
  },
  {
    title: "Developer Docs",
    icon: Book,
    description: "Integration guides, tutorials, and best practices",
    href: "/developer/docs",
    featured: true,
  },
  {
    title: "Getting Started",
    icon: Zap,
    description: "Quick start guide to integrate Taxu in minutes",
    href: "/developer/docs/getting-started",
    featured: true,
  },
  {
    title: "Authentication",
    icon: Shield,
    description: "API keys, OAuth 2.0, and security best practices",
    href: "/developer/docs/api/authentication",
  },
  {
    title: "Tax Filing API",
    icon: FileText,
    description: "Submit and manage tax filings programmatically",
    href: "/developer/docs/api/tax-filing",
  },
  {
    title: "Banking API",
    icon: TrendingUp,
    description: "Account management, transfers, and transaction data",
    href: "/developer/docs/api/neobank",
  },
  {
    title: "Taxu CLI",
    icon: Terminal,
    description: "Command-line interface for developers",
    href: "/cli",
  },
  {
    title: "SDKs & Libraries",
    icon: Code,
    description: "Client libraries for Node.js, Python, Go, and more",
    href: "/developer/docs/sdks",
  },
  {
    title: "Webhooks",
    icon: Zap,
    description: "Real-time event notifications",
    href: "/developer/docs/webhooks",
  },
  {
    title: "Business Solutions",
    icon: Users,
    description: "Documentation for business and enterprise features",
    href: "/businesses/small-business",
  },
]

const apiEndpoints = [
  {
    category: "Tax Filing",
    items: [
      { method: "POST", path: "/v1/filings", description: "Create a tax filing" },
      { method: "GET", path: "/v1/filings/:id", description: "Retrieve filing details" },
      { method: "POST", path: "/v1/filings/:id/submit", description: "Submit for e-filing" },
      { method: "GET", path: "/v1/filings/:id/status", description: "Check filing status" },
    ],
  },
  {
    category: "Recipients",
    items: [
      { method: "POST", path: "/v1/recipients", description: "Create recipient" },
      { method: "GET", path: "/v1/recipients", description: "List all recipients" },
      { method: "GET", path: "/v1/recipients/:id", description: "Get recipient details" },
      { method: "PATCH", path: "/v1/recipients/:id", description: "Update recipient" },
    ],
  },
  {
    category: "Documents",
    items: [
      { method: "POST", path: "/v1/documents/upload", description: "Upload document" },
      { method: "POST", path: "/v1/documents/extract", description: "Extract data with AI" },
      { method: "GET", path: "/v1/documents/:id", description: "Get document" },
      { method: "DELETE", path: "/v1/documents/:id", description: "Delete document" },
    ],
  },
  {
    category: "Banking",
    items: [
      { method: "GET", path: "/v1/accounts", description: "List bank accounts" },
      { method: "POST", path: "/v1/transfers", description: "Create transfer" },
      { method: "GET", path: "/v1/transactions", description: "List transactions" },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Taxu Documentation</h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Complete API reference, integration guides, and technical documentation for building with Taxu
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/api-docs"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                API Reference
              </Link>
              <Link
                href="/developer/docs/getting-started"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                Quick Start
              </Link>
              <Link
                href="/developer/shell"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                API Explorer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold">Featured Documentation</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {sections
            .filter((s) => s.featured)
            .map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group rounded-lg border bg-card p-8 transition-all hover:border-primary hover:shadow-xl"
                >
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-primary">{section.title}</h3>
                  <p className="text-muted-foreground">{section.description}</p>
                  <div className="mt-4 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View documentation →
                  </div>
                </Link>
              )
            })}
        </div>
      </div>

      {/* All Sections */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">All Documentation</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections
              .filter((s) => !s.featured)
              .map((section) => {
                const Icon = section.icon
                return (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-semibold group-hover:text-primary">{section.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </Link>
                )
              })}
          </div>
        </div>
      </div>

      {/* API Endpoints Preview */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">API Endpoints</h2>
            <Link href="/api-docs" className="text-primary hover:underline">
              View full API reference →
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {apiEndpoints.map((category) => (
              <div key={category.category} className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-xl font-bold">{category.category}</h3>
                <div className="space-y-3">
                  {category.items.map((endpoint) => (
                    <div key={endpoint.path} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold ${
                          endpoint.method === "GET"
                            ? "bg-blue-500/10 text-blue-500"
                            : endpoint.method === "POST"
                              ? "bg-green-500/10 text-green-500"
                              : endpoint.method === "PATCH"
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="flex-1 text-sm font-mono">{endpoint.path}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Ready to Build?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start integrating Taxu's powerful APIs into your application today
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/get-started"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link
                href="/guides"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                View Guides
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
