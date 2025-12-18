"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Copy, Mail } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReferralsPage() {
  const referrals = [
    { company: "Widgets Inc.", applicationStarted: "Mar 4, 2018", status: "Paid", payout: "$250 paid on Mar 4, 2018" },
    { company: "Pluto Import & Export", applicationStarted: "Mar 4, 2018", status: "Started", payout: "—" },
    { company: "Razer Capital", applicationStarted: "Mar 4, 2018", status: "Applied", payout: "—" },
    { company: "Wanda's Brooms", applicationStarted: "Mar 4, 2018", status: "Approved", payout: "—" },
    { company: "Rick's Shoes", applicationStarted: "Mar 4, 2018", status: "Closed", payout: "—" },
    { company: "Chocolate Frontiers", applicationStarted: "Mar 4, 2018", status: "Expired", payout: "—" },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "started":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "applied":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "approved":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Referrals</h1>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Referral Bonus Card */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground mb-2">$250.00</p>
              <p className="text-sm text-muted-foreground">Referral Bonus</p>
            </div>
          </CardContent>
        </Card>

        {/* Why Refer Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Why refer someone?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                You each get $250 when your referral deposits $10K within 90 days
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                They get to skip the line with expedited application review.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral URL */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base font-medium">Referral URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Input
                value="taxu.com/r/taxu"
                readOnly
                className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Mail className="mr-2 h-4 w-4" />
              Invite via Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Application started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{referral.company}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{referral.applicationStarted}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(referral.status)}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{referral.payout}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Referral program subject to the{" "}
          <a href="#" className="text-primary hover:underline">
            Taxu Referral Agreement
          </a>
          .
        </p>
      </div>
    </div>
  )
}
