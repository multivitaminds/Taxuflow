"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, TrendingUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VaultPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Taxu Vault</h1>
        <p className="text-sm text-muted-foreground">
          Secure your funds with FDIC insurance and earn yield on your treasury balance.
        </p>
      </div>

      <div className="mb-6">
        <Badge variant="secondary" className="text-[10px] mb-4">
          <Info className="h-3 w-3 mr-1" />1 Vault insight for you
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* FDIC Insurance */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-base font-semibold mb-1">FDIC Insurance</CardTitle>
                <CardDescription className="text-sm">
                  Your deposit accounts are FDIC insured up to $60M
                  <sup className="text-[10px]">*</sup>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Checking/Savings Balance</p>
                <p className="text-3xl font-bold">$5,000,000.00</p>
              </div>
              <div className="text-right">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px]">
                  Up to $60M FDIC insured
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasury */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-base font-semibold mb-1">Treasury</CardTitle>
                <CardDescription className="text-sm">Your portfolio is earning 3.88% yield</CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  Taxu Treasury earns yield and keeps your funds secure with low-risk, short-term investments
                </p>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                Transfer in Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-1">Treasury Balance</p>
              <p className="text-3xl font-bold">$231,764.10</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                </div>
                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-xs">25% J.P. Morgan</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: "75%" }}></div>
                </div>
                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  <span className="text-xs">75% Morgan Stanley</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Taxu Vault */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">About Taxu Vault</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Taxu Vault helps startups of any size and scale manage bank risk and protect your funds.
            </p>
            <Button variant="link" className="h-auto p-0 text-sm text-primary">
              Learn More →
            </Button>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <sup>*</sup>Taxu is a fintech company, not an FDIC-insured bank. Checking and savings accounts are
                provided through our bank partners Choice Financial Group, Column N.A., and Evolve Bank & Trust, Members
                FDIC. Deposit insurance covers the failure of an insured bank. Checking and savings account deposits may
                be held by sweep network banks. Certain conditions must be satisfied for pass-through insurance to
                apply. Learn more here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
