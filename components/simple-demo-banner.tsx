"use client"

import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimpleDemoBanner() {
  const handleSwitchToLive = () => {
    window.location.href = "/dashboard/activate-account"
  }

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 flex items-center justify-center gap-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3 text-sm font-medium">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur">
          <Info className="h-4 w-4" />
          <span className="font-semibold">Demo Mode</span>
        </div>
        <span>You're viewing demo data—Switch to your live account to access real features</span>
      </div>
      <Button
        size="sm"
        onClick={handleSwitchToLive}
        className="ml-4 bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-md"
      >
        Switch to Live Account
      </Button>
    </div>
  )
}
