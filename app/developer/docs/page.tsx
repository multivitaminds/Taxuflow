import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Book, Code, Zap, Shield, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DeveloperDocsPage() {
  const sections = [
    {
      title: "Getting Started",
      icon: Zap,
      links: [
        { name: "Introduction", href: "/developer/docs/introduction" },
        { name: "Authentication", href: "/developer/docs/authentication" },
        { name: "Quickstart Guide", href: "/developer/docs/quickstart" },
        { name: "Error Handling", href: "/developer/docs/errors" },
        { name: "Rate Limits", href: "/developer/docs/rate-limits" },
      ],
    },
    {
      title: "Core APIs",
      icon: Code,
      links: [
        { name: "Tax Filing API", href: "/developer/docs/api/tax-filing" },
        { name: "Refund Estimation API", href: "/developer/docs/api/refund-estimation" },
        { name: "Document Intelligence API", href: "/developer/docs/api/document-intelligence" },
        { name: "Compliance API", href: "/developer/docs/api/compliance" },
        { name: "Accounting API", href: "/developer/docs/api/accounting" },
        { name: "Audit Defense API", href: "/developer/docs/api/audit-defense" },
      ],
    },
    {
      title: "SDKs & Libraries",
      icon: Book,
      links: [
        { name: "Node.js SDK", href: "/sdk/javascript" },
        { name: "Python SDK", href: "/sdk/python" },
        { name: "Ruby SDK", href: "/sdk/ruby" },
        { name: "Go SDK", href: "/sdk/go" },
        { name: "PHP SDK", href: "/sdk/php" },
        { name: "Swift SDK", href: "/sdk/swift" },
      ],
    },
    {
      title: "Industry Guides",
      icon: Globe,
      links: [
        { name: "Real Estate", href: "/developer/industries/real-estate" },
        { name: "E-Commerce", href: "/developer/industries/ecommerce" },
        { name: "HR & Payroll", href: "/developer/industries/hr-payroll" },
        { name: "Healthcare", href: "/developer/industries/healthcare" },
        { name: "Financial Services", href: "/developer/industries/financial-services" },
        { name: "View All Industries", href: "/developer#industries" },
      ],
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      links: [
        { name: "Security Overview", href: "/security/docs" },
        { name: "Data Encryption", href: "/developer/docs/security/encryption" },
        { name: "Compliance Certifications", href: "/developer/docs/security/compliance" },
        { name: "Audit Logs", href: "/developer/docs/security/audit-logs" },
        { name: "GDPR & Privacy", href: "/developer/docs/security/privacy" },
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">Developer Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to integrate Taxu into your application. Comprehensive guides, API references, and
              code examples.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <div key={index} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="mt-16 rounded-2xl border border-accent/30 bg-card p-12 text-center glow-neon">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-xl text-muted-foreground mb-8">Our developer support team is here to assist you</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="glow-neon-strong">
                  Contact Support
                </Button>
              </Link>
              <Link href="/developer-portal">
                <Button size="lg" variant="outline" className="bg-transparent">
                  View API Dashboard
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
