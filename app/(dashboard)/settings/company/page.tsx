"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Company Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your company information and business details.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Company Name */}
            <div className="flex items-start justify-between py-4 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium">Company name</Label>
                <p className="text-sm text-muted-foreground mt-1">Taxu Inc.</p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>

            {/* Legal Name */}
            <div className="flex items-start justify-between py-4 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium">Legal name</Label>
                <p className="text-sm text-muted-foreground mt-1">Taxu Incorporated</p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>

            {/* EIN */}
            <div className="flex items-start justify-between py-4 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium">EIN</Label>
                <p className="text-sm text-muted-foreground mt-1">••-•••9876</p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>

            {/* Business Address */}
            <div className="flex items-start justify-between py-4 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium">Business address</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  123 Business St
                  <br />
                  San Francisco, CA 94102
                  <br />
                  United States
                </p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>

            {/* Industry */}
            <div className="flex items-start justify-between py-4 border-b border-border">
              <div className="flex-1">
                <Label className="text-sm font-medium">Industry</Label>
                <p className="text-sm text-muted-foreground mt-1">Financial Technology</p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>

            {/* Website */}
            <div className="flex items-start justify-between py-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Website</Label>
                <p className="text-sm text-muted-foreground mt-1">https://taxu.com</p>
              </div>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
