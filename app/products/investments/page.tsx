import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, BarChart3, Users, ArrowRight, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Taxu Investments - Portfolio Management & Tax Optimization",
  description: "Automated investment tracking, portfolio management, and tax-loss harvesting for optimal returns.",
}

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-gradient-to-b from-background to-muted/20 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <TrendingUp className="h-4 w-4" />
              Investment Management
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Invest Smarter with Tax Optimization
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Automated portfolio tracking, tax-loss harvesting, and investment reporting. Maximize returns while
              minimizing tax liability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                Start Investing <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Complete Investment Platform</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage investments and optimize taxes
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Portfolio Tracking</CardTitle>
                <CardDescription>
                  Real-time portfolio monitoring with performance analytics and asset allocation insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Tax-Loss Harvesting</CardTitle>
                <CardDescription>
                  Automated tax-loss harvesting to offset gains and reduce your tax burden
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Investment Reports</CardTitle>
                <CardDescription>
                  Comprehensive reports for tax filing including capital gains and dividend income
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Multi-Account Support</CardTitle>
                <CardDescription>Manage multiple investment accounts and portfolios from one dashboard</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Check className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Cost Basis Tracking</CardTitle>
                <CardDescription>
                  Automatic cost basis calculation with FIFO, LIFO, and specific lot methods
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ArrowRight className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Integration Ready</CardTitle>
                <CardDescription>
                  Connect with major brokerages and automatically sync investment transactions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">Maximize Investment Returns</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Automated Tax Optimization</p>
                    <p className="text-sm text-muted-foreground">
                      Intelligent algorithms identify tax-saving opportunities in real-time
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Performance Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Track ROI, volatility, and risk-adjusted returns across all portfolios
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Dividend Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      Automatic recording of dividends with qualified vs. ordinary classification
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Capital Gains Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Detailed short-term and long-term capital gains for accurate tax filing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight">Built for Investors</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Multi-Asset Classes</p>
                    <p className="text-sm text-muted-foreground">
                      Support for stocks, bonds, ETFs, mutual funds, options, and crypto
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Rebalancing Tools</p>
                    <p className="text-sm text-muted-foreground">
                      Maintain target allocations with automated rebalancing suggestions
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">Wash Sale Detection</p>
                    <p className="text-sm text-muted-foreground">
                      Automatic identification and adjustment for wash sale rules
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">API Access</p>
                    <p className="text-sm text-muted-foreground">
                      Full API for custom integrations and automated workflows
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Ready to optimize your investments?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of investors using Taxu to maximize returns and minimize taxes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
