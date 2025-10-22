import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Code2, BookOpen, Key, Webhook, Terminal, Box, BarChart3, FileText, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Taxu Developer Platform",
  description: "Build powerful tax and accounting integrations with Taxu APIs, SDKs, and tools",
}

const navigation = [
  {
    name: "Documentation",
    items: [
      { name: "Overview", href: "/developer", icon: BookOpen },
      { name: "Getting Started", href: "/developer/docs", icon: Code2 },
      { name: "API Reference", href: "/developer/docs/api-reference", icon: FileText },
      { name: "Guides", href: "/developer/docs/guides", icon: BookOpen },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Dashboard", href: "/developer/dashboard", icon: BarChart3 },
      { name: "Sandbox", href: "/developer/sandbox", icon: Box },
      { name: "CLI", href: "/developer/cli", icon: Terminal },
      { name: "Webhooks", href: "/developer/webhooks", icon: Webhook },
    ],
  },
  {
    name: "SDKs",
    items: [
      { name: "Node.js", href: "/developer/sdks/nodejs", icon: Code2 },
      { name: "Python", href: "/developer/sdks/python", icon: Code2 },
      { name: "Ruby", href: "/developer/sdks/ruby", icon: Code2 },
      { name: "Go", href: "/developer/sdks/go", icon: Code2 },
    ],
  },
  {
    name: "Resources",
    items: [
      { name: "API Status", href: "/developer/status", icon: BarChart3 },
      { name: "Changelog", href: "/developer/changelog", icon: FileText },
      { name: "Support", href: "/developer/support", icon: MessageSquare },
    ],
  },
]

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Developer Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/developer" className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Taxu Developer</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/developer/docs" className="text-sm font-medium hover:text-primary transition-colors">
                Docs
              </Link>
              <Link
                href="/developer/docs/api-reference"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                API Reference
              </Link>
              <Link href="/developer/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/developer/sdks/nodejs" className="text-sm font-medium hover:text-primary transition-colors">
                SDKs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/developer/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Key className="mr-2 h-4 w-4" />
              Get API Keys
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex-1">
        <div className="flex gap-8 py-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {navigation.map((section) => (
                <div key={section.name}>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{section.name}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      {/* Developer Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Documentation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/developer/docs" className="hover:text-foreground">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api-reference" className="hover:text-foreground">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/guides" className="hover:text-foreground">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Tools</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/developer/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sandbox" className="hover:text-foreground">
                    Sandbox
                  </Link>
                </li>
                <li>
                  <Link href="/developer/cli" className="hover:text-foreground">
                    CLI
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">SDKs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/developer/sdks/nodejs" className="hover:text-foreground">
                    Node.js
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/python" className="hover:text-foreground">
                    Python
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/ruby" className="hover:text-foreground">
                    Ruby
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks/go" className="hover:text-foreground">
                    Go
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/developer/status" className="hover:text-foreground">
                    API Status
                  </Link>
                </li>
                <li>
                  <Link href="/developer/changelog" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/developer/support" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Taxu. All rights reserved. Built for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
