import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Book, Code2, Wrench, Webhook, Terminal, TestTube, BarChart3, MessageSquare } from "lucide-react"

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const navSections = [
    {
      title: "Getting Started",
      items: [
        { label: "Overview", href: "/developer", icon: Book },
        { label: "Quick Start", href: "/developer/quickstart", icon: Code2 },
        { label: "Authentication", href: "/developer/authentication", icon: Wrench },
      ],
    },
    {
      title: "API Reference",
      items: [
        { label: "Tax Filing API", href: "/developer/api/tax-filing", icon: Code2 },
        { label: "Document Intelligence", href: "/developer/api/documents", icon: Code2 },
        { label: "Refund Estimator", href: "/developer/api/refunds", icon: Code2 },
      ],
    },
    {
      title: "Tools & SDKs",
      items: [
        { label: "Webhooks", href: "/developer/webhooks", icon: Webhook },
        { label: "CLI Tool", href: "/developer/cli", icon: Terminal },
        { label: "Sandbox", href: "/developer/sandbox", icon: TestTube },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "API Status", href: "/developer/status", icon: BarChart3 },
        { label: "Changelog", href: "/developer/changelog", icon: Book },
        { label: "Support", href: "/developer/support", icon: MessageSquare },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Developer Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            <Link
              href="/developer"
              className="text-sm font-semibold whitespace-nowrap hover:text-accent transition-colors"
            >
              Developers
            </Link>
            <Link
              href="/developer/docs"
              className="text-sm text-muted-foreground whitespace-nowrap hover:text-accent transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/developer/api/tax-filing"
              className="text-sm text-muted-foreground whitespace-nowrap hover:text-accent transition-colors"
            >
              API Reference
            </Link>
            <Link
              href="/developer-portal"
              className="text-sm text-muted-foreground whitespace-nowrap hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/developer/sandbox"
              className="text-sm text-muted-foreground whitespace-nowrap hover:text-accent transition-colors"
            >
              Sandbox
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors py-1"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
