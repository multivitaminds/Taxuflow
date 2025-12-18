"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Pencil, Trash2 } from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    { name: "Business Client Meals", reimbursements: true, cardSpend: true, other: false },
    { name: "Legal Fees", reimbursements: false, cardSpend: false, other: true },
    { name: "Travel - Flights", reimbursements: false, cardSpend: true, other: false },
    { name: "Travel - Accommodation", reimbursements: true, cardSpend: true, other: true },
    { name: "Travel - Vehicles", reimbursements: true, cardSpend: true, other: true },
    { name: "Contractor Payments", reimbursements: true, cardSpend: true, other: false },
    { name: "Venue Rental", reimbursements: true, cardSpend: true, other: true },
    { name: "Employee Gifts", reimbursements: true, cardSpend: true, other: true },
  ]

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Create categories that team members can choose from to categorize transactions. Map these categories to GL
            codes in{" "}
            <a href="/accounting/settings" className="text-primary hover:underline">
              accounting settings
            </a>
            .
          </p>
        </div>
        <Button className="h-8 text-xs">+ Create Category</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Reimbursements</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">Card spend</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-center">
                  Other
                  <span className="ml-1 inline-block text-xs">ⓘ</span>
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                  <TableCell className="text-sm">{category.name}</TableCell>
                  <TableCell className="text-center">
                    {category.reimbursements ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {category.cardSpend ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {category.other ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
