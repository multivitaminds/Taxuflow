"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, X, Edit, Trash2 } from "lucide-react"

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-600 mt-1">
            Create categories that team members can choose from to categorize transactions. Map these categories to GL
            codes in accounting settings.
          </p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5246e0]">+ Create Category</Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">Category</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Reimbursements</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">Card spend</TableHead>
              <TableHead className="font-semibold text-slate-900 text-center">
                <div className="flex items-center justify-center gap-1">
                  Other
                  <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 cursor-help">
                    ?
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">{category.name}</TableCell>
                <TableCell className="text-center">
                  {category.reimbursements ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-slate-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {category.cardSpend ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-slate-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {category.other ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-slate-300 mx-auto" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4 text-slate-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
