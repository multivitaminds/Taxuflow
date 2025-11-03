"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, Plus, Search, FileText, DollarSign, AlertTriangle, CheckCircle2, Mail, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Contractor {
  id: string
  first_name: string
  last_name: string
  email: string
  total_payments: number
  payment_count: number
  w9_status: "missing" | "pending" | "verified" | "expired"
  needs_1099: boolean
  last_payment_date: string
}

interface ContractorManagementClientProps {
  userId: string
}

export function ContractorManagementClient({ userId }: ContractorManagementClientProps) {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const { toast } = useToast()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  useEffect(() => {
    fetchContractors()
  }, [selectedYear])

  const fetchContractors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/contractors?year=${selectedYear}`)
      const data = await response.json()

      if (data.success) {
        setContractors(data.contractors)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load contractors",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const requestW9 = async (contractorId: string, email: string, name: string) => {
    try {
      const response = await fetch("/api/w9/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: contractorId,
          recipientEmail: email,
          recipientName: name,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "W-9 Request Sent",
          description: `W-9 request email sent to ${name}`,
        })
        fetchContractors()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send W-9 request",
        variant: "destructive",
      })
    }
  }

  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch =
      contractor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "needs_1099" && contractor.needs_1099) ||
      (filterStatus === "missing_w9" && contractor.w9_status === "missing") ||
      (filterStatus === "verified" && contractor.w9_status === "verified")

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: contractors.length,
    needs1099: contractors.filter((c) => c.needs_1099).length,
    missingW9: contractors.filter((c) => c.w9_status === "missing").length,
    totalPayments: contractors.reduce((sum, c) => sum + c.total_payments, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange bg-clip-text text-transparent">
            Contractor Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage contractors, track payments, and collect W-9 forms</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number.parseInt(v))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange">
            <Plus className="mr-2 h-4 w-4" />
            Add Contractor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need 1099</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.needs1099}</div>
            <p className="text-xs text-muted-foreground">≥$600 in {selectedYear}</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing W-9</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missingW9}</div>
            <p className="text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In {selectedYear}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contractors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                <SelectItem value="needs_1099">Needs 1099 (≥$600)</SelectItem>
                <SelectItem value="missing_w9">Missing W-9</SelectItem>
                <SelectItem value="verified">W-9 Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contractors List */}
      <div className="space-y-3">
        {filteredContractors.map((contractor) => (
          <Card key={contractor.id} className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      {contractor.first_name} {contractor.last_name}
                    </h3>
                    {contractor.needs_1099 && (
                      <Badge variant="outline" className="border-orange-500 text-orange-500">
                        Needs 1099
                      </Badge>
                    )}
                    {contractor.w9_status === "missing" && (
                      <Badge variant="outline" className="border-red-500 text-red-500">
                        Missing W-9
                      </Badge>
                    )}
                    {contractor.w9_status === "verified" && (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        W-9 Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{contractor.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />${contractor.total_payments.toLocaleString()} YTD
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {contractor.payment_count} payments
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {contractor.w9_status === "missing" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        requestW9(contractor.id, contractor.email, `${contractor.first_name} ${contractor.last_name}`)
                      }
                      className="border-white/10"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Request W-9
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="border-white/10 bg-transparent">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredContractors.length === 0 && (
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contractors found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Add your first contractor to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
