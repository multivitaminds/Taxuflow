import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, CreditCard, ArrowRight, Check, Shield, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Taxu Banking - Modern Business Banking",
  description: "Full-featured business banking with automated bookkeeping and tax optimization.",
}

export default function BankingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative border-b border-border bg-gradient-to-b from-background to-muted/20 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Building2 className="h-4 w-4" />
              Business Banking
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
              Banking Built for Your Business
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Business accounts with automated bookkeeping, expense tracking, and seamless tax filing integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                Open Account <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Building2 className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Business Accounts</CardTitle>
                <CardDescription>FDIC-insured checking and savings accounts designed for businesses</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Corporate Cards</CardTitle>
                <CardDescription>
                  Issue unlimited cards with spending controls and automatic expense categorization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Instant Transfers</CardTitle>
                <CardDescription>Real-time ACH and wire transfers with same-day processing</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>FDIC Insured</CardTitle>
                <CardDescription>Up to $250,000 insurance per depositor through our banking partners</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Check className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Automated Bookkeeping</CardTitle>
                <CardDescription>Every transaction automatically categorized and synced to your books</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ArrowRight className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Tax Integration</CardTitle>
                <CardDescription>
                  Seamless connection to tax filing with pre-filled income and expense data
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Start banking with Taxu today</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Open an account in minutes and experience modern business banking.
          </p>
          <Button size="lg" className="gap-2">
            Open Account <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
