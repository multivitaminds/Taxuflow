"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard } from "lucide-react"

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/developer-portal/billing"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>
        <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
        <p className="text-muted-foreground">
          Manage payment methods for your developer portal subscription
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Visa ending in 4242</p>
                  <Badge variant="secondary">Default</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="destructive" size="sm" disabled title="Coming soon">
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled title="Coming soon">
          <CreditCard className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </div>
    </div>
  )
}
