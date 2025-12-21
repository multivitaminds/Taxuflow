"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Sparkles } from "lucide-react"
import { useDemoMode } from "@/lib/demo/context"

export function DemoEnvironmentBanner() {
  const { isDemoMode, isAuthenticated, isLoading } = useDemoMode()

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-lg">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm font-bold text-amber-100">Taxu Demo</span>
            </div>
            <span className="text-slate-400 text-sm">—</span>
          </div>
          <p className="text-sm text-slate-300 hidden sm:block">
            Explore and personalize tax, bookkeeping, and financial features in demo mode.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 px-3 text-sm"
              >
                Viewing as Admin
                <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>View as Admin</DropdownMenuItem>
              <DropdownMenuItem>View as Accountant</DropdownMenuItem>
              <DropdownMenuItem>View as User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/register/open-account">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-9 px-5 rounded-lg shadow-md shadow-indigo-900/30 transition-all hover:shadow-lg hover:shadow-indigo-900/40"
            >
              Create live account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
