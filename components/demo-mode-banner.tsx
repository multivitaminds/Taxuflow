"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface DemoModeBannerProps {
  isDemoMode?: boolean
}

export function DemoModeBanner({ isDemoMode }: DemoModeBannerProps) {
  if (isDemoMode === false) return null

  return (
    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
      <Sparkles className="w-3 h-3 mr-1" />
      Demo Mode
    </Badge>
  )
}
