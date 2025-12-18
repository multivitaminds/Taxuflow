import type { Metadata } from "next"
import Link from "next/link"
import { Book, FileText, Lightbulb, Code, Zap, Shield, TrendingUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Guides | Taxu",
  description: "Comprehensive guides to help you get the most out of Taxu's tax, banking, and investment platform",
}

const guides = [
  {
    category: "Getting Started",
    icon: Book,
    items: [
      {
        title: "Quick Start Guide",
        description: "Get up and running with Taxu in under 5 minutes",
        href: "/developer/docs/getting-started",
        time: "5 min read",
      },
      {
        title: "Account Setup",
        description: "Complete guide to setting up your Taxu account",
        href: "/get-started",
        time: "10 min read",
      },
      {
        title: "First Tax Filing",
        description: "Step-by-step guide to filing your first tax return",
        href: "/individuals",
        time: "15 min read",
      },
    ],
  },
  {
    category: "Tax Filing",
    icon: FileText,
    items: [
      {
        title: "Individual Tax Returns",
        description: "Complete guide to filing 1040 returns",
        href: "/individuals",
        time: "20 min read",
      },
      {
        title: "Business Tax Returns",
        description: "Filing taxes for your business entity",
        href: "/businesses/small-business",
        time: "25 min read",
      },
      {
        title: "Form 941 Quarterly Filing",
        description: "Payroll tax filing and compliance",
        href: "/developer/docs/api/tax-filing",
        time: "15 min read",
      },
      {
        title: "Tax Deductions & Credits",
        description: "Maximize your tax savings",
        href: "/ai-features/deductions",
        time: "18 min read",
      },
    ],
  },
  {
    category: "AI Features",
    icon: Lightbulb,
    items: [
      {
        title: "AI Tax Assistant",
        description: "Get instant answers to your tax questions",
        href: "/ai-features",
        time: "8 min read",
      },
      {
        title: "Document Intelligence",
        description: "Automatic data extraction from tax documents",
        href: "/ai-features/documents",
        time: "12 min read",
      },
      {
        title: "Smart Audit Defense",
        description: "AI-powered audit protection and support",
        href: "/ai-features/audit",
        time: "15 min read",
      },
    ],
  },
  {
    category: "For Developers",
    icon: Code,
    items: [
      {
        title: "API Integration Guide",
        description: "Integrate Taxu's API into your application",
        href: "/developer/docs/api/overview",
        time: "30 min read",
      },
      {
        title: "Authentication",
        description: "Secure your API requests with OAuth 2.0",
        href: "/developer/docs/api/authentication",
        time: "15 min read",
      },
      {
        title: "Webhooks Setup",
        description: "Receive real-time event notifications",
        href: "/developer/docs/webhooks",
        time: "20 min read",
      },
      {
        title: "SDK Quick Start",
        description: "Get started with Taxu SDKs",
        href: "/developer/docs/sdks",
        time: "10 min read",
      },
    ],
  },
  {
    category: "Banking & Finance",
    icon: TrendingUp,
    items: [
      {
        title: "Neobanking Features",
        description: "Modern banking with real-time insights",
        href: "/products/banking",
        time: "12 min read",
      },
      {
        title: "Investment Tracking",
        description: "Monitor and optimize your portfolio",
        href: "/products/investments",
        time: "15 min read",
      },
      {
        title: "QuickBooks Integration",
        description: "Sync your accounting data seamlessly",
        href: "/integrations/quickbooks",
        time: "10 min read",
      },
    ],
  },
  {
    category: "Security & Compliance",
    icon: Shield,
    items: [
      {
        title: "Security Best Practices",
        description: "Keep your data safe and secure",
        href: "/security",
        time: "10 min read",
      },
      {
        title: "Compliance Standards",
        description: "SOC 2, GDPR, and regulatory compliance",
        href: "/compliance",
        time: "12 min read",
      },
      {
        title: "Data Privacy",
        description: "How we protect your sensitive information",
        href: "/data-usage",
        time: "8 min read",
      },
    ],
  },
  {
    category: "Business Solutions",
    icon: Users,
    items: [
      {
        title: "Small Business Guide",
        description: "Tax and finance solutions for small businesses",
        href: "/businesses/small-business",
        time: "20 min read",
      },
      {
        title: "Enterprise Solutions",
        description: "Scalable solutions for large organizations",
        href: "/businesses/enterprise",
        time: "15 min read",
      },
      {
        title: "Accountant Tools",
        description: "Professional features for tax accountants",
        href: "/businesses/accountants",
        time: "18 min read",
      },
    ],
  },
  {
    category: "Advanced Features",
    icon: Zap,
    items: [
      {
        title: "CLI Usage",
        description: "Power user features with Taxu CLI",
        href: "/cli",
        time: "15 min read",
      },
      {
        title: "API Explorer",
        description: "Interactive API testing and exploration",
        href: "/developer/shell",
        time: "10 min read",
      },
      {
        title: "Automation & Workflows",
        description: "Automate repetitive tax and finance tasks",
        href: "/developer/docs/api/overview",
        time: "20 min read",
      },
    ],
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Taxu Guides</h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Comprehensive guides to help you master tax filing, banking, investments, and API integrations with Taxu
            </p>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {guides.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.category}>
                <div className="mb-8 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((guide) => (
                    <Link
                      key={guide.title}
                      href={guide.href}
                      className="group rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
                    >
                      <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{guide.title}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{guide.time}</span>
                        <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Read guide →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">Need More Help?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Contact Support
              </Link>
              <Link
                href="/developer/docs"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                Developer Docs
              </Link>
              <Link
                href="/api-docs"
                className="rounded-lg border bg-background px-6 py-3 font-semibold transition-colors hover:bg-muted"
              >
                API Reference
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
