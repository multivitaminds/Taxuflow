"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function APITokensPage() {
  const tokens = [
    {
      nickname: "Token with long IPv6 address",
      permissions: "Read/Write",
      lastUsed: "May 16, 2019",
      createdBy: "jane@demo.merc...",
      createdDate: "Mar 14, 2019",
      whitelistedIPs: "1 IP whitelisted",
    },
    {
      nickname: "My read-write Mercury API token",
      permissions: "Read/Write",
      lastUsed: "Apr 15, 2019",
      createdBy: "jane@demo.merc...",
      createdDate: "Mar 14, 2019",
      whitelistedIPs: "2 IPs whitelisted",
    },
    {
      nickname: "My read-only Mercury API token",
      permissions: "Read",
      lastUsed: "Mar 14, 2019",
      createdBy: "landon@demo.me...",
      createdDate: "Mar 14, 2019",
      whitelistedIPs: "1 IP whitelisted",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">API Tokens</h1>
        <p className="text-sm text-muted-foreground">
          If there are changes to the role of the team member who created a token, the capabilities of the API token may
          be limited to reflect those changes. For more information, please reference our{" "}
          <a href="#" className="text-primary hover:underline">
            API Documentation
          </a>
          .
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nickname</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created date</TableHead>
                <TableHead>Whitelisted IPs</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{token.nickname}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{token.permissions}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.lastUsed}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.createdBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.createdDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{token.whitelistedIPs}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Revoke</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-border p-4">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create an API token
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
