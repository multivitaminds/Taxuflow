"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Receipt, FileText, Grid, CreditCard } from "lucide-react"

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Policies</h1>
        <p className="text-sm text-muted-foreground">
          Manage spending rules and compliance requirements across your organization.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Card Spend Policy */}
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Card spend policy</CardTitle>
                <CardDescription className="text-sm">
                  Restrict spend or require additional information for card spend at your organization.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                4 rules
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Receipt Requirement */}
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div className="flex items-start gap-3">
                <Receipt className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Receipt requirement</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Receipt required if transaction amount exceeds <span className="font-medium">$75</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      Amazon Web Services
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Facebook
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Google
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Notion
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Github
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Excluded merchants</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-red-600">
                  Disable
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit
                </Button>
              </div>
            </div>

            {/* Notes Requirement */}
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Notes requirement</p>
                  <p className="text-sm text-muted-foreground">
                    Notes required if transaction amount exceeds <span className="font-medium">$100</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-red-600">
                  Disable
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit
                </Button>
              </div>
            </div>

            {/* Category Requirement */}
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div className="flex items-start gap-3">
                <Grid className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Category requirement</p>
                  <p className="text-sm text-muted-foreground">
                    Category required if transaction amount exceeds <span className="font-medium">$1</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-red-600">
                  Disable
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit
                </Button>
              </div>
            </div>

            {/* Spend Controls */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Spend controls</p>
                  <p className="text-sm text-muted-foreground mb-2">Will override controls set for individual cards</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium mb-1">Blocked merchants:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          Amazon Web Services
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Facebook
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Google
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Notion
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Github
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Blocked merchant types:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          Alcohol and Bars
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Gambling
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-red-600">
                  Disable
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
