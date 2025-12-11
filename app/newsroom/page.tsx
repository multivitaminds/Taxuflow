"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Download, Calendar, Users, Award, TrendingUp } from "lucide-react"

export default function NewsroomPage() {
  const [email, setEmail] = useState("")

  const pressReleases = [
    {
      title: "Taxu Raises $50M Series B to Transform Tax Filing with AI",
      category: "Funding",
      date: "December 2024",
      excerpt:
        "Leading investment from top venture firms to accelerate AI-powered tax automation for millions of businesses.",
      featured: true,
    },
    {
      title: "Taxu Launches AI Tax Agent for Automated Form 1099 Filing",
      category: "Product",
      date: "November 2024",
      excerpt: "New AI-powered agent reduces tax filing time by 90% with intelligent data extraction and validation.",
    },
    {
      title: "Taxu Partners with Major Banks for Embedded Tax Solutions",
      category: "Partnership",
      date: "October 2024",
      excerpt:
        "Strategic partnerships bring seamless tax filing directly into banking platforms for millions of users.",
    },
    {
      title: "Taxu Achieves SOC 2 Type II Compliance",
      category: "Security",
      date: "September 2024",
      excerpt: "Independent audit confirms enterprise-grade security controls and data protection measures.",
    },
    {
      title: "1 Million Forms Filed Through Taxu Platform",
      category: "Milestone",
      date: "August 2024",
      excerpt: "Platform reaches major milestone processing over 1 million tax forms for businesses nationwide.",
    },
    {
      title: "Taxu Expands to Support Form 941 Quarterly Filings",
      category: "Product",
      date: "July 2024",
      excerpt: "New support for quarterly employment tax forms makes Taxu a complete payroll tax solution.",
    },
  ]

  const companyStats = [
    { label: "Forms Filed", value: "1M+", icon: TrendingUp },
    { label: "Businesses Served", value: "10,000+", icon: Users },
    { label: "Industry Awards", value: "15+", icon: Award },
    { label: "API Integrations", value: "50+", icon: ArrowRight },
  ]

  const mediaResources = [
    { title: "Brand Guidelines", type: "PDF", size: "2.4 MB" },
    { title: "Company Logos", type: "ZIP", size: "8.1 MB" },
    { title: "Executive Photos", type: "ZIP", size: "12.3 MB" },
    { title: "Product Screenshots", type: "ZIP", size: "5.7 MB" },
  ]

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Newsletter subscription:", email)
    // API call would go here
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20">Newsroom</Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">Latest News & Updates</h1>
            <p className="text-xl text-muted-foreground">
              Stay informed about Taxu's latest announcements, product launches, partnerships, and company milestones.
            </p>
          </div>

          {/* Company Stats */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companyStats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="border-2">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-lg bg-indigo-500/10 p-3">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Press Releases</h2>
            <p className="mt-2 text-muted-foreground">Latest announcements and updates from Taxu</p>
          </div>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            View Archive
          </Button>
        </div>

        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <Card key={index} className={release.featured ? "border-2 border-indigo-500" : ""}>
              <CardHeader>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={release.featured ? "default" : "secondary"}>{release.category}</Badge>
                  {release.featured && <Badge className="bg-indigo-500/10 text-indigo-600">Featured</Badge>}
                  <span className="text-sm text-muted-foreground">{release.date}</span>
                </div>
                <CardTitle className="text-2xl">{release.title}</CardTitle>
                <CardDescription className="text-base">{release.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0">
                  Read full release
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Media Resources */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-3xl font-bold">Media Resources</h2>
            <p className="mb-12 text-muted-foreground">
              Download official brand assets, logos, and media materials for press coverage.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {mediaResources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>
                      {resource.type} • {resource.size}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8 border-2 border-indigo-500/20 bg-indigo-500/5">
              <CardHeader>
                <CardTitle>Media Inquiries</CardTitle>
                <CardDescription>
                  For press inquiries, interviews, or additional information, please contact our media team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold">Email</div>
                  <Link href="mailto:press@taxu.com" className="text-indigo-600 hover:underline">
                    press@taxu.com
                  </Link>
                </div>
                <div>
                  <div className="font-semibold">Press Kit</div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Press Kit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Stay Updated</h2>
            <p className="mb-8 text-muted-foreground">
              Subscribe to receive the latest news, product updates, and announcements directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
