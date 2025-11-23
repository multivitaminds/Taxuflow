"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"

interface DataPreviewTableProps {
  data: any[]
  errors?: Array<{ customer: any; errors: Array<{ field: string; message: string }> }>
  warnings?: Array<{ customer: any; warnings: Array<{ field: string; message: string }> }>
  duplicates?: Array<{ original: any; duplicate: any; matchScore: number; matchFields: string[] }>
  onEdit?: (index: number, field: string, value: any) => void
  onRemove?: (index: number) => void
}

export function DataPreviewTable({
  data,
  errors = [],
  warnings = [],
  duplicates = [],
  onEdit,
  onRemove,
}: DataPreviewTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "valid" | "errors" | "warnings" | "duplicates">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getRecordStatus = (record: any) => {
    const hasError = errors.some((e) => e.customer === record)
    const hasWarning = warnings.some((w) => w.customer === record)
    const isDuplicate = duplicates.some((d) => d.duplicate === record)

    if (hasError) return "error"
    if (isDuplicate) return "duplicate"
    if (hasWarning) return "warning"
    return "valid"
  }

  const getRecordIssues = (record: any) => {
    const error = errors.find((e) => e.customer === record)
    const warning = warnings.find((w) => w.customer === record)
    const duplicate = duplicates.find((d) => d.duplicate === record)

    return {
      errors: error?.errors || [],
      warnings: warning?.warnings || [],
      duplicate,
    }
  }

  const filteredData = data.filter((record) => {
    const status = getRecordStatus(record)
    const matchesFilter =
      filterType === "all" ||
      (filterType === "valid" && status === "valid") ||
      (filterType === "errors" && status === "error") ||
      (filterType === "warnings" && status === "warning") ||
      (filterType === "duplicates" && status === "duplicate")

    const matchesSearch =
      !searchQuery ||
      Object.values(record).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const statusCounts = {
    all: data.length,
    valid: data.filter((r) => getRecordStatus(r) === "valid").length,
    errors: errors.length,
    warnings: warnings.length,
    duplicates: duplicates.length,
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4 border-border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="valid">Valid ({statusCounts.valid})</SelectItem>
              <SelectItem value="errors">Errors ({statusCounts.errors})</SelectItem>
              <SelectItem value="warnings">Warnings ({statusCounts.warnings})</SelectItem>
              <SelectItem value="duplicates">Duplicates ({statusCounts.duplicates})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Status</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => {
                  const status = getRecordStatus(record)
                  const issues = getRecordIssues(record)
                  const actualIndex = (currentPage - 1) * itemsPerPage + index

                  return (
                    <TableRow key={actualIndex} className={status === "error" ? "bg-red-500/5" : ""}>
                      <TableCell>
                        {status === "valid" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        {status === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {status === "duplicate" && <AlertCircle className="h-5 w-5 text-orange-500" />}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{record.contact_name}</p>
                          {issues.errors.some((e) => e.field === "contact_name") && (
                            <p className="text-xs text-red-500 mt-1">
                              {issues.errors.find((e) => e.field === "contact_name")?.message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{record.company_name || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-muted-foreground">{record.email || "-"}</p>
                          {issues.errors.some((e) => e.field === "email") && (
                            <p className="text-xs text-red-500 mt-1">
                              {issues.errors.find((e) => e.field === "email")?.message}
                            </p>
                          )}
                          {issues.warnings.some((w) => w.field === "email") && (
                            <p className="text-xs text-yellow-500 mt-1">
                              {issues.warnings.find((w) => w.field === "email")?.message}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{record.phone || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{record.city || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{record.state || "-"}</p>
                      </TableCell>
                      <TableCell>
                        {onRemove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(actualIndex)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
