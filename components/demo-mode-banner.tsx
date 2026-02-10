"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, X, ArrowRight } from "lucide-react"

interface DemoModeBannerProps {
  isDemoMode?: boolean
}

export function DemoModeBanner({ isDemoMode }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (isDemoMode === false || dismissed) return null

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white px-4 py-2.5 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Sandbox Mode
          </Badge>
          <span className="text-sm font-medium hidden sm:inline">
            You&apos;re exploring Taxu with sample data. Changes won&apos;t be saved.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/signup">
            <Button
              size="sm"
              className="bg-white text-purple-700 hover:bg-white/90 font-semibold h-7 text-xs"
            >
              Create Free Account
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
