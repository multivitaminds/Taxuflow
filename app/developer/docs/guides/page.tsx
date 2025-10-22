import { BookOpen, Code2, Zap, Building2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const guides = [
  {
    category: "Getting Started",
    icon: BookOpen,
    color: "text-blue-600",
    items: [
      {
        title: "Quick Start Guide",
        description: "Get up and running with Taxu APIs in 5 minutes",
        href: "/developer/docs/guides/quickstart",
        time: "5 min read",
      },
      {
        title: "Authentication",
        description: "Learn how to authenticate your API requests",
        href: "/developer/docs/guides/authentication",
        time: "3 min read",
      },
      {
        title: "Error Handling",
        description: "Understand error codes and how to handle them",
        href: "/developer/docs/guides/errors",
        time: "4 min read",
      },
    ],
  },
  {
    category: "Core Concepts",
    icon: Code2,
    color: "text-green-600",
    items: [
      {
        title: "Tax Returns",
        description: "Create and manage tax returns programmatically",
        href: "/developer/docs/guides/tax-returns",
        time: "10 min read",
      },
      {
        title: "Document Processing",
        description: "Upload and extract data from tax documents",
        href: "/developer/docs/guides/documents",
        time: "8 min read",
      },
      {
        title: "Webhooks",
        description: "Receive real-time notifications for events",
        href: "/developer/docs/guides/webhooks",
        time: "7 min read",
      },
    ],
  },
  {
    category: "Industry Solutions",
    icon: Building2,
    color: "text-purple-600",
    items: [
      {
        title: "Real Estate Tax Integration",
        description: "Build tax solutions for real estate platforms",
        href: "/developer/docs/guides/real-estate",
        time: "12 min read",
      },
      {
        title: "E-Commerce Tax Automation",
        description: "Automate sales tax for online stores",
        href: "/developer/docs/guides/ecommerce",
        time: "10 min read",
      },
      {
        title: "HR & Payroll Integration",
        description: "Integrate payroll tax calculations",
        href: "/developer/docs/guides/payroll",
        time: "15 min read",
      },
    ],
  },
  {
    category: "Advanced Topics",
    icon: Zap,
    color: "text-orange-600",
    items: [
      {
        title: "Rate Limiting",
        description: "Understand API rate limits and best practices",
        href: "/developer/docs/guides/rate-limiting",
        time: "5 min read",
      },
      {
        title: "Idempotency",
        description: "Safely retry requests without duplicates",
        href: "/developer/docs/guides/idempotency",
        time: "6 min read",
      },
      {
        title: "Pagination",
        description: "Work with large datasets efficiently",
        href: "/developer/docs/guides/pagination",
        time: "4 min read",
      },
    ],
  },
]

export default function GuidesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Developer Guides</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guides to help you build powerful tax and accounting integrations with Taxu.
        </p>
      </div>

      {/* Guides by Category */}
      <div className="space-y-8">
        {guides.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`h-6 w-6 ${section.color}`} />
                <h2 className="text-2xl font-bold">{section.category}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((guide) => (
                  <Link key={guide.title} href={guide.href}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription>{guide.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{guide.time}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Popular Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Guides</CardTitle>
          <CardDescription>Most viewed guides by developers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Building Your First Tax Integration", views: "12.5K views" },
              { title: "Webhook Best Practices", views: "8.2K views" },
              { title: "Real Estate Tax Automation", views: "6.7K views" },
              { title: "E-Commerce Sales Tax Guide", views: "5.9K views" },
            ].map((guide) => (
              <div
                key={guide.title}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{guide.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{guide.views}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
