"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building2, Check, Plus, Settings } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  industry: string
  isActive: boolean
}

export function CompanySwitcher() {
  const [currentCompany, setCurrentCompany] = useState<Company>({
    id: "1",
    name: "Acme Corporation",
    industry: "Technology",
    isActive: true,
  })

  const companies: Company[] = [
    {
      id: "1",
      name: "Acme Corporation",
      industry: "Technology",
      isActive: true,
    },
    {
      id: "2",
      name: "Smith Consulting LLC",
      industry: "Consulting",
      isActive: true,
    },
    {
      id: "3",
      name: "Green Energy Inc",
      industry: "Energy",
      isActive: true,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100">
          <Building2 className="h-4 w-4" />
          <span className="font-medium">{currentCompany.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px]">
        <DropdownMenuLabel className="text-xs text-slate-500 uppercase">Switch Company</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onClick={() => setCurrentCompany(company)}
            className="flex items-center justify-between py-3 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100">
                <Building2 className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{company.name}</span>
                <span className="text-xs text-slate-500">{company.industry}</span>
              </div>
            </div>
            {currentCompany.id === company.id && <Check className="h-4 w-4 text-emerald-600" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/accounting/companies/new" className="flex items-center gap-2 py-3 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span className="font-medium">Add New Company</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/accounting/companies" className="flex items-center gap-2 py-3 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span className="font-medium">Manage Companies</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
