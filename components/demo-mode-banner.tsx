"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DemoModeBannerProps {
  isDemoMode: boolean
  userName?: string
}

export function DemoModeBanner({ isDemoMode }: DemoModeBannerProps) {
  const [showLiveBanner, setShowLiveBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user just activated their account
    const activationTime = localStorage.getItem("account_activation_time")

    if (activationTime) {
      const timeSinceActivation = Date.now() - Number.parseInt(activationTime)
      const threeMinutes = 3 * 60 * 1000 // 3 minutes in milliseconds

      if (timeSinceActivation < threeMinutes) {
        // Show live account banner
        setShowLiveBanner(true)

        // Set timeout to hide banner after remaining time
        const remainingTime = threeMinutes - timeSinceActivation
        const timer = setTimeout(() => {
          setIsVisible(false)
          localStorage.removeItem("account_activation_time")
        }, remainingTime)

        return () => clearTimeout(timer)
      } else {
        // More than 3 minutes have passed, clear the flag
        localStorage.removeItem("account_activation_time")
      }
    }
  }, [])

  const handleSwitchToLive = async () => {
    window.location.href = "/dashboard/activate-account"
  }

  if (showLiveBanner && isVisible) {
    return (
      <div className="w-full bg-emerald-600 text-white py-2.5 px-4 flex items-center justify-center gap-2 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">Live Account</span>
          <span className="mx-2">-</span>
          <span>You're using your production account with real data</span>
        </div>
      </div>
    )
  }

  if (!isDemoMode || !isVisible) {
    return null
  }

  return (
    <div className="w-full bg-[#635bff] text-white py-2.5 px-4 flex items-center justify-center gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded">
          <span className="font-semibold">Demo Mode</span>
          <Info className="h-4 w-4" />
        </div>
        <span>You're on Demo Mode—your space to explore Taxu features</span>
      </div>
      <Button
        size="sm"
        onClick={handleSwitchToLive}
        className="ml-4 bg-white text-[#635bff] hover:bg-gray-100 font-semibold"
      >
        Switch to live account
      </Button>
    </div>
  )
}
