"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ApprovalsPage() {
  const approvalRules = [
    {
      name: "Large Transactions",
      threshold: "$1,000",
      approvers: ["Jane Smith", "John Doe"],
      active: true,
    },
    {
      name: "International Payments",
      threshold: "Any amount",
      approvers: ["Jane Smith"],
      active: true,
    },
    {
      name: "New Vendor Payments",
      threshold: "$500",
      approvers: ["Finance Team"],
      active: false,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Set up approval workflows for transactions and spending limits.
          </p>
        </div>
        <Button className="h-8 text-xs">+ Create Rule</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Rule Name</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Threshold</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Approvers</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvalRules.map((rule, index) => (
                <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{rule.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rule.threshold}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {rule.approvers.map((approver, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-[10px]">
                            {approver
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.active ? "default" : "secondary"} className="text-[10px]">
                      {rule.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
