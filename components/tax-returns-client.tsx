"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Building2,
  Users,
  Briefcase,
  Heart,
  Landmark,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import type { JSX } from "react"

interface TaxReturn {
  id: string
  filing_year: number
  tax_type: string
  tax_category: string
  state_code?: string
  return_name?: string
  display_name: string
  filing_status?: string
  status: string
  is_amended: boolean
  estimated_refund: number
  total_income: number
  progress_percentage: number
  created_at: string
  updated_at: string
  type_label: string
  category_label: string
}

const TAX_TYPES = [
  { value: "individual_1040", label: "Individual (Form 1040)", icon: FileText },
  { value: "business_1120", label: "Business (Form 1120)", icon: Building2 },
  { value: "partnership_1065", label: "Partnership (Form 1065)", icon: Users },
  { value: "s_corp_1120s", label: "S-Corp (Form 1120-S)", icon: Briefcase },
  { value: "estate_1041", label: "Estate (Form 1041)", icon: Heart },
  { value: "trust_1041", label: "Trust (Form 1041)", icon: Landmark },
  { value: "amended_1040x", label: "Amended (Form 1040-X)", icon: Edit },
]

const TAX_CATEGORIES = [
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "local", label: "Local" },
  { value: "international", label: "International" },
]

export function TaxReturnsClient() {
  const [returns, setReturns] = useState<TaxReturn[]>([])
  const [filteredReturns, setFilteredReturns] = useState<TaxReturn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchTaxReturns()
  }, [])

  useEffect(() => {
    filterReturns()
  }, [returns, searchQuery, selectedYear, selectedType, selectedCategory, selectedStatus])

  const fetchTaxReturns = async () => {
    try {
      const { data, error } = await supabase
        .from("tax_returns_view")
        .select("*")
        .order("filing_year", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error

      setReturns(data || [])
    } catch (error) {
      console.error("[v0] Error fetching tax returns:", error)
      toast({
        title: "Error",
        description: "Failed to load tax returns",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterReturns = () => {
    let filtered = [...returns]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.filing_year.toString().includes(searchQuery) ||
          r.type_label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter((r) => r.filing_year.toString() === selectedYear)
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((r) => r.tax_type === selectedType)
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.tax_category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus)
    }

    setFilteredReturns(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "filed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      filed: "default",
      in_progress: "secondary",
    }
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const availableYears = Array.from(new Set(returns.map((r) => r.filing_year))).sort((a, b) => b - a)

  const groupedByYear = filteredReturns.reduce(
    (acc, ret) => {
      const year = ret.filing_year
      if (!acc[year]) acc[year] = []
      acc[year].push(ret)
      return acc
    },
    {} as Record<number, TaxReturn[]>,
  )

  const groupedByType = filteredReturns.reduce(
    (acc, ret) => {
      const type = ret.type_label
      if (!acc[type]) acc[type] = []
      acc[type].push(ret)
      return acc
    },
    {} as Record<string, TaxReturn[]>,
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading tax returns...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Tax Returns</h1>
          <p className="text-muted-foreground">Organize and manage all your tax returns by year, type, and category</p>
        </div>
        <Button className="glow-neon">
          <Plus className="w-4 h-4 mr-2" />
          New Tax Return
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search returns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="year" className="mb-2 block">
              Tax Year
            </Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type" className="mb-2 block">
              Tax Type
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TAX_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="mb-2 block">
              Category
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TAX_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="mb-2 block">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="filed">Filed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing {filteredReturns.length} of {returns.length} tax returns
          </span>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="by-year" className="mb-8">
        <TabsList>
          <TabsTrigger value="by-year">
            <Calendar className="w-4 h-4 mr-2" />
            By Year
          </TabsTrigger>
          <TabsTrigger value="by-type">
            <FileText className="w-4 h-4 mr-2" />
            By Type
          </TabsTrigger>
          <TabsTrigger value="all">All Returns</TabsTrigger>
        </TabsList>

        {/* By Year View */}
        <TabsContent value="by-year" className="space-y-6">
          {Object.entries(groupedByYear)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, yearReturns]) => (
              <div key={year}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-accent" />
                  {year} Tax Year
                  <Badge variant="secondary">{yearReturns.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearReturns.map((ret) => (
                    <TaxReturnCard
                      key={ret.id}
                      taxReturn={ret}
                      getStatusIcon={getStatusIcon}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            ))}
        </TabsContent>

        {/* By Type View */}
        <TabsContent value="by-type" className="space-y-6">
          {Object.entries(groupedByType).map(([type, typeReturns]) => {
            const typeConfig = TAX_TYPES.find((t) => t.label.includes(type))
            const Icon = typeConfig?.icon || FileText
            return (
              <div key={type}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Icon className="w-6 h-6 text-accent" />
                  {type}
                  <Badge variant="secondary">{typeReturns.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeReturns.map((ret) => (
                    <TaxReturnCard
                      key={ret.id}
                      taxReturn={ret}
                      getStatusIcon={getStatusIcon}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>

        {/* All Returns View */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReturns.map((ret) => (
              <TaxReturnCard
                key={ret.id}
                taxReturn={ret}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredReturns.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No tax returns found</h3>
          <p className="text-muted-foreground mb-6">
            {returns.length === 0
              ? "Start by creating your first tax return"
              : "Try adjusting your filters to see more results"}
          </p>
          <Button className="glow-neon">
            <Plus className="w-4 h-4 mr-2" />
            Create Tax Return
          </Button>
        </Card>
      )}
    </div>
  )
}

function TaxReturnCard({
  taxReturn,
  getStatusIcon,
  getStatusBadge,
}: {
  taxReturn: TaxReturn
  getStatusIcon: (status: string) => JSX.Element
  getStatusBadge: (status: string) => JSX.Element
}) {
  const typeConfig = TAX_TYPES.find((t) => t.value === taxReturn.tax_type)
  const Icon = typeConfig?.icon || FileText

  return (
    <Card className="p-6 hover:border-accent/50 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1">{taxReturn.display_name}</h3>
            <div className="flex items-center gap-2">
              {getStatusIcon(taxReturn.status)}
              {getStatusBadge(taxReturn.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="outline">{taxReturn.category_label}</Badge>
        </div>
        {taxReturn.state_code && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">State</span>
            <span className="font-medium">{taxReturn.state_code}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated Refund</span>
          <span className="font-bold text-accent flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {taxReturn.estimated_refund.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{taxReturn.progress_percentage}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
    </Card>
  )
}
